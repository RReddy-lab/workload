import React, { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  LogOut, 
  Filter, 
  Search, 
  UserCheck, 
  Edit, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface AttendanceViewProps {
  currentUser: Employee;
  allEmployees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onCheckIn: () => void;
  onCheckOut: () => void;
  onOverrideAttendance?: (record: {
    employeeId: string;
    employeeName: string;
    date: string;
    status: AttendanceStatus;
    checkIn: string;
    checkOut: string;
    notes: string;
  }) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentUser,
  allEmployees,
  attendanceRecords,
  onCheckIn,
  onCheckOut,
  onOverrideAttendance,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Override Modal state for Admin
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const [overrideTargetEmployee, setOverrideTargetEmployee] = useState<Employee>(allEmployees[0]);
  const [overrideStatus, setOverrideStatus] = useState<AttendanceStatus>('Present');
  const [overrideCheckIn, setOverrideCheckIn] = useState<string>('08:30 AM');
  const [overrideCheckOut, setOverrideCheckOut] = useState<string>('05:30 PM');
  const [overrideNotes, setOverrideNotes] = useState<string>('Administrative proctorial mark.');

  // Check if current user is checked in today
  const myTodayRecord = attendanceRecords.find(
    r => r.employeeId === currentUser.employeeId && r.date === todayStr
  );
  const isCheckedIn = !!myTodayRecord?.checkIn && !myTodayRecord?.checkOut;

  // Filter records based on role (Problem Statement 3.4.2: Employees can view only their own attendance; Admin can view all)
  const visibleRecords = isAdmin
    ? attendanceRecords
    : attendanceRecords.filter(r => r.employeeId === currentUser.employeeId);

  // Daily records for selectedDate
  const dailyRecords = visibleRecords.filter(r => r.date === selectedDate);

  // Filtered by search and status
  const filteredDailyEmployees = (isAdmin ? allEmployees : [currentUser]).filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());

    const record = dailyRecords.find(r => r.employeeId === emp.employeeId);
    const status = record ? record.status : 'Absent';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Weekly view calculation: Past 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOverrideAttendance) {
      onOverrideAttendance({
        employeeId: overrideTargetEmployee.employeeId,
        employeeName: overrideTargetEmployee.name,
        date: selectedDate,
        status: overrideStatus,
        checkIn: overrideCheckIn,
        checkOut: overrideCheckOut,
        notes: overrideNotes,
      });
    }
    setIsOverrideModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Punch Module */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-playfair font-semibold text-[#152A20]">
            {isAdmin ? 'Sovereign Attendance & Time Ledger' : 'My Attendance & Roll'}
          </h2>
          <p className="text-xs text-[#8A7663] mt-1 font-serif-cormorant text-base">
            {isAdmin
              ? 'Roll registry of chamber appointments, timestamps, and proctorial adjustments.'
              : 'Log daily chamber arrival and departure, review weekly hours and attendance status.'}
          </p>
        </div>

        {/* Punch In / Out Quick Pill for Logged In User */}
        <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E2DAC9] shadow-sm flex items-center gap-3">
          <div className="text-xs">
            <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Today’s Status</span>
            <span className="font-serif-playfair font-medium text-[#152A20]">
              {isCheckedIn ? 'Clocked In' : myTodayRecord?.checkOut ? 'Clocked Out' : 'Not Clocked In'}
            </span>
          </div>

          {!isCheckedIn ? (
            <button
              onClick={onCheckIn}
              id="attendance-clock-in-btn"
              className="px-3.5 py-1.5 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair font-semibold tracking-wide uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Clock In</span>
            </button>
          ) : (
            <button
              onClick={onCheckOut}
              id="attendance-clock-out-btn"
              className="px-3.5 py-1.5 rounded bg-[#6B1D2F] hover:bg-[#85223A] text-white border border-[#85223A] text-xs font-serif-playfair font-semibold tracking-wide uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Clock Out</span>
            </button>
          )}
        </div>
      </div>

      {/* View Switcher & Date Controls */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Toggle Daily vs Weekly View */}
        <div className="flex items-center bg-[#F4EFE6] p-0.5 rounded border border-[#E2DAC9] text-xs">
          <button
            onClick={() => setViewType('daily')}
            id="view-daily-btn"
            className={`px-3 py-1.5 rounded font-serif-playfair transition-colors cursor-pointer ${
              viewType === 'daily' ? 'bg-[#152A20] text-[#FAF7F2]' : 'text-[#4A3728] hover:text-[#152A20]'
            }`}
          >
            Daily Chamber Roll
          </button>
          <button
            onClick={() => setViewType('weekly')}
            id="view-weekly-btn"
            className={`px-3 py-1.5 rounded font-serif-playfair transition-colors cursor-pointer ${
              viewType === 'weekly' ? 'bg-[#152A20] text-[#FAF7F2]' : 'text-[#4A3728] hover:text-[#152A20]'
            }`}
          >
            Weekly Roster View
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8A7663]">Chamber Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            id="attendance-date-picker"
            className="px-2.5 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
          />
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-xs font-serif-playfair text-[#152A20] cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Admin Action: Override / Mark Attendance */}
        {isAdmin && (
          <button
            onClick={() => setIsOverrideModalOpen(true)}
            id="admin-override-attendance-btn"
            className="px-3 py-1.5 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#C5A059] text-xs font-serif-playfair text-[#152A20] flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Mark / Adjust Roll</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* DAILY VIEW */}
      {/* ========================================================= */}
      {viewType === 'daily' ? (
        <div className="space-y-4">
          {/* Filters for Admin */}
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#8A7663] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter personnel on roll..."
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-[#FFFFFF] border border-[#E2DAC9] text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8A7663]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#FFFFFF] border border-[#E2DAC9] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half-day">Half-day</option>
                  <option value="Leave">On Leave</option>
                </select>
              </div>
            </div>
          )}

          {/* Daily Records Ledger Table */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#152A20] text-[#FAF7F2] font-serif-playfair">
                    <th className="py-3 px-4 font-normal">Officer / Fellow</th>
                    <th className="py-3 px-4 font-normal">Chamber Division</th>
                    <th className="py-3 px-4 font-normal">Check-In</th>
                    <th className="py-3 px-4 font-normal">Check-Out</th>
                    <th className="py-3 px-4 font-normal">Logged Hours</th>
                    <th className="py-3 px-4 font-normal">Status</th>
                    <th className="py-3 px-4 font-normal">Location / Notes</th>
                    {isAdmin && <th className="py-3 px-4 font-normal text-right">Adjustment</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DAC9]">
                  {filteredDailyEmployees.map((emp) => {
                    const record = dailyRecords.find(r => r.employeeId === emp.employeeId);
                    const status: AttendanceStatus = record ? record.status : 'Absent';
                    const checkIn = record?.checkIn || '— : —';
                    const checkOut = record?.checkOut || '— : —';
                    const hours = record?.workingHours ? `${record.workingHours} hrs` : '0.0 hrs';
                    const location = record?.location || emp.chamberLocation;
                    const notes = record?.notes || '';

                    return (
                      <tr key={emp.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#C5A059]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-serif-playfair font-semibold text-[#152A20]">
                                {emp.name}
                              </div>
                              <div className="text-[10px] text-[#8A7663] font-mono">
                                {emp.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#5C4838]">
                          {emp.department}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-[#152A20]">
                          {checkIn}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-[#152A20]">
                          {checkOut}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] font-semibold text-[#5C4838]">
                          {hours}
                        </td>

                        <td className="py-3 px-4">
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
                        </td>

                        <td className="py-3 px-4 text-[#8A7663] max-w-[200px] truncate">
                          <span>{location}</span>
                          {notes && <span className="block text-[10px] italic text-[#5C4838]">"{notes}"</span>}
                        </td>

                        {isAdmin && (
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setOverrideTargetEmployee(emp);
                                setOverrideStatus(status);
                                setOverrideCheckIn(checkIn !== '— : —' ? checkIn : '08:30 AM');
                                setOverrideCheckOut(checkOut !== '— : —' ? checkOut : '05:30 PM');
                                setIsOverrideModalOpen(true);
                              }}
                              className="px-2 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-[11px] font-serif-playfair text-[#152A20] cursor-pointer"
                            >
                              Modify
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* WEEKLY ROSTER VIEW (Problem Statement 3.4.1) */
        /* ========================================================= */
        <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3">
            <div>
              <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                Weekly Attendance &amp; Hours Ledger
              </h3>
              <p className="text-xs text-[#8A7663]">
                Inspection period: {last7Days[0]} through {last7Days[6]}
              </p>
            </div>
            <span className="text-xs font-serif-playfair text-[#C5A059]">
              Standard Syndicate Pace: 40 hrs / wk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2DAC9] text-[#152A20] font-serif-playfair">
                  <th className="py-2.5 px-3 font-medium">Personnel</th>
                  {last7Days.map((d) => (
                    <th key={d} className="py-2.5 px-3 font-medium text-center">
                      <span className="block text-[10px] text-[#8A7663] font-sans">
                        {new Date(d).toLocaleDateString('en-GB', { weekday: 'short' })}
                      </span>
                      <span className="font-mono text-[11px]">{d.slice(5)}</span>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 font-medium text-right">Week Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DAC9]">
                {(isAdmin ? allEmployees : [currentUser]).map((emp) => {
                  let totalWeeklyHours = 0;

                  return (
                    <tr key={emp.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="py-3 px-3">
                        <div className="font-serif-playfair font-semibold text-[#152A20]">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-[#8A7663]">{emp.department}</div>
                      </td>

                      {last7Days.map((d) => {
                        const rec = visibleRecords.find(
                          r => r.employeeId === emp.employeeId && r.date === d
                        );
                        const status = rec ? rec.status : 'Absent';
                        const hrs = rec?.workingHours || 0;
                        totalWeeklyHours += hrs;

                        return (
                          <td key={d} className="py-3 px-2 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border ${
                                  status === 'Present'
                                    ? 'bg-[#152A20] text-[#E4CA92] border-[#C5A059]/40'
                                    : status === 'Leave'
                                    ? 'bg-[#6B1D2F] text-white border-[#85223A]'
                                    : status === 'Half-day'
                                    ? 'bg-[#C5A059]/20 text-[#9A7B39] border-[#C5A059]'
                                    : 'bg-[#E2DAC9] text-[#8A7663] border-[#D2C7B4]'
                                }`}
                              >
                                {status === 'Present' ? 'P' : status === 'Leave' ? 'L' : status === 'Half-day' ? '½' : 'A'}
                              </span>
                              <span className="font-mono text-[9px] text-[#8A7663] mt-0.5">
                                {hrs > 0 ? `${hrs}h` : '—'}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      <td className="py-3 px-3 text-right font-mono font-bold text-xs text-[#152A20]">
                        {totalWeeklyHours.toFixed(1)} hrs
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADMIN OVERRIDE MODAL */}
      {/* ========================================================= */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#C5A059] rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif-playfair text-lg font-semibold text-[#152A20]">
                  Proctorial Roll Adjustment
                </h3>
              </div>
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="text-[#8A7663] hover:text-[#152A20] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Target Personnel</label>
                <select
                  value={overrideTargetEmployee.id}
                  onChange={(e) => {
                    const found = allEmployees.find(x => x.id === e.target.value);
                    if (found) setOverrideTargetEmployee(found);
                  }}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                >
                  {allEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Status Classification</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as AttendanceStatus)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half-day">Half-day</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Check-In</label>
                  <input
                    type="text"
                    value={overrideCheckIn}
                    onChange={(e) => setOverrideCheckIn(e.target.value)}
                    placeholder="08:30 AM"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Check-Out</label>
                  <input
                    type="text"
                    value={overrideCheckOut}
                    onChange={(e) => setOverrideCheckOut(e.target.value)}
                    placeholder="05:30 PM"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Proctorial Notes / Reason</label>
                <textarea
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2DAC9]">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#FAF7F2] text-[#4A3728] border border-[#E2DAC9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] font-serif-playfair font-medium cursor-pointer shadow-sm"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
