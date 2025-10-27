# 👥 Hướng dẫn Quản lý Admin

## Tổng quan

Tính năng quản lý admin cho phép các quản trị viên hiện tại cấp quyền admin cho người dùng khác trong hệ thống. Tính năng này bao gồm:

- ✅ API endpoint để quản lý quyền admin
- ✅ Giao diện web để xem và chỉnh sửa quyền người dùng
- ✅ Bảo vệ chống tự gỡ quyền admin của chính mình
- ✅ Xác thực qua Clerk
- ✅ Thông báo toast cho mọi hành động

## Cấu trúc Database

### Trường `isAdmin` trong User Model

```prisma
model User {
  id        Int     @id @default(autoincrement())
  clerkId   String  @unique
  email     String  @unique
  name      String?
  avatar    String?
  // ... các trường khác
  isAdmin   Boolean @default(false)  // ← Trường mới
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Field này đã được thêm vào database và Prisma schema.

## API Endpoints

### `GET /api/admin/users`

Lấy danh sách tất cả người dùng (chỉ admin).

**Headers:**
```
Authorization: Bearer <clerk_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "clerkId": "user_xxx",
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "avatar": "https://...",
    "isAdmin": false,
    "_count": {
      "posts": 5,
      "comments": 12
    }
  }
]
```

**Error Responses:**
- `401`: Chưa đăng nhập
- `403`: Không phải admin

### `PATCH /api/admin/users`

Cập nhật quyền admin của người dùng.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <clerk_token>
```

**Request Body:**
```json
{
  "userId": 2,
  "isAdmin": true
}
```

**Response:**
```json
{
  "id": 2,
  "clerkId": "user_yyy",
  "email": "newadmin@example.com",
  "name": "Trần Thị B",
  "avatar": "https://...",
  "isAdmin": true,
  "_count": {
    "posts": 3,
    "comments": 8
  }
}
```

**Error Responses:**
- `400`: Dữ liệu không hợp lệ
- `401`: Chưa đăng nhập
- `403`: Không phải admin HOẶC đang cố gỡ quyền admin của chính mình
- `404`: Không tìm thấy người dùng

## Giao diện Quản lý

### Truy cập

1. Đăng nhập với tài khoản admin
2. Vào Dashboard Admin: `/admin`
3. Click vào card "👥 Quản lý Admin"
4. Hoặc truy cập trực tiếp: `/admin/users`

### Tính năng

#### 🔍 Tìm kiếm
- Tìm kiếm theo tên hoặc email
- Real-time filtering

#### 🎯 Bộ lọc
- **Tất cả**: Hiện tất cả người dùng
- **Admin**: Chỉ hiện các admin
- **User**: Chỉ hiện người dùng thường

#### 📊 Bảng người dùng
Hiển thị:
- Avatar và tên người dùng
- Email
- Số bài đăng
- Số bình luận
- Vai trò hiện tại (Admin/User)
- Nút hành động (Cấp/Gỡ quyền admin)

#### 📈 Thống kê
- Tổng số người dùng
- Số quản trị viên
- Số người dùng thường

## Thiết lập lần đầu

### Bước 1: Xác minh Prisma Client

Nếu gặp lỗi TypeScript về `isAdmin`, chạy:

```bash
# Xóa cache Prisma
rm -rf node_modules/.prisma

# Regenerate Prisma Client
npx prisma generate

# Nếu vẫn lỗi, reload VS Code window
# Command Palette (Cmd+Shift+P) → "Developer: Reload Window"
```

### Bước 2: Tạo Admin đầu tiên

Vì chưa có admin nào, bạn cần tạo admin đầu tiên thủ công:

#### Cách 1: Sử dụng Prisma Studio

```bash
npx prisma studio
```

1. Mở bảng `User`
2. Tìm tài khoản của bạn (theo email)
3. Đổi field `isAdmin` thành `true`
4. Save

#### Cách 2: Sử dụng SQL trực tiếp

```bash
# Lấy Clerk ID của bạn từ Clerk Dashboard
# Hoặc kiểm tra trong database

npx prisma studio
# Copy clerkId của user bạn muốn làm admin
```

Sau đó chạy SQL:

```sql
UPDATE "users" 
SET "isAdmin" = true 
WHERE "clerkId" = 'user_xxx';
```

#### Cách 3: Sử dụng Node.js Script

