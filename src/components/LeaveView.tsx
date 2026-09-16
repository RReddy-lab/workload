import React, { useState } from 'react';
import { Employee, LeaveRequest, LeaveType, LeaveStatus } from '../types';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Filter, 
  Search, 
  ShieldCheck, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  Award
} from 'lucide-react';

interface LeaveViewProps {
  currentUser: Employee;
  allEmployees: Employee[];
  leaveRequests: LeaveRequest[];
  onApplyLeave: (newLeave: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => void;
  onApproveLeave: (leaveId: string, comments?: string) => void;
  onRejectLeave: (leaveId: string, comments?: string) => void;
  isModalOpenInitially?: boolean;
}

export const LeaveView: React.FC<LeaveViewProps> = ({
  currentUser,
  allEmployees,
  leaveRequests,
  onApplyLeave,
  onApproveLeave,
  onRejectLeave,
  isModalOpenInitially = false,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(isModalOpenInitially);
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Executive');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [applyError, setApplyError] = useState<string>('');

  // Decision Modal state for Admin
  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    leaveId: string;
    action: 'approve' | 'reject';
    employeeName: string;
    comments: string;
  }>({
    isOpen: false,
    leaveId: '',
    action: 'approve',
    employeeName: '',
    comments: '',
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate days between start and end
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e.getTime() - s.getTime()) / (1000 * 3600 * 24) + 1;
    return Math.max(0, Math.round(diff));
  };

  const calculatedDays = calculateDays(startDate, endDate);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError('');

    if (!startDate || !endDate) {
      setApplyError('Please designate both initiation and conclusion dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setApplyError('Conclusion date cannot precede initiation date.');
      return;
    }

    if (!remarks.trim()) {
      setApplyError('Please provide a reason for taking leave.');
      return;
    }

    // Balance check
    if (leaveType === 'Paid Executive' && calculatedDays > currentUser.leaveBalance.paidRemaining) {
      setApplyError(`Requested days (${calculatedDays}) exceed your remaining Paid Executive quota (${currentUser.leaveBalance.paidRemaining} days).`);
      return;
    }

    if (leaveType === 'Convalescence (Sick)' && calculatedDays > currentUser.leaveBalance.sickRemaining) {
      setApplyError(`Requested days (${calculatedDays}) exceed your remaining Convalescence quota (${currentUser.leaveBalance.sickRemaining} days).`);
      return;
    }

    onApplyLeave({
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType,
      startDate,
      endDate,
      totalDays: calculatedDays,
      remarks,
    });

    setIsApplyModalOpen(false);
    setStartDate('');
    setEndDate('');
    setRemarks('');
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (decisionModal.action === 'approve') {
      onApproveLeave(decisionModal.leaveId, decisionModal.comments || 'Sanctioned under proctorial authority.');
    } else {
      onRejectLeave(decisionModal.leaveId, decisionModal.comments || 'Declined upon proctorial review.');
    }
    setDecisionModal({ isOpen: false, leaveId: '', action: 'approve', employeeName: '', comments: '' });
  };

  // Filter requests based on role
  const visibleRequests = isAdmin
    ? leaveRequests
    : leaveRequests.filter(l => l.employeeId === currentUser.employeeId);

  const filteredRequests = visibleRequests.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Petition Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-playfair font-semibold text-[#152A20]">
            {isAdmin ? 'Petitions for Time-Off & Imprimaturs' : 'Time-Off & Leave Ledger'}
          </h2>
          <p className="text-xs text-[#8A7663] mt-1 font-serif-cormorant text-base">
            {isAdmin
              ? 'Sanction, review, or decline fellow and officer leave petitions across all chambers.'
              : 'Submit formal petitions for executive sabbatical, convalescence, or annual leave.'}
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          id="open-apply-leave-btn"
          className="px-4 py-2 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair font-semibold tracking-wide uppercase transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Petition for Leave</span>
        </button>
      </div>

      {/* Leave Quota Cards (Shown for current user perspective) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8A7663]">
            <span className="uppercase tracking-wider font-sans">Paid Executive Quota</span>
            <span className="p-1 rounded bg-[#FAF7F2] text-[#152A20]">
              <Award className="w-4 h-4 text-[#C5A059]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif-cormorant font-bold text-[#152A20]">
              {currentUser.leaveBalance.paidRemaining}{' '}
              <span className="text-sm font-sans font-normal text-[#8A7663]">
                / {currentUser.leaveBalance.paidTotal} days
              </span>
            </div>
            <div className="text-xs text-[#5C4838] mt-1">
              Accrued for {currentUser.name}
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8A7663]">
            <span className="uppercase tracking-wider font-sans">Convalescence (Sick)</span>
            <span className="p-1 rounded bg-[#FAF7F2] text-[#6B1D2F]">
              <Clock className="w-4 h-4 text-[#6B1D2F]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif-cormorant font-bold text-[#152A20]">
              {currentUser.leaveBalance.sickRemaining}{' '}
              <span className="text-sm font-sans font-normal text-[#8A7663]">
                / {currentUser.leaveBalance.sickTotal} days
              </span>
            </div>
            <div className="text-xs text-[#5C4838] mt-1">
              Physician endorsement on file
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8A7663]">
            <span className="uppercase tracking-wider font-sans">Unpaid Sabbatical</span>
            <span className="p-1 rounded bg-[#FAF7F2] text-[#5C4838]">
              <CalendarDays className="w-4 h-4 text-[#5C4838]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif-cormorant font-bold text-[#5C4838]">
              {currentUser.leaveBalance.unpaidUsed}{' '}
              <span className="text-sm font-sans font-normal text-[#8A7663]">days taken</span>
            </div>
            <div className="text-xs text-[#8A7663] mt-1">
              Subject to high table consent
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#8A7663] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by petitioner, remarks..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#8A7663]" />
          <span className="text-[#8A7663]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="leave-status-filter"
            className="px-2.5 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="all">All Petitions ({visibleRequests.length})</option>
            <option value="Pending">Pending Imprimatur</option>
            <option value="Approved">Sanctioned / Approved</option>
            <option value="Rejected">Declined</option>
          </select>
        </div>
      </div>

      {/* Petitions List / Cards */}
      <div className="space-y-3.5">
        {filteredRequests.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 rounded-lg border border-[#E2DAC9] text-center space-y-2">
            <p className="font-serif-playfair text-base text-[#152A20]">No leave petitions found</p>
            <p className="text-xs text-[#8A7663]">
              There are currently no petitions matching the selected filter in the registry.
            </p>
          </div>
        ) : (
          filteredRequests.map((leave) => {
            const isPending = leave.status === 'Pending';
            const isApproved = leave.status === 'Approved';
            const isRejected = leave.status === 'Rejected';

            return (
              <div
                key={leave.id}
                className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-5 shadow-sm transition-all hover:border-[#C5A059]/80"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                        {leave.employeeName}
                      </h4>
                      <span className="text-xs text-[#8A7663]">•</span>
                      <span className="text-xs text-[#5C4838]">{leave.department}</span>
                      <span className="text-xs text-[#8A7663]">•</span>
                      <span className="font-mono text-[11px] text-[#8A7663]">
                        Filed on {leave.appliedOn}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#152A20] border border-[#E2DAC9] font-medium font-serif-playfair">
                        {leave.leaveType}
                      </span>
                      <span className="text-[#8A7663]">Span:</span>
                      <span className="font-mono font-semibold text-[#152A20]">
                        {leave.startDate} to {leave.endDate}
                      </span>
                      <span className="text-[#5C4838] font-serif-cormorant text-sm">
                        ({leave.totalDays} business days)
                      </span>
                    </div>

                    <p className="text-xs text-[#4A3728] italic bg-[#FAF7F2] p-2.5 rounded border border-[#E2DAC9] max-w-2xl">
                      "{leave.remarks}"
                    </p>

                    {/* Decision comments if present */}
                    {(leave.reviewedBy || leave.adminComments) && (
                      <div className="mt-2 text-[11px] text-[#152A20] flex items-start gap-1.5 bg-[#FAF7F2]/80 px-2.5 py-1.5 rounded border border-[#E2DAC9]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-serif-playfair font-semibold">
                            Proctorial Notice ({leave.reviewedBy || 'High Table Proctor'}):
                          </span>{' '}
                          <span className="italic">{leave.adminComments || 'Sanctioned without reservation.'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Sanctioned (Approved)</span>
                        </div>
                      )}

                      {isPending && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF7F2] text-[#9A7B39] border border-[#C5A059] text-xs font-serif-playfair font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Pending Imprimatur</span>
                        </div>
                      )}

                      {isRejected && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#6B1D2F] text-white border border-[#85223A] text-xs font-serif-playfair">
                          <XCircle className="w-3.5 h-3.5 text-white" />
                          <span>Declined</span>
                        </div>
                      )}
                    </div>

                    {/* Admin Action Buttons (Approve / Reject) for Pending Requests */}
                    {isAdmin && isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setDecisionModal({
                              isOpen: true,
                              leaveId: leave.id,
                              action: 'reject',
                              employeeName: leave.employeeName,
                              comments: '',
                            });
                          }}
                          id={`reject-btn-${leave.id}`}
                          className="px-3 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#6B1D2F] border border-[#6B1D2F]/40 text-xs font-serif-playfair cursor-pointer transition-colors"
                        >
                          Decline...
                        </button>
                        <button
                          onClick={() => {
                            setDecisionModal({
                              isOpen: true,
                              leaveId: leave.id,
                              action: 'approve',
                              employeeName: leave.employeeName,
                              comments: 'Sanctioned with full proctorial endorsement.',
                            });
                          }}
                          id={`approve-btn-${leave.id}`}
                          className="px-3.5 py-1 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair cursor-pointer shadow-sm transition-colors"
                        >
                          Sanction (Approve)...
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* APPLY MODAL */}
      {/* ========================================================= */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#C5A059] rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif-playfair text-lg font-semibold text-[#152A20]">
                  Petition for Time-Off
                </h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-[#8A7663] hover:text-[#152A20] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {applyError && (
              <div className="p-2.5 rounded bg-[#4A101E]/10 border border-[#85223A] text-xs text-[#6B1D2F] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Classification of Time-Off</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  id="apply-leave-type-select"
                  className="w-full p-2.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="Paid Executive">Paid Executive Leave (Available: {currentUser.leaveBalance.paidRemaining} days)</option>
                  <option value="Convalescence (Sick)">Convalescence / Sick Leave (Available: {currentUser.leaveBalance.sickRemaining} days)</option>
                  <option value="Sabbatical (Unpaid)">Unpaid Sabbatical</option>
                  <option value="Compassionate">Compassionate &amp; Family Heritage Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Initiation Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    id="apply-start-date"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Conclusion Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    id="apply-end-date"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              {calculatedDays > 0 && (
                <div className="p-2.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-[#152A20] flex items-center justify-between">
                  <span className="font-serif-playfair">Calculated Working Duration:</span>
                  <span className="font-mono font-bold text-sm text-[#C5A059]">
                    {calculatedDays} business day{calculatedDays > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">
                  Reason for Leave
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  id="apply-leave-remarks"
                  placeholder="Enter reason for leave (e.g., family function, sick leave, urgent personal work)..."
                  rows={3}
                  className="w-full p-2.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2DAC9]">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3.5 py-2 rounded bg-[#FAF7F2] text-[#4A3728] border border-[#E2DAC9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-leave-petition-btn"
                  className="px-4 py-2 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] font-serif-playfair font-semibold cursor-pointer shadow-sm"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADMIN DECISION MODAL (Approve / Reject with Comments) */}
      {/* ========================================================= */}
      {decisionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#C5A059] rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif-playfair text-lg font-semibold text-[#152A20]">
                  {decisionModal.action === 'approve' ? 'Sanction Petition' : 'Decline Petition'}
                </h3>
              </div>
              <button
                onClick={() => setDecisionModal({ ...decisionModal, isOpen: false })}
                className="text-[#8A7663] hover:text-[#152A20] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5C4838]">
              You are about to {decisionModal.action} the leave petition for{' '}
              <strong className="text-[#152A20]">{decisionModal.employeeName}</strong>. This imprimatur
              will be permanently recorded in the Sovereign Audit Trail.
            </p>

            <form onSubmit={handleConfirmDecision} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">
                  Proctorial Comments / Conditions
                </label>
                <textarea
                  value={decisionModal.comments}
                  onChange={(e) => setDecisionModal({ ...decisionModal, comments: e.target.value })}
                  rows={3}
                  id="decision-comments-input"
                  placeholder="Add proctorial instruction or justification..."
                  className="w-full p-2.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2DAC9]">
                <button
                  type="button"
                  onClick={() => setDecisionModal({ ...decisionModal, isOpen: false })}
                  className="px-3.5 py-1.5 rounded bg-[#FAF7F2] text-[#4A3728] border border-[#E2DAC9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-decision-btn"
                  className={`px-4 py-1.5 rounded font-serif-playfair font-semibold cursor-pointer shadow-sm ${
                    decisionModal.action === 'approve'
                      ? 'bg-[#152A20] text-[#E4CA92] border border-[#C5A059]'
                      : 'bg-[#6B1D2F] text-white border border-[#85223A]'
                  }`}
                >
                  {decisionModal.action === 'approve' ? 'Confirm Sanction' : 'Confirm Decline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
