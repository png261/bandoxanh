# 📋 Deployment Checklist - Band Xanh

**Ngày kiểm tra:** 28/10/2025  
**Trạng thái Build:** ✅ Thành công (npm run build completed)  
**Dev Server:** ✅ Chạy thành công tại http://localhost:3002

---

## ✅ KIỂM TRA ĐÃ HOÀN THÀNH

### Build & Development
- [x] ✅ `npm run build` thành công không có lỗi
- [x] ✅ `npm run dev` chạy được
- [x] ✅ TypeScript compilation không có lỗi nghiêm trọng
- [x] ✅ Loading animations đã được thêm vào tất cả trang
- [x] ✅ LoadingSpinner component hoạt động tốt

### API Endpoints (Đã test thành công khi dev server chạy)
- [x] ✅ GET `/api/stations` - Trả về danh sách stations
- [x] ✅ GET `/api/events` - Trả về danh sách events  
- [x] ✅ GET `/api/posts` - Posts API hoạt động
- [x] ✅ Database queries chạy thành công (thấy trong logs)

---

## 🔧 1. Kiểm tra môi trường (Environment)

### ⚠️ Biến môi trường CẦN CÓ trên Production (Vercel):
```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database
DATABASE_URL=prisma://accelerate.prisma-data.net/?api_key=...

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # ⚠️ QUAN TRỌNG cho admin uploads!

# AI Features
GEMINI_API_KEY=AIzaSy...

# Social Sharing
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_secret

# App URL
NEXT_PUBLIC_APP_URL=https://bandoxanh.vercel.app
```

### Vercel Dashboard Checklist:
- [ ] Tất cả environment variables đã được thêm
- [ ] `SUPABASE_SERVICE_ROLE_KEY` được đánh dấu là **Sensitive**
- [ ] `CLERK_SECRET_KEY` được đánh dấu là **Sensitive**
- [ ] `FACEBOOK_APP_SECRET` được đánh dấu là **Sensitive**
- [ ] `GEMINI_API_KEY` được đánh dấu là **Sensitive**
- [ ] `NEXT_PUBLIC_APP_URL` trỏ đến production domain

---

## 🎨 2. Trang chính (Public Pages)

### Landing Page (`/landing`)
- [ ] Hiển thị đúng khi chưa đăng nhập
- [ ] Redirect to `/map` khi đã đăng nhập
- [ ] Hero section responsive
- [ ] Loading spinner hiển thị khi kiểm tra auth

### Map Page (`/map`) - ✅ PRIORITY HIGH
- [x] ✅ Bản đồ load thành công
- [x] ✅ Loading spinner hiển thị với animation
- [x] ✅ Stations API trả về dữ liệu
- [x] ✅ Events API trả về dữ liệu
- [ ] Click vào marker hiển thị popup (cần test thủ công)
- [ ] Tìm kiếm stations/events hoạt động
- [ ] Filter theo loại rác hoạt động
- [ ] "Chỉ đường" mở Google Maps
- [ ] Sidebar collapse/expand smooth
- [ ] Dark mode toggle hoạt động
- [ ] Mobile responsive
- [x] ✅ Fallback images cho stations/events không có ảnh

### Community Page (`/community`)
- [ ] ✅ Loading spinner khi tải bài viết
- [ ] Tab "Tất cả" hiển thị tất cả posts
- [ ] Tab "Đang theo dõi" hiển thị posts từ người được follow
- [ ] Tạo post mới (text + images)
- [ ] ✅ Upload ảnh TRƯỚC khi post được tạo
- [ ] ✅ Hiển thị "Đang đăng..." khi upload
- [ ] Like/Unlike posts
- [ ] React với emoji
- [ ] Comment trên posts
- [ ] Delete comment (nếu là author)
- [ ] Delete post (nếu là author)
- [ ] Share post
- [ ] Click vào avatar → profile page
- [ ] Image gallery (click ảnh để xem fullscreen)
- [ ] Infinite scroll hoặc pagination
- [ ] Dark mode
- [ ] Responsive mobile

### News Page (`/news`)
- [ ] ✅ Loading spinner khi tải tin tức
- [ ] Hiển thị danh sách tin tức
- [ ] Featured article nổi bật
- [ ] Click vào tin → trang chi tiết
- [ ] Share tin tức
- [ ] Sidebar: Upcoming events
- [ ] ✅ Fallback image cho tin tức không có ảnh
- [ ] Category badges hiển thị đúng
- [ ] Dark mode
- [ ] Responsive mobile

