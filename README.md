# 🌿 BandoXanh - Nền tảng Cộng đồng Tái chế & Bảo vệ Môi trường

Nền tảng web xây dựng trên Next.js nhằm thúc đẩy hoạt động tái chế và nâng cao nhận thức về bảo vệ môi trường thông qua cộng đồng tương tác.

## 📋 Yêu cầu hệ thống

- Node.js 18 trở lên
- pnpm (khuyến nghị) hoặc npm/yarn
- Database PostgreSQL (hoặc database tương thích với Prisma)

## 🚀 Bắt đầu

### 1. Cài đặt Dependencies

```bash
pnpm install
```

### 2. Thiết lập biến môi trường

Tạo file `.env` trong thư mục gốc:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bandoxanh"

# Clerk Authentication (Lấy từ https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Gemini API (AI nhận diện rác thải)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (Lưu trữ ảnh)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Thiết lập Database

```bash
# Chạy migrations
pnpm prisma migrate dev

# Seed dữ liệu mẫu (optional)
pnpm prisma db seed
```

### 4. Chạy Development Server

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🏗️ Build cho Production

```bash
pnpm build
pnpm start
```

## 📁 Cấu trúc Project

```
bandoxanh/
├── app/                      # Next.js App Router
│   ├── admin/               # Trang quản trị
│   ├── api/                 # API routes
│   ├── community/           # Trang cộng đồng
│   ├── identify/            # Nhận diện rác thải
│   ├── map/                 # Bản đồ điểm thu gom
│   ├── news/                # Tin tức môi trường
│   ├── profile/             # Trang cá nhân
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── admin/              # Components quản trị
│   ├── Header.tsx          # Navigation sidebar
│   ├── Footer.tsx          # Footer
│   └── ...
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & helpers
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
├── services/                # External services (Gemini AI, etc.)
├── store/                   # Zustand state management
└── types/                   # TypeScript types
```

## ✨ Tính năng chính

### 🗺️ Bản đồ Điểm thu gom
- Hiển thị các trạm thu gom rác tái chế trên bản đồ
- Tìm kiếm điểm thu gom gần nhất
- Thông tin chi tiết về loại rác thu gom
- Tích hợp OpenStreetMap với Leaflet

### 🤖 Nhận diện Rác thải AI
- Sử dụng Google Gemini AI để nhận diện loại rác
- Phân loại tự động (nhựa, giấy, kim loại, thủy tinh, ...)
- Hướng dẫn cách xử lý và tái chế
- Upload ảnh hoặc chụp trực tiếp

### 👥 Cộng đồng
- Đăng bài chia sẻ kinh nghiệm bảo vệ môi trường
- Tương tác: Like, comment, share
- Theo dõi người dùng khác
- Trang cá nhân với bài viết và huy hiệu

### 📰 Tin tức & Sự kiện
- Tin tức về môi trường và tái chế
- Sự kiện cộng đồng sắp diễn ra
- Bài viết nổi bật

### ⚙️ Admin Dashboard
- Quản lý điểm thu gom (CRUD)
- Quản lý tin tức và sự kiện
- Quản lý người dùng và phân quyền
- Upload ảnh trực tiếp lên Supabase
- Chọn vị trí trên bản đồ tương tác

### � Giao diện
- Dark mode / Light mode
- Responsive design (mobile-first)
- Sidebar có thể thu gọn
- Animations mượt mà
- Toast notifications

## 🛠️ Công nghệ sử dụng

### Core
- **Framework**: Next.js 15 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 3.4

### Database & ORM
- **Prisma**: ORM cho PostgreSQL
- **PostgreSQL**: Database chính

### Authentication
- **Clerk**: Xác thực người dùng
- Đăng nhập/Đăng ký
- Quản lý session
- Protected routes

### AI & Services
- **Google Gemini AI**: Nhận diện và phân loại rác
- **Supabase Storage**: Lưu trữ ảnh
- **Leaflet**: Bản đồ tương tác
- **Nominatim**: Geocoding

### State Management
- **Zustand**: Global state management
- React Query patterns

### UI Libraries
- **React Hot Toast**: Notifications
- **Material-UI Icons**: Icon system
- **Recharts**: Charts & analytics

### Monitoring
- **Vercel Analytics**: Page views & traffic
- **Vercel Speed Insights**: Performance monitoring

## 🔐 Xác thực & Phân quyền

Ứng dụng sử dụng **Clerk** cho xác thực an toàn:

- ✅ Đăng ký/Đăng nhập
- ✅ Quản lý profile người dùng
- ✅ Protected routes (middleware)
- ✅ Phân quyền admin (database-driven)

### Admin Access
Admin được quản lý qua trường `isAdmin` trong database:
```typescript
// Cấp quyền admin cho user
UPDATE users SET "isAdmin" = true WHERE email = 'user@example.com';
```

## 🌍 Triển khai

### Vercel (Khuyến nghị)
```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

### Environment Variables cần thiết
Thêm tất cả biến trong file `.env` vào Vercel dashboard:
- Database URL
- Clerk keys
- Gemini API key
- Supabase credentials

## 📱 Tính năng người dùng chưa đăng nhập

Người dùng **chưa đăng nhập** có thể:
- ✅ Xem bản đồ điểm thu gom
- ✅ Xem tin tức và sự kiện
- ✅ Xem bài viết cộng đồng
- ✅ Sử dụng tính năng nhận diện AI

Các tính năng yêu cầu đăng nhập:
- ❌ Đăng bài, like, comment
- ❌ Theo dõi người dùng
- ❌ Xem profile chi tiết
- ❌ Truy cập admin dashboard

## 🧪 Testing & Development

```bash
# Development mode
pnpm dev

# Type checking
pnpm tsc --noEmit

# Prisma Studio (Database GUI)
pnpm prisma studio

# View logs
pnpm dev | grep -i error
```

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini API](https://ai.google.dev/docs)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 👥 Team

**BandoXanh Team** - Xây dựng vì một tương lai xanh hơn 🌱

---

<div align="center">
  Made with 💚 for the environment
</div>