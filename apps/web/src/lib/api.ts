const envApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const API_BASE_URL = envApiUrl.endsWith('/api/v1') ? envApiUrl : `${envApiUrl}/api/v1`;

// Standard fetcher — on 401, clears token and redirects to /login.
// Use this for all authenticated API calls EXCEPT those that should not
// interrupt the current page (e.g. background saves after a simulation).
async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token && token !== 'undefined') {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Only redirect to login if the user is not on a dashboard page.
        // Dashboard pages (simulation, encyclopedia, etc.) should NOT be
        // interrupted mid-session by a background save failure.
        const isDashboardPage = !window.location.pathname.startsWith('/login') &&
                                !window.location.pathname.startsWith('/register');
        if (!isDashboardPage) {
          window.location.href = '/login';
        }
      }
    }
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || parsed.error || errorMessage;
    } catch {
      // Not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Silent fetcher — never redirects on 401. Use for background saves (e.g. clientSave)
// where a 401 failure should not interrupt the user's current view.
async function fetcherSilent<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token && token !== 'undefined') {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      // Silently clear the stale token but do NOT redirect
      localStorage.removeItem('token');
    }
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || parsed.error || errorMessage;
    } catch {
      // Not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth API
  auth: {
    login: async (credentials: any) => {
      const data = await fetcher<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (typeof window !== 'undefined' && data?.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      return data;
    },
    register: async (userData: any) => {
      return fetcher<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    me: async () => {
      return fetcher<any>('/auth/me');
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  },

  // Systems API
  systems: {
    list: async (filters?: { category?: string; maxRange?: number }) => {
      const query = filters ? `?${new URLSearchParams(filters as any).toString()}` : '';
      return fetcher<any[]>(`/systems${query}`);
    },
    get: async (id: string) => {
      return fetcher<any>(`/systems/${id}`);
    },
    compare: async (ids: string[]) => {
      return fetcher<any[]>(`/systems/compare?ids=${ids.join(',')}`);
    },
    categories: async () => {
      return fetcher<string[]>('/systems/categories');
    }
  },

  // Threats API
  threats: {
    list: async () => {
      return fetcher<any[]>('/threats');
    },
    get: async (id: string) => {
      return fetcher<any>(`/threats/${id}`);
    }
  },

  // Simulations API
  simulations: {
    create: async (simulationData: { scenarioId: string; speed?: number; placements: any[] }) => {
      return fetcher<any>('/simulations', {
        method: 'POST',
        body: JSON.stringify(simulationData),
      });
    },
    list: async () => {
      return fetcher<any[]>('/simulations');
    },
    get: async (id: string) => {
      return fetcher<any>(`/simulations/${id}`);
    },
    getReplay: async (id: string) => {
      return fetcher<any>(`/simulations/${id}/replay`);
    },
    getReport: async (id: string) => {
      return fetcher<any>(`/simulations/${id}/report`);
    },
    clientSave: async (simulationData: { name?: string; config: any; results: any; duration: number }) => {
      // Use fetcherSilent so a 401 / network error never redirects away from the results screen
      return fetcherSilent<any>('/simulations/client-save', {
        method: 'POST',
        body: JSON.stringify(simulationData),
      });
    }
  },

  // Scenarios API
  scenarios: {
    list: async () => {
      return fetcher<any[]>('/scenarios');
    },
    get: async (id: string) => {
      return fetcher<any>(`/scenarios/${id}`);
    },
    create: async (scenarioData: any) => {
      return fetcher<any>('/scenarios', {
        method: 'POST',
        body: JSON.stringify(scenarioData),
      });
    },
    import: async (scenarioJson: string) => {
      return fetcher<any>('/scenarios/import', {
        method: 'POST',
        body: scenarioJson,
      });
    },
    export: (id: string) => {
      return `${API_BASE_URL}/scenarios/${id}/export`;
    }
  },

  // Campaigns API
  campaigns: {
    create: async (campaignData: { name: string; difficulty: string }) => {
      return fetcher<any>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(campaignData),
      });
    },
    list: async () => {
      return fetcher<any[]>('/campaigns');
    },
    get: async (id: string) => {
      return fetcher<any>(`/campaigns/${id}`);
    },
    advance: async (id: string, dailyOutcome: any) => {
      return fetcher<any>(`/campaigns/${id}/advance`, {
        method: 'POST',
        body: JSON.stringify(dailyOutcome),
      });
    }
  },

  // Procurement API
  procurement: {
    catalog: async () => {
      return fetcher<any[]>('/procurement/catalog');
    },
    purchase: async (systemId: string) => {
      return fetcher<any>('/procurement/purchase', {
        method: 'POST',
        body: JSON.stringify({ systemId }),
      });
    },
    upgrade: async (systemId: string, upgradeType: string) => {
      return fetcher<any>('/procurement/upgrade', {
        method: 'POST',
        body: JSON.stringify({ systemId, upgradeType }),
      });
    },
    budget: async () => {
      return fetcher<{ budget: number; spent: number }>('/procurement/budget');
    }
  },

  // Analytics API
  analytics: {
    overview: async () => {
      return fetcher<any>('/analytics/overview');
    },
    simulations: async () => {
      return fetcher<any>('/analytics/simulations');
    },
    costs: async () => {
      return fetcher<any>('/analytics/costs');
    },
    systems: async () => {
      return fetcher<any>('/analytics/systems');
    }
  },

  // Admin API
  admin: {
    users: async () => {
      return fetcher<any[]>('/admin/users');
    },
    updateRole: async (userId: string, role: string) => {
      return fetcher<any>(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    },
    stats: async () => {
      return fetcher<any>('/admin/stats');
    }
  }
};
