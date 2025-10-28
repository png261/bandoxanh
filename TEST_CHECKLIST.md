# 🧪 Test Checklist - BanDoXanh System

## ✅ Authentication & User Management
- [ ] Đăng nhập với Clerk
- [ ] Đăng xuất
- [ ] Xem profile người dùng
- [ ] Chỉnh sửa thông tin profile
- [ ] Follow/Unfollow người dùng

## ✅ Community Features (Cộng đồng)
### Posts (Bài đăng)
- [ ] Tạo bài đăng chỉ có text
- [ ] Tạo bài đăng có text + 1 ảnh
- [ ] Tạo bài đăng có text + nhiều ảnh (2-6 ảnh)
- [ ] Upload ảnh thành công (kiểm tra ảnh hiển thị)
- [ ] Bài đăng hiển thị ngay sau khi tạo (không cần reload)
- [ ] Xem danh sách bài đăng (Explore tab)
- [ ] Xem bài đăng của người đang follow (Following tab)
- [ ] Cache hoạt động (không re-fetch khi switch tab trong 2 phút)

### Comments (Bình luận)
- [ ] Thêm bình luận vào bài đăng
- [ ] Bình luận hiển thị ngay lập tức (optimistic UI)
- [ ] Chỉnh sửa bình luận của mình
- [ ] Xóa bình luận của mình
- [ ] Xem tất cả bình luận của bài đăng

### Interactions (Tương tác)
- [ ] Like/Unlike bài đăng
- [ ] Đếm số lượng likes chính xác
- [ ] Share bài đăng (mở ShareModal)
- [ ] Xóa bài đăng của chính mình

## ✅ News & Events (Tin tức & Sự kiện)
### News Articles
- [ ] Xem danh sách tin tức
- [ ] Lọc tin tức theo category
- [ ] Click vào tin tức để xem chi tiết
- [ ] Ảnh tin tức hiển thị hoặc có fallback (📰)
- [ ] Share tin tức

### Events
- [ ] Xem sự kiện sắp diễn ra
- [ ] Đăng ký tham gia sự kiện (Going)
- [ ] Đăng ký quan tâm (Interested)
- [ ] Ảnh sự kiện hiển thị hoặc có fallback (🎉)
- [ ] Click sự kiện mở map với vị trí event

## ✅ Map Features (Bản đồ)
### Stations (Trạm thu gom)
- [ ] Hiển thị tất cả trạm trên bản đồ
- [ ] Click marker để xem thông tin trạm
- [ ] Ảnh trạm hiển thị trong popup hoặc có fallback (♻️)
- [ ] Click "Chỉ đường" mở Google Maps
- [ ] Tính khoảng cách từ vị trí hiện tại
- [ ] Lọc trạm theo loại rác thải
- [ ] Search trạm theo tên/địa chỉ

### Events on Map
- [ ] Hiển thị sự kiện trên bản đồ (marker tím)
- [ ] Click marker để xem thông tin sự kiện
- [ ] Ảnh sự kiện hiển thị trong popup hoặc có fallback
- [ ] Switch giữa Stations và Events

### Location
- [ ] Lấy vị trí hiện tại của user
- [ ] Hiển thị marker vị trí user trên map
- [ ] Tự động zoom đến vị trí user

## ✅ Identify Features (Nhận diện)
- [ ] Chụp ảnh cây/hoa
- [ ] Upload ảnh từ thiết bị
- [ ] AI nhận diện chính xác (Google Gemini)
- [ ] Hiển thị thông tin chi tiết (tên, mô tả, cách chăm sóc)
- [ ] Lưu lịch sử nhận diện
- [ ] Xem lại lịch sử

## ✅ Admin Panel
### Authentication
- [ ] Chỉ admin mới truy cập được /admin
- [ ] Non-admin bị redirect hoặc thấy 403

### Dashboard
- [ ] Hiển thị thống kê tổng quan
- [ ] 6 cards: Users, Posts, News, Events, Stations, Badges

### User Management (/admin/users)
- [ ] Xem danh sách users
- [ ] Search users
- [ ] Xem thông tin chi tiết user
- [ ] Chỉnh sửa quyền admin (promote/demote)
- [ ] Pagination hoạt động

### Post Management (/admin/posts)
- [ ] Xem danh sách posts
- [ ] Search posts theo content/author
- [ ] Xem ảnh của post
- [ ] Xóa post
- [ ] Pagination

### News Management (/admin/news)
- [ ] Xem danh sách news
- [ ] Thêm news article mới
- [ ] Upload ảnh cho news (Supabase)
- [ ] Chỉnh sửa news
- [ ] Xóa news
- [ ] Lọc theo category

### Events Management (/admin/events)
- [ ] Xem danh sách events
- [ ] Thêm event mới
- [ ] Upload ảnh cho event
- [ ] Chọn vị trí trên map (MapPicker)
- [ ] Chỉnh sửa event
- [ ] Xóa event

### Stations Management (/admin/stations)
- [ ] Xem danh sách stations
- [ ] Thêm station mới
- [ ] Upload ảnh cho station
- [ ] Chọn vị trí trên map
- [ ] Chọn waste types (checkbox multiple)
- [ ] Chỉnh sửa station
- [ ] Xóa station

### Image Upload (Admin)
- [ ] Upload ảnh thành công (với SUPABASE_SERVICE_ROLE_KEY)
- [ ] Validation: file type (jpg, png, gif, webp)
- [ ] Validation: file size (max 5MB)
- [ ] Preview ảnh trước khi upload
- [ ] Hiển thị error rõ ràng nếu upload fail
- [ ] Ảnh được lưu vào bucket `bandoxanh-admin`

## ✅ Theme & Dark Mode
- [ ] Toggle dark mode
- [ ] Theme được lưu trong localStorage
- [ ] Theme persistent khi reload
- [ ] Tất cả components render đúng trong cả 2 modes

## ✅ Responsive Design
- [ ] Mobile (< 768px): Sidebar collapse, bottom navigation
- [ ] Tablet (768px - 1024px): Layout responsive
- [ ] Desktop (> 1024px): Full sidebar, grid layouts

## ✅ Performance
- [ ] Initial page load < 3s
- [ ] Images lazy load
- [ ] Infinite scroll/pagination không lag
- [ ] No memory leaks khi navigate

## ✅ Error Handling
- [ ] 404 page cho routes không tồn tại
- [ ] Error boundaries catch runtime errors
- [ ] Network errors hiển thị toast/message
- [ ] Form validation errors rõ ràng

## 🔧 Database & API
- [ ] Prisma schema sync với database
- [ ] All API routes return correct status codes
- [ ] API errors được log ra console
- [ ] Database queries optimized (no N+1)

## 🔐 Security
- [ ] Admin routes protected
- [ ] SUPABASE_SERVICE_ROLE_KEY không expose ra client
- [ ] No sensitive data trong client logs
- [ ] CORS configured correctly

---

## 🎯 Critical Path Test (Minimum to Push)
1. ✅ User có thể đăng nhập
2. ✅ User có thể tạo post với ảnh
3. ✅ User có thể comment
4. ✅ Map hiển thị stations và events
5. ✅ Admin có thể upload ảnh
6. ✅ Admin có thể tạo news/events/stations

---

## 📝 Notes
- Test trên Chrome/Firefox/Safari
- Test cả development và production build
- Check console cho errors/warnings
- Verify Supabase storage có files mới

---

**Tested by:** _________________  
**Date:** _________________  
**Build:** _________________  
**Status:** ⬜ PASS | ⬜ FAIL