### News Detail Page (`/news/[id]`)
- [ ] ✅ Loading spinner
- [ ] Hiển thị full content của tin tức
- [ ] Image header
- [ ] Date, category hiển thị
- [ ] Back button quay lại `/news`
- [ ] Share button
- [ ] Related events (nếu có)
- [ ] Dark mode
- [ ] Responsive mobile

### Identify Page (`/identify`)
- [ ] Upload ảnh rác để phân tích
- [ ] Camera capture (mobile)
- [ ] Gemini AI phân tích ảnh
- [ ] Hiển thị kết quả: loại rác, cách tái chế
- [ ] Loading state khi phân tích
- [ ] Error handling khi API fail
- [ ] Dark mode
- [ ] Responsive mobile

### Profile Page (`/profile/[id]`)
- [ ] ✅ Loading spinner
- [ ] Hiển thị thông tin user: avatar, name, bio
- [ ] Hiển thị stats: posts, followers, following
- [ ] Hiển thị danh sách posts của user
- [ ] Follow/Unfollow button (nếu không phải user hiện tại)
- [ ] Edit profile (nếu là user hiện tại)
- [ ] Hiển thị badges của user
- [ ] QR code để share profile
- [ ] Scan badge QR (nếu có quyền)
- [ ] Click followers/following → modal
- [ ] ✅ Followers modal có loading spinner
- [ ] Dark mode
- [ ] Responsive mobile

### About Page (`/about`)
- [ ] Hiển thị thông tin về dự án
- [ ] Team members (nếu có)
- [ ] Mission & Vision
- [ ] Contact info
- [ ] Dark mode
- [ ] Responsive mobile

---

## 🔐 3. Authentication (Clerk)

### Sign In (`/sign-in`)
- [ ] Clerk sign-in form hiển thị
- [ ] Đăng nhập bằng email/password
- [ ] Đăng nhập bằng Google (nếu enabled)
- [ ] Redirect sau khi login thành công
- [ ] Error messages hiển thị rõ ràng

### Sign Up (`/sign-up`)
- [ ] Clerk sign-up form hiển thị
- [ ] Tạo tài khoản mới
- [ ] Email verification
- [ ] Redirect sau khi sign up
- [ ] Auto-create user trong database

### Session Management
- [ ] User data sync với database
- [ ] Avatar sync từ Clerk
- [ ] Logout hoạt động
- [ ] Protected routes redirect về login

---

## 👨‍💼 4. Admin Panel

### Authentication
- [ ] Chỉ admin mới truy cập được `/admin/*`
- [ ] Non-admin redirect về home
- [ ] ✅ Loading spinner khi check admin status

### Admin Dashboard (`/admin`)
- [ ] ✅ Loading spinner khi tải stats
- [ ] Hiển thị tổng số: stations, events, news, posts, users
- [ ] Cards link đến trang quản lý tương ứng
- [ ] Dark mode support
- [ ] Responsive

### Quản lý Stations (`/admin/stations`)
- [ ] ✅ Loading spinner
- [ ] Danh sách tất cả stations
- [ ] Search theo tên/địa chỉ
- [ ] Thêm station mới
  - [ ] ✅ Upload ảnh (sử dụng Supabase service role key)
  - [ ] Map picker chọn vị trí
  - [ ] Input: name, address, hours, wasteTypes
  - [ ] ✅ MapPicker có loading spinner
- [ ] Edit station
  - [ ] Load dữ liệu cũ
  - [ ] Update ảnh
  - [ ] Update vị trí
- [ ] Delete station
- [ ] Pagination/filter

### Quản lý Events (`/admin/events`)
- [ ] ✅ Loading spinner
- [ ] Danh sách events
- [ ] Search
- [ ] Thêm event mới
  - [ ] ✅ Upload ảnh
  - [ ] Map picker
  - [ ] Date/time picker
  - [ ] Organizer, description
- [ ] Edit event
- [ ] Delete event
- [ ] Filter theo date

