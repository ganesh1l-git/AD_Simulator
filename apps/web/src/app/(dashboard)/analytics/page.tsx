'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const chartColors = {
  green: '#00ff88',
  cyan: '#00b4d8',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#a855f7',
  indigo: '#6366f1',
};

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InterceptionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Sim 1', 'Sim 2', 'Sim 3', 'Sim 4', 'Sim 5', 'Sim 6', 'Sim 7', 'Sim 8', 'Sim 9', 'Sim 10'],
        datasets: [
          {
            label: 'Interception Rate (%)',
            data: [65, 72, 68, 78, 82, 75, 85, 88, 81, 90],
            borderColor: chartColors.green,
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            fill: true, tension: 0.4, borderWidth: 2,
            pointBackgroundColor: chartColors.green,
            pointRadius: 4,
          },
          {
            label: 'Detection Rate (%)',
            data: [88, 90, 85, 92, 95, 90, 96, 98, 94, 99],
            borderColor: chartColors.cyan,
            backgroundColor: 'rgba(0, 180, 216, 0.05)',
            fill: true, tension: 0.4, borderWidth: 2,
            pointBackgroundColor: chartColors.cyan,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#9ca3af', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#4b5563' }, grid: { color: 'rgba(255,255,255,0.03)' } },
          y: { ticks: { color: '#4b5563' }, grid: { color: 'rgba(255,255,255,0.03)' }, min: 50, max: 100 },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

function CostChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sim 1', 'Sim 2', 'Sim 3', 'Sim 4', 'Sim 5', 'Sim 6', 'Sim 7', 'Sim 8'],
        datasets: [
          {
            label: 'Cost per Engagement ($M)',
            data: [2.1, 1.8, 3.5, 1.2, 0.9, 2.8, 1.5, 0.7],
            backgroundColor: chartColors.amber + '80',
            borderColor: chartColors.amber,
            borderWidth: 1,
          },
          {
            label: 'Cost per Interception ($M)',
            data: [3.2, 2.5, 5.2, 1.5, 1.1, 3.7, 1.8, 0.8],
            backgroundColor: chartColors.red + '80',
            borderColor: chartColors.red,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#9ca3af', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#4b5563' }, grid: { color: 'rgba(255,255,255,0.03)' } },
          y: { ticks: { color: '#4b5563' }, grid: { color: 'rgba(255,255,255,0.03)' } },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

function SystemUsageChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['S-400', 'MRSAM', 'Akash', 'QRSAM', 'Igla-S', 'Anti-Drone'],
        datasets: [{
          data: [15, 25, 20, 18, 12, 10],
          backgroundColor: [chartColors.red, chartColors.amber, '#f97316', chartColors.green, chartColors.cyan, chartColors.purple],
          borderColor: '#0a0e17',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 }, padding: 15 } },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

function ThreatPenetrationChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Ballistic', 'Cruise', 'UAV', 'Drone Swarm', 'Fighter', 'Hypersonic'],
        datasets: [
          {
            label: 'Interception Rate (%)',
            data: [60, 85, 92, 55, 78, 15],
            borderColor: chartColors.green,
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            borderWidth: 2,
          },
          {
            label: 'Penetration Rate (%)',
            data: [40, 15, 8, 45, 22, 85],
            borderColor: chartColors.red,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#9ca3af', font: { size: 11 } } } },
        scales: {
          r: {
            ticks: { color: '#4b5563', backdropColor: 'transparent' },
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: { color: '#9ca3af', font: { size: 11 } },
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">📊 Analytics Dashboard</h1>
        <p className="text-sm text-[#6b7280]">Simulation performance metrics and cost analysis</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Interception', value: '78.4%', color: '#00ff88' },
          { label: 'Avg Detection', value: '93.7%', color: '#00b4d8' },
          { label: 'Avg Cost/Intercept', value: '$2.1M', color: '#f59e0b' },
          { label: 'Simulations Run', value: '42', color: '#a855f7' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 text-center stat-card animate-fade-in-up" style={{ '--accent-color': stat.color } as React.CSSProperties}>
            <div className="text-[10px] text-[#4b5563] uppercase">{stat.label}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Interception & Detection Rate Over Time" delay={100}>
          <InterceptionChart />
        </ChartCard>
        <ChartCard title="Cost Analysis per Simulation" delay={200}>
          <CostChart />
        </ChartCard>
        <ChartCard title="System Utilization Distribution" delay={300}>
          <SystemUsageChart />
        </ChartCard>
        <ChartCard title="Threat Type Effectiveness" delay={400}>
          <ThreatPenetrationChart />
        </ChartCard>
      </div>
    </div>
  );
}
