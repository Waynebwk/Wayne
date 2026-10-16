import React, { useState } from 'react';
import { Search, Wifi, Shield, Laptop, Printer, HelpCircle, ArrowRight } from 'lucide-react';

interface KnowledgeBaseViewProps {
  onOpenNewTicketWithCategory: (category: string) => void;
}

const ARTICLES = [
  {
    id: 'kb-1',
    category: 'Network & Wi-Fi',
    icon: Wifi,
    title: 'Connecting to Corp-Secure 802.1X Wi-Fi',
    summary: 'Step-by-step certificate enrollment for macOS Sequoia, Windows 11, and Linux workstations.',
    steps: [
      'Download the Corporate Root Certificate from identity.corp.internal/cert.',
      'Select "Corp-Secure" in your Wi-Fi network menu.',
      'Enter your company email and SSO master password.',
      'Accept the SHA-256 fingerprint for auth.internal.company.',
    ],
  },
  {
    id: 'kb-2',
    category: 'Security & Access',
    icon: Shield,
    title: 'VPN Connection Revoked or Expired Credentials',
    summary: 'Fixing AnyConnect and WireGuard gateway timeouts and renewing hardware MFA tokens.',
    steps: [
      'Ensure your local system time is synchronized with pool.ntp.org.',
      'Open 1Password or Okta Verify and copy a fresh 6-digit TOTP token.',
      'If connecting from abroad, activate Travel Mode via the SecOps portal.',
      'Restart the Cisco AnyConnect daemon or flush DNS with `sudo dscacheutil -flushcache`.',
    ],
  },
  {
    id: 'kb-3',
    category: 'Hardware',
    icon: Laptop,
    title: 'USB-C / Thunderbolt Dock & Dual 4K Monitor Troubleshooting',
    summary: 'Resolving black screen, display flickering, and 60W power negotiation issues.',
    steps: [
      'Unplug power from the CalDigit / Dell dock for 30 seconds to hard reset.',
      'Check that the host cable is plugged into a certified Thunderbolt 4 port (lightning bolt icon).',
      'Update DisplayLink Manager or Dell Command Update drivers.',
      'Verify that High Dynamic Range (HDR) is disabled if refresh rate caps at 30Hz.',
    ],
  },
  {
    id: 'kb-4',
    category: 'Peripherals & Printers',
    icon: Printer,
    title: 'Adding Network Canon/HP Printers on Office Floors',
    summary: 'Finding printer IP addresses and installing secure PaperCut follow-me print queues.',
    steps: [
      'Open system Settings -> Printers & Scanners -> Add Printer.',
      'Choose IP / LPD protocol and type `print-fl3-canon.corp.internal`.',
      'Select "Generic PostScript Driver" for instant compatibility.',
      'Swipe your RFID building badge at the printer panel to release your print job.',
    ],
  },
];

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  onOpenNewTicketWithCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[0] | null>(null);

  const filtered = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900">
            Self-Service IT Knowledge Base
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Resolve common hardware, network, and application issues immediately without waiting in queue.
          </p>
          <div className="relative mt-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides, setup tutorials, error codes..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((art) => {
          const Icon = art.icon;
          return (
            <div
              key={art.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-slate-700">{art.category}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{art.title}</h3>
                <p className="text-xs text-slate-600 mb-4">{art.summary}</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Quick Steps:
                  </span>
                  {art.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono text-slate-400 shrink-0 tabular-nums">
                        {i + 1}.
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Did this solve your issue?</span>
                <button
                  onClick={() => onOpenNewTicketWithCategory(art.category)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <span>Submit Ticket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
