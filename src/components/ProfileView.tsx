import React, { useState } from 'react';
import { Employee, Department, UserRole } from '../types';
import { calculatePayroll, formatRupee } from '../services/storage';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Award, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Camera,
  AlertCircle
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: Employee;
  allEmployees: Employee[];
  selectedEmployeeForDossier?: Employee | null;
  onUpdateProfile: (updated: Employee) => void;
  onNavigateToPayroll: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  allEmployees,
  selectedEmployeeForDossier,
  onUpdateProfile,
  onNavigateToPayroll,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Target employee whose profile is being viewed/edited
  const targetEmployee: Employee = selectedEmployeeForDossier || currentUser;
  const isSelf = targetEmployee.id === currentUser.id;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'remuneration' | 'documents'>('personal');

  // Edit form state
  const [formData, setFormData] = useState<Employee>({ ...targetEmployee });

  // Reset form when target employee changes
  React.useEffect(() => {
    setFormData({ ...targetEmployee });
    setIsEditing(false);
  }, [targetEmployee.id]);

  const payroll = calculatePayroll(targetEmployee.salary);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const aristocraticAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="space-y-6">
      {/* Dossier Header Card */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={targetEmployee.avatar}
                alt={targetEmployee.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#C5A059] shadow-gold-subtle"
                referrerPolicy="no-referrer"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-[#C5A059]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-serif-playfair font-semibold text-[#152A20]">
                  {targetEmployee.name}
                </h2>
                <span className="font-mono text-xs text-[#8A7663] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                  {targetEmployee.employeeId}
                </span>
                {targetEmployee.isEmailVerified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Official</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-serif-cormorant text-lg text-[#C5A059] font-medium">
                {targetEmployee.preferredTitle || targetEmployee.designation}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A7663] mt-2">
                <span className="flex items-center gap-1 text-[#152A20]">
                  <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{targetEmployee.department}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{targetEmployee.grade}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{targetEmployee.chamberLocation}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action: Edit Profile Button */}
          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                id="enter-edit-profile-btn"
                className="px-4 py-2 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair font-semibold tracking-wide uppercase transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{isAdmin ? 'Edit Full Dossier' : 'Edit Contact Details'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded bg-[#FAF7F2] text-[#6B1D2F] border border-[#E2DAC9] text-xs font-serif-playfair cursor-pointer"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation in Profile */}
        <div className="flex items-center gap-4 mt-8 border-b border-[#E2DAC9] text-xs font-serif-playfair overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`pb-2.5 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'personal'
                ? 'border-[#C5A059] text-[#152A20]'
                : 'border-transparent text-[#8A7663] hover:text-[#152A20]'
            }`}
          >
            Personal &amp; Contact Records
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`pb-2.5 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'job'
                ? 'border-[#C5A059] text-[#152A20]'
                : 'border-transparent text-[#8A7663] hover:text-[#152A20]'
            }`}
          >
            Appointment &amp; Chamber Details
          </button>
          <button
            onClick={() => setActiveTab('remuneration')}
            className={`pb-2.5 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'remuneration'
                ? 'border-[#C5A059] text-[#152A20]'
                : 'border-transparent text-[#8A7663] hover:text-[#152A20]'
            }`}
          >
            Remuneration Schedule
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'documents'
                ? 'border-[#C5A059] text-[#152A20]'
                : 'border-transparent text-[#8A7663] hover:text-[#152A20]'
            }`}
          >
            Official Charters &amp; Covenants ({targetEmployee.documents.length})
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EDIT FORM OR READ-ONLY VIEW */}
      {/* ========================================================= */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3">
            <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
              {isAdmin ? 'Modify Official Dossier (Proctorial Authority)' : 'Edit Personal Contact Information'}
            </h3>
            {!isAdmin && (
              <span className="text-[11px] text-[#6B1D2F] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Job, appointment and salary fields are locked by proctorial decree.</span>
              </span>
            )}
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-medium text-[#5C4838] mb-1.5">
              Portrait Avatar (Select from Gallery or Enter URL)
            </label>
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
              {aristocraticAvatars.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setFormData({ ...formData, avatar: url })}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                    formData.avatar === url ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs font-mono focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Phone */}
            <div>
              <label className="block font-medium text-[#5C4838] mb-1">Private Telephone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium text-[#5C4838] mb-1">Residential Estate Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-medium text-[#5C4838] mb-1">City / Region</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block font-medium text-[#5C4838] mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="pt-3 border-t border-[#E2DAC9]">
            <h4 className="font-serif-playfair text-xs font-semibold text-[#152A20] mb-2">
              Next of Kin / Emergency Fiduciary Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#5C4838] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#5C4838] mb-1">Kinship Relation</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, relation: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#5C4838] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Admin-Only Editable Fields */}
          {isAdmin && (
            <div className="pt-3 border-t border-[#E2DAC9] space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-medium font-serif-playfair">
                <ShieldCheck className="w-4 h-4" />
                <span>Chamber Registry Appointments (Proctorial Authority Only)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#5C4838] mb-1">Official Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] mb-1">Chamber Division</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
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
                  <label className="block text-[#5C4838] mb-1">Appointment Title</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#5C4838] mb-1">Rank / Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] mb-1">Chamber Location</label>
                  <input
                    type="text"
                    value={formData.chamberLocation}
                    onChange={(e) => setFormData({ ...formData, chamberLocation: e.target.value })}
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] mb-1">Reporting Partner</label>
                  <input
                    type="text"
                    value={formData.reportingTo}
                    onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2DAC9]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-1.5 rounded bg-[#FAF7F2] text-[#4A3728] border border-[#E2DAC9] text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-profile-dossier-btn"
              className="px-4 py-1.5 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] font-serif-playfair text-xs font-semibold cursor-pointer shadow-sm"
            >
              Save Alterations
            </button>
          </div>
        </form>
      ) : (
        /* READ-ONLY TAB VIEWS */
        <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] p-6 shadow-sm">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h3 className="font-serif-playfair text-base font-semibold text-[#152A20] border-b border-[#E2DAC9] pb-2">
                Personal &amp; Contact Records
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <span className="text-[#8A7663] block">Corporate Registry Email</span>
                    <span className="font-mono text-[#152A20] font-medium">{targetEmployee.email}</span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Private Telephone</span>
                    <span className="font-mono text-[#152A20] font-medium">{targetEmployee.phone}</span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Residential Estate</span>
                    <span className="text-[#152A20] font-medium">
                      {targetEmployee.address}, {targetEmployee.city}, {targetEmployee.country}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[#8A7663] block">Next of Kin / Fiduciary Contact</span>
                    <span className="text-[#152A20] font-medium font-serif-playfair">
                      {targetEmployee.emergencyContact.name} ({targetEmployee.emergencyContact.relation})
                    </span>
                    <span className="block font-mono text-[#5C4838] mt-0.5">
                      {targetEmployee.emergencyContact.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Chamber Roll Status</span>
                    <span className="px-2 py-0.5 rounded bg-[#152A20] text-[#E4CA92] text-[10px] uppercase font-sans font-semibold inline-block mt-0.5">
                      {targetEmployee.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'job' && (
            <div className="space-y-6">
              <h3 className="font-serif-playfair text-base font-semibold text-[#152A20] border-b border-[#E2DAC9] pb-2">
                Appointment &amp; Chamber Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <span className="text-[#8A7663] block">Chamber Division</span>
                    <span className="text-base font-serif-playfair text-[#152A20] font-semibold">
                      {targetEmployee.department}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Official Designation</span>
                    <span className="text-[#152A20] font-medium">{targetEmployee.designation}</span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Rank / Grade Tier</span>
                    <span className="text-[#5C4838] font-serif-cormorant text-base font-medium">
                      {targetEmployee.grade}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[#8A7663] block">Admission / Joining Date</span>
                    <span className="font-mono text-[#152A20] font-medium">{targetEmployee.joiningDate}</span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Reporting Chancellor / Manager</span>
                    <span className="text-[#152A20] font-medium">{targetEmployee.reportingTo}</span>
                  </div>

                  <div>
                    <span className="text-[#8A7663] block">Physical Chamber Office</span>
                    <span className="text-[#152A20] font-medium">{targetEmployee.chamberLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'remuneration' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-2">
                <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
                  Remuneration Schedule Overview
                </h3>
                <button
                  onClick={onNavigateToPayroll}
                  className="text-xs text-[#C5A059] hover:underline font-serif-playfair cursor-pointer"
                >
                  View Full Itemized Payslip →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                  <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Gross Monthly</span>
                  <span className="font-mono text-xl font-bold text-[#152A20] mt-1 block">
                    {formatRupee(payroll.gross)}
                  </span>
                  <span className="text-[10px] text-[#5C4838]">Base + allowances</span>
                </div>

                <div className="p-4 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                  <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Total Deductions</span>
                  <span className="font-mono text-xl font-bold text-[#6B1D2F] mt-1 block">
                    {formatRupee(payroll.totalDeductions)}
                  </span>
                  <span className="text-[10px] text-[#8A7663]">Tax ({targetEmployee.salary.taxRate}%), PF, Insurance</span>
                </div>

                <div className="p-4 rounded bg-[#152A20] text-[#FAF7F2] border border-[#C5A059]">
                  <span className="text-[#C5A059] block text-[10px] uppercase font-sans">Net Payout</span>
                  <span className="font-mono text-xl font-bold text-[#FAF7F2] mt-1 block">
                    {formatRupee(payroll.netPay)}
                  </span>
                  <span className="text-[10px] text-[#D2C7B4]">Direct deposit</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-serif-playfair text-base font-semibold text-[#152A20] border-b border-[#E2DAC9] pb-2">
                Official Documents, Charters &amp; Covenants
              </h3>

              <div className="space-y-2.5">
                {targetEmployee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded bg-[#FAF7F2] border border-[#E2DAC9] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#C5A059]" />
                      <div>
                        <div className="font-serif-playfair font-semibold text-[#152A20]">
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-[#8A7663]">
                          Category: {doc.category} • Sealed on {doc.issueDate} • {doc.fileSize}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Simulated secure parchment download: "${doc.title}" has been verified under cryptographic registry seal.`)}
                      className="px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-[11px] font-serif-playfair text-[#152A20] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-[#C5A059]" />
                      <span>Examine</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
