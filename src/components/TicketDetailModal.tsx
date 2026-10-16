import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types/ticket';
import {
  X,
  Clock,
  User,
  Building2,
  HardDrive,
  Laptop,
  MessageSquare,
  Send,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onUpdatePriority: (ticketId: string, priority: TicketPriority) => void;
  onAddNote: (ticketId: string, author: string, noteText: string) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onAddNote,
  onDeleteTicket,
}) => {
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Helpdesk Specialist');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(ticket.id, noteAuthor.trim() || 'IT Specialist', noteText.trim());
    setNoteText('');
  };

  const getPriorityBadgeClass = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Low':
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {ticket.id}
            </span>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{ticket.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Title & Status Controls */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {ticket.subject}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <User className="w-3.5 h-3.5" />
                  {ticket.requesterName}
                </span>
                {ticket.department && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {ticket.department}
                    </span>
                  </>
                )}
                {ticket.deviceAssetId && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Laptop className="w-3.5 h-3.5" />
                      {ticket.deviceAssetId}
                    </span>
                  </>
                )}
                {ticket.requesterEmail && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{ticket.requesterEmail}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Status and Priority Selectors */}
            <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={ticket.status}
                  onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-800 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Priority:</span>
                <select
                  value={ticket.priority}
                  onChange={(e) => onUpdatePriority(ticket.id, e.target.value as TicketPriority)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border cursor-pointer ${getPriorityBadgeClass(
                    ticket.priority
                  )}`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Issue Description
            </h3>
            <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Activity / Notes Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Internal Notes & Resolution Log ({ticket.notes?.length || 0})</span>
              </h3>
            </div>

            {ticket.notes && ticket.notes.length > 0 ? (
              <div className="space-y-3 mb-4">
                {ticket.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-slate-700">{note.author}</span>
                      <span className="font-mono tabular-nums text-[11px]">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-800 text-sm leading-normal">{note.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mb-4">
                No internal technician notes added yet. Record work steps below.
              </p>
            )}

            {/* Add note form */}
            <form onSubmit={handleNoteSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="Author name"
                  className="w-1/3 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add update, work steps or resolution note..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200">
          <div>
            {!showConfirmDelete ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700 font-medium">Permanently delete?</span>
                <button
                  onClick={() => {
                    onDeleteTicket(ticket.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-800 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {ticket.status !== 'Resolved' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(ticket.id, 'Resolved');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
