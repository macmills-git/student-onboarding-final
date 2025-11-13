import { useEffect, useState, FormEvent } from 'react';
import { DollarSign, CreditCard, Smartphone, Plus, X, TrendingUp } from 'lucide-react';
import { mockPayments, mockStudents, getUserAnalytics, Payment, Student } from '../lib/mockData';

interface UserRevenue {
  user_id: string;
  full_name: string;
  totalRevenue: number;
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

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      // Use centralized mock data
      setPayments(mockPayments);

      // Get user analytics from mock data
      const analytics = getUserAnalytics();
      const revenue: UserRevenue[] = analytics.map(user => ({
        user_id: user.user_id,
        full_name: user.full_name,
        totalRevenue: user.totalRevenue
      }));

      setUserRevenue(revenue);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    // Use centralized mock data
    setStudents(mockStudents);
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

      // Create new payment object
      const newPaymentRecord: Payment = {
        id: (mockPayments.length + 1).toString(),
        student_id: newPayment.student_id,
        student_name: selectedStudent.name,
        amount: parseFloat(newPayment.amount),
        payment_method: newPayment.payment_method,
        reference_id: newPayment.reference_id,
        operator: newPayment.operator || undefined,
        recorded_by: '1', // Current user ID
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // Add to mock data (in a real app, this would be an API call)
      mockPayments.unshift(newPaymentRecord);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`Payment of GH₵${newPayment.amount} recorded successfully for ${selectedStudent.name}!`);

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
            Track and manage payment records
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md w-full md:w-auto"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Add Payment
        </button>
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
            <p className="text-[1.54rem] font-normal text-gray-900 dark:text-white">GH₵ {totalAmount.toLocaleString()}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">All payments received</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-1 mb-1">
              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-300">Cash Payments</span>
            </div>
            <p className="text-[1.54rem] font-normal text-gray-900 dark:text-white">GH₵ {totalCash.toLocaleString()}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">Physical cash received</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-1 mb-1">
              <Smartphone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-300">MoMo Payments</span>
            </div>
            <p className="text-[1.54rem] font-normal text-gray-900 dark:text-white">GH₵ {totalMomo.toLocaleString()}</p>
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