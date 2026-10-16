import React from 'react';
import { Ticket } from '../types/ticket';
import { Clock, AlertCircle, CheckCircle2, Layers } from 'lucide-react';

interface TicketStatsProps {
  tickets: Ticket[];
  onFilterByStatus?: (status: string) => void;
  activeStatusFilter?: string;
}

export const TicketStats: React.FC<TicketStatsProps> = ({
  tickets,
  onFilterByStatus,
  activeStatusFilter = 'All',
}) => {
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const stats = [
    {
      id: 'total',
      label: 'Total Tickets',
      value: total,
      subtext: 'All tickets in system',
      icon: Layers,
      filterKey: 'All',
      borderColor: 'border-slate-200 hover:border-slate-300',
      activeClass: 'bg-slate-50 border-slate-900 ring-1 ring-slate-900',
      iconColor: 'text-slate-700',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'open',
      label: 'Open Tickets',
      value: openCount,
      subtext: 'Needs triage or response',
      icon: AlertCircle,
      filterKey: 'Open',
      borderColor: 'border-amber-200/80 hover:border-amber-300',
      activeClass: 'bg-amber-50/50 border-amber-600 ring-1 ring-amber-600',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100/70 text-amber-800',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: inProgressCount,
      subtext: 'Currently being investigated',
      icon: Clock,
      filterKey: 'In Progress',
      borderColor: 'border-blue-200/80 hover:border-blue-300',
      activeClass: 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100/70 text-blue-800',
    },
    {
      id: 'resolved',
      label: 'Resolved Tickets',
      value: resolvedCount,
      subtext: 'Successfully addressed',
      icon: CheckCircle2,
      filterKey: 'Resolved',
      borderColor: 'border-emerald-200/80 hover:border-emerald-300',
      activeClass: 'bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100/70 text-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = activeStatusFilter === stat.filterKey;

        return (
          <button
            key={stat.id}
            onClick={() => onFilterByStatus?.(stat.filterKey)}
            className={`text-left p-4 rounded-xl border bg-white transition-all cursor-pointer shadow-2xs relative group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isActive ? stat.activeClass : stat.borderColor
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-1.5 rounded-lg ${stat.badgeBg}`}>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                {isActive ? 'Filtered' : 'Click to filter'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 truncate">{stat.subtext}</p>
          </button>
        );
      })}
    </div>
  );
};
