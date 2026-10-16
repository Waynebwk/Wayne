import React from 'react';
import { Plus, LifeBuoy } from 'lucide-react';

interface NavbarProps {
  onOpenNewTicket: () => void;
  onNavigate: (section: 'tickets' | 'kb' | 'status') => void;
  activeSection: 'tickets' | 'kb' | 'status';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTicket,
  onNavigate,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('tickets');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              Enterprise IT Helpdesk
            </a>
          </div>

          {/* Zone 2: 4-5 concise nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => onNavigate('tickets')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${
                activeSection === 'tickets'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600'
              }`}
            >
              Tickets
            </button>
            <button
              onClick={() => onNavigate('kb')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${
                activeSection === 'kb'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600'
              }`}
            >
              Knowledge Base
            </button>
            <button
              onClick={() => onNavigate('status')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 ${
                activeSection === 'status'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-600'
              }`}
            >
              System Status
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewTicket}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
