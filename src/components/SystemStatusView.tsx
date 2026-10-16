import React from 'react';
import { CheckCircle2, AlertTriangle, Shield, RefreshCw } from 'lucide-react';

export const SystemStatusView: React.FC = () => {
  const services = [
    {
      name: 'Single Sign-On (Okta / SAML)',
      category: 'Identity & Access',
      status: 'Operational',
      uptime: '99.99%',
      lastIncident: 'None in past 30 days',
      state: 'healthy',
    },
    {
      name: 'Corporate Wi-Fi (Cisco Meraki APs)',
      category: 'Floor Infrastructure',
      status: 'Degraded on Floor 5',
      uptime: '98.85%',
      lastIncident: 'Investigating AP flapping in Room Orion',
      state: 'degraded',
    },
    {
      name: 'GlobalProtect / AnyConnect VPN',
      category: 'Remote Access',
      status: 'Operational',
      uptime: '99.95%',
      lastIncident: 'Certificate rollover completed',
      state: 'healthy',
    },
    {
      name: 'Google Workspace (Mail & Drive)',
      category: 'Collaboration',
      status: 'Operational',
      uptime: '100.0%',
      lastIncident: 'Normal service',
      state: 'healthy',
    },
    {
      name: 'GitHub Enterprise Cloud',
      category: 'Developer Tools',
      status: 'Operational',
      uptime: '99.98%',
      lastIncident: 'Webhook delivery normal',
      state: 'healthy',
    },
    {
      name: 'Badge Access & Turnstiles',
      category: 'Physical Security',
      status: 'Operational',
      uptime: '99.92%',
      lastIncident: 'Scheduled firmware patch executed',
      state: 'healthy',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Corporate IT Infrastructure Status
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live status updates for internal networks, software services, and hardware gateways.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              All Core Systems Nominal
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Monitored IT Endpoints (6)
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            Telemetry checked: 2 min ago
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {services.map((srv) => (
            <div
              key={srv.name}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{srv.name}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{srv.category}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{srv.lastIncident}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold tabular-nums text-slate-700">
                    {srv.uptime}
                  </div>
                  <div className="text-[10px] text-slate-400">30d uptime</div>
                </div>

                <div className="w-32 text-right">
                  {srv.state === 'healthy' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Operational
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Degraded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
