import React, { useState } from 'react';
import { TicketCategory, TicketPriority, TicketFormData } from '../types/ticket';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
}

const CATEGORIES: TicketCategory[] = [
  'Hardware',
  'Software',
  'Network & Wi-Fi',
  'Security & Access',
  'Email & Account',
  'Peripherals & Printers',
];

const PRIORITIES: { value: TicketPriority; label: string; desc: string; color: string }[] = [
  { value: 'Low', label: 'Low', desc: 'Minor inquiry or non-blocking preference', color: 'border-slate-300 text-slate-700' },
  { value: 'Medium', label: 'Medium', desc: 'Normal work issue with available workarounds', color: 'border-blue-300 text-blue-700' },
  { value: 'High', label: 'High', desc: 'Significant productivity loss or client deadline', color: 'border-amber-400 text-amber-700' },
  { value: 'Urgent', label: 'Urgent', desc: 'Critical outage, security threat, or complete work stoppage', color: 'border-rose-400 text-rose-700' },
];

const SAMPLE_TEMPLATES = [
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@company.internal',
    department: 'Engineering',
    category: 'Hardware' as TicketCategory,
    priority: 'Urgent' as TicketPriority,
    subject: 'External monitor black screen and USB dock power failure',
    description: 'Since this morning, my dual 4K monitors plugged into the CalDigit TS4 dock are not receiving any signal. The dock LED is dark and my laptop is not charging through the Thunderbolt cable. Tested with a colleague dock and monitors worked.',
    assetId: 'DOCK-TS4-118',
  },
  {
    name: 'Emily Watson',
    email: 'emily.w@company.internal',
    department: 'Human Resources',
    category: 'Email & Account' as TicketCategory,
    priority: 'High' as TicketPriority,
    subject: 'New hire onboarding email delegation and Slack workspace invite',
    description: 'Two new software engineering interns starting Monday (Liam & Zoe) need to be provisioned on the eng-all mailing list, GitHub Enterprise org, and AWS dev sandbox account.',
    assetId: 'ONBOARDING-2026',
  },
  {
    name: 'Carlos Mendoza',
    email: 'carlos.m@company.internal',
    department: 'Sales',
    category: 'Network & Wi-Fi' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    subject: 'Cisco AnyConnect VPN throws Certificate Revocation error',
    description: 'When attempting to connect to the US-East VPN concentrator from home, AnyConnect fails at 90% with "Untrusted Server Certificate - Connection terminated". Resetting network settings did not resolve.',
    assetId: 'LAPTOP-THINKPAD-09',
  },
];

export const TicketFormModal: React.FC<TicketFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TicketFormData>({
    requesterName: '',
    requesterEmail: '',
    department: 'Engineering',
    category: 'Hardware',
    priority: 'Medium',
    subject: '',
    description: '',
    deviceAssetId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.requesterName.trim()) {
      errs.requesterName = 'Requester name is required';
    }
    if (!formData.description.trim()) {
      errs.description = 'Issue description is required';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Please provide at least 10 characters describing the issue';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Auto-generate subject from description if empty
      const finalSubject = formData.subject.trim() || formData.description.slice(0, 60) + (formData.description.length > 60 ? '...' : '');
      onSubmit({
        ...formData,
        subject: finalSubject,
      });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        requesterName: '',
        requesterEmail: '',
        department: 'Engineering',
        category: 'Hardware',
        priority: 'Medium',
        subject: '',
        description: '',
        deviceAssetId: '',
      });
      setErrors({});
    }, 150);
  };

  const handleFillSample = () => {
    const randomTemplate = SAMPLE_TEMPLATES[Math.floor(Math.random() * SAMPLE_TEMPLATES.length)];
    setFormData({
      requesterName: randomTemplate.name,
      requesterEmail: randomTemplate.email,
      department: randomTemplate.department,
      category: randomTemplate.category,
      priority: randomTemplate.priority,
      subject: randomTemplate.subject,
      description: randomTemplate.description,
      deviceAssetId: randomTemplate.assetId,
    });
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden transition-all my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 id="modal-headline" className="text-lg font-bold text-slate-900">
              Submit New IT Support Ticket
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details below. Our technical helpdesk responds within SLA guidelines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              title="Populate realistic sample values"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section 1: User info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Requester Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                placeholder="e.g. Jordan Miller"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                  errors.requesterName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.requesterName && (
                <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.requesterName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Work Email (Optional)
              </label>
              <input
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                placeholder="e.g. jordan.m@company.com"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product Design">Product Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance & Legal">Finance & Legal</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Device / Asset Tag (Optional)
              </label>
              <input
                type="text"
                value={formData.deviceAssetId}
                onChange={(e) => setFormData({ ...formData, deviceAssetId: e.target.value })}
                placeholder="e.g. MBP-16-402 or DOCK-01"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Section 2: Issue Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low - Minor inquiry / cosmetic</option>
                <option value="Medium">Medium - Normal workflow issue</option>
                <option value="High">High - Significant work blocked</option>
                <option value="Urgent">Urgent - Complete blocker / security</option>
              </select>
            </div>
          </div>

          {/* Priority visual helper cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {PRIORITIES.map((p) => {
              const isSelected = formData.priority === p.value;
              return (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setFormData({ ...formData, priority: p.value })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">{p.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Section 3: Summary / Subject */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Subject / Short Summary
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Cannot connect to corporate Wi-Fi after macOS update"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Section 4: Detailed Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                {formData.description.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please explain the issue in detail, what steps you took, any error codes or symptoms, and when it started occurring..."
              className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