### Quản lý News (`/admin/news`)
- [ ] ✅ Loading spinner
- [ ] Danh sách tin tức
- [ ] Search
- [ ] Thêm tin mới
  - [ ] ✅ Upload ảnh
  - [ ] Rich text editor cho content
  - [ ] Category selection
  - [ ] Featured toggle
  - [ ] Excerpt (tóm tắt)
- [ ] Edit news
- [ ] Delete news
- [ ] Preview

### Quản lý Posts (`/admin/posts`)
- [ ] ✅ Loading spinner (2 places)
- [ ] Danh sách tất cả community posts
- [ ] Search/filter
- [ ] Xem chi tiết post
- [ ] Delete post (moderation)
- [ ] View author profile
- [ ] Stats: likes, comments

### Quản lý Users (`/admin/users`)
- [ ] ✅ Loading spinner
- [ ] Danh sách users
- [ ] Search theo name/email
- [ ] View profile
- [ ] Stats: posts count, followers
- [ ] Ban/unban user (nếu có feature)
- [ ] Role management (admin/user)

### Quản lý Badges (`/admin/badges`)
- [ ] ✅ Loading spinner
- [ ] Danh sách badges
- [ ] Create badge
- [ ] Edit badge
- [ ] Delete badge
- [ ] Assign badge to user

---

## 📤 5. File Upload (Supabase Storage)

### Admin Uploads
- [ ] ✅ Sử dụng `supabaseAdmin` (service role key)
- [ ] Upload ảnh stations → bucket `bandoxanh-admin`
- [ ] Upload ảnh events → bucket `bandoxanh-admin`
- [ ] Upload ảnh news → bucket `bandoxanh-admin`
- [ ] ✅ ImageUpload component có loading spinner
- [ ] File size validation (max 5MB)
- [ ] File type validation (images only)
- [ ] Error handling rõ ràng

### Community Uploads
- [ ] ✅ Sử dụng `supabaseAdmin` cho `/api/upload`
- [ ] Upload multiple images cho posts
- [ ] Bucket: `bandoxanh`
- [ ] ✅ Upload thành công TRƯỚC khi tạo post
- [ ] Preview images trước khi upload
- [ ] Delete uploaded image

### Storage Buckets
- [ ] Bucket `bandoxanh-admin` tồn tại và public
- [ ] Bucket `bandoxanh` tồn tại và public
- [ ] URLs accessible từ browser
- [ ] RLS policies đúng (hoặc bypassed bằng service role)

---

## 🎯 6. API Endpoints

### Public APIs
- [ ] `GET /api/stations` - Lấy danh sách stations
- [ ] `GET /api/events` - Lấy events
- [ ] `GET /api/events/upcoming` - Events sắp tới
- [ ] `GET /api/news` - Lấy tin tức
- [ ] `GET /api/news/[id]` - Chi tiết tin
- [ ] `GET /api/posts` - Danh sách posts
- [ ] `GET /api/posts/following` - Posts từ following
- [ ] `POST /api/posts` - Tạo post mới (auth required)
- [ ] `PUT /api/posts/[id]` - Update post (auth)
- [ ] `DELETE /api/posts/[id]` - Xóa post (auth)
- [ ] `POST /api/posts/[id]/like` - Like post
- [ ] `POST /api/posts/[id]/react` - React với emoji
- [ ] `POST /api/posts/[id]/comment` - Comment
- [ ] `DELETE /api/posts/[id]/comment/[commentId]` - Xóa comment
- [ ] `POST /api/upload` - Upload ảnh (community)
- [ ] `POST /api/waste-analysis` - Gemini AI phân tích
- [ ] `GET /api/users/[id]` - Profile user
- [ ] `POST /api/users/[id]/follow` - Follow user
- [ ] `GET /api/users/[id]/followers` - Danh sách followers
- [ ] `GET /api/users/[id]/following` - Danh sách following
- [ ] `GET /api/users/[id]/posts` - Posts của user
- [ ] `GET /api/badges` - Danh sách badges
- [ ] `POST /api/badges/scan` - Scan badge QR

