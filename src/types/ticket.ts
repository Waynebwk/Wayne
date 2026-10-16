export type TicketCategory =
  | 'Hardware'
  | 'Software'
  | 'Network & Wi-Fi'
  | 'Security & Access'
  | 'Email & Account'
  | 'Peripherals & Printers';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export interface TicketNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string; // e.g. IT-1041
  requesterName: string;
  requesterEmail?: string;
  department?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  deviceAssetId?: string;
  status: TicketStatus;
  createdAt: string; // ISO date string
  updatedAt?: string;
  assignedTo?: string;
  notes?: TicketNote[];
}

export interface TicketFormData {
  requesterName: string;
  requesterEmail: string;
  department: string;
  category: TicketCategory;
  priority: TicketPriority;
  status?: TicketStatus;
  subject: string;
  description: string;
  deviceAssetId: string;
}
