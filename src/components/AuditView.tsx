import React, { useState } from 'react';
import { AuditLog } from '../types';
import { ScrollText, Filter, Search, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface AuditViewProps {
  logs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-playfair font-semibold text-[#152A20]">
            Sovereign Audit Trail &amp; Chancery Register
          </h2>
          <p className="text-xs text-[#8A7663] mt-1 font-serif-cormorant text-base">
            Immutable chronological ledger documenting all appointments, attendance punches, proctorial imprimaturs, and financial adjustments.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Cryptographically Sealed</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2DAC9] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#8A7663] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action, details..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#8A7663]" />
          <span className="text-[#8A7663]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="all">All Chancery Operations ({logs.length})</option>
            <option value="Auth">Authentication</option>
            <option value="Attendance">Attendance &amp; Roll</option>
            <option value="Leave">Time-Off &amp; Petitions</option>
            <option value="Payroll">Payroll &amp; Remuneration</option>
            <option value="Profile">Profile Alterations</option>
            <option value="System">System Verification</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#152A20] text-[#FAF7F2] font-serif-playfair">
                <th className="py-3 px-4 font-normal">Timestamp</th>
                <th className="py-3 px-4 font-normal">Chancery Actor</th>
                <th className="py-3 px-4 font-normal">Role</th>
                <th className="py-3 px-4 font-normal">Operation</th>
                <th className="py-3 px-4 font-normal">Category</th>
                <th className="py-3 px-4 font-normal">Fiduciary Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DAC9]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#8A7663] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-serif-playfair font-semibold text-[#152A20]">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-sans font-semibold ${
                        log.actorRole === 'admin'
                          ? 'bg-[#6B1D2F] text-white'
                          : 'bg-[#233F31] text-[#E4CA92]'
                      }`}
                    >
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-serif-playfair text-[#152A20]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#5C4838] border border-[#E2DAC9] text-[10px] uppercase font-sans">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5C4838] max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
