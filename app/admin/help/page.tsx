'use client';

import { useRouter } from 'next/navigation';

export default function AdminHelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              📚 Hướng dẫn Quản trị viên
            </h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
            >
              ← Quay lại
            </button>
          </div>
          <p className="text-gray-600 text-lg">
            Hướng dẫn chi tiết cách sử dụng trang quản trị BandoXanh
          </p>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-8 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">👋</span>
            <div>
              <h2 className="text-3xl font-bold mb-2">Chào mừng bạn!</h2>
              <p className="text-green-100 text-lg">
                Bạn đã được cấp quyền Quản trị viên (Admin) của hệ thống BandoXanh
              </p>
            </div>
          </div>
        </div>

        {/* What is Admin Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">👑</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Quản trị viên là gì?</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Quản trị viên (Admin) là người có quyền quản lý toàn bộ nội dung và người dùng trong hệ thống BandoXanh. 
                Với quyền này, bạn có thể thêm/sửa/xóa các nội dung và quản lý quyền hạn của người dùng khác.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            Những gì bạn có thể làm
          </h3>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <span className="text-4xl">📍</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Quản lý Điểm thu gom</h4>
                <p className="text-gray-700">
                  Thêm, chỉnh sửa hoặc xóa các điểm thu gom rác thải tái chế trên bản đồ. 
                  Cập nhật thông tin về địa chỉ, giờ làm việc và loại rác được thu gom.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <span className="text-4xl">📰</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Quản lý Tin tức</h4>
                <p className="text-gray-700">
                  Đăng bài viết mới về môi trường, cập nhật tin tức về tái chế, 
                  chỉnh sửa hoặc xóa các bài viết hiện có.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <span className="text-4xl">📅</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Quản lý Sự kiện</h4>
                <p className="text-gray-700">
                  Tạo và quản lý các sự kiện tái chế, chiến dịch làm sạch môi trường, 
                  cập nhật thông tin về thời gian và địa điểm tổ chức.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <span className="text-4xl">💬</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Theo dõi Bài đăng</h4>
                <p className="text-gray-700">
                  Xem và kiểm duyệt các bài đăng từ cộng đồng, 
                  đảm bảo nội dung phù hợp với quy định của hệ thống.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <span className="text-4xl">👥</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Quản lý Người dùng</h4>
                <p className="text-gray-700">
                  <strong>Tính năng quan trọng:</strong> Cấp hoặc gỡ quyền admin cho người dùng khác. 
                  Chỉ admin mới có thể thực hiện việc này.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Admin Management */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            Cách quản lý quyền Admin
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Truy cập trang quản lý Admin</h4>
                <p className="text-gray-700">
                  Từ bảng điều khiển, nhấn vào ô <strong>"👥 Quản lý Admin"</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Tìm người dùng</h4>
                <p className="text-gray-700">
                  Sử dụng ô tìm kiếm để nhập tên hoặc email của người dùng bạn muốn tìm. 
                  Hoặc dùng các nút lọc: <strong>Tất cả</strong>, <strong>Admin</strong>, <strong>User</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Cấp quyền Admin</h4>
                <p className="text-gray-700">
                  Nhấn nút <strong className="text-green-600">⬆️ Cấp Admin</strong> bên cạnh tên người dùng. 
                  Một cửa sổ xác nhận sẽ hiện ra để bạn kiểm tra lại trước khi thực hiện.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Gỡ quyền Admin</h4>
                <p className="text-gray-700">
                  Nhấn nút <strong className="text-red-600">🔽 Gỡ Admin</strong> để thu hồi quyền admin. 
                  Cửa sổ xác nhận sẽ hiện ra để đảm bảo bạn không nhầm lẫn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-3">
            <span className="text-4xl">⚠️</span>
            Lưu ý quan trọng
          </h3>

          <div className="space-y-4 text-gray-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <strong>Không thể tự gỡ quyền của mình:</strong> Bạn không thể gỡ quyền admin của chính mình. 
                Cần có admin khác thực hiện việc này để đảm bảo hệ thống luôn có ít nhất một admin.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <strong>Cân nhắc kỹ trước khi cấp quyền:</strong> Người có quyền admin sẽ có toàn quyền quản lý hệ thống. 
                Chỉ cấp quyền cho những người bạn tin tưởng.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Xác nhận trước khi thực hiện:</strong> Luôn kiểm tra kỹ thông tin trong cửa sổ xác nhận 
                trước khi nhấn nút đồng ý để tránh thao tác nhầm lẫn.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <div>
                <strong>Thay đổi có hiệu lực ngay lập tức:</strong> Khi bạn cấp hoặc gỡ quyền admin, 
                thay đổi sẽ có hiệu lực ngay và người dùng sẽ thấy sự thay đổi khi tải lại trang.
              </div>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🆘</span>
            <div>
              <h3 className="text-2xl font-bold mb-3">Cần trợ giúp?</h3>
              <p className="text-blue-100 mb-4 text-lg">
                Nếu bạn gặp khó khăn hoặc có thắc mắc về cách sử dụng trang quản trị, 
                đừng ngại liên hệ với đội ngũ phát triển của BandoXanh.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/admin')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Về trang chủ Admin
                </button>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all border-2 border-white"
                >
                  Quản lý Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
