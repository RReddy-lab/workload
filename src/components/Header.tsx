import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { WorkLoadLogo } from './WorkLoadLogo';
import { 
  ShieldCheck, 
  UserCheck, 
  Download, 
  RefreshCw, 
  LogOut, 
  Clock, 
  Building2 
} from 'lucide-react';

interface HeaderProps {
  currentUser: Employee;
  allEmployees: Employee[];
  onSwitchUser?: (employee: Employee) => void;
  onResetData: () => void;
  onOpenAuth?: () => void;
  onLogout: () => void;
  onExportSingleHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allEmployees,
  onResetData,
  onLogout,
  onExportSingleHtml,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="bg-[#152A20] text-[#FAF7F2] border-b border-[#C5A059]/30 relative z-30 shadow-md">
      {/* Top Heritage Ribbon */}
      <div className="bg-[#0D1C15] px-4 py-1.5 border-b border-[#233F31] text-[11px] font-sans-ui text-[#D2C7B4] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
          <span className="tracking-widest uppercase text-[#C5A059] font-medium font-serif-playfair">WORK LOAD</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#E5DFD1]">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-mono text-[11px]">{timeStr || '12:00:00 PM'}</span>
            <span className="text-[#8A7663]">•</span>
            <span>{dateStr || 'Monday, 14 September 2026'}</span>
          </div>

          <button
            onClick={onExportSingleHtml}
            id="export-single-html-btn"
            title="Download full standalone single-file HTML version that runs offline without any server"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#233F31] hover:bg-[#2C4E3D] text-[#E4CA92] border border-[#C5A059]/40 text-[11px] transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3 text-[#C5A059]" />
            <span className="font-serif-playfair">Download Single HTML</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3.5">
          <WorkLoadLogo size="md" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-playfair text-xl sm:text-2xl font-semibold tracking-wide text-[#FAF7F2]">
                Work Load
              </h1>
            </div>
            <p className="font-serif-cormorant text-sm italic text-[#D2C7B4]">
              {currentUser.chamberLocation || 'Chamber Registry'} • {currentUser.department}
            </p>
          </div>
        </div>

        {/* Authenticated User Context & Secure Sign Out */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active User Identity Pill (Fixed & Secure - No Unauthorized Account Switching) */}
          <div 
            id="active-user-display"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-[#0D1C15] border border-[#C5A059]/40 text-left shadow-xs"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A059]/60 flex-shrink-0 bg-[#233F31]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[#FAF7F2] font-serif-playfair leading-tight">
                  {currentUser.name}
                </span>
                {isAdmin ? (
                  <span className="px-1.5 py-0.2 bg-[#6B1D2F] text-[#FAF7F2] text-[9px] uppercase font-sans tracking-wider rounded border border-[#C5A059]/40 font-semibold">
                    Admin
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 bg-[#233F31] text-[#E4CA92] text-[9px] uppercase font-sans tracking-wider rounded border border-[#C5A059]/30 font-semibold">
                    Employee
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#C5A059] truncate max-w-[190px]">
                {currentUser.preferredTitle || currentUser.designation} ({currentUser.employeeId})
              </div>
            </div>
          </div>

          {/* Secure Sign Out Button */}
          <button
            onClick={onLogout}
            id="header-signout-btn"
            title="Sign out of Work Load session"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#4A101E]/40 hover:bg-[#6B1D2F] border border-[#85223A] text-xs text-[#FAF7F2] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E4CA92]" />
            <span className="font-serif-playfair">Sign Out</span>
          </button>

          {/* Reset Seed Data Button (with confirmation) */}
          {confirmReset ? (
            <div className="flex items-center gap-1 bg-[#4A101E] px-2 py-1 rounded border border-[#85223A] text-xs">
              <span className="text-[11px] text-[#FAF7F2]">Reset data?</span>
              <button
                onClick={() => {
                  onResetData();
                  setConfirmReset(false);
                }}
                id="confirm-reset-yes-btn"
                className="px-1.5 py-0.5 bg-[#6B1D2F] text-white rounded hover:bg-[#85223A] text-[10px] cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                id="confirm-reset-no-btn"
                className="px-1.5 py-0.5 bg-black/30 text-[#D2C7B4] rounded text-[10px] cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              id="reset-seed-btn"
              title="Reset all records to default sovereign seed state"
              className="p-1.5 rounded bg-[#0D1C15] hover:bg-[#233F31] border border-[#233F31] text-[#D2C7B4] hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
