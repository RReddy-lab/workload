import { Employee, AttendanceRecord, LeaveRequest, AuditLog } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_LEAVES, INITIAL_AUDIT_LOGS } from '../data/seedData';

const STORAGE_KEYS = {
  EMPLOYEES: 'wl_hrms_employees_inr_v2',
  ATTENDANCE: 'wl_hrms_attendance_inr_v2',
  LEAVES: 'wl_hrms_leaves_inr_v3',
  AUDIT: 'wl_hrms_audit_inr_v2',
  CURRENT_USER: 'wl_hrms_current_user_inr_v2',
};

export const getStoredEmployees = (): Employee[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading employees from storage', e);
    return INITIAL_EMPLOYEES;
  }
};

export const saveStoredEmployees = (employees: Employee[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  } catch (e) {
    console.error('Error saving employees to storage', e);
  }
};

export const getStoredAttendance = (): AttendanceRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading attendance from storage', e);
    return INITIAL_ATTENDANCE;
  }
};

export const saveStoredAttendance = (attendance: AttendanceRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  } catch (e) {
    console.error('Error saving attendance to storage', e);
  }
};

export const getStoredLeaves = (): LeaveRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEAVES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
      return INITIAL_LEAVES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading leaves from storage', e);
    return INITIAL_LEAVES;
  }
};

export const saveStoredLeaves = (leaves: LeaveRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  } catch (e) {
    console.error('Error saving leaves to storage', e);
  }
};

export const getStoredAuditLogs = (): AuditLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading audit logs from storage', e);
    return INITIAL_AUDIT_LOGS;
  }
};

export const saveStoredAuditLogs = (logs: AuditLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving audit logs to storage', e);
  }
};

export const getCurrentUser = (): Employee | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      // verify it exists in fresh employees
      const emps = getStoredEmployees();
      const match = emps.find(e => e.id === parsed.id);
      if (match) return match;
    }
  } catch (e) {
    console.error('Error loading current user', e);
  }
  return null;
};

export const saveCurrentUser = (user: Employee | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Error saving current user', e);
  }
};

export const clearCurrentUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (e) {
    console.error('Error clearing current user', e);
  }
};

export const resetAllStorage = (): { employees: Employee[]; attendance: AttendanceRecord[]; leaves: LeaveRequest[]; audit: AuditLog[]; currentUser: Employee | null } => {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

  return {
    employees: INITIAL_EMPLOYEES,
    attendance: INITIAL_ATTENDANCE,
    leaves: INITIAL_LEAVES,
    audit: INITIAL_AUDIT_LOGS,
    currentUser: null,
  };
};

export const loadEmployees = getStoredEmployees;
export const saveEmployees = saveStoredEmployees;
export const loadAttendance = getStoredAttendance;
export const saveAttendance = saveStoredAttendance;
export const loadLeaveRequests = getStoredLeaves;
export const saveLeaveRequests = saveStoredLeaves;
export const loadAuditLogs = getStoredAuditLogs;
export const saveAuditLogs = saveStoredAuditLogs;
export const loadCurrentUser = getCurrentUser;
export const resetToDefaultData = resetAllStorage;

export const addAuditLog = (
  actor: string,
  actorRole: Employee['role'],
  action: string,
  category: AuditLog['category'],
  details: string
): AuditLog => {
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor,
    actorRole,
    action,
    category,
    details,
  };
  const currentLogs = getStoredAuditLogs();
  saveStoredAuditLogs([newLog, ...currentLogs]);
  return newLog;
};

export interface PayrollCalculation {
  gross: number;
  totalDeductions: number;
  taxAmount: number;
  netPay: number;
  annualNet: number;
}

export const calculatePayroll = (salary: Employee['salary']): PayrollCalculation => {
  const { basic, hra, executiveAllowance, discretionaryBonus, taxRate, providentFund, insurance } = salary;
  const gross = basic + hra + executiveAllowance + discretionaryBonus;
  const taxAmount = (gross * taxRate) / 100;
  const totalDeductions = taxAmount + providentFund + insurance;
  const netPay = Math.max(0, gross - totalDeductions);
  const annualNet = netPay * 12;

  return {
    gross: Math.round(gross * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
  };
};

export const formatRupee = (val: number): string => {
  return '₹' + Math.round(val).toLocaleString('en-IN');
};
