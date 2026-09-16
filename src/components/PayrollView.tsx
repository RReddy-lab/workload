import React, { useState } from 'react';
import { Employee, SalaryStructure } from '../types';
import { calculatePayroll, PayrollCalculation, formatRupee } from '../services/storage';
import { 
  Banknote, 
  FileText, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  Download, 
  Calendar,
  AlertCircle,
  Calculator
} from 'lucide-react';

interface PayrollViewProps {
  currentUser: Employee;
  allEmployees: Employee[];
  onUpdateSalary: (employeeId: string, newSalary: SalaryStructure) => void;
  onDisbursePayroll: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  currentUser,
  allEmployees,
  onUpdateSalary,
  onDisbursePayroll,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Selected employee for detailed payslip view (default to currentUser or first employee for admin)
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState<Employee>(currentUser);

  // Edit Salary Structure Modal for Admin
  const [isEditSalaryOpen, setIsEditSalaryOpen] = useState<boolean>(false);
  const [targetEmployeeForEdit, setTargetEmployeeForEdit] = useState<Employee>(allEmployees[0]);
  const [salaryForm, setSalaryForm] = useState<SalaryStructure>({
    basic: targetEmployeeForEdit.salary.basic,
    hra: targetEmployeeForEdit.salary.hra,
    executiveAllowance: targetEmployeeForEdit.salary.executiveAllowance,
    discretionaryBonus: targetEmployeeForEdit.salary.discretionaryBonus,
    taxRate: targetEmployeeForEdit.salary.taxRate,
    providentFund: targetEmployeeForEdit.salary.providentFund,
    insurance: targetEmployeeForEdit.salary.insurance,
  });

  // Dynamic live calculation for the edit form
  const previewCalculation: PayrollCalculation = calculatePayroll(salaryForm);

  // Aggregate calculations for Admin Ledger
  const totalGross = allEmployees.reduce((sum, e) => sum + calculatePayroll(e.salary).gross, 0);
  const totalTax = allEmployees.reduce((sum, e) => sum + calculatePayroll(e.salary).taxAmount, 0);
  const totalNet = allEmployees.reduce((sum, e) => sum + calculatePayroll(e.salary).netPay, 0);

  const handleOpenEdit = (emp: Employee) => {
    setTargetEmployeeForEdit(emp);
    setSalaryForm({ ...emp.salary });
    setIsEditSalaryOpen(true);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSalary(targetEmployeeForEdit.id, salaryForm);
    setIsEditSalaryOpen(false);
  };