### Admin APIs
- [ ] ✅ `POST /api/admin/stations` - Tạo station
- [ ] ✅ `PUT /api/admin/stations/[id]` - Update station
- [ ] ✅ `DELETE /api/admin/stations/[id]` - Xóa station
- [ ] ✅ `POST /api/admin/events` - Tạo event
- [ ] ✅ `PUT /api/admin/events/[id]` - Update event
- [ ] ✅ `DELETE /api/admin/events/[id]` - Xóa event
- [ ] ✅ `POST /api/admin/news` - Tạo news
- [ ] ✅ `PUT /api/admin/news/[id]` - Update news
- [ ] ✅ `DELETE /api/admin/news/[id]` - Xóa news
- [ ] ✅ `GET /api/admin/posts` - Stats posts
- [ ] ✅ `DELETE /api/admin/posts/[id]` - Xóa post
- [ ] ✅ `POST /api/admin/upload` - Upload ảnh admin
- [ ] `GET /api/admin/users` - User management
- [ ] Admin auth check hoạt động cho tất cả endpoints

---

## 🗄️ 7. Database (Prisma + Supabase Postgres)

### Connection
- [ ] `DATABASE_URL` correct trong production
- [ ] Connection pooling hoạt động
- [ ] No connection limit errors

### Models
- [ ] `User` - Sync với Clerk
- [ ] `Station` - Có image field (empty string default)
- [ ] `RecyclingEvent` - Có image field
- [ ] `NewsArticle` - Có imageUrl field
- [ ] `Post` - Multiple images support
- [ ] `Comment` - Belongs to Post
- [ ] `Like` - User likes Post
- [ ] `Reaction` - Emoji reactions
- [ ] `Follow` - User follows User
- [ ] `Badge` - User badges

### Migrations
- [ ] All migrations applied
- [ ] No pending schema changes
- [ ] Seed data (nếu cần)

---

## 🌐 8. SEO & Meta Tags

### Open Graph Tags
- [ ] `metadataBase` set trong metadata export
- [ ] OG tags cho home page
- [ ] OG tags cho news articles (`/share/news/[id]`)
- [ ] OG tags cho posts (`/share/post/[id]`)
- [ ] Facebook sharing hiển thị đúng preview
- [ ] Twitter cards

### Sitemap & Robots
- [ ] `/sitemap.xml` generate đúng
- [ ] `/robots.txt` allow crawlers
- [ ] Canonical URLs

---

## 📱 9. Responsive & UI/UX

### Desktop (≥1024px)
- [ ] Sidebar navigation hoạt động
- [ ] Map sidebar (stations/events list)
- [ ] Admin tables readable
- [ ] Images scale properly

### Tablet (768px - 1023px)
- [ ] Sidebar collapse tốt
- [ ] Content readable
- [ ] Touch friendly

### Mobile (<768px)
- [ ] ✅ Bottom navigation bar (Header mobile)
- [ ] ✅ Hamburger menu
- [ ] Map controls dễ chạm
- [ ] Forms dễ nhập
- [ ] Images optimize
- [ ] Modals fullscreen hoặc bottom sheet
- [ ] Virtual keyboard không che content

### Dark Mode
- [ ] ✅ Toggle hoạt động
- [ ] ✅ Theme persist (localStorage)
- [ ] Tất cả pages support dark mode
- [ ] Colors contrast đủ
- [ ] Images/icons có dark variant

### Loading States
- [ ] ✅ LoadingSpinner component everywhere
- [ ] ✅ "Đang tải..." text có animation
- [ ] Skeleton screens (optional)
- [ ] Smooth transitions

### Error States
- [ ] 404 page
- [ ] 500 error page
- [ ] API error messages
- [ ] Form validation errors
- [ ] Toast notifications

---

## ⚡ 10. Performance

### Build
- [ ] ✅ Build thành công không lỗi
- [ ] Bundle size hợp lý (<500KB first load)
- [ ] Code splitting hiệu quả
- [ ] No console warnings trong build

### Runtime
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No layout shifts (CLS)
- [ ] Images lazy load
- [ ] Fonts preload

### Database
- [ ] Queries optimize (indexes)
- [ ] No N+1 queries
- [ ] Pagination implemented
- [ ] Connection pooling

---

## 🔒 11. Security

### Authentication
- [ ] Protected routes check auth
- [ ] Admin routes check admin role
- [ ] API routes validate user
- [ ] Clerk webhooks secure (nếu có)

### API Security
- [ ] Rate limiting (nếu cần)
- [ ] Input validation
- [ ] SQL injection protection (Prisma handles)
- [ ] XSS protection
- [ ] CORS configured

