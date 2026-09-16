import React, { useState } from 'react';
import { Employee, UserRole, Department } from '../types';
import { WorkLoadLogo } from './WorkLoadLogo';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  KeyRound,
  Sparkles,
  Award
} from 'lucide-react';

interface SignInPageProps {
  allEmployees: Employee[];
  onSignInSuccess: (user: Employee) => void;
  onCreateAccountSuccess: (newUser: Employee) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  allEmployees,
  onSignInSuccess,
  onCreateAccountSuccess,
}) => {
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In form state
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [signInError, setSignInError] = useState<string>('');

  // Create Account form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>(`WL-00${allEmployees.length + 1}`);
  const [department, setDepartment] = useState<Department>('Private Wealth');
  const [designation, setDesignation] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signUpError, setSignUpError] = useState<string>('');

  // Password validation rules
  const hasMinLength = signupPassword.length >= 8;
  const hasNumber = /\d/.test(signupPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword);
  const isPasswordSecure = hasMinLength && hasNumber && hasSpecial;

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const trimmedId = loginIdentifier.trim().toLowerCase();
    const trimmedPw = loginPassword.trim();

    if (!trimmedId || !trimmedPw) {
      setSignInError('Please provide both your registered email/Employee ID and password.');
      return;
    }

    // Match by email or employee ID
    const foundUser = allEmployees.find(
      (emp) =>
        emp.email.toLowerCase() === trimmedId ||
        emp.employeeId.toLowerCase() === trimmedId
    );

    if (!foundUser) {
      setSignInError('No account found with this identifier. Please verify your credentials or create a new account.');
      return;
    }

    if (foundUser.password && foundUser.password !== trimmedPw) {
      setSignInError('Invalid password. Please enter the correct password covenant.');
      return;
    }

    // Success
    onSignInSuccess(foundUser);
  };

  // Handle Create Account submission
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!fullName.trim()) {
      setSignUpError('Please enter your full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setSignUpError('Please furnish a valid corporate email address.');
      return;
    }

    if (!employeeId.trim()) {
      setSignUpError('Please assign an Employee ID for this personnel record.');
      return;
    }

    if (!isPasswordSecure) {
      setSignUpError('Password covenant does not satisfy all security criteria (8+ characters, number, and special character).');
      return;
    }

    // Check if ID or email already registered
    const exists = allEmployees.some(
      (emp) =>
        emp.employeeId.toLowerCase() === employeeId.trim().toLowerCase() ||
        emp.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (exists) {
      setSignUpError('An account with this Employee ID or Email is already registered.');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: employeeId.trim().toUpperCase(),
      name: fullName.trim(),
      preferredTitle: designation.trim() || (selectedRole === 'admin' ? 'Chamber Administrator' : 'Executive Fellow'),
      email: email.trim().toLowerCase(),
      password: signupPassword,
      role: selectedRole,
      department,
      designation: designation.trim() || (selectedRole === 'admin' ? 'Systems Administrator & Proctor' : 'Associate Officer'),
      grade: selectedRole === 'admin' ? 'Director Tier I' : 'Officer Tier III',
      joiningDate: new Date().toISOString().split('T')[0],
      phone: '+44 20 7946 0199',
      address: 'Mayfair Chambers',
      city: 'London',
      country: 'United Kingdom',
      avatar: selectedRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      status: 'Active',
      reportingTo: selectedRole === 'admin' ? 'Board of Governors' : 'Senior Administrator',
      chamberLocation: 'Mayfair Chambers, London',
      isEmailVerified: true,
      salary: {
        basic: selectedRole === 'admin' ? 160000 : 95000,
        hra: 35000,
        executiveAllowance: selectedRole === 'admin' ? 30000 : 20000,
        discretionaryBonus: 20000,
        taxRate: 20,
        providentFund: 9000,
        insurance: 4500,
      },
      leaveBalance: {
        paidRemaining: 25,
        paidTotal: 25,
        sickRemaining: 12,
        sickTotal: 12,
        unpaidUsed: 0,
      },
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: `Indenture of Service & Appointment — ${fullName.trim()}`,
          category: 'Charter',
          issueDate: new Date().toISOString().split('T')[0],
          fileSize: '2.4 MB',
        },
      ],
      emergencyContact: {
        name: 'Chancery Registry',
        relation: 'Official Registry',
        phone: '+44 20 7946 0000',
      },
    };

    onCreateAccountSuccess(newEmp);
  };

  // Preset demo auto-fill helpers
  const fillDemoAdmin = () => {
    setLoginIdentifier('sterling@vanderbilt-sterling.co.uk');
    setLoginPassword('Password123!');
    setSignInError('');
  };

  const fillDemoEmployee = () => {
    setLoginIdentifier('pendelton@vanderbilt-sterling.co.uk');
    setLoginPassword('Password123!');
    setSignInError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col justify-between selection:bg-[#C5A059]/30">
      {/* Top Heritage Ribbon */}
      <div className="bg-[#152A20] text-[#FAF7F2] px-4 py-2 text-xs border-b border-[#C5A059]/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
            <span className="font-serif-playfair font-semibold tracking-wider text-[#E4CA92]">WORK LOAD</span>
            <span className="text-[#8A7663]">|</span>
            <span className="text-[11px] text-[#D2C7B4]">Restricted Corporate Gateway &amp; Human Resource Access</span>
          </div>
          <div className="text-[11px] font-mono text-[#E4CA92]">
            SECURE ACCESS REQUIRED
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl bg-[#FFFFFF] rounded-xl border-2 border-[#E2DAC9] shadow-parchment overflow-hidden">
          
          {/* Header Branding */}
          <div className="bg-[#152A20] text-[#FAF7F2] p-6 sm:p-8 text-center border-b-2 border-[#C5A059] relative">
            {/* Crest */}
            <div className="flex justify-center mb-3">
              <WorkLoadLogo size="lg" />
            </div>

            <h1 className="font-serif-playfair text-2xl sm:text-3xl font-bold tracking-wide text-[#FAF7F2]">
              Work Load
            </h1>
            <p className="font-serif-cormorant text-base text-[#E4CA92] mt-1">
              Workforce &amp; Operations Management
            </p>
            <p className="text-[11px] text-[#D2C7B4] mt-2 max-w-md mx-auto">
              Access is restricted to authorized personnel. Sign in with your registered credentials or create a new account below.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#E2DAC9] bg-[#FAF7F2]">
            <button
              onClick={() => {
                setActiveMode('signin');
                setSignInError('');
              }}
              id="tab-sign-in"
              className={`flex-1 py-3 text-xs sm:text-sm font-serif-playfair font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-2 border-b-2 ${
                activeMode === 'signin'
                  ? 'border-[#152A20] text-[#152A20] bg-[#FFFFFF]'
                  : 'border-transparent text-[#8A7663] hover:text-[#152A20]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#C5A059]" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('signup');
                setSignUpError('');
              }}
              id="tab-create-account"
              className={`flex-1 py-3 text-xs sm:text-sm font-serif-playfair font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-2 border-b-2 ${
                activeMode === 'signup'
                  ? 'border-[#152A20] text-[#152A20] bg-[#FFFFFF]'
                  : 'border-transparent text-[#8A7663] hover:text-[#152A20]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Create New Account</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* ========================================================= */}
            {/* SIGN IN FORM */}
            {/* ========================================================= */}
            {activeMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                {signInError && (
                  <div className="p-3 rounded bg-[#4A101E]/10 border border-[#85223A] text-xs text-[#6B1D2F] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                    Corporate Email or Employee ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A7663] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. sterling@vanderbilt-sterling.co.uk or VS-001"
                      id="signin-identifier"
                      className="w-full pl-9 pr-3 py-2.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs sm:text-sm text-[#152A20] focus:border-[#C5A059] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                    Password Covenant
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A7663] absolute left-3 top-3" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      id="signin-password"
                      className="w-full pl-9 pr-3 py-2.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs sm:text-sm font-mono text-[#152A20] focus:border-[#C5A059] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    id="submit-signin-btn"
                    className="w-full py-3 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] font-serif-playfair text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Authenticate &amp; Open Work Load</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>

                {/* Quick Demo Pre-fill for convenient evaluation */}
                <div className="mt-6 pt-5 border-t border-[#E2DAC9]">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#8A7663] font-semibold block mb-2 text-center">
                    Quick-Fill Test Credentials:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={fillDemoAdmin}
                      id="demo-admin-fill-btn"
                      className="p-2 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1 text-xs font-serif-playfair font-semibold text-[#152A20]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Admin Account</span>
                      </div>
                      <div className="text-[10px] text-[#8A7663] font-mono mt-0.5 truncate">
                        sterling@... • Password123!
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={fillDemoEmployee}
                      id="demo-employee-fill-btn"
                      className="p-2 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1 text-xs font-serif-playfair font-semibold text-[#152A20]">
                        <UserCheck className="w-3.5 h-3.5 text-[#152A20]" />
                        <span>Employee Account</span>
                      </div>
                      <div className="text-[10px] text-[#8A7663] font-mono mt-0.5 truncate">
                        pendelton@... • Password123!
                      </div>
                    </button>
                  </div>
                </div>

                {/* Option to create new account note */}
                <div className="text-center pt-2 text-xs text-[#8A7663]">
                  <span>Don't have an active account? </span>
                  <button
                    type="button"
                    onClick={() => setActiveMode('signup')}
                    id="switch-to-create-acc-link"
                    className="text-[#152A20] font-serif-playfair font-semibold underline hover:text-[#C5A059] cursor-pointer ml-1"
                  >
                    Create new account
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* CREATE NEW ACCOUNT FORM (User Requirement) */}
            {/* ========================================================= */}
            {activeMode === 'signup' && (
              <form onSubmit={handleCreateAccount} className="space-y-4">
                {signUpError && (
                  <div className="p-3 rounded bg-[#4A101E]/10 border border-[#85223A] text-xs text-[#6B1D2F] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {/* Choose Admin vs Employee Account */}
                <div>
                  <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1.5">
                    Select Account Privilege Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('employee')}
                      id="role-choice-employee"
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedRole === 'employee'
                          ? 'bg-[#152A20] text-[#FAF7F2] border-[#C5A059] shadow-xs'
                          : 'bg-[#FAF7F2] text-[#152A20] border-[#E2DAC9] hover:border-[#C5A059]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif-playfair font-bold text-xs">Employee</span>
                        <UserCheck className={`w-4 h-4 ${selectedRole === 'employee' ? 'text-[#C5A059]' : 'text-[#8A7663]'}`} />
                      </div>
                      <p className={`text-[10px] mt-1 ${selectedRole === 'employee' ? 'text-[#D2C7B4]' : 'text-[#8A7663]'}`}>
                        Attendance punches, personal leave petitions, and itemized payslip ledger.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      id="role-choice-admin"
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedRole === 'admin'
                          ? 'bg-[#152A20] text-[#FAF7F2] border-[#C5A059] shadow-xs'
                          : 'bg-[#FAF7F2] text-[#152A20] border-[#E2DAC9] hover:border-[#C5A059]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif-playfair font-bold text-xs">Admin / HR</span>
                        <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-[#C5A059]' : 'text-[#8A7663]'}`} />
                      </div>
                      <p className={`text-[10px] mt-1 ${selectedRole === 'admin' ? 'text-[#D2C7B4]' : 'text-[#8A7663]'}`}>
                        Workforce overview, approval authority, payroll control, and audit logs.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Marcus Sterling"
                      id="create-fullname"
                      className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs text-[#152A20] focus:border-[#C5A059] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@workload.com"
                      id="create-email"
                      className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs text-[#152A20] focus:border-[#C5A059] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      id="create-employee-id"
                      className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs font-mono text-[#152A20] focus:border-[#C5A059] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as Department)}
                      id="create-department"
                      className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs text-[#152A20] focus:border-[#C5A059] focus:outline-none cursor-pointer"
                    >
                      <option value="Executive Board">Executive Board</option>
                      <option value="Legal Chambers">Legal Chambers</option>
                      <option value="Private Wealth">Private Wealth</option>
                      <option value="Real Estate Syndication">Real Estate Syndication</option>
                      <option value="Human Capital">Human Capital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder={selectedRole === 'admin' ? 'Chamber Administrator' : 'Senior Analyst'}
                      id="create-designation"
                      className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs text-[#152A20] focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password & Security Checks */}
                <div>
                  <label className="block text-xs font-serif-playfair font-semibold text-[#152A20] mb-1">
                    Password Covenant
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Must meet rules below"
                    id="create-password"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-xs font-mono text-[#152A20] focus:border-[#C5A059] focus:outline-none"
                    required
                  />

                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9]">
                    <div className="flex items-center gap-1">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMinLength ? 'bg-emerald-700 text-white' : 'bg-gray-300 text-gray-700'}`}>
                        {hasMinLength ? '✓' : '•'}
                      </span>
                      <span className={hasMinLength ? 'text-emerald-900 font-medium' : 'text-[#8A7663]'}>
                        8+ Chars
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-emerald-700 text-white' : 'bg-gray-300 text-gray-700'}`}>
                        {hasNumber ? '✓' : '•'}
                      </span>
                      <span className={hasNumber ? 'text-emerald-900 font-medium' : 'text-[#8A7663]'}>
                        1+ Number
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasSpecial ? 'bg-emerald-700 text-white' : 'bg-gray-300 text-gray-700'}`}>
                        {hasSpecial ? '✓' : '•'}
                      </span>
                      <span className={hasSpecial ? 'text-emerald-900 font-medium' : 'text-[#8A7663]'}>
                        1+ Symbol
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    id="submit-create-account-btn"
                    className="w-full py-3 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] font-serif-playfair text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Create {selectedRole === 'admin' ? 'Admin' : 'Employee'} Account &amp; Sign In</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>

                <div className="text-center pt-2 text-xs text-[#8A7663]">
                  <span>Already possess credentials? </span>
                  <button
                    type="button"
                    onClick={() => setActiveMode('signin')}
                    id="switch-to-signin-link"
                    className="text-[#152A20] font-serif-playfair font-semibold underline hover:text-[#C5A059] cursor-pointer ml-1"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Sovereign Footer */}
      <footer className="bg-[#152A20] text-[#D2C7B4] border-t border-[#C5A059]/30 py-4 px-4 text-center text-xs font-serif-playfair">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#FAF7F2]">Work Load • Sovereign Human Resource Platform</p>
          <p className="text-[11px] text-[#8A7663]">Encrypted Identity Access Management • Zero Unauthorized Switch</p>
        </div>
      </footer>
    </div>
  );
};
