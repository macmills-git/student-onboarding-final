import { useEffect, useState, useRef } from 'react';
import {
  Users, DollarSign, TrendingUp, UserPlus,
  CreditCard, BarChart3, Activity, PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
// Frontend-only dashboard - no API imports needed

interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  activeUsers: number;
}

interface UserAnalytics {
  user_id: string;
  full_name: string;
  registeredToday: number;
  revenueToday: number;
  registeredThisWeek: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'student' | 'payment';
  name: string;
  amount?: number;
  timestamp: string;
}

export const DashboardPage = () => {
  const { students, payments } = useData();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [recentStudents, setRecentStudents] = useState<RecentActivity[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [isStaffVisible, setIsStaffVisible] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboardData();
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, [students, payments]); // Re-fetch when students or payments change

  useEffect(() => {
    let hasTriggered = false;

    // Delay to ensure DOM is ready
    const setupObserver = () => {
      const currentRef = chartRef.current;

      if (!currentRef) {
        setTimeout(setupObserver, 100);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTriggered) {
              hasTriggered = true;
              setTimeout(() => {
                setIsChartVisible(true);
              }, 300);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px' }
      );

      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    };

    const cleanup = setupObserver();
    return cleanup;
  }, []);

  useEffect(() => {
    let hasTriggered = false;

    // Delay to ensure DOM is ready
    const setupObserver = () => {
      const currentRef = staffRef.current;
      console.log('Staff observer setup, ref exists:', !!currentRef);

      if (!currentRef) {
        console.log('Ref not ready, retrying...');
        setTimeout(setupObserver, 100);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            console.log('Staff intersection:', entry.isIntersecting, 'hasTriggered:', hasTriggered);
            if (entry.isIntersecting && !hasTriggered) {
              hasTriggered = true;
              console.log('Setting staff visible to TRUE');
              setTimeout(() => {
                setIsStaffVisible(true);
              }, 300);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px' }
      );

      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    };

    const cleanup = setupObserver();
    return cleanup;
  }, []);

  const fetchDashboardData = async () => {
    // Frontend-only: Use real data from context

    // Calculate total revenue from payments
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Set dashboard stats using real data
    setStats({
      totalStudents: students.length,
      totalRevenue: totalRevenue,
      activeUsers: 3, // Keep static for demo
    });

    // Set user analytics (keep static for demo but could be calculated from real data)
    setUserAnalytics([
      {
        user_id: '1',
        full_name: 'McMills User',
        registeredToday: 5,
        revenueToday: 7500.00,
        registeredThisWeek: 28,
        totalRevenue: 125000.00
      },
      {
        user_id: '2',
        full_name: 'System Clerk',
        registeredToday: 3,
        revenueToday: 4500.00,
        registeredThisWeek: 18,
        totalRevenue: 61750.00
      }
    ]);

    // Get recent students from real data (sort by created_at and take the most recent)
    const sortedStudents = [...students]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5); // Get top 5 most recent

    const recentStudentsData: RecentActivity[] = sortedStudents.map(student => ({
      id: student.id,
      type: 'student' as const,
      name: student.name,
      timestamp: student.created_at
    }));

    setRecentStudents(recentStudentsData);

    // Get recent payments from real data (sort by created_at and take the most recent)
    const sortedPayments = [...payments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5); // Get top 5 most recent

    const recentPaymentsData: RecentActivity[] = sortedPayments.map(payment => ({
      id: payment.id,
      type: 'payment' as const,
      name: payment.student_name,
      amount: payment.amount,
      timestamp: payment.created_at
    }));

    setRecentPayments(recentPaymentsData);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in pb-12">

      {/* Daily Operations Summary */}
      <div id="operations" className="scroll-mt-24 md:scroll-mt-32 mt-2 md:mt-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                Today's Operations
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className={`relative overflow-hidden bg-transparent rounded-lg p-4 md:p-5 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-[525ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-150">
                <UserPlus className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Today</span>
            </div>
            <p className="text-xl md:text-[1.7rem] font-normal text-gray-800 dark:text-white mb-1">
              {userAnalytics.reduce((sum, user) => sum + user.registeredToday, 0)}
            </p>
            <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Registrations</p>
          </div>
          <div className={`relative overflow-hidden bg-transparent rounded-lg p-4 md:p-5 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-[525ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-150">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Today</span>
            </div>
            <p className="text-xl md:text-[1.7rem] font-normal text-gray-800 dark:text-white mb-1">
              GH₵ {userAnalytics.reduce((sum, user) => sum + user.revenueToday, 0).toLocaleString()}
            </p>
            <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
          </div>
          <div className={`relative overflow-hidden bg-transparent rounded-lg p-4 md:p-5 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-[525ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-150">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Week</span>
            </div>
            <p className="text-xl md:text-[1.7rem] font-normal text-gray-800 dark:text-white mb-1">
              {userAnalytics.reduce((sum, user) => sum + user.registeredThisWeek, 0)}
            </p>
            <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Total</p>
          </div>
          <div className={`relative overflow-hidden bg-transparent rounded-lg p-4 md:p-5 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-[525ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-sky-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-150">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Now</span>
            </div>
            <p className="text-xl md:text-[1.7rem] font-normal text-gray-800 dark:text-white mb-1">{stats.activeUsers}</p>
            <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Staff Online</p>
          </div>
        </div>
      </div>

      {/* Course Distribution Analytics */}
      <div id="courses" ref={chartRef} className="rounded-lg p-3 md:p-4 scroll-mt-24 md:scroll-mt-32 border-t-2 border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            Course Distribution Analytics
          </h3>
          <span className="text-xs md:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
            Live Data
          </span>
        </div>

        <div className="space-y-4 md:space-y-0">
          {/* Mobile View - Card Layout */}
          <div className="md:hidden space-y-4">
            {[
              { course: 'Computer Science', students: 298, percentage: 23.9, color: 'bg-cyan-600', rank: 1 },
              { course: 'Information Technology', students: 245, percentage: 19.6, color: 'bg-emerald-600', rank: 2 },
              { course: 'Mathematical Science', students: 187, percentage: 15.0, color: 'bg-blue-600', rank: 3 },
              { course: 'Physical Science', students: 156, percentage: 12.5, color: 'bg-cyan-600', rank: 4 },
              { course: 'Actuarial Science', students: 142, percentage: 11.4, color: 'bg-teal-700', rank: 5 },
              { course: 'Education', students: 124, percentage: 9.9, color: 'bg-indigo-600', rank: 6 },
              { course: 'Allied Health', students: 95, percentage: 7.6, color: 'bg-cyan-600', rank: 7 }
            ].map((item) => (
              <div key={item.course} className="bg-gray-100 dark:bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.rank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                      <span className="text-base font-bold text-gray-800 dark:text-white">{item.course}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">{item.students.toLocaleString()}</span>
                </div>
                <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div
                    className={`${item.color} h-full transition-all duration-[1500ms] ease-out flex items-center justify-end pr-2`}
                    style={{ width: isChartVisible ? `${(item.students / 298) * 100}%` : '0%' }}
                  >
                    {isChartVisible && (
                      <span className="text-sm font-bold text-white animate-fade-in">{item.percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-gray-100 dark:bg-gray-700/30 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-800 dark:text-white">Total Enrollment</span>
                <span className="text-xl font-extrabold text-gray-800 dark:text-white">{students.length.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">7 Programs</p>
            </div>
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '40%' }} />
              </colgroup>
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 text-base font-bold text-gray-700 dark:text-gray-300">Rank</th>
                  <th className="text-left py-3 px-4 text-base font-bold text-gray-700 dark:text-gray-300">Program</th>
                  <th className="text-center py-3 px-4 text-base font-bold text-gray-700 dark:text-gray-300">Students</th>
                  <th className="text-left py-3 px-4 text-base font-bold text-gray-700 dark:text-gray-300">Enrollment Chart</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { course: 'Computer Science', students: 298, percentage: 23.9, color: 'bg-cyan-600', rank: 1 },
                  { course: 'Information Technology', students: 245, percentage: 19.6, color: 'bg-emerald-600', rank: 2 },
                  { course: 'Mathematical Science', students: 187, percentage: 15.0, color: 'bg-blue-600', rank: 3 },
                  { course: 'Physical Science', students: 156, percentage: 12.5, color: 'bg-cyan-600', rank: 4 },
                  { course: 'Actuarial Science', students: 142, percentage: 11.4, color: 'bg-teal-700', rank: 5 },
                  { course: 'Education', students: 124, percentage: 9.9, color: 'bg-indigo-600', rank: 6 },
                  { course: 'Allied Health', students: 95, percentage: 7.6, color: 'bg-cyan-600', rank: 7 }
                ].map((item, index) => (
                  <tr
                    key={item.course}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors ${index === 0 ? 'bg-gray-50 dark:bg-gray-800/20' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-base font-bold text-gray-700 dark:text-gray-300">{item.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                        <span className="text-base font-bold text-gray-800 dark:text-white">{item.course}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{item.students.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <div
                              className={`${item.color} h-full transition-all duration-[1500ms] ease-out flex items-center justify-end pr-2`}
                              style={{ width: isChartVisible ? `${(item.students / 298) * 100}%` : '0%' }}
                            >
                              {isChartVisible && (
                                <span className="text-sm font-bold text-white animate-fade-in">{item.percentage}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/30 font-bold">
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-base font-bold text-gray-800 dark:text-white">Total Enrollment</td>
                  <td className="py-4 px-4 text-center text-xl font-extrabold text-gray-800 dark:text-white">{students.length.toLocaleString()}</td>
                  <td className="py-4 px-4 text-base text-gray-600 dark:text-gray-400">7 Programs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Updated in real-time</span>
            </div>
            <Link
              to="/students"
              className="text-sm md:text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors duration-150"
            >
              View All Students →
            </Link>
          </div>
        </div>
      </div>

      <div id="performance" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-32">
        <div ref={staffRef} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Staff Performance</h2>
            </div>
            <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full">
              Live Data
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userAnalytics.slice(0, 2).map((user, index) => {
              const dailyTarget = 8;
              const weeklyTarget = 40;
              const dailyProgress = (user.registeredToday / dailyTarget) * 100;
              const weeklyProgress = (user.registeredThisWeek / weeklyTarget) * 100;
              const circumference = 2 * Math.PI * 45;
              // strokeDashoffset: circumference = 0% filled, 0 = 100% filled
              // When not visible: show 0% (offset = circumference)
              // When visible: show actual % (offset = circumference - progress)
              const dailyOffset = isStaffVisible ? (circumference - (dailyProgress / 100) * circumference) : circumference;
              const weeklyOffset = isStaffVisible ? (circumference - (weeklyProgress / 100) * circumference) : circumference;

              return (
                <div
                  key={user.user_id}
                  className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-150 overflow-hidden"
                >
                  {/* Header */}
                  <div className="relative flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg bg-gradient-to-br from-green-500 to-emerald-600">
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-base">{user.full_name}</h3>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {index === 0 ? 'Admin' : 'Clerk'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${dailyProgress >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : dailyProgress >= 50 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                      {dailyProgress >= 75 ? 'Top' : dailyProgress >= 50 ? 'Good' : 'Growing'}
                    </div>
                  </div>

                  {/* Circular Progress Indicators */}
                  <div className="flex justify-around mb-6">
                    {/* Daily Progress Circle */}
                    <div className="relative">
                      <svg className="transform -rotate-90" width="100" height="100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={dailyOffset}
                          className={`transition-all duration-1000 ${dailyProgress >= 100 ? 'text-green-500' : dailyProgress >= 75 ? 'text-blue-500' : dailyProgress >= 50 ? 'text-yellow-500' : 'text-orange-500'}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-extrabold text-gray-800 dark:text-white">{isStaffVisible ? Math.round(dailyProgress) : 0}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Daily</div>
                      </div>
                    </div>

                    {/* Weekly Progress Circle */}
                    <div className="relative">
                      <svg className="transform -rotate-90" width="100" height="100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={weeklyOffset}
                          className={`transition-all duration-1000 ${weeklyProgress >= 100 ? 'text-green-500' : weeklyProgress >= 75 ? 'text-blue-500' : weeklyProgress >= 50 ? 'text-yellow-500' : 'text-orange-500'}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-extrabold text-gray-800 dark:text-white">{isStaffVisible ? Math.round(weeklyProgress) : 0}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Weekly</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{user.registeredToday}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Today</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">/{dailyTarget}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">GH₵{user.revenueToday.toLocaleString()}</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">Revenue</div>
                      <div className="text-xs text-green-500 dark:text-green-500">Today</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{user.registeredThisWeek}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Week</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">/{weeklyTarget}</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Avg: {Math.round(user.registeredThisWeek / 7 * 10) / 10}/day</span>
                    <span className="text-gray-400 dark:text-gray-500">Last: {Math.floor(Math.random() * 10) + 1}m ago</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/users"
              className="text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              View More Staff →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Students</h2>
            </div>
            <div className="space-y-2">
              {recentStudents.length > 0 ? (
                recentStudents.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {student.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(student.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent students</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/students"
                className="text-base text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 font-medium"
              >
                View More Students →
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Payments</h2>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentPayments.length > 0 ? (
                (showAllPayments ? recentPayments : recentPayments.slice(0, 2)).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900/50 rounded hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {payment.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white block">
                          {payment.name}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                          GH₵ {payment.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">
                        {new Date(payment.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent payments</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              {recentPayments.length > 2 && (
                <button
                  onClick={() => setShowAllPayments(!showAllPayments)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                >
                  {showAllPayments ? 'View Less' : `View More (${recentPayments.length - 2} more)`}
                </button>
              )}
              <Link
                to="/payments"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
              >
                All Payments →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="system" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            System Notifications
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-transparent rounded-xl p-5 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">System Status</span>
            </div>
            <p className="text-2xl font-normal text-gray-800 dark:text-white mb-1">Operational</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">All systems running smoothly</p>
          </div>
          <div className="bg-transparent rounded-xl p-5 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Maintenance</span>
            </div>
            <p className="text-2xl font-normal text-gray-800 dark:text-white mb-1">Sunday</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled at 2:00 AM</p>
          </div>
          <div className="bg-transparent rounded-xl p-5 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Updates</span>
            </div>
            <p className="text-2xl font-normal text-gray-800 dark:text-white mb-1">Available</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">New features ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};