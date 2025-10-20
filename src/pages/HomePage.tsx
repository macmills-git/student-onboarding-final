import {
  Users, DollarSign, TrendingUp, Activity,
  UserPlus, FileText, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const { profile } = useAuth();

  // Define all quick actions with role permissions
  const allQuickActions = [
    {
      title: 'Register Student',
      description: 'Onboard new students',
      icon: UserPlus,
      link: '/register',
      color: 'from-blue-500 to-cyan-500',
      roles: ['admin', 'clerk']
    },
    {
      title: 'View Students',
      description: 'Browse all students',
      icon: Users,
      link: '/students',
      color: 'from-green-500 to-emerald-500',
      roles: ['admin', 'clerk']
    },
    {
      title: 'Dashboard',
      description: 'Analytics overview',
      icon: TrendingUp,
      link: '/dashboard',
      color: 'from-orange-500 to-red-500',
      roles: ['admin']
    },
    {
      title: 'Payments',
      description: 'Manage payments',
      icon: DollarSign,
      link: '/payments',
      color: 'from-purple-500 to-pink-500',
      roles: ['admin']
    },
  ];

  // Show all quick actions for both admin and clerk users
  const quickActions = allQuickActions.map(action => ({
    title: action.title,
    description: action.description,
    icon: action.icon,
    link: action.link,
    color: action.color,
  }));

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 rounded-xl p-7 text-white shadow-lg animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-2">
              Welcome to Student Management!
            </h1>
            <p className="text-blue-100 text-base">
              Ready to manage student registrations and records
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-11 h-11 text-blue-200 opacity-50" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.link}
                className={`group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 hover:-translate-y-1 animate-zoom-in animation-delay-${index * 100}`}
              >
                <div className={`w-11 h-11 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-bounce-in animation-delay-${index * 200}`}>
                  <Icon className="w-6 h-6 text-white group-hover:animate-wiggle" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {action.description}
                </p>
                <div className="flex items-center text-blue-500 text-xs font-medium group-hover:gap-2 transition-all duration-300">
                  <span>Go</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 group-hover:scale-125 transition-all duration-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              System Overview
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mode</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                Demo Mode
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Access Level</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                Full Access
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                v2.1.0
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Active
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              Getting Started
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Navigate to Register to onboard new students to the system
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                View and manage all registered students in the Students page
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Access Dashboard for detailed analytics and comprehensive reports
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                4
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Track payments and financial records for all students
              </span>
            </li>
          </ul>
        </div>
      </div>



      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Need Help?
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Documentation</span>
            </div>
            <p className="text-xl font-bold text-purple-900 dark:text-purple-100">Available</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Comprehensive guides</p>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm font-medium text-pink-800 dark:text-pink-300">Support Team</span>
            </div>
            <p className="text-xl font-bold text-pink-900 dark:text-pink-100">24/7</p>
            <p className="text-xs text-pink-600 dark:text-pink-400">Always ready to help</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Quick Response</span>
            </div>
            <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">&lt; 2hrs</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Average response time</p>
          </div>
        </div>
      </div>
    </div>
  );
};