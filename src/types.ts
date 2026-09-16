export type UserRole = 'admin' | 'employee';

export type Department = 
  | 'Executive Board' 
  | 'Legal Chambers' 
  | 'Private Wealth' 
  | 'Real Estate Syndication' 
  | 'Human Capital';

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export type LeaveType = 
  | 'Paid Executive' 
  | 'Convalescence (Sick)' 
  | 'Sabbatical (Unpaid)' 
  | 'Compassionate';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SalaryStructure {
  basic: number;
  hra: number;
  executiveAllowance: number;
  discretionaryBonus: number;
  taxRate: number; // percentage (e.g. 20%)
  providentFund: number;
  insurance: number;
}

export interface LeaveBalance {
  paidRemaining: number;
  paidTotal: number;
  sickRemaining: number;
  sickTotal: number;
  unpaidUsed: number;
}

export interface EmployeeDocument {
  id: string;
  title: string;
  category: 'Charter' | 'Tax' | 'Covenant' | 'Identity';
  issueDate: string;
  fileSize: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. "VS-101"
  name: string;
  preferredTitle: string; // e.g. "Lord Alistair Sterling"
  email: string;
  password?: string;
  role: UserRole;
  department: Department;
  designation: string;
  grade: string; // e.g. "Partner Tier I"
  joiningDate: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatar: string;
  status: 'Active' | 'On Sabbatical' | 'Probationary';
  reportingTo: string;
  chamberLocation: string;
  isEmailVerified: boolean;
  salary: SalaryStructure;
  leaveBalance: LeaveBalance;
  documents: EmployeeDocument[];
  emergencyContact: EmergencyContact;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // e.g. "08:45 AM"
  checkOut: string | null; // e.g. "05:30 PM"
  workingHours: number;
  status: AttendanceStatus;
  location: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  remarks: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  adminComments?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  category: 'Auth' | 'Attendance' | 'Leave' | 'Payroll' | 'Profile' | 'System';
  details: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
