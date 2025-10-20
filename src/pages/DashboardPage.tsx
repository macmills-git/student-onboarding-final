import { useEffect, useState } from 'react';
import {
  Users, DollarSign, TrendingUp, UserPlus,
  Eye, CreditCard, BarChart3, Activity, ArrowRight, PieChart, GraduationCap, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getStudentStats,
  getCourseDistribution,
  getRecentStudents,
  getRecentPayments,
  getUserAnalytics
} from '../lib/mockData';

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
}

interface RecentActivity {
  id: string;
  type: 'student' | 'payment';
  name: string;
  amount?: number;
  timestamp: string;
}

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [recentStudents, setRecentStudents] = useState<RecentActivity[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get consistent stats from centralized data
      const stats = getStudentStats();
      setStats(stats);

      // Get user analytics from centralized data
      const analytics = getUserAnalytics();
      setUserAnalytics(analytics);

      // Get recent students from centralized data
      const recentStudentsData = getRecentStudents(5);
      setRecentStudents(
        recentStudentsData.map(student => ({
          id: student.id,
          type: 'student' as const,
          name: student.name,
          timestamp: student.created_at
        }))
      );

      // Get recent payments from centralized data
      const recentPaymentsData = getRecentPayments(5);
      setRecentPayments(
        recentPaymentsData.map(payment => ({
          id: payment.id,
          type: 'payment' as const,
          name: payment.student_name,
          amount: payment.amount,
          timestamp: payment.created_at
        }))
      );
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Overview of system performance and analytics
        </p>
      </div>



      {/* Daily Operations Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Today's Operations
          </h3>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-wiggle" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Today's Registrations</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {userAnalytics.reduce((sum, user) => sum + user.registeredToday, 0)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">New students registered</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 animate-wiggle animation-delay-100" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">Today's Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              GH₵ {userAnalytics.reduce((sum, user) => sum + user.revenueToday, 0).toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">Payments collected</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-wiggle animation-delay-200" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-300">This Week</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {userAnalytics.reduce((sum, user) => sum + user.registeredThisWeek, 0)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Weekly registrations</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-wiggle animation-delay-300" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Staff Online</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.activeUsers}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">Currently working</p>
          </div>
        </div>
      </div>

      {/* Course Distribution Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
            <PieChart className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Course Distribution Analytics
          </h3>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
            Live Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Statistics */}
          <div className="space-y-3">
            {[
              { course: 'Computer Science', students: 298, percentage: 23.9, color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800', textColor: 'text-blue-600 dark:text-blue-400' },
              { course: 'Information Technology', students: 245, percentage: 19.6, color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800', textColor: 'text-green-600 dark:text-green-400' },
              { course: 'Mathematical Science', students: 187, percentage: 15.0, color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800', textColor: 'text-purple-600 dark:text-purple-400' },
              { course: 'Physical Science', students: 156, percentage: 12.5, color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800', textColor: 'text-orange-600 dark:text-orange-400' },
              { course: 'Actuarial Science', students: 142, percentage: 11.4, color: 'bg-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/20', borderColor: 'border-teal-200 dark:border-teal-800', textColor: 'text-teal-600 dark:text-teal-400' },
              { course: 'Education', students: 124, percentage: 9.9, color: 'bg-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-800', textColor: 'text-indigo-600 dark:text-indigo-400' },
              { course: 'Allied Health', students: 95, percentage: 7.6, color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-800', textColor: 'text-red-600 dark:text-red-400' }
            ].map((item, index) => (
              <div key={item.course} className={`flex items-center justify-between p-3 ${item.bgColor} rounded-lg border ${item.borderColor} hover:shadow-md transition-all duration-300 transform hover:scale-102`}>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${item.color} rounded-full flex items-center justify-center`}>
                    <GraduationCap className="w-2 h-2 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{item.course}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${item.textColor}`}>{item.percentage}%</p>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div
                      className={`${item.color} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Chart Representation */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-4">
              {/* Simple Donut Chart using CSS */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 via-orange-500 via-teal-500 to-red-500 animate-spin" style={{ animationDuration: '10s' }}></div>
              <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Students</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">7</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Programs</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">CS</p>
                <p className="text-xs text-green-600 dark:text-green-400">Top Course</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Updated in real-time</span>
            </div>
            <Link
              to="/students"
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium transition-colors duration-300"
            >
              View All Students →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Staff Performance</h2>
            </div>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full group-hover:animate-pulse">
              Live Data
            </span>
          </div>
          <div className="space-y-4">
            {userAnalytics.slice(0, 2).map((user, index) => {
              const dailyTarget = 8; // Target registrations per day
              const weeklyTarget = 40; // Target registrations per week
              const dailyProgress = (user.registeredToday / dailyTarget) * 100;
              const weeklyProgress = (user.registeredThisWeek / weeklyTarget) * 100;

              return (
                <div
                  key={user.user_id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-102 transition-all duration-300 group/card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user.full_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full group-hover/card:animate-pulse ${index === 0 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {index === 0 ? 'Admin' : 'Clerk'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Today's Work</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {user.registeredToday}/{dailyTarget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 group-hover/card:animate-pulse group-hover/card:shadow-lg ${dailyProgress >= 100 ? 'bg-green-500' :
                            dailyProgress >= 75 ? 'bg-blue-500' :
                              dailyProgress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                          style={{ width: `${Math.min(dailyProgress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Revenue</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          GH₵ {user.revenueToday.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">This Week</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {user.registeredThisWeek}/{weeklyTarget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 group-hover/card:animate-pulse group-hover/card:shadow-lg ${weeklyProgress >= 100 ? 'bg-green-500' :
                            weeklyProgress >= 75 ? 'bg-blue-500' :
                              weeklyProgress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                          style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Avg/Day</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {Math.round(user.registeredThisWeek / 7 * 10) / 10}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className={`font-medium ${dailyProgress >= 75 ? 'text-green-600 dark:text-green-400' :
                          dailyProgress >= 50 ? 'text-blue-600 dark:text-blue-400' :
                            'text-orange-600 dark:text-orange-400'
                          }`}>
                          {dailyProgress >= 75 ? 'Excellent' :
                            dailyProgress >= 50 ? 'Good' : 'Needs Focus'}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${index === 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          }`}>
                          {index === 0 ? '🟢 Online' : '🔵 Active'}
                        </div>
                      </div>
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Last activity: {Math.floor(Math.random() * 10) + 1}m ago
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/users"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              View More Staff →
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-green-500" />
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Recent Students</h2>
            </div>
            <div className="space-y-2">
              {recentStudents.slice(0, 2).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900/50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                      {student.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(student.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/students"
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 font-medium"
              >
                View More Students →
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Recent Payments</h2>
            </div>
            <div className="space-y-2">
              {recentPayments.slice(0, 2).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900/50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {payment.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-800 dark:text-white block">
                        {payment.name}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                        GH₵ {payment.amount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(payment.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/payments"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
              >
                View More Payments →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Link
          to="/register"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gray-800 dark:text-white">Register Student</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Add new student to system</p>
        </Link>

        <Link
          to="/students"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gray-800 dark:text-white">View Students</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Browse all registered students</p>
        </Link>

        <Link
          to="/payments"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gray-800 dark:text-white">Manage Payments</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Track payment records</p>
        </Link>

        <Link
          to="/users"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gray-800 dark:text-white">User Management</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Manage system users</p>
        </Link>
      </div>



      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            System Notifications
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-300">System Status</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">Operational</p>
            <p className="text-xs text-green-600 dark:text-green-400">All systems running</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Maintenance</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">Sunday</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">2:00 AM scheduled</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Updates</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">Available</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">New features ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};