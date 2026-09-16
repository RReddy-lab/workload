import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  AuditLog, 
  SalaryStructure,
  AttendanceStatus 
} from './types';
import { 
  loadEmployees, 
  saveEmployees, 
  loadAttendance, 
  saveAttendance, 
  loadLeaveRequests, 
  saveLeaveRequests, 
  loadAuditLogs, 
  saveAuditLogs, 
  loadCurrentUser, 
  saveCurrentUser, 
  clearCurrentUser,
  resetToDefaultData, 
  addAuditLog,
  formatRupee 
} from './services/storage';
import { exportSingleHtml } from './services/htmlExport';
import { SignInPage } from './components/SignInPage';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { AttendanceView } from './components/AttendanceView';
import { LeaveView } from './components/LeaveView';
import { PayrollView } from './components/PayrollView';
import { ProfileView } from './components/ProfileView';
import { AuditView } from './components/AuditView';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { WorkLoadLogo } from './components/WorkLoadLogo';

export default function App() {
  // Core state from persistent storage
  const [employees, setEmployees] = useState<Employee[]>(() => loadEmployees());
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => loadCurrentUser());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadAttendance());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => loadLeaveRequests());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadAuditLogs());

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Selected employee for viewing dossier/profile
  const [selectedEmployeeForDossier, setSelectedEmployeeForDossier] = useState<Employee | null>(null);

  // Modals
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState<boolean>(false);
  const [initialLeaveModalOpen, setInitialLeaveModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state changes with persistence
  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    saveLeaveRequests(leaves);
  }, [leaves]);

  useEffect(() => {
    saveAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  // Ensure non-admin employees cannot access the workforce/chamber directory tab
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin' && currentTab === 'employees') {
      setCurrentTab('dashboard');
    }
  }, [currentUser, currentTab]);

  // If user is not authenticated, render the dedicated SignInPage
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <SignInPage
          allEmployees={employees}
          onSignInSuccess={(user) => {
            setCurrentUser(user);
            setCurrentTab('dashboard');
            const newLog = addAuditLog(
              user.name,
              user.role,
              'Authenticated via Credentials',
              'Auth',
              `Signed in successfully to Work Load as ${user.name} (${user.role.toUpperCase()})`
            );
            setAuditLogs(prev => [newLog, ...prev]);
            addToast('success', 'Access Granted', `Welcome to Work Load, ${user.name}`);
          }}
          onCreateAccountSuccess={(newUser) => {
            setEmployees(prev => [newUser, ...prev]);
            setCurrentUser(newUser);
            setCurrentTab('dashboard');
            const newLog = addAuditLog(
              newUser.name,
              newUser.role,
              'Created New User Account',
              'Auth',
              `Enrolled new ${newUser.role} account for ${newUser.name} (${newUser.employeeId})`
            );
            setAuditLogs(prev => [newLog, ...prev]);
            addToast('success', 'Account Enrolled', `Created ${newUser.role} account for ${newUser.name}`);
          }}
        />
      </div>
    );
  }

  // Check if current user checked in today
  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    r => r.employeeId === currentUser.employeeId && r.date === todayStr
  );
  const isCheckedInToday = !!userTodayAttendance?.checkIn && !userTodayAttendance?.checkOut;

  // Pending leaves count
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;

  // ==========================================
  // HANDLERS
  // ==========================================

  // 1. Sign Out (Locks app and returns to SignInPage)
  const handleLogout = () => {
    const actorName = currentUser.name;
    const actorRole = currentUser.role;
    clearCurrentUser();
    setCurrentUser(null);
    setSelectedEmployeeForDossier(null);

    const newLog = addAuditLog(
      actorName,
      actorRole,
      'Concluded Session (Signed Out)',
      'Auth',
      `Signed out from Work Load session`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('info', 'Signed Out', 'You have safely concluded your session.');
  };

  // 2. Attendance Check-In
  const handleCheckIn = () => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const existingIndex = attendance.findIndex(
      r => r.employeeId === currentUser.employeeId && r.date === todayStr
    );

    let updatedRecords: AttendanceRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...attendance];
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        checkIn: nowTime,
        status: 'Present',
      };
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        date: todayStr,
        status: 'Present',
        checkIn: nowTime,
        checkOut: null,
        workingHours: 0,
        location: currentUser.chamberLocation || 'Chamber Headquarters',
        notes: 'Punch-in recorded on Work Load ledger',
      };
      updatedRecords = [newRecord, ...attendance];
    }

    setAttendance(updatedRecords);
    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Punch-In Recorded',
      'Attendance',
      `Checked in at ${nowTime}`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Arrival Logged', `Checked in at ${nowTime} for ${currentUser.name}`);
  };

  // 3. Attendance Check-Out
  const handleCheckOut = () => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const existingIndex = attendance.findIndex(
      r => r.employeeId === currentUser.employeeId && r.date === todayStr
    );

    if (existingIndex >= 0) {
      const rec = attendance[existingIndex];
      let hours = 8.5;
      if (rec.checkIn) {
        const [inH, inM] = rec.checkIn.split(':').map(Number);
        const [outH, outM] = nowTime.split(':').map(Number);
        const diff = (outH * 60 + outM) - (inH * 60 + inM);
        hours = Math.max(0.5, Math.round((diff / 60) * 10) / 10);
      }

      const updated = [...attendance];
      updated[existingIndex] = {
        ...rec,
        checkOut: nowTime,
        workingHours: hours,
        notes: 'Concluded official daily session',
      };
      setAttendance(updated);

      const newLog = addAuditLog(
        currentUser.name,
        currentUser.role,
        'Punch-Out Recorded',
        'Attendance',
        `Concluded daily duties at ${nowTime} (${hours} hrs worked)`
      );
      setAuditLogs(prev => [newLog, ...prev]);
      addToast('success', 'Duties Concluded', `Checked out at ${nowTime}. Hours logged: ${hours}h`);
    }
  };

  // 4. Admin Attendance Override
  const handleOverrideAttendance = (override: {
    employeeId: string;
    employeeName: string;
    date: string;
    status: AttendanceStatus;
    checkIn: string;
    checkOut: string;
    notes: string;
  }) => {
    const existingIdx = attendance.findIndex(
      r => r.employeeId === override.employeeId && r.date === override.date
    );

    let updated: AttendanceRecord[];
    if (existingIdx >= 0) {
      updated = [...attendance];
      updated[existingIdx] = {
        ...updated[existingIdx],
        ...override,
        workingHours: override.status === 'Present' || override.status === 'Half-day' ? 8 : 0,
      };
    } else {
      updated = [
        {
          id: `att-ov-${Date.now()}`,
          ...override,
          location: 'Chamber Headquarters',
          workingHours: override.status === 'Present' ? 8 : 0,
        },
        ...attendance,
      ];
    }

    setAttendance(updated);
    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Proctorial Attendance Override',
      'Attendance',
      `Modified record for ${override.employeeName} on ${override.date} to "${override.status}"`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Attendance Record Adjusted', `Updated ${override.employeeName} on ${override.date}`);
  };

  // 5. Apply for Leave
  const handleApplyLeave = (newLeave: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => {
    const created: LeaveRequest = {
      ...newLeave,
      id: `leave-${Date.now()}`,
      appliedOn: todayStr,
      status: 'Pending',
    };

    setLeaves(prev => [created, ...prev]);
    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Leave Petition Filed',
      'Leave',
      `Petitioned for ${newLeave.totalDays} days of ${newLeave.leaveType} (${newLeave.startDate} to ${newLeave.endDate})`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Petition Registered', 'Your request has been forwarded for administrative review.');
  };

  // 6. Approve Leave (Admin)
  const handleApproveLeave = (leaveId: string, comments?: string) => {
    const targetLeave = leaves.find(l => l.id === leaveId);
    if (!targetLeave) return;

    // Update leave request status
    const updatedLeaves = leaves.map(l =>
      l.id === leaveId
        ? {
            ...l,
            status: 'Approved' as const,
            reviewedBy: currentUser.name,
            adminComments: comments || 'Sanctioned under administrative authority.',
          }
        : l
    );
    setLeaves(updatedLeaves);

    // Deduct leave balance from employee
    const updatedEmployees = employees.map(emp => {
      if (emp.employeeId === targetLeave.employeeId) {
        const bal = { ...emp.leaveBalance };
        if (targetLeave.leaveType === 'Paid Executive') {
          bal.paidRemaining = Math.max(0, bal.paidRemaining - targetLeave.totalDays);
        } else if (targetLeave.leaveType === 'Convalescence (Sick)') {
          bal.sickRemaining = Math.max(0, bal.sickRemaining - targetLeave.totalDays);
        } else if (targetLeave.leaveType === 'Sabbatical (Unpaid)') {
          bal.unpaidUsed = bal.unpaidUsed + targetLeave.totalDays;
        }
        return { ...emp, leaveBalance: bal };
      }
      return emp;
    });
    setEmployees(updatedEmployees);

    if (currentUser.employeeId === targetLeave.employeeId) {
      const updatedSelf = updatedEmployees.find(e => e.id === currentUser.id);
      if (updatedSelf) setCurrentUser(updatedSelf);
    }

    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Leave Petition Approved',
      'Leave',
      `Approved ${targetLeave.totalDays} days of ${targetLeave.leaveType} for ${targetLeave.employeeName}. Notes: ${comments || 'None'}`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Leave Sanctioned', `Approved petition for ${targetLeave.employeeName}`);
  };

  // 7. Reject Leave (Admin)
  const handleRejectLeave = (leaveId: string, comments?: string) => {
    const targetLeave = leaves.find(l => l.id === leaveId);
    if (!targetLeave) return;

    const updatedLeaves = leaves.map(l =>
      l.id === leaveId
        ? {
            ...l,
            status: 'Rejected' as const,
            reviewedBy: currentUser.name,
            adminComments: comments || 'Declined upon administrative review.',
          }
        : l
    );
    setLeaves(updatedLeaves);

    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Leave Petition Rejected',
      'Leave',
      `Declined ${targetLeave.totalDays} days leave for ${targetLeave.employeeName}. Reason: ${comments || 'None'}`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('warning', 'Leave Petition Declined', `Declined request for ${targetLeave.employeeName}`);
  };

  // 8. Update Salary Structure (Admin)
  const handleUpdateSalary = (employeeId: string, newSalary: SalaryStructure) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, salary: newSalary } : emp
    );
    setEmployees(updatedEmployees);

    if (currentUser.id === employeeId) {
      setCurrentUser(prev => prev ? ({ ...prev, salary: newSalary }) : null);
    }

    const target = employees.find(e => e.id === employeeId);
    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Remuneration Schedule Adjusted',
      'Payroll',
      `Updated compensation schedule for ${target?.name || 'Officer'} (Base: ${formatRupee(newSalary.basic)})`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Remuneration Updated', `Adjusted salary schedule for ${target?.name}`);
  };

  // 9. Process Monthly Disbursement (Admin)
  const handleDisbursePayroll = () => {
    const totalDisbursed = employees.reduce((acc, e) => {
      const gross = e.salary.basic + e.salary.hra + e.salary.executiveAllowance + e.salary.discretionaryBonus;
      const tax = (gross * e.salary.taxRate) / 100;
      const net = gross - tax - e.salary.providentFund - e.salary.insurance;
      return acc + net;
    }, 0);

    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Disbursed Remuneration Roll',
      'Payroll',
      `Executed payroll disbursement of ${formatRupee(totalDisbursed)} across ${employees.length} officers.`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Disbursement Executed', `Disbursed ${formatRupee(totalDisbursed)} across ${employees.length} personnel.`);
  };

  // 10. Update Profile / Dossier
  const handleUpdateProfile = (updated: Employee) => {
    const updatedEmployees = employees.map(e => (e.id === updated.id ? updated : e));
    setEmployees(updatedEmployees);

    if (currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
    if (selectedEmployeeForDossier?.id === updated.id) {
      setSelectedEmployeeForDossier(updated);
    }

    const newLog = addAuditLog(
      currentUser.name,
      currentUser.role,
      'Profile Records Updated',
      'Profile',
      `Updated records for ${updated.name}`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Records Saved', `Profile updated for ${updated.name}`);
  };

  // 11. Add New Employee (Admin)
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees(prev => [newEmp, ...prev]);
    const newLog = addAuditLog(
      currentUser ? currentUser.name : 'System Admin',
      currentUser ? currentUser.role : 'admin',
      'New Employee Enrolled',
      'Auth',
      `Enrolled ${newEmp.name} (${newEmp.employeeId}) as ${newEmp.designation} in ${newEmp.department}`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    addToast('success', 'Officer Enrolled', `${newEmp.name} has been enrolled into ${newEmp.department}.`);
  };

  // 12. Reset to default sovereign seed data
  const handleResetData = () => {
    resetToDefaultData();
    const freshEmps = loadEmployees();
    setEmployees(freshEmps);
    setCurrentUser(freshEmps[0]);
    setAttendance(loadAttendance());
    setLeaves(loadLeaveRequests());
    setAuditLogs(loadAuditLogs());
    setSelectedEmployeeForDossier(null);
    addToast('info', 'Work Load Reset', 'All records have been restored to initial default state.');
  };

  // 13. Download Single HTML
  const handleExportSingleHtml = () => {
    exportSingleHtml(currentUser, employees, attendance, leaves, auditLogs);
    addToast('success', 'HTML Archive Exported', 'A complete standalone single-file snapshot of Work Load has been downloaded.');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans-ui selection:bg-[#C5A059]/30">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sovereign Header */}
      <Header
        currentUser={currentUser}
        allEmployees={employees}
        onResetData={handleResetData}
        onLogout={handleLogout}
        onExportSingleHtml={handleExportSingleHtml}
      />

      {/* Navigation Ribbon */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          if (tab !== 'profile') {
            setSelectedEmployeeForDossier(null);
          }
        }}
        userRole={currentUser.role}
        pendingLeavesCount={pendingLeavesCount}
        isCheckedInToday={isCheckedInToday}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            allEmployees={employees}
            attendanceRecords={attendance}
            leaveRequests={leaves}
            auditLogs={auditLogs}
            onNavigate={tab => setCurrentTab(tab)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            onSelectEmployeePerspective={() => {}}
            onOpenLeaveModal={() => {
              setCurrentTab('leaves');
              setInitialLeaveModalOpen(true);
            }}
          />
        )}

        {currentTab === 'employees' && currentUser.role === 'admin' && (
          <EmployeesView
            employees={employees}
            currentUser={currentUser}
            onSelectEmployee={emp => {
              setSelectedEmployeeForDossier(emp);
              setCurrentTab('profile');
            }}
            onEditEmployee={emp => {
              setSelectedEmployeeForDossier(emp);
              setCurrentTab('profile');
            }}
            onAddEmployee={() => setIsAddEmployeeModalOpen(true)}
          />
        )}

        {currentTab === 'attendance' && (
          <AttendanceView
            currentUser={currentUser}
            allEmployees={employees}
            attendanceRecords={attendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onOverrideAttendance={handleOverrideAttendance}
          />
        )}

        {currentTab === 'leaves' && (
          <LeaveView
            currentUser={currentUser}
            allEmployees={employees}
            leaveRequests={leaves}
            onApplyLeave={handleApplyLeave}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            isModalOpenInitially={initialLeaveModalOpen}
          />
        )}

        {currentTab === 'payroll' && (
          <PayrollView
            currentUser={currentUser}
            allEmployees={employees}
            onUpdateSalary={handleUpdateSalary}
            onDisbursePayroll={handleDisbursePayroll}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            allEmployees={employees}
            selectedEmployeeForDossier={selectedEmployeeForDossier}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToPayroll={() => setCurrentTab('payroll')}
          />
        )}

        {currentTab === 'audit' && (
          <AuditView logs={auditLogs} />
        )}
      </main>

      {/* Heritage Footer */}
      <footer className="bg-[#152A20] text-[#D2C7B4] border-t border-[#C5A059]/30 py-6 px-4 text-xs font-serif-playfair no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WorkLoadLogo size="sm" />
            <div>
              <p className="text-[#FAF7F2] font-semibold">
                Work Load
              </p>
              <p className="text-[11px] text-[#8A7663] font-serif-cormorant text-sm">
                Workforce Management &amp; Personnel Records
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#8A7663] font-sans">
            <div>Encrypted Sovereign HRMS • Role Protected Access</div>
            <div className="text-[#C5A059] mt-0.5">Role: {currentUser.role.toUpperCase()} • Authenticated: {currentUser.name}</div>
          </div>
        </div>
      </footer>

      {/* Add Employee Modal (Admin only) */}
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        existingCount={employees.length}
      />
    </div>
  );
}
