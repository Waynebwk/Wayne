import React, { useState, useMemo } from 'react';
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../types/ticket';
import {
  Search,
  ArrowUpDown,
  Download,
  Filter,
  Eye,
  Trash2,
  HardDrive,
  Code2,
  Wifi,
  ShieldCheck,
  Mail,
  Printer,
  RefreshCw,
  Plus,
  X,
  Database,
  CheckCircle2,
} from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onOpenTicket: (ticket: Ticket) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onDeleteTicket: (ticketId: string) => void;
  onOpenNewTicket: () => void;
  onResetSampleData: () => void;
  activeStatusFilter: string;
  setActiveStatusFilter: (status: string) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onOpenTicket,
  onUpdateStatus,
  onDeleteTicket,
  onOpenNewTicket,
  onResetSampleData,
  activeStatusFilter,
  setActiveStatusFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'priority-desc' | 'id-desc'>('date-desc');

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter (Open, In Progress, Resolved, or All)
      if (activeStatusFilter !== 'All') {
        if (ticket.status !== activeStatusFilter) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'All' && ticket.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) {
        return false;
      }

      // Real-time Search query matching across:
      // requester name, subject, description, ID, category, department, priority, and status
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matches =
          ticket.id.toLowerCase().includes(query) ||
          ticket.requesterName.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          (ticket.department && ticket.department.toLowerCase().includes(query)) ||
          ticket.category.toLowerCase().includes(query) ||
          ticket.priority.toLowerCase().includes(query) ||
          ticket.status.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'id-desc') {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === 'priority-desc') {
        const priorityOrder: Record<TicketPriority, number> = {
          Urgent: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });
  }, [tickets, activeStatusFilter, categoryFilter, priorityFilter, searchQuery, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Requester Name', 'Email', 'Department', 'Category', 'Priority', 'Status', 'Subject', 'Description', 'Created At'];
    const rows = filteredTickets.map((t) => [
      t.id,
      `"${t.requesterName.replace(/"/g, '""')}"`,
      `"${(t.requesterEmail || '').replace(/"/g, '""')}"`,
      `"${(t.department || '').replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.subject.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `it_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category: TicketCategory) => {
    switch (category) {
      case 'Hardware':
        return <HardDrive className="w-3.5 h-3.5 text-slate-500" />;
      case 'Software':
        return <Code2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'Network & Wi-Fi':
        return <Wifi className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Security & Access':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Email & Account':
        return <Mail className="w-3.5 h-3.5 text-sky-500" />;
      case 'Peripherals & Printers':
        return <Printer className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <HardDrive className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" aria-hidden="true" />
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" aria-hidden="true" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            Low
          </span>
        );
    }
  };

  const getStatusBadgeClass = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'border-amber-300 text-amber-800 bg-amber-50/80 hover:bg-amber-100/80';
      case 'In Progress':
        return 'border-blue-300 text-blue-800 bg-blue-50/80 hover:bg-blue-100/80';
      case 'Resolved':
        return 'border-emerald-300 text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80';
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Table Controls Toolbar */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        {/* Row 1: Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Prominent Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by requester, category, description, status..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer rounded-full"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network & Wi-Fi">Network & Wi-Fi</option>
                <option value="Security & Access">Security & Access</option>
                <option value="Email & Account">Email & Account</option>
                <option value="Peripherals & Printers">Peripherals & Printers</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
                aria-label="Filter by priority"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
                aria-label="Sort tickets"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="priority-desc">Highest Priority</option>
                <option value="id-desc">Ticket ID (Desc)</option>
              </select>
            </div>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Download filtered tickets as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Reset sample data */}
            <button
              onClick={onResetSampleData}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Reset default sample tickets"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Row 2: Status Filter Tabs (Open, In Progress, Resolved, All) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { key: 'All', label: 'All Tickets', count: tickets.length },
              { key: 'Open', label: 'Open', count: tickets.filter((t) => t.status === 'Open').length },
              { key: 'In Progress', label: 'In Progress', count: tickets.filter((t) => t.status === 'In Progress').length },
              { key: 'Resolved', label: 'Resolved', count: tickets.filter((t) => t.status === 'Resolved').length },
            ].map((tab) => {
              const isActive = activeStatusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveStatusFilter(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                      isActive ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            {searchQuery && (
              <span className="text-blue-600 font-medium">
                Matching &quot;{searchQuery}&quot;
              </span>
            )}
            <span className="font-mono tabular-nums">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-24">Ticket ID</th>
              <th className="py-3 px-4 w-44">Requester</th>
              <th className="py-3 px-4 w-36">Category</th>
              <th className="py-3 px-4">Subject & Description</th>
              <th className="py-3 px-4 w-28">Priority</th>
              <th className="py-3 px-4 w-36">Status</th>
              <th className="py-3 px-4 w-32">Submitted</th>
              <th className="py-3 px-4 w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onOpenTicket(ticket)}
                >
                  {/* Ticket ID */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-semibold text-blue-600">
                      {ticket.id}
                    </span>
                  </td>

                  {/* Requester Name & Dept */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{ticket.requesterName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                      {ticket.department || ticket.requesterEmail || 'General Staff'}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      {getCategoryIcon(ticket.category)}
                      <span className="truncate">{ticket.category}</span>
                    </div>
                  </td>

                  {/* Subject & Description preview */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 max-w-md">
                      {ticket.subject}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 max-w-md mt-0.5">
                      {ticket.description}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getPriorityBadge(ticket.priority)}
                  </td>

                  {/* Status Dropdown (Open, In Progress, Resolved) */}
                  <td
                    className="py-3 px-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        onUpdateStatus(ticket.id, e.target.value as TicketStatus)
                      }
                      className={`text-xs font-semibold py-1 px-2.5 rounded-md border cursor-pointer focus:outline-hidden transition-colors ${getStatusBadgeClass(
                        ticket.status
                      )}`}
                      aria-label={`Change status for ticket ${ticket.id}`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  {/* Date Submitted */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-500 text-[11px]">
                    {formatDate(ticket.createdAt)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 px-4 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenTicket(ticket)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View Ticket Details"
                        aria-label="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTicket(ticket.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Delete Ticket"
                        aria-label="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      No support tickets found
                    </p>
                    <p className="text-xs text-slate-500">
                      {searchQuery || categoryFilter !== 'All' || priorityFilter !== 'All' || activeStatusFilter !== 'All'
                        ? 'No tickets match your active search or filter criteria. Try adjusting or clearing your query.'
                        : 'No IT support tickets in the database yet.'}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      {(searchQuery || categoryFilter !== 'All' || priorityFilter !== 'All' || activeStatusFilter !== 'All') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('All');
                            setPriorityFilter('All');
                            setActiveStatusFilter('All');
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Clear Filters & Search
                        </button>
                      )}
                      <button
                        onClick={onOpenNewTicket}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Submit Ticket</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary Strip */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Saved to browser localStorage</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Status: Open · In Progress · Resolved</span>
        </div>
        <div className="font-mono tabular-nums text-slate-600">
          Queue: {tickets.filter((t) => t.status === 'Open').length} open / {tickets.length} total
        </div>
      </div>
    </div>
  );
};
