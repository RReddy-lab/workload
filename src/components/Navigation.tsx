import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  Banknote, 
  UserCircle, 
  ScrollText,
  AlertCircle
} from 'lucide-react';

export type NavTab = 'dashboard' | 'employees' | 'attendance' | 'leaves' | 'payroll' | 'profile' | 'audit';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingLeavesCount: number;
  isCheckedInToday: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  pendingLeavesCount,
  isCheckedInToday,
}) => {
  const isAdmin = userRole === 'admin';

  const navItems: Array<{
    id: NavTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string | number | null;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      sublabel: isAdmin ? 'Executive High Table' : 'Personal Hearth',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    ...(isAdmin ? [{
      id: 'employees' as NavTab,
      label: 'Workforce Registry',
      sublabel: 'All Personnel & Appointments',
      icon: <Users className="w-4 h-4" />,
    }] : []),
    {
      id: 'attendance',
      label: 'Attendance Ledger',
      sublabel: 'Time, Punctuality & Roll',
      icon: <Clock className="w-4 h-4" />,
      badge: isCheckedInToday ? 'Active' : 'Unlogged',
      badgeColor: isCheckedInToday ? 'bg-[#152A20] text-[#E4CA92] border-[#C5A059]' : 'bg-[#6B1D2F] text-[#FAF7F2] border-[#85223A]',
    },
    {
      id: 'leaves',
      label: 'Leave & Time-Off',
      sublabel: isAdmin ? 'Petitions & Approvals' : 'Petitions & Balances',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: isAdmin && pendingLeavesCount > 0 ? `${pendingLeavesCount} Pending` : null,
      badgeColor: 'bg-[#6B1D2F] text-white border-[#85223A]',
    },
    {
      id: 'payroll',
      label: 'Payroll & Remuneration',
      sublabel: isAdmin ? 'Fiduciary Disbursements' : 'Personal Payslips',
      icon: <Banknote className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'My Dossier',
      sublabel: 'Personal & Job Records',
      icon: <UserCircle className="w-4 h-4" />,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      sublabel: 'Chronological Ledger',
      icon: <ScrollText className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="bg-[#FAF7F2] border-b border-[#E2DAC9] sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                id={`nav-tab-${item.id}`}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded transition-all whitespace-nowrap cursor-pointer text-left relative ${
                  isActive
                    ? 'bg-[#152A20] text-[#FAF7F2] shadow-sm'
                    : 'text-[#4A3728] hover:bg-[#F4EFE6] hover:text-[#152A20]'
                }`}
              >
                <span className={`${isActive ? 'text-[#C5A059]' : 'text-[#8A7663] group-hover:text-[#152A20]'}`}>
                  {item.icon}
                </span>

                <div className="flex flex-col">
                  <span className={`text-xs font-serif-playfair font-medium tracking-wide ${isActive ? 'text-[#FAF7F2]' : 'text-[#1C1917]'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] hidden md:inline leading-none ${isActive ? 'text-[#D2C7B4]' : 'text-[#8A7663]'}`}>
                    {item.sublabel}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-sans font-semibold rounded border ${
                      item.badgeColor || 'bg-[#233F31] text-[#E4CA92] border-[#C5A059]/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C5A059] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
