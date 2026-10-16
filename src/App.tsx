import React, { useState, useEffect } from 'react';
import { Ticket, TicketFormData, TicketStatus, TicketPriority } from './types/ticket';
import { SEED_TICKETS } from './data/seedTickets';
import { Navbar } from './components/Navbar';
import { TicketStats } from './components/TicketStats';
import { TicketTable } from './components/TicketTable';
import { TicketFormModal } from './components/TicketFormModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { SystemStatusView } from './components/SystemStatusView';
import { CheckCircle2, Info, X } from 'lucide-react';

const STORAGE_KEY = 'helpdesk_tickets_v1';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored tickets:', e);
    }
    return SEED_TICKETS;
  });

  const [activeSection, setActiveSection] = useState<'tickets' | 'kb' | 'status'>('tickets');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [toastMessage, setToastMessage] = useState<{ id: number; text: string; type?: 'success' | 'info' } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Failed to save tickets to localStorage:', e);
    }
  }, [tickets]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    const toastId = Date.now();
    setToastMessage({ id: toastId, text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === toastId ? null : prev));
    }, 3500);
  };

  // Generate next sequential Ticket ID
  const generateNextId = () => {
    const maxNum = tickets.reduce((max, t) => {
      const match = t.id.match(/IT-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 1040);
    return `IT-${maxNum + 1}`;
  };

  // Submit new ticket handler
  const handleCreateTicket = (data: TicketFormData) => {
    const newId = generateNextId();
    const newTicket: Ticket = {
      id: newId,
      requesterName: data.requesterName.trim(),
      requesterEmail: data.requesterEmail.trim() || undefined,
      department: data.department || undefined,
      category: data.category,
      priority: data.priority,
      subject: data.subject.trim() || data.description.slice(0, 50),
      description: data.description.trim(),
      deviceAssetId: data.deviceAssetId.trim() || undefined,
      status: 'Open',
      createdAt: new Date().toISOString(),
      notes: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Ticket #${newId} created successfully for ${data.requesterName}`);
  };

  // Update status handler
  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = { ...t, status: newStatus, updatedAt: new Date().toISOString() };
          // If modal is open for this ticket, keep it synced
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Ticket #${ticketId} status updated to ${newStatus}`, 'info');
  };

  // Update priority handler
  const handleUpdatePriority = (ticketId: string, newPriority: TicketPriority) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = { ...t, priority: newPriority, updatedAt: new Date().toISOString() };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Ticket #${ticketId} priority set to ${newPriority}`, 'info');
  };

  // Add technician note
  const handleAddNote = (ticketId: string, author: string, noteText: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      author,
      text: noteText,
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const currentNotes = t.notes || [];
          const updated = { ...t, notes: [...currentNotes, newNote], updatedAt: new Date().toISOString() };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Note logged on Ticket #${ticketId}`, 'info');
  };

  // Delete ticket handler
  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(null);
    }
    showToast(`Ticket #${ticketId} deleted`, 'info');
  };

  // Reset to seed data
  const handleResetSampleData = () => {
    if (window.confirm('Reset all tickets back to the standard sample records?')) {
      setTickets(SEED_TICKETS);
      showToast('Sample tickets restored', 'info');
    }
  };

  // Open ticket modal with preselected category from KB
  const handleOpenFromKB = (category: string) => {
    setActiveSection('tickets');
    setIsNewTicketOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        onNavigate={setActiveSection}
        activeSection={activeSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb & Context */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>IT Support</span>
              <span aria-hidden="true">/</span>
              <span className="text-slate-800 capitalize">{activeSection}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {activeSection === 'tickets'
                ? 'Support Ticket Management'
                : activeSection === 'kb'
                ? 'Knowledge Base & Troubleshooting'
                : 'System Health & Service Outages'}
            </h1>
          </div>

          {activeSection === 'tickets' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNewTicketOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>+ Submit New Ticket</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Section Rendering */}
        {activeSection === 'tickets' && (
          <>
            {/* KPI Metric Strip */}
            <TicketStats
              tickets={tickets}
              onFilterByStatus={setActiveStatusFilter}
              activeStatusFilter={activeStatusFilter}
            />

            {/* Main Submitted Tickets Table */}
            <TicketTable
              tickets={tickets}
              onOpenTicket={(ticket) => setSelectedTicket(ticket)}
              onUpdateStatus={handleUpdateStatus}
              onDeleteTicket={handleDeleteTicket}
              onOpenNewTicket={() => setIsNewTicketOpen(true)}
              onResetSampleData={handleResetSampleData}
              activeStatusFilter={activeStatusFilter}
              setActiveStatusFilter={setActiveStatusFilter}
            />
          </>
        )}

        {activeSection === 'kb' && (
          <KnowledgeBaseView onOpenNewTicketWithCategory={handleOpenFromKB} />
        )}

        {activeSection === 'status' && <SystemStatusView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} IT Service Desk Portal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono tabular-nums">Standard SLA: Urgent &lt;1h · High &lt;4h</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleResetSampleData}
              className="text-slate-500 hover:text-slate-800 underline underline-offset-2 cursor-pointer"
            >
              Reset Sample Tickets
            </button>
          </div>
        </div>
      </footer>

      {/* Submission Modal */}
      <TicketFormModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* Detail / Technician Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onAddNote={handleAddNote}
        onDeleteTicket={handleDeleteTicket}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg border border-slate-800 transition-all"
        >
          {toastMessage.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
}
