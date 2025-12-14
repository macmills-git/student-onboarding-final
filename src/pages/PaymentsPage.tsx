import { useEffect, useState, FormEvent, useRef } from 'react';
import { DollarSign, CreditCard, Smartphone, Plus, X, TrendingUp, Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { paymentsApi, studentsApi, analyticsApi, Payment, Student } from '../lib/api';

interface UserRevenue {
  user_id: string;
  full_name: string;
  totalRevenue: number;
}

interface UserAnalytics {
  user_id: string;
  full_name: string;
  totalRevenue: number;
  registeredToday: number;
  revenueToday: number;
  registeredThisWeek: number;
}

export const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userRevenue, setUserRevenue] = useState<UserRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const [newPayment, setNewPayment] = useState({
    student_id: '',
    amount: '',
    payment_method: 'cash' as 'cash' | 'momo' | 'bank',
    reference_id: '',
    operator: '',
  });

  const [showAllPayments, setShowAllPayments] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      // Use real API to fetch payments
      const paymentsResponse = await paymentsApi.getAll();

      if (paymentsResponse.success && paymentsResponse.data) {
        setPayments(paymentsResponse.data);
      } else {
        console.error('Failed to fetch payments:', paymentsResponse.error);
        setPayments([]);
      }

      // Get user analytics from API
      const analyticsResponse = await analyticsApi.getUserAnalytics();

      if (analyticsResponse.success && analyticsResponse.data) {
        const revenue: UserRevenue[] = analyticsResponse.data.map((user: UserAnalytics) => ({
          user_id: user.user_id,
          full_name: user.full_name,
          totalRevenue: user.totalRevenue
        }));
        setUserRevenue(revenue);
      } else {
        console.error('Failed to fetch user analytics:', analyticsResponse.error);
        setUserRevenue([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setUserRevenue([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Use real API to fetch students
      const response = await studentsApi.getAll();

      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        console.error('Failed to fetch students:', response.error);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Export functions
  const exportToCSV = () => {
    const exportType = 'Complete';

    // Calculate daily and weekly analytics
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayPayments = payments.filter(p => new Date(p.payment_date) >= todayStart);
    const weekPayments = payments.filter(p => new Date(p.payment_date) >= weekStart);

    const todayAmount = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const weekAmount = weekPayments.reduce((sum, p) => sum + p.amount, 0);

    // Generate daily breakdown for the last 7 days
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayPayments = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate >= dayStart && paymentDate < dayEnd;
      });

      const dayAmount = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      const dayCash = dayPayments.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0);
      const dayMomo = dayPayments.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0);

      dailyBreakdown.push({
        date: date.toLocaleDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        payments: dayPayments.length,
        amount: dayAmount,
        cash: dayCash,
        momo: dayMomo,
        isToday: i === 0
      });
    }

    // Generate weekly breakdown for the last 4 weeks
    const weeklyBreakdown = [];
    for (let i = 3; i >= 0; i--) {
      const weekEndDate = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStartDate = new Date(weekEndDate.getTime() - 6 * 24 * 60 * 60 * 1000);

      const weekPaymentsData = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate >= weekStartDate && paymentDate <= weekEndDate;
      });

      const weekAmountData = weekPaymentsData.reduce((sum, p) => sum + p.amount, 0);
      const weekCash = weekPaymentsData.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0);
      const weekMomo = weekPaymentsData.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0);

      weeklyBreakdown.push({
        weekRange: `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`,
        payments: weekPaymentsData.length,
        amount: weekAmountData,
        cash: weekCash,
        momo: weekMomo,
        dailyAverage: Math.round(weekAmountData / 7),
        isCurrentWeek: i === 0
      });
    }

    // Create comprehensive header with analytics
    const exportInfo = [
      `COMPSSA Payments Export - ${exportType}`,
      `Export Date: ${new Date().toLocaleDateString()}`,
      `Export Time: ${new Date().toLocaleTimeString()}`,
      '',
      '=== PAYMENT ANALYTICS ===',
      `Total Records: ${payments.length}`,
      `Total Amount: GH₵ ${totalAmount.toLocaleString()}`,
      `Cash Payments: GH₵ ${totalCash.toLocaleString()} (${cashPayments.length} transactions)`,
      `Mobile Money: GH₵ ${totalMomo.toLocaleString()} (${momoPayments.length} transactions)`,
      `Average Payment: GH₵ ${payments.length > 0 ? Math.round(totalAmount / payments.length).toLocaleString() : '0'}`,
      '',
      '=== DAILY RECORDS (LAST 7 DAYS) ===',
      ...dailyBreakdown.map(day => [
        `${day.dayName} (${day.date})${day.isToday ? ' - TODAY' : ''}`,
        `  Transactions: ${day.payments}`,
        `  Total Revenue: GH₵ ${day.amount.toLocaleString()}`,
        `  Cash: GH₵ ${day.cash.toLocaleString()}`,
        `  Mobile Money: GH₵ ${day.momo.toLocaleString()}`,
        `  Average per Transaction: GH₵ ${day.payments > 0 ? Math.round(day.amount / day.payments).toLocaleString() : '0'}`,
        ''
      ]).flat(),
      '=== WEEKLY RECORDS (LAST 4 WEEKS) ===',
      ...weeklyBreakdown.map((week, index) => [
        `Week ${index + 1}: ${week.weekRange}${week.isCurrentWeek ? ' - CURRENT WEEK' : ''}`,
        `  Transactions: ${week.payments}`,
        `  Total Revenue: GH₵ ${week.amount.toLocaleString()}`,
        `  Cash: GH₵ ${week.cash.toLocaleString()}`,
        `  Mobile Money: GH₵ ${week.momo.toLocaleString()}`,
        `  Daily Average: GH₵ ${week.dailyAverage.toLocaleString()}`,
        `  Transaction Average: GH₵ ${week.payments > 0 ? Math.round(week.amount / week.payments).toLocaleString() : '0'}`,
        ''
      ]).flat(),
      '=== TODAY\'S SUMMARY ===',
      `Today's Payments: ${todayPayments.length} transactions`,
      `Today's Revenue: GH₵ ${todayAmount.toLocaleString()}`,
      `Today's Average: GH₵ ${todayPayments.length > 0 ? Math.round(todayAmount / todayPayments.length).toLocaleString() : '0'}`,
      `Today's Cash: GH₵ ${todayPayments.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      `Today's MoMo: GH₵ ${todayPayments.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      '',
      '=== PAYMENT METHOD BREAKDOWN ===',
      `Cash: ${totalAmount > 0 ? Math.round((totalCash / totalAmount) * 100) : 0}% of total amount`,
      `Mobile Money: ${totalAmount > 0 ? Math.round((totalMomo / totalAmount) * 100) : 0}% of total amount`,
      '',
      '=== REVENUE BY STAFF ===',
      ...userRevenue.map(user => `${user.full_name}: GH₵ ${user.totalRevenue.toLocaleString()}`),
      '',
      '=== RECENT ACTIVITY ===',
      `Latest Payment: ${payments.length > 0 ? new Date(payments[0].payment_date).toLocaleDateString() : 'N/A'}`,
      `Oldest Payment: ${payments.length > 0 ? new Date(payments[payments.length - 1].payment_date).toLocaleDateString() : 'N/A'}`,
      '',
      '=== DETAILED PAYMENT DATA ===',
    ];

    const csvHeaders = [
      'Payment ID',
      'Student Name',
      'Student ID',
      'Amount (GH₵)',
      'Payment Method',
      'Reference ID',
      'Operator',
      'Payment Date',
      'Recorded Date'
    ];

    const csvData = payments.map(payment => [
      payment.id,
      payment.student_name,
      payment.student_id,
      payment.amount,
      payment.payment_method.toUpperCase(),
      payment.reference_id,
      payment.operator || 'N/A',
      new Date(payment.payment_date).toLocaleDateString(),
      new Date(payment.created_at).toLocaleDateString()
    ]);

    // Add summary section at the end
    const summarySection = [
      '',
      '=== EXPORT SUMMARY ===',
      `Total Payments Exported: ${payments.length}`,
      `Export Generated: ${new Date().toLocaleString()}`,
      `System: COMPSSA Student Management System`,
      `Report Type: Complete Payment Records with Daily/Weekly Analytics`,
      ''
    ];

    const csvContent = [
      ...exportInfo,
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(',')),
      ...summarySection
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const filename = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const exportType = 'Complete Payments List';

    // Calculate additional analytics
    const avgPayment = payments.length > 0 ? Math.round(totalAmount / payments.length) : 0;
    const cashPercentage = totalAmount > 0 ? Math.round((totalCash / totalAmount) * 100) : 0;
    const momoPercentage = totalAmount > 0 ? Math.round((totalMomo / totalAmount) * 100) : 0;

    // Calculate daily and weekly analytics (same as CSV)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayPayments = payments.filter(p => new Date(p.payment_date) >= todayStart);
    const weekPayments = payments.filter(p => new Date(p.payment_date) >= weekStart);

    const todayAmount = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const weekAmount = weekPayments.reduce((sum, p) => sum + p.amount, 0);

    // Generate daily breakdown for the last 7 days
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayPayments = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate >= dayStart && paymentDate < dayEnd;
      });

      const dayAmount = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      const dayCash = dayPayments.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0);
      const dayMomo = dayPayments.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0);

      dailyBreakdown.push({
        date: date.toLocaleDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        payments: dayPayments.length,
        amount: dayAmount,
        cash: dayCash,
        momo: dayMomo,
        isToday: i === 0
      });
    }

    // Generate weekly breakdown for the last 4 weeks
    const weeklyBreakdown = [];
    for (let i = 3; i >= 0; i--) {
      const weekEndDate = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStartDate = new Date(weekEndDate.getTime() - 6 * 24 * 60 * 60 * 1000);

      const weekPaymentsData = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate >= weekStartDate && paymentDate <= weekEndDate;
      });

      const weekAmountData = weekPaymentsData.reduce((sum, p) => sum + p.amount, 0);
      const weekCash = weekPaymentsData.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0);
      const weekMomo = weekPaymentsData.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0);

      weeklyBreakdown.push({
        weekRange: `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`,
        payments: weekPaymentsData.length,
        amount: weekAmountData,
        cash: weekCash,
        momo: weekMomo,
        dailyAverage: Math.round(weekAmountData / 7),
        isCurrentWeek: i === 0
      });
    }

    // Create comprehensive HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${exportType}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
          h1 { color: #1f2937; text-align: center; margin-bottom: 10px; font-size: 24px; }
          h2 { color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 11px; }
          th { background-color: #f3f4f6; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .header { text-align: center; margin-bottom: 25px; }
          .export-info { font-size: 13px; color: #374151; margin-bottom: 5px; }
          .export-type { font-size: 16px; color: #1f2937; font-weight: bold; margin-bottom: 10px; }
          .amount { text-align: right; font-weight: bold; }
          .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .analytics-card { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; background-color: #f9fafb; }
          .analytics-title { font-weight: bold; color: #374151; margin-bottom: 10px; font-size: 14px; }
          .stat-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .stat-label { color: #6b7280; }
          .stat-value { font-weight: bold; color: #1f2937; }
          .revenue-table { margin-top: 10px; }
          .revenue-table th, .revenue-table td { padding: 4px 8px; font-size: 11px; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPSSA - ${exportType}</h1>
          <div class="export-type">💰 Complete Export with Analytics</div>
          <div class="export-info">
            Export Date: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
            Generated by COMPSSA Student Management System
          </div>
        </div>

        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-title">📊 Payment Summary</div>
            <div class="stat-row">
              <span class="stat-label">Total Records:</span>
              <span class="stat-value">${payments.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Amount:</span>
              <span class="stat-value">GH₵ ${totalAmount.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Average Payment:</span>
              <span class="stat-value">GH₵ ${avgPayment.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Date Range:</span>
              <span class="stat-value">${payments.length > 0 ? new Date(Math.min(...payments.map(p => new Date(p.payment_date).getTime()))).toLocaleDateString() : 'N/A'} - ${payments.length > 0 ? new Date(Math.max(...payments.map(p => new Date(p.payment_date).getTime()))).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-title">💳 Payment Methods</div>
            <div class="stat-row">
              <span class="stat-label">Cash Payments:</span>
              <span class="stat-value">GH₵ ${totalCash.toLocaleString()} (${cashPercentage}%)</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Cash Transactions:</span>
              <span class="stat-value">${cashPayments.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Mobile Money:</span>
              <span class="stat-value">GH₵ ${totalMomo.toLocaleString()} (${momoPercentage}%)</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">MoMo Transactions:</span>
              <span class="stat-value">${momoPayments.length}</span>
            </div>
          </div>
        </div>

        <h2>👥 Revenue by Staff Member</h2>
        <table class="revenue-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Total Revenue</th>
              <th>Percentage of Total</th>
            </tr>
          </thead>
          <tbody>
            ${userRevenue.map(user => `
              <tr>
                <td>${user.full_name}</td>
                <td class="amount">GH₵ ${user.totalRevenue.toLocaleString()}</td>
                <td>${totalAmount > 0 ? Math.round((user.totalRevenue / totalAmount) * 100) : 0}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📅 Daily Records (Last 7 Days)</h2>
        <table class="revenue-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Transactions</th>
              <th>Total Revenue</th>
              <th>Cash</th>
              <th>Mobile Money</th>
              <th>Avg per Transaction</th>
            </tr>
          </thead>
          <tbody>
            ${dailyBreakdown.map(day => `
              <tr style="${day.isToday ? 'background-color: #dbeafe; font-weight: bold;' : ''}">
                <td>${day.dayName}${day.isToday ? ' (TODAY)' : ''}</td>
                <td>${day.date}</td>
                <td>${day.payments}</td>
                <td class="amount">GH₵ ${day.amount.toLocaleString()}</td>
                <td class="amount">GH₵ ${day.cash.toLocaleString()}</td>
                <td class="amount">GH₵ ${day.momo.toLocaleString()}</td>
                <td class="amount">GH₵ ${day.payments > 0 ? Math.round(day.amount / day.payments).toLocaleString() : '0'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📊 Weekly Records (Last 4 Weeks)</h2>
        <table class="revenue-table">
          <thead>
            <tr>
              <th>Week Period</th>
              <th>Transactions</th>
              <th>Total Revenue</th>
              <th>Cash</th>
              <th>Mobile Money</th>
              <th>Daily Average</th>
              <th>Transaction Average</th>
            </tr>
          </thead>
          <tbody>
            ${weeklyBreakdown.map((week, index) => `
              <tr style="${week.isCurrentWeek ? 'background-color: #dcfce7; font-weight: bold;' : ''}">
                <td>Week ${index + 1}: ${week.weekRange}${week.isCurrentWeek ? ' (CURRENT)' : ''}</td>
                <td>${week.payments}</td>
                <td class="amount">GH₵ ${week.amount.toLocaleString()}</td>
                <td class="amount">GH₵ ${week.cash.toLocaleString()}</td>
                <td class="amount">GH₵ ${week.momo.toLocaleString()}</td>
                <td class="amount">GH₵ ${week.dailyAverage.toLocaleString()}</td>
                <td class="amount">GH₵ ${week.payments > 0 ? Math.round(week.amount / week.payments).toLocaleString() : '0'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📈 Today's Summary</h2>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-title">🎯 Today's Performance</div>
            <div class="stat-row">
              <span class="stat-label">Transactions Today:</span>
              <span class="stat-value">${todayPayments.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Revenue Today:</span>
              <span class="stat-value">GH₵ ${todayAmount.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Average per Transaction:</span>
              <span class="stat-value">GH₵ ${todayPayments.length > 0 ? Math.round(todayAmount / todayPayments.length).toLocaleString() : '0'}</span>
            </div>
          </div>
          <div class="analytics-card">
            <div class="analytics-title">💰 Today's Payment Methods</div>
            <div class="stat-row">
              <span class="stat-label">Cash Today:</span>
              <span class="stat-value">GH₵ ${todayPayments.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Mobile Money Today:</span>
              <span class="stat-value">GH₵ ${todayPayments.filter(p => p.payment_method === 'momo').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Comparison to Week Avg:</span>
              <span class="stat-value">${weekPayments.length > 0 ? Math.round((todayAmount / (weekAmount / 7)) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        <div class="page-break"></div>
        <h2>💰 Detailed Payment Records</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Operator</th>
              <th>Payment Date</th>
              <th>Recorded Date</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(payment => `
              <tr>
                <td>${payment.id}</td>
                <td>${payment.student_name}</td>
                <td>${payment.student_id}</td>
                <td class="amount">GH₵ ${payment.amount.toLocaleString()}</td>
                <td>${payment.payment_method.toUpperCase()}</td>
                <td>${payment.reference_id}</td>
                <td>${payment.operator || 'N/A'}</td>
                <td>${new Date(payment.payment_date).toLocaleDateString()}</td>
                <td>${new Date(payment.created_at).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 11px;">
          <p>This report was generated by COMPSSA Student Management System</p>
          <p>For questions about this data, contact the system administrator</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleAddPayment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Find the selected student
      const selectedStudent = students.find(s => s.id === newPayment.student_id);
      if (!selectedStudent) {
        alert('Please select a valid student');
        return;
      }

      // Create payment via API
      const paymentData = {
        student_id: newPayment.student_id,
        amount: parseFloat(newPayment.amount),
        payment_method: newPayment.payment_method,
        reference_id: newPayment.reference_id,
        operator: newPayment.operator || undefined,
        payment_date: new Date().toISOString()
      };

      const response = await paymentsApi.create(paymentData);

      if (response.success && response.data) {
        alert(`Payment of GH₵${newPayment.amount} recorded successfully for ${selectedStudent.name}!`);
      } else {
        alert(`Failed to record payment: ${response.error}`);
        return;
      }

      setShowAddModal(false);
      setNewPayment({
        student_id: '',
        amount: '',
        payment_method: 'cash',
        reference_id: '',
        operator: '',
      });
      fetchPayments();
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const cashPayments = payments.filter((p) => p.payment_method === 'cash');
  const momoPayments = payments.filter((p) => p.payment_method === 'momo');
  const totalCash = cashPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalMomo = momoPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">Payments</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Track and manage payment records ({payments.length} total)
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showExportDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <button
                    onClick={() => {
                      exportToCSV();
                      setShowExportDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet format</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF();
                      setShowExportDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <div className="text-left">
                      <div className="font-medium">Export as PDF</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Printable document</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add Payment
          </button>
        </div>
      </div>



      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
            <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
            Payment Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-300">Total Amount</span>
            </div>
            <p className="text-[1.13rem] md:text-[1.39rem] font-normal text-gray-900 dark:text-white">GH₵ {totalAmount.toLocaleString()}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">All payments received</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-1 mb-1">
              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-300">Cash Payments</span>
            </div>
            <p className="text-[1.13rem] md:text-[1.39rem] font-normal text-gray-900 dark:text-white">GH₵ {totalCash.toLocaleString()}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">Physical cash received</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-1 mb-1">
              <Smartphone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-300">MoMo Payments</span>
            </div>
            <p className="text-[1.13rem] md:text-[1.39rem] font-normal text-gray-900 dark:text-white">GH₵ {totalMomo.toLocaleString()}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">Mobile money transfers</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Revenue by User / Clerk
          </h2>
          <span className="text-base text-gray-500 dark:text-gray-400">
            {userRevenue.length} Clerks
          </span>
        </div>
        <div className="space-y-3">
          {userRevenue.map((user, index) => (
            <div
              key={user.user_id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                    {user.full_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Clerk #{index + 1}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-normal text-gray-800 dark:text-white">
                  GH₵ {user.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Revenue
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Payment Methods Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <span className="text-base text-blue-600 dark:text-blue-400">Cash Payments</span>
              <span className="text-base font-bold text-blue-800 dark:text-blue-200">45%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
              <span className="text-base text-gray-600 dark:text-gray-400">Mobile Money</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">35%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
              <span className="text-base text-gray-600 dark:text-gray-400">Bank Transfer</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">20%</span>
            </div>
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-base font-medium text-green-800 dark:text-green-300">
                  Most popular payment method
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 animate-spin" style={{ animationDuration: '4s' }}>
                {/* Cash - 45% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="20"
                  strokeDasharray="113 138"
                  strokeDashoffset="0"
                  className="transition-all duration-300 hover:stroke-opacity-80"
                />
                {/* Mobile Money - 35% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="20"
                  strokeDasharray="88 163"
                  strokeDashoffset="-113"
                  className="transition-all duration-300 hover:stroke-opacity-80"
                />
                {/* Bank Transfer - 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="20"
                  strokeDasharray="50 201"
                  strokeDashoffset="-201"
                  className="transition-all duration-300 hover:stroke-opacity-80"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">100%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-800 dark:text-white">Cash Payments</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">45%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-800 dark:text-white">Mobile Money</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">35%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-800 dark:text-white">Bank Transfer</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">20%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Payments</h2>
          <span className="text-base text-gray-500 dark:text-gray-400">
            Showing {showAllPayments ? payments.length : Math.min(5, payments.length)} of {payments.length} payments
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                  Student
                </th>
                <th className="text-left py-3 px-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="text-left py-3 px-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                  Method
                </th>
                <th className="text-left py-3 px-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                  Reference
                </th>
                <th className="text-left py-3 px-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(showAllPayments ? payments : payments.slice(0, 5)).map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                    }`}
                >
                  <td className="py-3 px-3 text-base text-gray-800 dark:text-white">
                    {payment.student_name}
                  </td>
                  <td className="py-3 px-3 text-base text-green-600 dark:text-green-400 font-bold">
                    GH₵ {Number(payment.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm capitalize">
                      {payment.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-base text-gray-600 dark:text-gray-400">
                    {payment.reference_id}
                  </td>
                  <td className="py-3 px-3 text-base text-gray-600 dark:text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length > 5 && (
          <div className="mt-4 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowAllPayments(!showAllPayments)}
              className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {showAllPayments ? (
                <>
                  <span>Show Less</span>
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>View More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Add Payment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student
                </label>
                <select
                  value={newPayment.student_id}
                  onChange={(e) => setNewPayment({ ...newPayment, student_id: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.student_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={newPayment.payment_method}
                  onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="momo">Mobile Money</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference ID
                </label>
                <input
                  type="text"
                  value={newPayment.reference_id}
                  onChange={(e) => setNewPayment({ ...newPayment, reference_id: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                />
              </div>

              {newPayment.payment_method === 'momo' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Operator
                  </label>
                  <input
                    type="text"
                    value={newPayment.operator}
                    onChange={(e) => setNewPayment({ ...newPayment, operator: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                    placeholder="e.g., MTN, Vodafone"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Daily Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
              <span className="text-base text-gray-600 dark:text-gray-400">Monday (Mar 18)</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">GH₵ 450</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
              <span className="text-base text-gray-600 dark:text-gray-400">Tuesday (Mar 19)</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">GH₵ 680</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <span className="text-base text-blue-600 dark:text-blue-400">Wednesday (Mar 20) Today</span>
              <span className="text-base font-bold text-blue-800 dark:text-blue-200">GH₵ 820</span>
            </div>
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-base font-medium text-green-800 dark:text-green-300">
                  20% increase from yesterday
                </span>
              </div>
            </div>
          </div>
        </div>



        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Weekly Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
              <span className="text-base text-gray-600 dark:text-gray-400">Week 1 (Mar 1-7)</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">GH₵ 2,150</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
              <span className="text-base text-gray-600 dark:text-gray-400">Week 2 (Mar 8-14)</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">GH₵ 2,890</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <span className="text-base text-blue-600 dark:text-blue-400">Week 3 (Mar 15-21) Current</span>
              <span className="text-base font-bold text-blue-800 dark:text-blue-200">GH₵ 3,410</span>
            </div>
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-base font-medium text-green-800 dark:text-green-300">
                  18% increase from last week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};