import React, { useState } from 'react';
import { Employee, Department, UserRole } from '../types';
import { UserPlus, ShieldCheck, AlertTriangle, Building2, Award, Banknote, Calendar } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (newEmployee: Employee) => void;
  existingCount: number;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  existingCount,
}) => {
  if (!isOpen) return null;

  const defaultId = `VS-00${existingCount + 1}`;

  const [employeeId, setEmployeeId] = useState<string>(defaultId);
  const [name, setName] = useState<string>('');
  const [preferredTitle, setPreferredTitle] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<UserRole>('employee');
  const [department, setDepartment] = useState<Department>('Private Wealth');
  const [designation, setDesignation] = useState<string>('');
  const [grade, setGrade] = useState<string>('Associate Tier III');
  const [chamberLocation, setChamberLocation] = useState<string>('Mayfair Chambers, London');
  const [reportingTo, setReportingTo] = useState<string>('Lord Alistair Sterling');
  const [phone, setPhone] = useState<string>('+44 20 7946 0122');
  const [address, setAddress] = useState<string>('12 Chesterfield Gardens, Mayfair');
  const [city, setCity] = useState<string>('London');
  const [country, setCountry] = useState<string>('United Kingdom');
  
  // Salary
  const [basic, setBasic] = useState<number>(115000);
  const [hra, setHra] = useState<number>(32000);
  const [executiveAllowance, setExecutiveAllowance] = useState<number>(20000);
  const [discretionaryBonus, setDiscretionaryBonus] = useState<number>(15000);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [providentFund, setProvidentFund] = useState<number>(8000);
  const [insurance, setInsurance] = useState<number>(4500);

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('Spouse / Solicitor');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+44 20 7946 0999');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const aristocraticAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  ];
  const [avatar, setAvatar] = useState<string>(aristocraticAvatars[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !employeeId.trim() || !email.trim() || !designation.trim()) {
      setErrorMessage('Please furnish all obligatory proctorial appointment fields.');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: employeeId.trim().toUpperCase(),
      name: name.trim(),
      preferredTitle: preferredTitle.trim() || designation.trim(),
      email: email.trim().toLowerCase(),
      password: 'Password123!',
      role,
      department,
      designation: designation.trim(),
      grade,
      joiningDate: new Date().toISOString().split('T')[0],
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      avatar,
      status: 'Active',
      reportingTo,
      chamberLocation,
      isEmailVerified: true,
      salary: {
        basic,
        hra,
        executiveAllowance,
        discretionaryBonus,
        taxRate,
        providentFund,
        insurance,
      },
      leaveBalance: {
        paidRemaining: 24,
        paidTotal: 24,
        sickRemaining: 12,
        sickTotal: 12,
        unpaidUsed: 0,
      },
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: `Indenture of Executive Covenant — ${name.trim()}`,
          category: 'Charter',
          issueDate: new Date().toISOString().split('T')[0],
          fileSize: '3.4 MB',
        },
      ],
      emergencyContact: {
        name: emergencyName.trim() || 'High Table Proctorial Registry',
        relation: emergencyRelation,
        phone: emergencyPhone,
      },
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border-2 border-[#C5A059] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#152A20] text-[#C5A059] flex items-center justify-center font-serif-cormorant text-xl font-bold border border-[#C5A059]">
              <UserPlus className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-serif-playfair text-lg font-bold text-[#152A20]">
                Enrol New Official / Syndicate Fellow
              </h3>
              <p className="text-xs text-[#8A7663] font-serif-cormorant text-sm">
                Proctorial admission covenant and remuneration charter
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8A7663] hover:text-[#152A20] text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded bg-[#4A101E]/10 border border-[#85223A] text-xs text-[#6B1D2F] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Appointment & Personal */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-serif-playfair font-semibold text-[#152A20] border-b border-[#E2DAC9] pb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Section I: Personal &amp; Identification Dossier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] font-mono focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5C4838] font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lord Julian Somerset"
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Preferred Title / Style</label>
                <input
                  type="text"
                  value={preferredTitle}
                  onChange={(e) => setPreferredTitle(e.target.value)}
                  placeholder="e.g. Managing Partner"
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Corporate Registry Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vanderbilt-sterling.co.uk"
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Chancery Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="employee">Employee / Fellow</option>
                  <option value="admin">Admin / HR Proctor</option>
                </select>
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-[#5C4838] font-medium mb-1">Official Portrait Avatar</label>
              <div className="flex items-center gap-2">
                {aristocraticAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer ${
                      avatar === url ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Chamber & Job Assignment */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-serif-playfair font-semibold text-[#152A20] border-b border-[#E2DAC9] pb-1">
              <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Section II: Chamber Division &amp; Appointment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Chamber Division</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="Executive Board">Executive Board</option>
                  <option value="Legal Chambers">Legal Chambers</option>
                  <option value="Private Wealth">Private Wealth</option>
                  <option value="Real Estate Syndication">Real Estate Syndication</option>
                  <option value="Human Capital">Human Capital</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Official Designation / Title</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Syndicate Counsel"
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Grade / Band</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Reporting Partner</label>
                <input
                  type="text"
                  value={reportingTo}
                  onChange={(e) => setReportingTo(e.target.value)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5C4838] font-medium mb-1">Chamber Location</label>
                <input
                  type="text"
                  value={chamberLocation}
                  onChange={(e) => setChamberLocation(e.target.value)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Remuneration Schedule */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-serif-playfair font-semibold text-[#152A20] border-b border-[#E2DAC9] pb-1">
              <Banknote className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Section III: Initial Remuneration Schedule (₹ / month)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[#5C4838] mb-1">Base Monthly</label>
                <input
                  type="number"
                  value={basic}
                  onChange={(e) => setBasic(Number(e.target.value) || 0)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#5C4838] mb-1">Estate HRA</label>
                <input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(Number(e.target.value) || 0)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#5C4838] mb-1">Executive Stipend</label>
                <input
                  type="number"
                  value={executiveAllowance}
                  onChange={(e) => setExecutiveAllowance(Number(e.target.value) || 0)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#5C4838] mb-1">Tax Withholding (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2DAC9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#FAF7F2] text-[#4A3728] border border-[#E2DAC9] text-xs cursor-pointer hover:bg-[#F4EFE6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-enrol-employee-btn"
              className="px-5 py-2 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] font-serif-playfair text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm hover:bg-[#233F31]"
            >
              Issue Indenture &amp; Enrol Fellow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
