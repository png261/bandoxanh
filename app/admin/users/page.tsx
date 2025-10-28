'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  clerkId: string;
  email: string;
  name: string;
  avatar: string | null;
  isAdmin: boolean;
  _count: {
    posts: number;
    comments: number;
  };
}

export default function AdminUsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAdmin, setFilterAdmin] = useState<'all' | 'admin' | 'user'>('all');
  const [processingUserId, setProcessingUserId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    userId: number;
    userName: string;
    action: 'grant' | 'revoke';
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      
      if (response.status === 403) {
        toast.error('Bạn không có quyền truy cập trang này');
        router.push('/admin');
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch users:', errorText);
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: number, currentStatus: boolean) => {
    try {
      setProcessingUserId(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, isAdmin: !currentStatus }),
      });

      if (response.status === 403) {
        const data = await response.json();
        toast.error(data.error || 'Bạn không có quyền thực hiện hành động này');
        return;
      }

      if (!response.ok) throw new Error('Failed to update user');

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast.success(
        updatedUser.isAdmin 
          ? '✅ Đã cấp quyền admin thành công' 
          : '✅ Đã gỡ quyền admin thành công'
      );
      setConfirmModal(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('❌ Không thể cập nhật quyền người dùng');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleActionClick = (userId: number, userName: string, isAdmin: boolean) => {
    setConfirmModal({
      show: true,
      userId,
      userName,
      action: isAdmin ? 'revoke' : 'grant'
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAdmin === 'all' || 
                         (filterAdmin === 'admin' && u.isAdmin) ||
                         (filterAdmin === 'user' && !u.isAdmin);
    return matchesSearch && matchesFilter;
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              👥 Quản lý Quản Trị Viên
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all flex items-center gap-2"
                title="Xem hướng dẫn sử dụng"
              >
                <span className="text-xl">❓</span>
                <span>Hướng dẫn</span>
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
              >
                ← Quay lại
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Trang này giúp bạn quản lý ai có quyền quản trị viên (Admin) trong hệ thống
          </p>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Hướng dẫn sử dụng</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <strong>Tìm kiếm:</strong> Gõ tên hoặc email người dùng vào ô tìm kiếm để lọc danh sách
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <strong>Lọc người dùng:</strong> Nhấn vào các nút "Tất cả", "Admin", hoặc "User" để xem từng nhóm
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⬆️</span>
                    <div>
                      <strong>Cấp quyền Admin:</strong> Nhấn nút "⬆️ Cấp Admin" để cho phép người dùng quản lý hệ thống
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔽</span>
                    <div>
                      <strong>Gỡ quyền Admin:</strong> Nhấn nút "🔽 Gỡ Admin" để thu hồi quyền quản trị
                    </div>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <strong>Lưu ý:</strong> Bạn không thể tự gỡ quyền admin của chính mình. Cần có admin khác thực hiện.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🔍 Tìm kiếm và lọc</h3>
            <p className="text-sm text-gray-600">Sử dụng các công cụ dưới đây để tìm người dùng bạn cần</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm người dùng
              </label>
              <input
                type="text"
                placeholder="Nhập tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-base"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo vai trò
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterAdmin('all')}
                  className={`px-5 py-3 rounded-lg font-medium transition-all text-base ${
                    filterAdmin === 'all'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Hiển thị tất cả người dùng"
                >
                  📋 Tất cả ({users.length})
                </button>
                <button
                  onClick={() => setFilterAdmin('admin')}
                  className={`px-5 py-3 rounded-lg font-medium transition-all text-base ${
                    filterAdmin === 'admin'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Chỉ hiển thị các quản trị viên"
                >
                  👑 Admin ({users.filter(u => u.isAdmin).length})
                </button>
                <button
                  onClick={() => setFilterAdmin('user')}
                  className={`px-5 py-3 rounded-lg font-medium transition-all text-base ${
                    filterAdmin === 'user'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Chỉ hiển thị người dùng thường"
                >
                  👤 User ({users.filter(u => !u.isAdmin).length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
            <h3 className="text-lg font-semibold">📊 Danh sách người dùng</h3>
            <p className="text-sm text-green-100 mt-1">
              {filteredUsers.length === 0 
                ? 'Không tìm thấy người dùng nào phù hợp'
                : `Đang hiển thị ${filteredUsers.length} người dùng`
              }
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>Người dùng</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <span>📝</span>
                      <span>Bài viết</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <span>💬</span>
                      <span>Bình luận</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <span>🏷️</span>
                      <span>Vai trò</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <span>⚡</span>
                      <span>Thao tác</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=40`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {user.email}
                      </td>

                      {/* Posts Count */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {user._count.posts}
                        </span>
                      </td>

                      {/* Comments Count */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {user._count.comments}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4 text-center">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            👑 Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            👤 User
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleActionClick(user.id, user.name, user.isAdmin)}
                          disabled={processingUserId === user.id}
                          className={`px-5 py-2.5 rounded-lg font-medium transition-all text-base shadow-md hover:shadow-lg ${
                            user.isAdmin
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          } ${processingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={user.isAdmin ? 'Nhấn để gỡ quyền admin' : 'Nhấn để cấp quyền admin'}
                        >
                          {processingUserId === user.id ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin">⏳</span>
                              <span>Đang xử lý...</span>
                            </span>
                          ) : user.isAdmin ? (
                            <span>🔽 Gỡ Admin</span>
                          ) : (
                            <span>⬆️ Cấp Admin</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm font-medium mb-1">Tổng người dùng</div>
                <div className="text-4xl font-bold">{users.length}</div>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-100 text-sm font-medium mb-1">Quản trị viên</div>
                <div className="text-4xl font-bold">{users.filter(u => u.isAdmin).length}</div>
              </div>
              <div className="text-5xl opacity-20">👑</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm font-medium mb-1">Người dùng thường</div>
                <div className="text-4xl font-bold">{users.filter(u => !u.isAdmin).length}</div>
              </div>
              <div className="text-5xl opacity-20">👤</div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {confirmModal.action === 'grant' ? '⬆️' : '🔽'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {confirmModal.action === 'grant' ? 'Cấp quyền Admin?' : 'Gỡ quyền Admin?'}
                </h3>
                <p className="text-gray-600 text-lg">
                  Bạn có chắc chắn muốn{' '}
                  <span className="font-semibold text-gray-900">
                    {confirmModal.action === 'grant' ? 'cấp quyền admin' : 'gỡ quyền admin'}
                  </span>{' '}
                  cho{' '}
                  <span className="font-semibold text-green-600">
                    {confirmModal.userName}
                  </span>
                  ?
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="text-sm text-gray-700">
                    {confirmModal.action === 'grant' ? (
                      <div>
                        <strong>Quyền Admin bao gồm:</strong>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                          <li>Quản lý tất cả người dùng</li>
                          <li>Cấp/gỡ quyền admin cho người khác</li>
                          <li>Truy cập bảng điều khiển admin</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <strong>Lưu ý:</strong> Người này sẽ mất quyền truy cập vào bảng điều khiển admin và không thể quản lý người dùng khác.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-base"
                >
                  ❌ Hủy bỏ
                </button>
                <button
                  onClick={() => toggleAdmin(confirmModal.userId, confirmModal.action === 'revoke')}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all text-base shadow-lg hover:shadow-xl ${
                    confirmModal.action === 'grant'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                >
                  {confirmModal.action === 'grant' ? '✅ Xác nhận cấp quyền' : '✅ Xác nhận gỡ quyền'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
