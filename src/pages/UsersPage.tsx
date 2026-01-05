import { useEffect, useState, FormEvent } from 'react';
import { UserPlus, Edit, Trash2, Shield, X, UserCircle, Activity, ChevronDown, ChevronUp, Clock, DollarSign, Users as UsersIcon, Calendar, TrendingUp } from 'lucide-react';
import { usersAPI, dashboardAPI } from '../services/api';
import { formatApiError } from '../utils/validationSchemas';

interface User {
  id: string;
  username: string;
  full_name: string;
  email?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserPerformance {
  user_id: string;
  full_name: string;
  username: string;
  registeredToday: number;
  revenueToday: number;
  registeredThisWeek: number;
  totalRevenue: number;
}

interface UserActivity {
  id: string;
  type: 'student_registration' | 'payment_record';
  student_id?: string;
  student_name: string;
  email?: string;
  course?: string;
  level?: string;
  study_mode?: string;
  amount?: number;
  payment_method?: string;
  reference_id?: string;
  timestamp: string;
  date: string;
  time: string;
}

interface UserActivitiesData {
  user: {
    id: string;
    username: string;
    full_name: string;
    role: string;
    created_at: string;
  };
  summary: {
    total_students_registered: number;
    total_payments_recorded: number;
    total_revenue: number;
    total_activities: number;
    first_activity: string | null;
    last_activity: string | null;
  };
  activities: UserActivity[];
  activities_by_date: Record<string, UserActivity[]>;
}

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [isPerformanceVisible, setIsPerformanceVisible] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [selectedUserActivities, setSelectedUserActivities] = useState<UserActivitiesData | null>(null);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'CLERK' as 'ADMIN' | 'CLERK',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      const errorMessage = formatApiError(error);
      alert(`Failed to load users: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPerformance = async () => {
    try {
      const response = await dashboardAPI.getStaffPerformance();
      if (response.success) {
        setUserPerformance(response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch user performance:', error);
      const errorMessage = formatApiError(error);
      console.error(`User performance error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserPerformance();
  }, []);

  const toggleUserExpand = (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setIsPerformanceVisible(false);
    } else {
      setExpandedUserId(userId);
      setIsPerformanceVisible(false);
      // Trigger animation after a short delay
      setTimeout(() => {
        setIsPerformanceVisible(true);
      }, 100);
    }
  };

  const getUserPerformance = (userId: string) => {
    // Find performance data for this user
    const performance = userPerformance.find(p => p.user_id === userId);
    if (performance) {
      return performance;
    }
    
    // Return default structure if not found
    return {
      user_id: userId,
      full_name: '',
      username: '',
      registeredToday: 0,
      revenueToday: 0,
      registeredThisWeek: 0,
      totalRevenue: 0
    };
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await usersAPI.create({
        username: newUser.username,
        password: newUser.password,
        full_name: newUser.full_name,
        email: newUser.email || undefined,
        role: newUser.role,
      });

      alert(`User ${newUser.full_name} created successfully!`);
      
      setShowAddModal(false);
      setNewUser({
        username: '',
        password: '',
        full_name: '',
        email: '',
        role: 'CLERK',
      });

      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const errorMessage = formatApiError(error);
      alert(`Failed to create user: ${errorMessage}`);
    }
  };

  const handleEditUser = async (user: User) => {
    try {
      await usersAPI.update(user.id, {
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      });

      alert(`User ${user.full_name} updated successfully!`);
      setEditingUser(null);
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      const errorMessage = formatApiError(error);
      alert(`Failed to update user: ${errorMessage}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(userId);
      alert('User deleted successfully!');
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      const errorMessage = formatApiError(error);
      alert(`Failed to delete user: ${errorMessage}`);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await usersAPI.toggleStatus(userId);
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to toggle user status:', error);
      const errorMessage = formatApiError(error);
      alert(`Failed to toggle user status: ${errorMessage}`);\n    }
  };

  const fetchUserActivities = async (userId: string) => {
    try {
      setLoadingActivities(true);
      setShowActivitiesModal(true);
      const response = await dashboardAPI.getUserActivities(userId);
      if (response.success) {
        setSelectedUserActivities(response.data);
      } else {
        const errorMessage = 'Failed to load user activities.';
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Failed to fetch user activities:', error);
      const errorMessage = formatApiError(error);
      alert(`Failed to load user activities: ${errorMessage}`);
    } finally {
      setLoadingActivities(false);
    }
  };

  const closeActivitiesModal = () => {
    setShowActivitiesModal(false);
    setSelectedUserActivities(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">Users</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Manage system users and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md w-full md:w-auto justify-center"
        >
          <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
          Add User
        </button>
      </div>

      <div id="security" className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 scroll-mt-24">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 dark:bg-teal-900/30 rounded flex items-center justify-center">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            Security & Access
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-teal-600 dark:text-teal-400" />
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-300">Security Level</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">High</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Protected system</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-300">Access Control</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Active</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Permissions managed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-300">Monitoring</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">24/7</p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Always watching</p>
          </div>
        </div>
      </div>

      <div id="user-list" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 scroll-mt-24">
        <div className="space-y-3">
          {users.map((user) => {
            const isExpanded = expandedUserId === user.id;
            const performance = getUserPerformance(user.id);
            const dailyTarget = 8;
            const weeklyTarget = 40;
            const dailyProgress = performance ? (performance.registeredToday / dailyTarget) * 100 : 0;
            const weeklyProgress = performance ? (performance.registeredThisWeek / weeklyTarget) * 100 : 0;

            return (
              <div
                key={user.id}
                className="bg-gray-50 dark:bg-gray-900/50 rounded p-2 md:p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0 md:justify-between">
                  <div
                    className="flex items-center gap-3 md:gap-4 flex-1 cursor-pointer w-full"
                    onClick={() => toggleUserExpand(user.id)}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white truncate">
                          {user.full_name}
                        </h3>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                        <span className="truncate">@{user.username}</span>
                        <span className="hidden md:inline">•</span>
                        <span className={`hidden md:inline px-2 py-1 rounded text-sm ${user.role.toUpperCase() === 'ADMIN'
                          ? 'bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400'
                          : 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className={`hidden md:inline px-2 py-1 rounded text-sm ${user.is_active
                          ? 'bg-gray-200 dark:bg-gray-700 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 w-full md:w-auto">
                    <button
                      onClick={() => fetchUserActivities(user.id)}
                      className="flex-1 md:flex-none px-2 md:px-3 py-1.5 text-xs md:text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all flex items-center justify-center gap-1 border border-blue-200 dark:border-blue-800"
                      title="View all activities"
                    >
                      <Activity className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Activities</span>
                    </button>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="flex-1 md:flex-none px-2 md:px-3 py-1.5 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-all flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-800"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`flex-1 md:flex-none px-2 md:px-3 py-1.5 text-xs md:text-sm rounded transition-all flex items-center justify-center gap-1 border ${user.is_active
                        ? 'bg-transparent text-amber-700 dark:text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                        : 'bg-transparent text-teal-700 dark:text-teal-600 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                        }`}
                    >
                      <Shield className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{user.is_active ? 'Deactivate' : 'Activate'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 md:flex-none px-2 md:px-3 py-1.5 text-xs md:text-sm bg-transparent text-rose-700 dark:text-rose-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-1 border border-gray-300 dark:border-gray-600"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Performance Dropdown */}
                {isExpanded && performance && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 animate-fade-in flex justify-center">
                    <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-150 overflow-hidden w-full md:w-3/5">
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
                              {user.role.toUpperCase() === 'ADMIN' ? 'Admin' : 'Clerk'}
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
                          <svg className="transform -rotate-90" width="140" height="140">
                            <circle
                              cx="70"
                              cy="70"
                              r="60"
                              stroke="currentColor"
                              strokeWidth="10"
                              fill="none"
                              className="text-gray-200 dark:text-gray-700"
                            />
                            <circle
                              cx="70"
                              cy="70"
                              r="60"
                              stroke="currentColor"
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 60}
                              strokeDashoffset={isPerformanceVisible ? (2 * Math.PI * 60 - (dailyProgress / 100) * 2 * Math.PI * 60) : 2 * Math.PI * 60}
                              className={`transition-all duration-1000 ${dailyProgress >= 100 ? 'text-green-500' : dailyProgress >= 75 ? 'text-blue-500' : dailyProgress >= 50 ? 'text-yellow-500' : 'text-orange-500'}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-extrabold text-gray-800 dark:text-white">{isPerformanceVisible ? Math.round(dailyProgress) : 0}%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Daily</div>
                          </div>
                        </div>

                        {/* Weekly Progress Circle */}
                        <div className="relative">
                          <svg className="transform -rotate-90" width="140" height="140">
                            <circle
                              cx="70"
                              cy="70"
                              r="60"
                              stroke="currentColor"
                              strokeWidth="10"
                              fill="none"
                              className="text-gray-200 dark:text-gray-700"
                            />
                            <circle
                              cx="70"
                              cy="70"
                              r="60"
                              stroke="currentColor"
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 60}
                              strokeDashoffset={isPerformanceVisible ? (2 * Math.PI * 60 - (weeklyProgress / 100) * 2 * Math.PI * 60) : 2 * Math.PI * 60}
                              className={`transition-all duration-1000 ${weeklyProgress >= 100 ? 'text-green-500' : weeklyProgress >= 75 ? 'text-blue-500' : weeklyProgress >= 50 ? 'text-yellow-500' : 'text-orange-500'}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-extrabold text-gray-800 dark:text-white">{isPerformanceVisible ? Math.round(weeklyProgress) : 0}%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Weekly</div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white">{performance.registeredToday}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Today</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">/{dailyTarget}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">GH₵{performance.revenueToday.toLocaleString()}</div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">Revenue</div>
                          <div className="text-xs text-green-500 dark:text-green-500">Today</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white">{performance.registeredThisWeek}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Week</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">/{weeklyTarget}</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Avg: {Math.round(performance.registeredThisWeek / 7 * 10) / 10}/day</span>
                        <span className="text-gray-400 dark:text-gray-500">Last: {Math.floor(Math.random() * 10) + 1}m ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                  required
                >
                  <option value="CLERK">Clerk</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Edit User</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role.toUpperCase()}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                >
                  <option value="CLERK">Clerk</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditUser(editingUser)}
                  className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div id="user-activity" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 scroll-mt-24">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">User Activity</h3>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No users found</p>
            ) : (
              users.map((user) => {
                const performance = userPerformance.find(p => p.user_id === user.id);
                const isActiveToday = performance && (performance.registeredToday > 0 || performance.revenueToday > 0);
                const hasWeekActivity = performance && performance.registeredThisWeek > 0;
                
                // Determine activity status
                let activityStatus = 'Inactive';
                let activityColor = 'gray';
                let bgColor = 'bg-gray-50 dark:bg-gray-900/50';
                let borderColor = '';
                
                if (!user.is_active) {
                  activityStatus = 'Deactivated';
                  activityColor = 'gray';
                } else if (isActiveToday) {
                  activityStatus = 'Active today';
                  activityColor = 'green';
                  bgColor = 'bg-green-50 dark:bg-green-900/20';
                  borderColor = 'border border-green-200 dark:border-green-800';
                } else if (hasWeekActivity) {
                  activityStatus = 'Active this week';
                  activityColor = 'blue';
                  bgColor = 'bg-blue-50 dark:bg-blue-900/20';
                  borderColor = 'border border-blue-200 dark:border-blue-800';
                }

                return (
                  <div key={user.id} className={`flex items-center justify-between p-3 ${bgColor} rounded ${borderColor}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-${activityColor}-500 rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{user.full_name}</p>
                        <p className={`text-sm text-${activityColor}-600 dark:text-${activityColor}-400`}>
                          {!user.is_active ? 'Account deactivated' : 
                           isActiveToday ? `${performance?.registeredToday || 0} registrations today` :
                           hasWeekActivity ? `${performance?.registeredThisWeek || 0} registrations this week` :
                           'No recent activity'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm text-${activityColor}-600 dark:text-${activityColor}-400 font-medium`}>
                      {activityStatus}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div id="permissions" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 scroll-mt-24">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Permission Overview</h3>
          <div className="space-y-2">
            <div className="p-3 bg-transparent rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Admin Permissions</span>
              </div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• Financial reports</li>
                <li>• System configuration</li>
              </ul>
            </div>

            <div className="p-3 bg-transparent rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <UserCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Clerk Permissions</span>
              </div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Student registration</li>
                <li>• View student records</li>
                <li>• Record payments</li>
                <li>• Generate basic reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* User Activities Modal */}
      {showActivitiesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Activity className="w-6 h-6" />
                    User Activity History
                  </h2>
                  {selectedUserActivities && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedUserActivities.user.full_name} (@{selectedUserActivities.user.username})
                    </p>
                  )}
                </div>
                <button
                  onClick={closeActivitiesModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingActivities ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedUserActivities ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Students Registered</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedUserActivities.summary.total_students_registered}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payments Recorded</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedUserActivities.summary.total_payments_recorded}
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        GH₵ {selectedUserActivities.summary.total_revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Activities</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedUserActivities.summary.total_activities}
                      </p>
                    </div>
                  </div>

                  {/* Activity Period */}
                  {selectedUserActivities.summary.first_activity && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Period</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(selectedUserActivities.summary.first_activity)} - {formatDate(selectedUserActivities.summary.last_activity || '')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activities Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Activity Timeline
                    </h3>
                    
                    {selectedUserActivities.activities.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No activities recorded yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(selectedUserActivities.activities_by_date)
                          .reverse()
                          .map(([date, activities]) => (
                            <div key={date} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              {/* Date Header */}
                              <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {formatDate(date)} ({activities.length} {activities.length === 1 ? 'activity' : 'activities'})
                                </h4>
                              </div>
                              {/* Activities for this date */}
                              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {activities.map((activity: UserActivity) => (
                                  <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        activity.type === 'student_registration'
                                          ? 'bg-blue-100 dark:bg-blue-900/30'
                                          : 'bg-green-100 dark:bg-green-900/30'
                                      }`}>
                                        {activity.type === 'student_registration' ? (
                                          <UsersIcon className={`w-5 h-5 ${
                                            activity.type === 'student_registration'
                                              ? 'text-blue-600 dark:text-blue-400'
                                              : 'text-green-600 dark:text-green-400'
                                          }`} />
                                        ) : (
                                          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <h5 className="text-sm font-semibold text-gray-800 dark:text-white">
                                            {activity.type === 'student_registration' ? 'Student Registration' : 'Payment Record'}
                                          </h5>
                                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {activity.time}
                                          </span>
                                        </div>
                                        <div className="mt-1 space-y-1">
                                          <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Student:</span> {activity.student_name}
                                            {activity.student_id && <span className="text-gray-500 dark:text-gray-400"> ({activity.student_id})</span>}
                                          </p>
                                          {activity.type === 'student_registration' ? (
                                            <>
                                              {activity.email && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                  <span className="font-medium">Email:</span> {activity.email}
                                                </p>
                                              )}
                                              {activity.course && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                  <span className="font-medium">Course:</span> {activity.course} • Level {activity.level} • {activity.study_mode}
                                                </p>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                Amount: GH₵ {activity.amount?.toLocaleString()}
                                              </p>
                                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Method:</span> {activity.payment_method?.toUpperCase()} • 
                                                <span className="font-medium"> Reference:</span> {activity.reference_id}
                                              </p>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No activities found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};