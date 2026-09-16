import { Employee, AttendanceRecord, LeaveRequest, AuditLog } from '../types';

export function exportSingleHtml(
  currentUser: Employee | null,
  employees: Employee[],
  attendance: AttendanceRecord[],
  leaves: LeaveRequest[],
  auditLogs: AuditLog[]
) {
  const activeUser = currentUser || employees[0];
  // Serialize current state so opening the exported HTML loads the exact data
  const statePayload = JSON.stringify({
    currentUser: activeUser,
    employees,
    attendance,
    leaves,
    auditLogs,
    exportedAt: new Date().toISOString(),
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Work Load HRMS — Sovereign Edition</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'vs-green': '#152A20',
            'vs-green-dark': '#0D1C15',
            'vs-green-light': '#233F31',
            'vs-cream': '#FAF7F2',
            'vs-cream-card': '#FFFFFF',
            'vs-burgundy': '#6B1D2F',
            'vs-burgundy-deep': '#4A101E',
            'vs-gold': '#C5A059',
            'vs-gold-light': '#E4CA92',
            'vs-walnut': '#5C4838',
            'vs-border': '#E2DAC9',
            'vs-muted': '#8A7663'
          },
          fontFamily: {
            cormorant: ['"Cormorant Garamond"', 'serif'],
            playfair: ['"Playfair Display"', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #FAF7F2;
      color: #1C1917;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
    }
    .watermark-syndicate {
      position: relative;
    }
    .watermark-syndicate::before {
      content: 'WORK LOAD';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-family: 'Cormorant Garamond', serif;
      font-size: 5rem;
      font-weight: 700;
      color: rgba(21, 42, 32, 0.03);
      pointer-events: none;
      white-space: nowrap;
      z-index: 0;
    }
  </style>
</head>
<body class="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
  <div id="standalone-root" class="w-full">
    <!-- Header -->
    <header class="bg-[#152A20] text-[#FAF7F2] border-b border-[#C5A059]/40 p-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-sm bg-[#0B1A13] border border-[#C5A059] flex items-center justify-center shadow-md">
            <svg viewBox="0 0 100 100" class="w-8 h-8" fill="none">
              <path d="M 30 5 L 70 5 L 95 30 L 95 70 L 70 95 L 30 95 L 5 70 L 5 30 Z" fill="#13261C" stroke="#C5A059" stroke-width="2.5"/>
              <path d="M 20 30 L 32 30 L 40 60 L 32 60 Z" fill="#E5C378"/>
              <polygon points="50,22 57,31 50,40 43,31" fill="#FFF2D1"/>
              <path d="M 68 30 L 80 30 L 68 60 L 60 60 Z" fill="#C5A059"/>
              <path d="M 30 68 L 70 68 L 76 78 L 24 78 Z" fill="#E5C378"/>
              <circle cx="50" cy="65" r="3" fill="#9B2C47"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold font-serif text-[#FAF7F2]">Work Load</h1>
            <p class="text-xs text-[#E4CA92]">Workforce Management &amp; Personnel Records</p>
          </div>
        </div>
        <div class="text-right text-xs text-[#D2C7B4]">
          <div>Active Perspective: <strong id="app-user-name">${activeUser.name}</strong> (${activeUser.role.toUpperCase()})</div>
          <div class="text-[11px] text-[#8A7663] mt-0.5">Archive Generated: ${new Date().toLocaleString('en-GB')}</div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <!-- Welcome Banner -->
      <div class="bg-white rounded-lg border border-[#E2DAC9] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span class="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">Self-Contained Standalone Ledger</span>
          <h2 class="text-2xl font-serif font-bold text-[#152A20] mt-1">Welcome back, ${activeUser.name}</h2>
          <p class="text-xs text-[#8A7663] mt-1">${activeUser.preferredTitle || activeUser.designation} • ${activeUser.department} • ${activeUser.chamberLocation}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1.5 rounded bg-[#152A20] text-[#E4CA92] border border-[#C5A059] text-xs font-serif font-semibold">
            Status: Active &amp; Verified
          </span>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg border border-[#E2DAC9]">
          <div class="text-xs text-[#8A7663] uppercase font-semibold">Enrolled Personnel</div>
          <div class="text-2xl font-serif font-bold text-[#152A20] mt-1">${employees.length} Officers</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-[#E2DAC9]">
          <div class="text-xs text-[#8A7663] uppercase font-semibold">Today's Attendance</div>
          <div class="text-2xl font-serif font-bold text-[#152A20] mt-1">${attendance.filter(a => a.status === 'Present').length} Present</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-[#E2DAC9]">
          <div class="text-xs text-[#8A7663] uppercase font-semibold">Pending Petitions</div>
          <div class="text-2xl font-serif font-bold text-[#6B1D2F] mt-1">${leaves.filter(l => l.status === 'Pending').length} Pending</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-[#E2DAC9]">
          <div class="text-xs text-[#8A7663] uppercase font-semibold">Net Remuneration</div>
          <div class="text-2xl font-serif font-bold text-[#152A20] mt-1">₹${Math.round(activeUser.salary.basic + activeUser.salary.hra + activeUser.salary.executiveAllowance - (activeUser.salary.basic * activeUser.salary.taxRate / 100)).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <!-- Personnel Roster -->
      <div class="bg-white rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm">
        <div class="p-4 border-b border-[#E2DAC9] bg-[#FAF7F2] flex items-center justify-between">
          <h3 class="font-serif text-base font-bold text-[#152A20]">Syndicate Personnel Registry</h3>
          <span class="text-xs text-[#8A7663]">${employees.length} active fellows</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-[#152A20] text-white">
                <th class="p-3 font-normal">Employee</th>
                <th class="p-3 font-normal">Chamber</th>
                <th class="p-3 font-normal">Designation</th>
                <th class="p-3 font-normal">Rank</th>
                <th class="p-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2DAC9]">
              ${employees.map(e => `
                <tr class="hover:bg-[#FAF7F2]">
                  <td class="p-3 font-semibold text-[#152A20]">${e.name} <span class="font-mono text-[10px] text-[#8A7663]">(${e.employeeId})</span></td>
                  <td class="p-3 text-[#5C4838]">${e.department}</td>
                  <td class="p-3 text-[#152A20]">${e.designation}</td>
                  <td class="p-3 text-[#8A7663]">${e.grade}</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-[#152A20] text-[#E4CA92] text-[10px] uppercase font-bold">${e.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Audit Trail -->
      <div class="bg-white rounded-lg border border-[#E2DAC9] overflow-hidden shadow-sm">
        <div class="p-4 border-b border-[#E2DAC9] bg-[#FAF7F2]">
          <h3 class="font-serif text-base font-bold text-[#152A20]">Recent Sovereign Audit Logs</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-[#152A20] text-white">
                <th class="p-3 font-normal">Timestamp</th>
                <th class="p-3 font-normal">Actor</th>
                <th class="p-3 font-normal">Action</th>
                <th class="p-3 font-normal">Category</th>
                <th class="p-3 font-normal">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E2DAC9]">
              ${auditLogs.slice(0, 10).map(l => `
                <tr class="hover:bg-[#FAF7F2]">
                  <td class="p-3 font-mono text-[11px] text-[#8A7663]">${l.timestamp}</td>
                  <td class="p-3 font-semibold text-[#152A20]">${l.actor}</td>
                  <td class="p-3 font-medium">${l.action}</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E2DAC9] text-[10px] uppercase">${l.category}</span></td>
                  <td class="p-3 text-[#5C4838]">${l.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-12 border-t border-[#E2DAC9] p-6 text-center text-xs text-[#8A7663] bg-[#FAF7F2]">
      <p class="font-serif text-sm text-[#152A20] font-semibold">Vanderbilt &amp; Sterling Syndicate Limited</p>
      <p class="mt-1">London • Zurich • Geneva • New York • Singapore</p>
      <p class="mt-2 text-[10px] text-[#8A7663]">Cryptographically compiled snapshot. All rights reserved under High Table Charter.</p>
    </footer>
  </div>

  <script>
    // Embedded Active Application State
    window.__VANDERBILT_STERLING_STATE__ = ${statePayload};
    console.log("Vanderbilt & Sterling HRMS standalone snapshot loaded successfully.", window.__VANDERBILT_STERLING_STATE__);
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vanderbilt-sterling-hrms-snapshot-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
