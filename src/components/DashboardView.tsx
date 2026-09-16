import React from 'react';
import { Employee, AttendanceRecord, LeaveRequest, AuditLog } from '../types';
import { calculatePayroll, formatRupee } from '../services/storage';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  Banknote, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  AlertTriangle,
  FileText,
  MapPin,
  TrendingUp,
  Award,
  LogOut
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: Employee;
  allEmployees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  auditLogs: AuditLog[];
  onNavigate: (tab: any) => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onApproveLeave: (leaveId: string, comment?: string) => void;
  onRejectLeave: (leaveId: string, comment?: string) => void;
  onSelectEmployeePerspective: (emp: Employee) => void;
  onOpenLeaveModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  allEmployees,
  attendanceRecords,
  leaveRequests,
  auditLogs,
  onNavigate,
  onCheckIn,
  onCheckOut,
  onApproveLeave,
  onRejectLeave,
  onSelectEmployeePerspective,
  onOpenLeaveModal,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const todayStr = new Date().toISOString().split('T')[0];

  // User's attendance today
  const myTodayRecord = attendanceRecords.find(
    r => r.employeeId === currentUser.employeeId && r.date === todayStr
  );
  const isCheckedIn = !!myTodayRecord?.checkIn && !myTodayRecord?.checkOut;
  const isCompletedToday = !!myTodayRecord?.checkIn && !!myTodayRecord?.checkOut;

  // Admin stats
  const totalEmployees = allEmployees.length;
  const todayAttendance = attendanceRecords.filter(r => r.date === todayStr);
  const presentToday = todayAttendance.filter(r => r.status === 'Present').length;
  const onLeaveToday = todayAttendance.filter(r => r.status === 'Leave').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');

  // Total payroll calculation for Admin
  const totalMonthlyPayroll = allEmployees.reduce((acc, emp) => {
    const calc = calculatePayroll(emp.salary);
    return acc + calc.gross;
  }, 0);

  // Employee's personal payroll calculation
  const personalPayroll = calculatePayroll(currentUser.salary);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#152A20] text-[#FAF7F2] rounded-lg p-6 sm:p-8 border border-[#C5A059]/40 relative overflow-hidden shadow-parchment">
        {/* Background Crest Watermark */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none text-right font-serif-cormorant text-9xl select-none text-[#C5A059]">
          V&amp;S
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#233F31] text-[#E4CA92] text-xs uppercase tracking-widest font-sans mb-3 border border-[#C5A059]/30">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isAdmin ? 'High Table Chancellor Console' : 'Member of Chambers Dossier'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-playfair font-medium text-[#FAF7F2]">
              Welcome, {currentUser.preferredTitle || currentUser.name}
            </h2>
            <p className="mt-2 text-sm text-[#D2C7B4] font-serif-cormorant text-base sm:text-lg leading-relaxed">
              {isAdmin
                ? 'All chambers report orderly functioning. The Sovereign Ledger is balanced, roll attendance is active, and pending petitions await your proctorial imprimatur.'
                : `Your appointment is active in the ${currentUser.department}. Today’s chamber session is open; review your time-off quotas, personal ledger, and roll.`}
            </p>
          </div>

          {/* Quick Action Button Group in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            {!isAdmin ? (
              <button
                onClick={onOpenLeaveModal}
                id="banner-petition-leave-btn"
                className="px-4 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#152A20] font-serif-playfair text-xs font-semibold tracking-wider uppercase transition-colors shadow-gold-subtle cursor-pointer flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Petition for Time-Off</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('leaves')}
                id="banner-review-petitions-btn"
                className="px-4 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#152A20] font-serif-playfair text-xs font-semibold tracking-wider uppercase transition-colors shadow-gold-subtle cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Process Petitions ({pendingLeaves.length})</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 rounded bg-[#233F31] hover:bg-[#2C4E3D] text-[#FAF7F2] font-serif-playfair text-xs tracking-wider uppercase transition-colors border border-[#C5A059]/40 cursor-pointer flex items-center gap-2"
            >
              <span>View Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADMIN DASHBOARD VIEW */}
      {/* ========================================================= */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8A7663] font-medium font-sans">
                  Total Workforce
                </span>
                <span className="p-2 rounded bg-[#FAF7F2] text-[#152A20] border border-[#E2DAC9]">
                  <Users className="w-4 h-4 text-[#152A20]" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-serif-cormorant font-bold text-[#152A20]">
                  {totalEmployees} <span className="text-sm font-sans font-normal text-[#8A7663]">Personnel</span>
                </div>
                <div className="text-xs text-[#5C4838] mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>5 Active Chambers</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8A7663] font-medium font-sans">
                  Present Today
                </span>
                <span className="p-2 rounded bg-[#FAF7F2] text-[#152A20] border border-[#E2DAC9]">
                  <Clock className="w-4 h-4 text-emerald-800" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-serif-cormorant font-bold text-[#152A20]">
                  {presentToday} <span className="text-sm font-sans font-normal text-[#8A7663]">in Chamber</span>
                </div>
                <div className="text-xs text-[#8A7663] mt-1">
                  {onLeaveToday} on sanctioned leave today
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8A7663] font-medium font-sans">
                  Pending Petitions
                </span>
                <span className="p-2 rounded bg-[#FAF7F2] text-[#6B1D2F] border border-[#E2DAC9]">
                  <CalendarCheck className="w-4 h-4 text-[#6B1D2F]" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-serif-cormorant font-bold text-[#6B1D2F]">
                  {pendingLeaves.length} <span className="text-sm font-sans font-normal text-[#8A7663]">Requests</span>
                </div>
                <div className="text-xs text-[#6B1D2F] mt-1 font-medium">
                  {pendingLeaves.length > 0 ? 'Requires Proctorial Decision' : 'All petitions settled'}
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8A7663] font-medium font-sans">
                  Monthly Remuneration
                </span>
                <span className="p-2 rounded bg-[#FAF7F2] text-[#C5A059] border border-[#E2DAC9]">
                  <Banknote className="w-4 h-4 text-[#9A7B39]" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-serif-cormorant font-bold text-[#152A20]">
                  {formatRupee(totalMonthlyPayroll)}
                </div>
                <div className="text-xs text-[#5C4838] mt-1">
                  Active monthly syndicate outlay
                </div>
              </div>
            </div>
          </div>

          {/* Workforce Directory Quick Inspection Bar (Admin View) */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                  Active Syndicate Personnel Roster
                </h3>
                <p className="text-xs text-[#8A7663]">
                  Roster overview of enrolled officers across chambers. Click any member to inspect full records in the Directory.
                </p>
              </div>
              <button
                onClick={() => onNavigate('employees')}
                id="view-all-roster-btn"
                className="text-xs text-[#C5A059] hover:text-[#9A7B39] font-serif-playfair font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Full Personnel Registry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {allEmployees.map((emp) => {
                return (
                  <button
                    key={emp.id}
                    onClick={() => onNavigate('employees')}
                    className="p-3 rounded-md border text-center transition-all cursor-pointer flex flex-col items-center bg-[#FAF7F2] text-[#1C1917] border-[#E2DAC9] hover:border-[#C5A059]/60 hover:bg-[#F4EFE6]"
                  >
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#C5A059] mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <div className="font-serif-playfair text-xs font-semibold truncate w-full">
                      {emp.name.split(' ')[0]} {emp.name.split(' ')[1] || ''}
                    </div>
                    <div className="text-[10px] truncate w-full text-[#8A7663]">
                      {emp.department}
                    </div>
                    <span className={`mt-1 text-[9px] uppercase px-1.5 py-0.2 rounded font-sans ${
                      emp.role === 'admin' 
                        ? 'bg-[#6B1D2F] text-white font-medium' 
                        : 'bg-[#233F31] text-[#E4CA92]'
                    }`}>
                      {emp.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Pending Leave Approvals & Today's Attendance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Leave Approvals */}
            <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-[#6B1D2F]" />
                    <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                      Pending Petitions for Time-Off
                    </h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#FAF7F2] text-[#6B1D2F] border border-[#E2DAC9] font-medium font-sans">
                    {pendingLeaves.length} Waiting
                  </span>
                </div>

                {pendingLeaves.length === 0 ? (
                  <div className="py-8 text-center text-[#8A7663] font-serif-cormorant text-lg italic">
                    All petitions have been duly processed. No actions pending.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingLeaves.slice(0, 3).map((leave) => (
                      <div
                        key={leave.id}
                        className="p-3.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] hover:border-[#C5A059] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-serif-playfair font-semibold text-[#152A20]">
                            {leave.employeeName}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#233F31] text-[#E4CA92] text-[10px] uppercase font-sans">
                            {leave.leaveType}
                          </span>
                        </div>
                        <div className="text-xs text-[#5C4838] mb-2">
                          <span className="font-mono text-[11px]">{leave.startDate}</span> to{' '}
                          <span className="font-mono text-[11px]">{leave.endDate}</span> ({leave.totalDays} business days)
                        </div>
                        <p className="text-xs text-[#8A7663] italic line-clamp-2 mb-3">
                          "{leave.remarks}"
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2DAC9]">
                          <button
                            onClick={() => onRejectLeave(leave.id, 'Declined upon proctorial review.')}
                            id={`quick-reject-${leave.id}`}
                            className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#6B1D2F] border border-[#6B1D2F]/40 text-xs font-serif-playfair cursor-pointer flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => onApproveLeave(leave.id, 'Approved with full proctorial endorsement.')}
                            id={`quick-approve-${leave.id}`}
                            className="px-2.5 py-1 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair cursor-pointer flex items-center gap-1 transition-colors shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Sanction</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {pendingLeaves.length > 3 && (
                <button
                  onClick={() => onNavigate('leaves')}
                  className="mt-4 text-xs text-[#C5A059] hover:underline font-serif-playfair text-center block w-full pt-2 border-t border-[#E2DAC9] cursor-pointer"
                >
                  View All {pendingLeaves.length} Petitions in Leave Manager →
                </button>
              )}
            </div>

            {/* Today's Roll & Attendance Distribution */}
            <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#152A20]" />
                    <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                      Today’s Roll Call ({todayStr})
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="text-xs text-[#C5A059] hover:underline font-serif-playfair cursor-pointer"
                  >
                    Attendance Ledger →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {allEmployees.map((emp) => {
                    const record = todayAttendance.find(r => r.employeeId === emp.employeeId);
                    const status = record ? record.status : 'Absent';
                    const checkInTime = record?.checkIn;

                    return (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between py-2 px-3 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#C5A059]/40"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-serif-playfair font-medium text-[#152A20]">
                              {emp.name}
                            </div>
                            <div className="text-[10px] text-[#8A7663]">
                              {emp.department}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {checkInTime && (
                            <span className="font-mono text-[11px] text-[#5C4838]">
                              {checkInTime}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-sans font-semibold border ${
                              status === 'Present'
                                ? 'bg-[#152A20] text-[#E4CA92] border-[#C5A059]/40'
                                : status === 'Leave'
                                ? 'bg-[#6B1D2F] text-[#FAF7F2] border-[#85223A]'
                                : status === 'Half-day'
                                ? 'bg-[#C5A059]/20 text-[#9A7B39] border-[#C5A059]'
                                : 'bg-[#E2DAC9] text-[#8A7663] border-[#D2C7B4]'
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2DAC9] flex items-center justify-between text-xs text-[#8A7663]">
                <span>Total Active Personnel: {totalEmployees}</span>
                <span className="text-[#152A20] font-medium font-serif-playfair">
                  Attendance Rate: {Math.round((presentToday / totalEmployees) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* EMPLOYEE DASHBOARD VIEW (Problem Statement 3.2.1) */
        /* ========================================================= */
        <div className="space-y-6">
          {/* Quick-Access Cards Grid (Profile, Attendance, Leave Requests, Logout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick-Access 1: Profile */}
            <button
              onClick={() => onNavigate('profile')}
              id="quick-card-profile"
              className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] hover:border-[#C5A059] shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-[#FAF7F2] text-[#152A20] border border-[#E2DAC9] group-hover:bg-[#152A20] group-hover:text-[#E4CA92] transition-colors">
                  <UserCheck className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-[#8A7663] group-hover:text-[#152A20] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-4">
                <h4 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                  Official Dossier
                </h4>
                <p className="text-xs text-[#8A7663] mt-1">
                  View credentials, chamber appointments, and official records.
                </p>
              </div>
            </button>

            {/* Quick-Access 2: Attendance */}
            <button
              onClick={() => onNavigate('attendance')}
              id="quick-card-attendance"
              className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] hover:border-[#C5A059] shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-[#FAF7F2] text-[#152A20] border border-[#E2DAC9] group-hover:bg-[#152A20] group-hover:text-[#E4CA92] transition-colors">
                  <Clock className="w-5 h-5" />
                </span>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-sans font-semibold ${
                  isCheckedIn ? 'bg-[#152A20] text-[#E4CA92]' : 'bg-[#FAF7F2] text-[#8A7663] border border-[#E2DAC9]'
                }`}>
                  {isCheckedIn ? 'Clocked In' : isCompletedToday ? 'Completed' : 'Not Clocked'}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                  Daily Roll &amp; Hours
                </h4>
                <p className="text-xs text-[#8A7663] mt-1">
                  Check-in/out stamps, weekly log, and chamber punctuality records.
                </p>
              </div>
            </button>

            {/* Quick-Access 3: Leave Requests */}
            <button
              onClick={() => onNavigate('leaves')}
              id="quick-card-leaves"
              className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] hover:border-[#C5A059] shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-[#FAF7F2] text-[#6B1D2F] border border-[#E2DAC9] group-hover:bg-[#6B1D2F] group-hover:text-white transition-colors">
                  <CalendarCheck className="w-5 h-5" />
                </span>
                <span className="text-xs text-[#C5A059] font-medium font-serif-playfair">
                  {currentUser.leaveBalance.paidRemaining} Days Left
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                  Time-Off Petitions
                </h4>
                <p className="text-xs text-[#8A7663] mt-1">
                  Submit petitions for executive leave, sick leave, or sabbatical.
                </p>
              </div>
            </button>

            {/* Quick-Access 4: Payroll */}
            <button
              onClick={() => onNavigate('payroll')}
              id="quick-card-payroll"
              className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] hover:border-[#C5A059] shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded bg-[#FAF7F2] text-[#C5A059] border border-[#E2DAC9] group-hover:bg-[#152A20] group-hover:text-[#E4CA92] transition-colors">
                  <Banknote className="w-5 h-5 text-[#9A7B39]" />
                </span>
                <span className="font-mono text-xs text-[#152A20] font-semibold">
                  {formatRupee(personalPayroll.netPay)} / mo
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                  Salary &amp; Payslips
                </h4>
                <p className="text-xs text-[#8A7663] mt-1">
                  View itemized compensation ledger, tax withholding &amp; payslips.
                </p>
              </div>
            </button>
          </div>

          {/* Interactive Today's Clock-in Card & Leave Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clock-In Widget */}
            <div className="lg:col-span-2 bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#152A20]" />
                    <h3 className="font-serif-playfair text-lg font-semibold text-[#152A20]">
                      Today’s Chamber Attendance ({todayStr})
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8A7663]">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{currentUser.chamberLocation}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3.5 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                    <div className="text-[11px] uppercase tracking-wider text-[#8A7663] font-sans">
                      Check-In Timestamp
                    </div>
                    <div className="font-mono text-lg font-bold text-[#152A20] mt-1">
                      {myTodayRecord?.checkIn || '— : —'}
                    </div>
                    <div className="text-[10px] text-[#5C4838] mt-0.5">
                      {myTodayRecord?.checkIn ? 'Punctual entry logged' : 'Pending morning arrival'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                    <div className="text-[11px] uppercase tracking-wider text-[#8A7663] font-sans">
                      Check-Out Timestamp
                    </div>
                    <div className="font-mono text-lg font-bold text-[#152A20] mt-1">
                      {myTodayRecord?.checkOut || '— : —'}
                    </div>
                    <div className="text-[10px] text-[#5C4838] mt-0.5">
                      {myTodayRecord?.checkOut ? 'Evening dismissal stamped' : 'Session currently open'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                    <div className="text-[11px] uppercase tracking-wider text-[#8A7663] font-sans">
                      Session Duration
                    </div>
                    <div className="font-mono text-lg font-bold text-[#152A20] mt-1">
                      {myTodayRecord?.workingHours ? `${myTodayRecord.workingHours} hrs` : isCheckedIn ? 'Active' : '0.0 hrs'}
                    </div>
                    <div className="text-[10px] text-[#5C4838] mt-0.5">
                      Standard expectation: 8.0 hrs
                    </div>
                  </div>
                </div>
              </div>

              {/* Punch In / Out Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2DAC9]">
                <div className="text-xs text-[#8A7663]">
                  {isCheckedIn ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      Currently clocked in at {myTodayRecord?.checkIn}
                    </span>
                  ) : isCompletedToday ? (
                    <span className="text-[#152A20] font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      Today’s attendance completed ({myTodayRecord?.workingHours} hrs)
                    </span>
                  ) : (
                    <span>Chamber session awaiting check-in verification</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!isCheckedIn ? (
                    <button
                      onClick={onCheckIn}
                      id="employee-checkin-btn"
                      className="px-5 py-2.5 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] font-serif-playfair text-xs tracking-wider uppercase font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      <span>Clock In Today</span>
                    </button>
                  ) : (
                    <button
                      onClick={onCheckOut}
                      id="employee-checkout-btn"
                      className="px-5 py-2.5 rounded bg-[#6B1D2F] hover:bg-[#85223A] text-white border border-[#85223A] font-serif-playfair text-xs tracking-wider uppercase font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Clock Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Leave Quota Card */}
            <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3 mb-4">
                  <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                    Time-Off Allowances
                  </h3>
                  <button
                    onClick={onOpenLeaveModal}
                    className="text-xs text-[#C5A059] hover:underline font-serif-playfair cursor-pointer"
                  >
                    + Petition
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-serif-playfair text-[#152A20]">Paid Executive Leave</span>
                      <span className="font-mono text-[#5C4838] font-bold">
                        {currentUser.leaveBalance.paidRemaining} / {currentUser.leaveBalance.paidTotal} days
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F2] border border-[#E2DAC9] overflow-hidden">
                      <div
                        className="h-full bg-[#152A20]"
                        style={{
                          width: `${(currentUser.leaveBalance.paidRemaining / currentUser.leaveBalance.paidTotal) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-serif-playfair text-[#152A20]">Convalescence (Sick)</span>
                      <span className="font-mono text-[#5C4838] font-bold">
                        {currentUser.leaveBalance.sickRemaining} / {currentUser.leaveBalance.sickTotal} days
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F2] border border-[#E2DAC9] overflow-hidden">
                      <div
                        className="h-full bg-[#C5A059]"
                        style={{
                          width: `${(currentUser.leaveBalance.sickRemaining / currentUser.leaveBalance.sickTotal) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-serif-playfair text-[#152A20]">Unpaid Sabbatical</span>
                      <span className="font-mono text-[#5C4838] font-bold">
                        {currentUser.leaveBalance.unpaidUsed} days taken
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8A7663]">
                      Subject to prior Proctorial consent.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2DAC9]">
                <button
                  onClick={onOpenLeaveModal}
                  className="w-full py-2 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#152A20] border border-[#E2DAC9] text-xs font-serif-playfair font-medium transition-colors cursor-pointer text-center"
                >
                  Submit New Petition →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Personal Activity & Alerts */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3 mb-3">
              <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                Recent Dossier Notices &amp; Activity
              </h3>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs text-[#C5A059] hover:underline font-serif-playfair cursor-pointer"
              >
                Full Audit Trail →
              </button>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between py-2 px-3 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs"
                >
                  <div>
                    <div className="font-serif-playfair font-medium text-[#152A20]">
                      {log.action}
                    </div>
                    <div className="text-[#8A7663] mt-0.5 text-[11px]">
                      {log.details}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#8A7663] whitespace-nowrap ml-4">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
