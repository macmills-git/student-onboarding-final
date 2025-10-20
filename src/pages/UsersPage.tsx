import { useEffect, useState, FormEvent } from 'react';
import { UserPlus, Edit, Trash2, Shield, X, Check, UserCircle, Activity } from 'lucide-react';
import { mockUsers, User } from '../lib/mockData';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);


  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'clerk' as 'admin' | 'clerk',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Use centralized mock data
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Create new user object
      const newUserRecord: User = {
        id: (mockUsers.length + 1).toString(),
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
        permissions: newUser.role === 'admin' ? {} : { register: true, view: true },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to mock data (in a real app, this would be an API call)
      mockUsers.unshift(newUserRecord);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`User ${newUser.full_name} created successfully!`);

      setShowAddModal(false);
      setNewUser({
        username: '',
        password: '',
        full_name: '',
        role: 'clerk',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (user: User) => {
    try {
      // Update the user in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...user, updated_at: new Date().toISOString() };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`User ${user.full_name} updated successfully!`);

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // Remove user from mock data
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert('User deleted successfully!');

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Update user status in mock data
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);

      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
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
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Users</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage system users and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 dark:bg-gray-900/50 rounded p-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-800 dark:text-white">
                      {user.full_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>@{user.username}</span>
                      <span>•</span>
                      <span className={`px-1 py-0.5 rounded text-xs ${user.role === 'admin'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}>
                        {user.role}
                      </span>
                      <span>•</span>
                      <span className={`px-1 py-0.5 rounded text-xs ${user.is_active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="px-1.5 py-0.5 text-xs bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-800"
                  >
                    <Edit className="w-2.5 h-2.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                    className={`px-1.5 py-0.5 text-xs rounded transition-all flex items-center gap-1 border ${user.is_active
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800'
                      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                      }`}
                  >
                    <Shield className="w-2.5 h-2.5" />
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-1.5 py-0.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center gap-1 border border-red-200 dark:border-red-800"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                  <option value="clerk">Clerk</option>
                  <option value="admin">Admin</option>
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
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white"
                >
                  <option value="clerk">Clerk</option>
                  <option value="admin">Admin</option>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">User Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-white">System Administrator</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Online now</p>
                </div>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  J
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-white">John Clerk</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Last seen 2 hours ago</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  J
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-white">Jane Clerk</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Inactive</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Inactive</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Permission Overview</h3>
          <div className="space-y-2">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-red-600 dark:text-red-400" />
                <span className="text-xs font-medium text-red-800 dark:text-red-300">Admin Permissions</span>
              </div>
              <ul className="text-xs text-red-600 dark:text-red-400 space-y-0.5">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• Financial reports</li>
                <li>• System configuration</li>
              </ul>
            </div>

            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1 mb-1">
                <UserCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Clerk Permissions</span>
              </div>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
                <li>• Student registration</li>
                <li>• View student records</li>
                <li>• Record payments</li>
                <li>• Generate basic reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-teal-100 dark:bg-teal-900/30 rounded flex items-center justify-center">
            <Shield className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Security & Access
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-3 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-medium text-teal-800 dark:text-teal-300">Security Level</span>
            </div>
            <p className="text-lg font-bold text-teal-900 dark:text-teal-100">High</p>
            <p className="text-xs text-teal-600 dark:text-teal-400">Protected system</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-1 mb-1">
              <UserCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Access Control</span>
            </div>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">Active</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Permissions managed</p>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded p-3 border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-medium text-cyan-800 dark:text-cyan-300">Monitoring</span>
            </div>
            <p className="text-lg font-bold text-cyan-900 dark:text-cyan-100">24/7</p>
            <p className="text-xs text-cyan-600 dark:text-cyan-400">Always watching</p>
          </div>
        </div>
      </div>
    </div>
  );
};