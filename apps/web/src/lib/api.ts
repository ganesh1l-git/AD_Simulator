const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || errorMessage;
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
      const data = await fetcher<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
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
      return fetcher<any>('/simulations/client-save', {
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