Tạo file `scripts/make-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true },
  });
  console.log(`✅ ${user.name} (${user.email}) is now an admin`);
}

makeAdmin('your-email@example.com')
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Chạy:

```bash
npx ts-node scripts/make-admin.ts
```

### Bước 3: Xác nhận

1. Đăng nhập với tài khoản vừa được cấp quyền admin
2. Truy cập `/admin`
3. Bạn sẽ thấy card "👥 Quản lý Admin"
4. Click vào để quản lý admin khác

## Bảo mật

### Quy tắc bảo vệ

1. **Xác thực**: Chỉ người dùng đã đăng nhập mới truy cập được API
2. **Phân quyền**: Chỉ admin mới có thể xem và sửa quyền người dùng
3. **Tự bảo vệ**: Admin không thể tự gỡ quyền admin của mình
4. **Audit Trail**: Tất cả thay đổi đều có thể tra cứu qua database logs

### Code bảo vệ trong API

```typescript
// Kiểm tra admin
const currentUser = await prisma.user.findUnique({
  where: { clerkId: userId },
  select: { isAdmin: true, id: true },
});

if (!currentUser?.isAdmin) {
  return NextResponse.json(
    { error: 'Bạn không có quyền truy cập' },
    { status: 403 }
  );
}

// Ngăn tự gỡ quyền
if (currentUser.id === targetUserId && !isAdmin) {
  return NextResponse.json(
    { error: 'Bạn không thể gỡ quyền admin của chính mình' },
    { status: 403 }
  );
}
```

## Kiểm tra tính năng

### Test Cases

1. **Login as admin** ✅
   - Truy cập `/admin/users`
   - Phải thấy danh sách người dùng

2. **Login as non-admin** ✅
   - Truy cập `/admin/users`
   - Phải redirect về `/admin` hoặc hiện 403

3. **Promote user to admin** ✅
   - Click "⬆️ Cấp Admin" trên user thường
   - Badge đổi thành "👑 Admin"
   - Toast hiện "Đã cấp quyền admin thành công"

4. **Demote admin to user** ✅
   - Click "🔽 Gỡ Admin" trên admin khác (không phải bản thân)
   - Badge đổi thành "👤 User"
   - Toast hiện "Đã gỡ quyền admin thành công"

5. **Cannot self-demote** ✅
   - API trả về 403 khi cố gỡ quyền admin của chính mình
   - Toast hiện lỗi

6. **Search functionality** ✅
   - Nhập tên/email vào search box
   - Danh sách filter real-time

7. **Filter by role** ✅
   - Click "Admin" → chỉ hiện admin
   - Click "User" → chỉ hiện user thường
   - Click "Tất cả" → hiện tất cả

## Troubleshooting

### Lỗi: "isAdmin does not exist in type 'UserSelect'"

**Nguyên nhân**: TypeScript server chưa reload sau khi generate Prisma client.

**Giải pháp**:
```bash
# 1. Regenerate Prisma client
npx prisma generate

# 2. Reload VS Code window
# Cmd+Shift+P → "Developer: Reload Window"

# 3. Nếu vẫn lỗi, xóa cache
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

### Lỗi: "Cannot find module 'react-hot-toast'"

**Giải pháp**:
```bash
npm install react-hot-toast
```

### Lỗi: 403 Forbidden khi truy cập /admin/users

**Nguyên nhân**: Tài khoản chưa có quyền admin.

**Giải pháp**: Xem [Bước 2: Tạo Admin đầu tiên](#bước-2-tạo-admin-đầu-tiên)

### Database không có cột isAdmin

**Giải pháp**:
```bash
npx prisma db push
```

## Mở rộng tính năng

### Tính năng có thể thêm

1. **Role-based permissions**
   - Thêm nhiều role hơn: moderator, editor, viewer
   - Quyền chi tiết cho từng chức năng

2. **Audit log**
   - Lưu lịch sử thay đổi quyền
   - Who, What, When, Why

3. **Bulk operations**
   - Cấp/gỡ quyền hàng loạt
   - Import/Export danh sách admin

4. **Email notifications**
   - Thông báo khi được cấp quyền admin
   - Thông báo khi bị gỡ quyền

5. **Super admin**
   - Admin cấp cao không thể bị gỡ
   - Chỉ super admin mới quản lý được admin khác

6. **Activity dashboard**
   - Dashboard riêng cho admin activity
   - Thống kê hành động của admin

## Files liên quan

```
prisma/schema.prisma                 # Database schema với isAdmin field
app/api/admin/users/route.ts         # API endpoint
app/admin/users/page.tsx             # UI quản lý admin
app/admin/page.tsx                   # Admin dashboard với link
app/layout.tsx                       # Root layout với Toaster
```

## Kết luận

Tính năng quản lý admin đã được triển khai đầy đủ với:

- ✅ Database schema updated
- ✅ API endpoints secured
- ✅ Modern UI with search & filter
- ✅ Toast notifications
- ✅ Self-protection mechanism
- ✅ Clerk authentication

Chỉ cần tạo admin đầu tiên thủ công (qua Prisma Studio), sau đó có thể quản lý tất cả admin khác qua giao diện web!