### Environment
- [ ] No secrets trong client code
- [ ] Service role key chỉ dùng server-side
- [ ] `.env` không commit vào git
- [ ] `.env.example` updated

---

## 🧪 12. Testing Flow (Manual)

### User Journey 1: Người dùng mới
1. [ ] Vào `/landing` → Thấy hero page
2. [ ] Click "Đăng ký" → `/sign-up`
3. [ ] Tạo account → Redirect `/map`
4. [ ] Xem stations trên map
5. [ ] Click station → Xem popup
6. [ ] "Chỉ đường" → Mở Google Maps
7. [ ] Vào `/community` → Xem posts
8. [ ] Tạo post mới với ảnh
9. [ ] Like, comment posts khác
10. [ ] Vào profile → Xem posts của mình
11. [ ] Follow user khác
12. [ ] Vào `/identify` → Upload ảnh rác → Nhận kết quả AI

### User Journey 2: Admin
1. [ ] Login as admin
2. [ ] Vào `/admin` → Xem dashboard stats
3. [ ] `/admin/stations` → Thêm station mới + upload ảnh
4. [ ] Edit station vừa tạo
5. [ ] `/admin/events` → Tạo event + ảnh
6. [ ] `/admin/news` → Tạo tin tức + ảnh
7. [ ] `/admin/posts` → Xem community posts, xóa spam
8. [ ] Verify stations/events hiện trên `/map`
9. [ ] Verify news hiện trên `/news`

### User Journey 3: Mobile User
1. [ ] Mở site trên mobile
2. [ ] Bottom nav hoạt động
3. [ ] Map zoom/pan mượt
4. [ ] Upload ảnh từ camera
5. [ ] Create post với multiple ảnh
6. [ ] Share post qua Facebook

---

## 🚀 13. Deployment Steps

### Pre-Deploy
- [ ] ✅ `npm run build` thành công local
- [ ] All tests pass (nếu có)
- [ ] Git commit tất cả changes
- [ ] Update version trong `package.json`

### Deploy to Vercel
- [ ] Push code lên GitHub
- [ ] Vercel auto-deploy hoặc manual trigger
- [ ] Vercel build thành công
- [ ] Environment variables set đúng
- [ ] Domain configured
- [ ] SSL certificate active

### Post-Deploy
- [ ] Check production URL hoạt động
- [ ] Test critical paths trên production
- [ ] Check logs không có errors
- [ ] Monitor performance
- [ ] Test từ different devices/browsers

### Database
- [ ] Migrations applied to production DB
- [ ] Connection stable
- [ ] Backup configured

---

## 📊 14. Monitoring (Post-Deploy)

### Analytics
- [ ] Google Analytics hoặc Vercel Analytics
- [ ] Track page views
- [ ] Track user events (button clicks, etc.)

### Error Tracking
- [ ] Sentry hoặc error logging
- [ ] Monitor API errors
- [ ] Monitor client errors

### Performance
- [ ] Vercel Speed Insights
- [ ] Lighthouse scores >90
- [ ] Core Web Vitals pass

---

## ✅ Final Checklist Before Deploy

- [ ] ✅ Build thành công không lỗi TypeScript
- [ ] All features tested locally
- [ ] All environment variables ready cho production
- [ ] Database migrations ready
- [ ] Git repository clean (no uncommitted changes)
- [ ] README.md updated
- [ ] Documentation updated
- [ ] Team notified về deployment

---

## 🐛 Known Issues / Todo

_Ghi lại các vấn đề đã biết hoặc features cần làm sau:_

1. ⚠️ Warning: `metadataBase` property not set → Cần set trong root layout
2. 💡 Prisma warning: Recommend `prisma generate --no-engine` cho production
3. 🔄 Có thể thêm infinite scroll cho community feed
4. 🎨 Có thể thêm rich text editor cho news content

---

**Người kiểm tra:** _________  
**Ngày hoàn thành:** _________  
**Approved by:** _________

---

## 📝 Notes

- Checklist này cover toàn bộ tính năng chính của Band Xanh
- Đánh dấu ✅ khi hoàn thành mỗi item
- Ghi chú issues phát hiện vào phần Known Issues
- Deployment chỉ nên tiến hành khi tất cả critical items được check