  const activeSlipPayroll = calculatePayroll(selectedPayslipEmployee.salary);

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-serif-playfair font-semibold text-[#152A20]">
            {isAdmin ? 'Chamber Remuneration & Payroll Ledger' : 'My Compensation & Payslip'}
          </h2>
          <p className="text-xs text-[#8A7663] mt-1 font-serif-cormorant text-base">
            {isAdmin
              ? 'Comprehensive fiduciary overview of partner stipends, tax withholdings, and salary structures.'
              : 'Official itemized payslip breakdown and annual remuneration ledger.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onDisbursePayroll}
            id="disburse-payroll-btn"
            className="px-4 py-2 rounded bg-[#152A20] hover:bg-[#233F31] text-[#E4CA92] border border-[#C5A059] text-xs font-serif-playfair font-semibold tracking-wide uppercase transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Banknote className="w-4 h-4 text-[#C5A059]" />
            <span>Process Monthly Disbursement</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADMIN AGGREGATED METRICS (Problem Statement 3.6.2) */}
      {/* ========================================================= */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
          <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm">
            <div className="text-xs text-[#8A7663] uppercase tracking-wider font-sans">
              Gross Monthly Commitment
            </div>
            <div className="text-2xl font-serif-cormorant font-bold text-[#152A20] mt-1">
              {formatRupee(totalGross)}
            </div>
            <div className="text-[11px] text-[#5C4838] mt-1">
              Sum of base, allowances &amp; executive bonuses
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm">
            <div className="text-xs text-[#8A7663] uppercase tracking-wider font-sans">
              Statutory &amp; Tax Withholding
            </div>
            <div className="text-2xl font-serif-cormorant font-bold text-[#6B1D2F] mt-1">
              {formatRupee(totalTax)}
            </div>
            <div className="text-[11px] text-[#8A7663] mt-1">
              HMRC &amp; proctorial fiduciary hold
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2DAC9] shadow-sm">
            <div className="text-xs text-[#8A7663] uppercase tracking-wider font-sans">
              Net Syndicate Disbursement
            </div>
            <div className="text-2xl font-serif-cormorant font-bold text-[#152A20] mt-1">
              {formatRupee(totalNet)}
            </div>
            <div className="text-[11px] text-[#5C4838] mt-1">
              Direct settlement via Coutts &amp; Co.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADMIN WORKFORCE PAYROLL LEDGER */}
      {/* ========================================================= */}
      {isAdmin && (
        <div className="bg-[#FFFFFF] rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm no-print">
          <div className="p-4 border-b border-[#E2DAC9] flex items-center justify-between">
            <h3 className="font-serif-playfair text-base font-semibold text-[#152A20]">
              Personnel Remuneration Structure &amp; Controls
            </h3>
            <span className="text-xs text-[#8A7663]">
              Click "Adjust" to update structure with live recalculation
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#152A20] text-[#FAF7F2] font-serif-playfair">
                  <th className="py-3 px-4 font-normal">Personnel</th>
                  <th className="py-3 px-4 font-normal">Chamber</th>
                  <th className="py-3 px-4 font-normal text-right">Base Pay</th>
                  <th className="py-3 px-4 font-normal text-right">Allowances &amp; HRA</th>
                  <th className="py-3 px-4 font-normal text-right">Tax Rate</th>
                  <th className="py-3 px-4 font-normal text-right">Deductions</th>
                  <th className="py-3 px-4 font-normal text-right">Net Monthly</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DAC9]">
                {allEmployees.map((emp) => {
                  const calc = calculatePayroll(emp.salary);
                  const isSelected = selectedPayslipEmployee.id === emp.id;

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#FAF7F2] transition-colors ${
                        isSelected ? 'bg-[#FAF7F2]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-serif-playfair font-semibold text-[#152A20]">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-[#8A7663] font-mono">
                          {emp.employeeId}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#5C4838]">
                        {emp.department}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[#152A20]">
                        {formatRupee(emp.salary.basic)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[#5C4838]">
                        {formatRupee(emp.salary.hra + emp.salary.executiveAllowance + emp.salary.discretionaryBonus)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[#6B1D2F]">
                        {emp.salary.taxRate}%
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[#6B1D2F]">
                        {formatRupee(calc.totalDeductions)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-[#152A20]">
                        {formatRupee(calc.netPay)}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedPayslipEmployee(emp)}
                          className="px-2 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-[11px] font-serif-playfair text-[#152A20] cursor-pointer"
                        >
                          View Slip
                        </button>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          id={`adjust-salary-btn-${emp.id}`}
                          className="px-2.5 py-1 rounded bg-[#152A20] hover:bg-[#233F31] border border-[#C5A059] text-[11px] font-serif-playfair text-[#E4CA92] cursor-pointer"
                        >
                          Adjust
                        </button>
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
      {/* FORMAL ARISTOCRATIC PAYSLIP VIEW (Read-Only for Employee) */}
      {/* ========================================================= */}
      <div className="bg-[#FFFFFF] rounded-lg border-2 border-[#E2DAC9] p-6 sm:p-10 shadow-parchment relative overflow-hidden">
        {/* Print Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
          <span className="font-serif-cormorant text-8xl font-bold uppercase tracking-widest text-[#152A20]">
            Vanderbilt &amp; Sterling
          </span>
        </div>

        {/* Payslip Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b-2 border-[#152A20] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#152A20] text-[#C5A059] flex items-center justify-center font-serif-cormorant text-2xl font-bold border border-[#C5A059]">
              V&amp;S
            </div>
            <div>
              <h3 className="font-serif-playfair text-xl font-bold text-[#152A20]">
                Vanderbilt &amp; Sterling Syndicate
              </h3>
              <p className="text-xs text-[#8A7663] font-serif-cormorant text-sm">
                Mayfair Chambers • 14 Belgrave Square, London SW1X
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-sans font-semibold mt-0.5">
                Official Sovereign Payslip &amp; Fiduciary Warrant
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="text-xs text-[#8A7663]">Payment Cycle:</div>
            <div className="font-serif-playfair text-base font-semibold text-[#152A20]">
              September 2026 Fiscal Roll
            </div>
            <div className="text-[11px] font-mono text-[#5C4838]">
              Warrant Ref: VS-PAY-2026-09-{selectedPayslipEmployee.employeeId}
            </div>

            <div className="pt-2 no-print">
              <button
                onClick={handlePrintSlip}
                id="print-payslip-btn"
                className="px-3 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E2DAC9] text-xs font-serif-playfair text-[#152A20] flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Print Official Payslip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Officer & Bank Dossier Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded bg-[#FAF7F2] border border-[#E2DAC9] mb-6 text-xs">
          <div>
            <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Officer / Fellow</span>
            <span className="font-serif-playfair font-semibold text-sm text-[#152A20]">
              {selectedPayslipEmployee.name}
            </span>
            <span className="text-[11px] text-[#5C4838] block">{selectedPayslipEmployee.designation}</span>
          </div>

          <div>
            <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Chamber &amp; ID</span>
            <span className="font-medium text-[#152A20] block">{selectedPayslipEmployee.department}</span>
            <span className="font-mono text-[11px] text-[#C5A059] font-bold">
              ID: {selectedPayslipEmployee.employeeId}
            </span>
          </div>

          <div>
            <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Remuneration Grade</span>
            <span className="font-serif-cormorant text-sm font-semibold text-[#152A20] block">
              {selectedPayslipEmployee.grade}
            </span>
            <span className="text-[11px] text-[#8A7663]">Joining: {selectedPayslipEmployee.joiningDate}</span>
          </div>

          <div>
            <span className="text-[#8A7663] block text-[10px] uppercase font-sans">Disbursement Syndicate</span>
            <span className="font-medium text-[#152A20] block">Coutts &amp; Co. Private Banking</span>
            <span className="font-mono text-[11px] text-[#8A7663]">IBAN: GB92COUT••••••••2910</span>
          </div>
        </div>

        {/* Itemized Ledger (Earnings vs Deductions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Earnings */}
          <div className="space-y-3">
            <div className="border-b border-[#152A20] pb-2 flex items-center justify-between">
              <span className="font-serif-playfair font-semibold text-sm text-[#152A20] uppercase tracking-wider">
                Gross Earnings
              </span>
              <span className="text-xs text-[#8A7663]">Amount (₹)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">Basic Appointment Honorarium</span>
                <span className="font-mono text-[#152A20]">
                  {formatRupee(selectedPayslipEmployee.salary.basic)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">House Rent &amp; Estate Allowance (HRA)</span>
                <span className="font-mono text-[#152A20]">
                  {formatRupee(selectedPayslipEmployee.salary.hra)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">Executive Luxury &amp; Travel Stipend</span>
                <span className="font-mono text-[#152A20]">
                  {formatRupee(selectedPayslipEmployee.salary.executiveAllowance)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">Discretionary Partner Bonus</span>
                <span className="font-mono text-[#152A20]">
                  {formatRupee(selectedPayslipEmployee.salary.discretionaryBonus)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#152A20] text-xs font-semibold">
              <span className="font-serif-playfair text-[#152A20]">Total Gross Earnings:</span>
              <span className="font-mono text-sm text-[#152A20]">
                {formatRupee(activeSlipPayroll.gross)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <div className="border-b border-[#6B1D2F] pb-2 flex items-center justify-between">
              <span className="font-serif-playfair font-semibold text-sm text-[#6B1D2F] uppercase tracking-wider">
                Withholdings &amp; Deductions
              </span>
              <span className="text-xs text-[#8A7663]">Amount (₹)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">
                  Income Tax Withholding ({selectedPayslipEmployee.salary.taxRate}%)
                </span>
                <span className="font-mono text-[#6B1D2F]">
                  {formatRupee(activeSlipPayroll.taxAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">Fiduciary Provident / Pension Fund</span>
                <span className="font-mono text-[#6B1D2F]">
                  {formatRupee(selectedPayslipEmployee.salary.providentFund)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60">
                <span className="text-[#152A20]">Private Healthcare &amp; Syndicate Life</span>
                <span className="font-mono text-[#6B1D2F]">
                  {formatRupee(selectedPayslipEmployee.salary.insurance)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#E2DAC9]/60 text-[#8A7663]">
                <span>Chancery Disciplinary Levies</span>
                <span className="font-mono">₹0.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#6B1D2F] text-xs font-semibold">
              <span className="font-serif-playfair text-[#6B1D2F]">Total Withholdings:</span>
              <span className="font-mono text-sm text-[#6B1D2F]">
                {formatRupee(activeSlipPayroll.totalDeductions)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Payout Callout Banner */}
        <div className="p-5 rounded-lg bg-[#152A20] text-[#FAF7F2] border border-[#C5A059] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-sans font-semibold">
              Net Monthly Remuneration (Disbursed)
            </span>
            <div className="text-3xl sm:text-4xl font-serif-cormorant font-bold text-[#FAF7F2] mt-0.5">
              {formatRupee(activeSlipPayroll.netPay)}
            </div>
            <div className="text-xs text-[#D2C7B4] font-serif-cormorant text-base">
              Annualized Equivalent: {formatRupee(activeSlipPayroll.annualNet)} net per annum
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-[#D2C7B4] border-t sm:border-t-0 sm:border-l border-[#233F31] pt-3 sm:pt-0 sm:pl-6">
            <div className="flex items-center gap-1.5 justify-start sm:justify-end text-[#E4CA92] font-serif-playfair">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
              <span>Certified by High Table Proctor</span>
            </div>
            <p className="text-[11px] text-[#8A7663] mt-1 italic">
              This document represents an official warrant of compensation.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADMIN ADJUST SALARY MODAL WITH LIVE DYNAMIC MATH */}
      {/* ========================================================= */}
      {isEditSalaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#C5A059] rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DAC9] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif-playfair text-lg font-semibold text-[#152A20]">
                  Adjust Remuneration Structure: {targetEmployeeForEdit.name}
                </h3>
              </div>
              <button
                onClick={() => setIsEditSalaryOpen(false)}
                className="text-[#8A7663] hover:text-[#152A20] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Base Monthly Pay (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.basic}
                    onChange={(e) => setSalaryForm({ ...salaryForm, basic: Number(e.target.value) || 0 })}
                    id="edit-salary-basic"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Estate Allowance / HRA (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: Number(e.target.value) || 0 })}
                    id="edit-salary-hra"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Executive Allowance (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.executiveAllowance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, executiveAllowance: Number(e.target.value) || 0 })}
                    id="edit-salary-executive"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Discretionary Bonus (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.discretionaryBonus}
                    onChange={(e) => setSalaryForm({ ...salaryForm, discretionaryBonus: Number(e.target.value) || 0 })}
                    id="edit-salary-bonus"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={salaryForm.taxRate}
                    onChange={(e) => setSalaryForm({ ...salaryForm, taxRate: Number(e.target.value) || 0 })}
                    id="edit-salary-tax"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Provident Fund (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.providentFund}
                    onChange={(e) => setSalaryForm({ ...salaryForm, providentFund: Number(e.target.value) || 0 })}
                    id="edit-salary-pf"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4838] font-medium mb-1">Insurance / Healthcare (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.insurance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, insurance: Number(e.target.value) || 0 })}
                    id="edit-salary-insurance"
                    className="w-full p-2 rounded bg-[#FAF7F2] border border-[#E2DAC9] focus:border-[#C5A059] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculation Card (Problem Statement requirement: dynamic client-side math calculations) */}
              <div className="p-3.5 rounded bg-[#152A20] text-[#FAF7F2] border border-[#C5A059] space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-[#C5A059] font-sans font-semibold">
                  Live Dynamic Math Calculation
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D2C7B4]">Calculated Gross Remuneration:</span>
                  <span className="font-mono font-bold text-[#FAF7F2]">
                    {formatRupee(previewCalculation.gross)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D2C7B4]">Total Statutory Deductions:</span>
                  <span className="font-mono text-[#E4CA92]">
                    -{formatRupee(previewCalculation.totalDeductions)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#233F31]">
                  <span className="font-serif-playfair text-[#FAF7F2] font-semibold">
                    Net Monthly Disbursement:
                  </span>
                  <span className="font-mono font-bold text-sm text-[#C5A059]">
                    {formatRupee(previewCalculation.netPay)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2DAC9]">
                <button
                  type="button"
                  onClick={() => setIsEditSalaryOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-[#FAF7F2] text-[#4A3728] border border-[#E2DAC9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="commit-salary-update-btn"
                  className="px-4 py-1.5 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] font-serif-playfair font-semibold cursor-pointer shadow-sm"
                >
                  Commit Remuneration Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
