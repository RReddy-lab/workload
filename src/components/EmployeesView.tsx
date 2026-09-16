import React, { useState } from 'react';
import { Employee, Department, UserRole } from '../types';
import { calculatePayroll, formatRupee } from '../services/storage';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  Building2,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface EmployeesViewProps {
  employees: Employee[];
  currentUser: Employee;
  onSelectEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onAddEmployee: () => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  currentUser,
  onSelectEmployee,
  onEditEmployee,
  onAddEmployee,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const departments: Department[] = [
    'Executive Board',
    'Legal Chambers',
    'Private Wealth',
    'Real Estate Syndication',
    'Human Capital',
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;

    return matchesSearch && matchesDept && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif-playfair font-semibold text-[#152A20]">
              {isAdmin ? 'Chamber Workforce Registry' : 'Personnel Directory'}
            </h2>
            <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8A7663] border border-[#E2DAC9] text-xs font-mono">
              {filteredEmployees.length} of {employees.length}
            </span>
          </div>
          <p className="text-xs text-[#8A7663] mt-1 font-serif-cormorant text-base">
            {isAdmin 
              ? 'Complete proctorial register of partners, counsel, directors, and associates.' 
              : 'Directory of appointed members and fellows of the chambers.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F4EFE6] p-0.5 rounded border border-[#E2DAC9] text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded font-serif-playfair transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#152A20] text-[#FAF7F2]' : 'text-[#4A3728] hover:text-[#152A20]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded font-serif-playfair transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#152A20] text-[#FAF7F2]' : 'text-[#4A3728] hover:text-[#152A20]'
              }`}
            >
              Ledger
            </button>
          </div>

          {/* Admin Add Officer Button */}
          {isAdmin && (
            <button
              onClick={onAddEmployee}
              id="add-new-employee-btn"
              className="px-4 py-2 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair font-semibold tracking-wide uppercase transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Induct Personnel</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8A7663] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID (e.g. VS-001), designation..."
            id="employee-search-input"
            className="w-full pl-9 pr-3 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none text-xs text-[#1C1917] placeholder:text-[#8A7663]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#5C4838]">
            <Filter className="w-3.5 h-3.5 text-[#8A7663]" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              id="department-filter-select"
              className="px-2.5 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none text-xs text-[#1C1917] cursor-pointer"
            >
              <option value="all">All Chambers / Divisions</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            id="role-filter-select"
            className="px-2.5 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none text-xs text-[#1C1917] cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin / HR Officer</option>
            <option value="employee">Employee / Fellow</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || selectedDept !== 'all' || selectedRole !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('all');
                setSelectedRole('all');
              }}
              className="text-xs text-[#6B1D2F] hover:underline font-serif-playfair cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Personnel Content */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-[#FFFFFF] p-12 rounded-lg border border-[#E2DAC9] text-center space-y-3">
          <p className="font-serif-playfair text-lg text-[#152A20]">No personnel match the selected criteria</p>
          <p className="text-xs text-[#8A7663]">
            Adjust your search keywords or reset division filters to inspect all chamber records.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const payroll = calculatePayroll(emp.salary);
            const isSelf = emp.id === currentUser.id;

            return (
              <div
                key={emp.id}
                className={`bg-[#FFFFFF] rounded-lg border transition-all p-5 shadow-sm flex flex-col justify-between relative overflow-hidden ${
                  isSelf ? 'border-[#C5A059] ring-1 ring-[#C5A059]/30' : 'border-[#E2DAC9] hover:border-[#C5A059]'
                }`}
              >
                {/* Top Badge Ribbon */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] text-[#8A7663] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2DAC9]">
                    {emp.employeeId}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {emp.role === 'admin' ? (
                      <span className="px-2 py-0.5 rounded bg-[#6B1D2F] text-white text-[10px] uppercase font-sans tracking-wider border border-[#85223A]">
                        Admin / HR
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#152A20] text-[#E4CA92] text-[10px] uppercase font-sans tracking-wider border border-[#C5A059]/30">
                        Fellow
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#5C4838] text-[10px] border border-[#E2DAC9]">
                      {emp.status}
                    </span>
                  </div>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059]"
                      referrerPolicy="no-referrer"
                    />
                    {emp.isEmailVerified && (
                      <span
                        title="Identity & Email Verified"
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#152A20] text-[#C5A059] rounded-full flex items-center justify-center border border-[#C5A059]"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="font-serif-playfair text-base font-semibold text-[#152A20] truncate">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-[#C5A059] font-serif-cormorant text-sm truncate">
                      {emp.preferredTitle || emp.designation}
                    </p>
                    <p className="text-[11px] text-[#8A7663] truncate">
                      {emp.department}
                    </p>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2 py-3 border-y border-[#E2DAC9] text-xs mb-4">
                  <div className="flex items-center justify-between text-[#5C4838]">
                    <span className="text-[#8A7663]">Rank / Grade:</span>
                    <span className="font-serif-playfair font-medium text-[#152A20]">{emp.grade}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5C4838]">
                    <span className="text-[#8A7663]">Chamber Office:</span>
                    <span className="truncate max-w-[180px] text-[#152A20]">{emp.chamberLocation}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5C4838]">
                    <span className="text-[#8A7663]">Appointed Date:</span>
                    <span className="font-mono text-[11px] text-[#152A20]">{emp.joiningDate}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center justify-between text-[#5C4838] pt-1 border-t border-[#E2DAC9]/60">
                      <span className="text-[#8A7663]">Net Pay (Mo):</span>
                      <span className="font-mono font-bold text-[#152A20]">
                        {formatRupee(payroll.netPay)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onSelectEmployee(emp)}
                    id={`view-profile-${emp.id}`}
                    className="flex-1 py-1.5 px-2.5 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#152A20] border border-[#E2DAC9] text-xs font-serif-playfair flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>View Dossier</span>
                  </button>

                  <button
                    onClick={() => onEditEmployee(emp)}
                    id={`edit-employee-${emp.id}`}
                    className={`py-1.5 px-3 rounded text-xs font-serif-playfair flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isAdmin
                        ? 'bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059]'
                        : isSelf
                        ? 'bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#152A20] border border-[#E2DAC9]'
                        : 'hidden'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{isAdmin ? 'Edit Details' : 'Edit Contact'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LEDGER VIEW */
        <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#152A20] text-[#FAF7F2] font-serif-playfair">
                  <th className="py-3 px-4 font-normal">Officer / Fellow</th>
                  <th className="py-3 px-4 font-normal">ID</th>
                  <th className="py-3 px-4 font-normal">Division / Chamber</th>
                  <th className="py-3 px-4 font-normal">Rank / Grade</th>
                  <th className="py-3 px-4 font-normal">Role</th>
                  <th className="py-3 px-4 font-normal">Appointed</th>
                  {isAdmin && <th className="py-3 px-4 font-normal text-right">Net Remuneration</th>}
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DAC9]">
                {filteredEmployees.map((emp) => {
                  const payroll = calculatePayroll(emp.salary);
                  const isSelf = emp.id === currentUser.id;

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#FAF7F2] transition-colors ${
                        isSelf ? 'bg-[#FAF7F2]/80' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-serif-playfair font-semibold text-[#152A20]">
                              {emp.name}
                            </div>
                            <div className="text-[11px] text-[#8A7663]">
                              {emp.preferredTitle || emp.designation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#5C4838]">
                        {emp.employeeId}
                      </td>
                      <td className="py-3 px-4 text-[#152A20]">
                        {emp.department}
                      </td>
                      <td className="py-3 px-4 text-[#5C4838] font-serif-cormorant text-sm">
                        {emp.grade}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-sans ${
                          emp.role === 'admin'
                            ? 'bg-[#6B1D2F] text-white'
                            : 'bg-[#233F31] text-[#E4CA92]'
                        }`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#8A7663]">
                        {emp.joiningDate}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#152A20]">
                          {formatRupee(payroll.netPay)}
                        </td>
                      )}
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => onSelectEmployee(emp)}
                          className="px-2 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-xs font-serif-playfair text-[#152A20] cursor-pointer"
                        >
                          Dossier
                        </button>
                        {(isAdmin || isSelf) && (
                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="px-2 py-1 rounded bg-[#152A20] hover:bg-[#233F31] border border-[#C5A059] text-xs font-serif-playfair text-[#E4CA92] cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
