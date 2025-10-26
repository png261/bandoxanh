# BandoXanh - Cơ sở dữ liệu Setup Guide

## Đã thiết lập

✅ Prisma ORM được cài đặt  
✅ Database schema được tạo (PostgreSQL với Prisma Accelerate)  
✅ API routes được tạo cho tất cả entities  
✅ Prisma Client được generate  

## Các API Routes hiện có

### News Articles
- `GET /api/news` - Lấy tất cả bài viết
- `POST /api/news` - Tạo bài viết mới

### Users
- `GET /api/users` - Lấy tất cả người dùng
- `POST /api/users` - Tạo người dùng mới

### Posts
- `GET /api/posts` - Lấy tất cả bài đăng
- `POST /api/posts` - Tạo bài đăng mới

### Stations
- `GET /api/stations` - Lấy tất cả trạm tái chế
- `POST /api/stations` - Tạo trạm mới

### Waste Analysis
- `GET /api/waste-analysis` - Lấy tất cả kết quả phân tích
- `POST /api/waste-analysis` - Tạo kết quả phân tích mới

## Sử dụng

### Tạo lib/api.ts sẵn sàng
```typescript
import { newsAPI, usersAPI, postsAPI, stationsAPI, wasteAnalysisAPI } from '@/lib/api';

// Lấy dữ liệu
const articles = await newsAPI.getAll();
const users = await usersAPI.getAll();

// Tạo dữ liệu
const newArticle = await newsAPI.create({
  title: 'Title',
  category: 'Category',
  content: 'Content',
  // ...
});
```

### Database Models

#### User
- id: Int (Primary Key)
- name: String
- avatar: String (URL)
- joinDate: String
- bio: String
- awards: UserAward[]
- posts: Post[]
- comments: Comment[]

#### NewsArticle
- id: Int (Primary Key)
- title: String
- category: String
- excerpt: String
- imageUrl: String
- date: String
- isFeatured: Boolean
- content: String (Text)

#### Post
- id: Int (Primary Key)
- content: String
- images: String (JSON array)
- timestamp: String
- likes: Int
- author: User
- comments: Comment[]
- poll: Poll

#### Station
- id: Int (Primary Key)
- name: String
- address: String
- latitude: Float
- longitude: Float
- hours: String
- wasteTypes: String (JSON array)
- image: String

#### Poll & PollOption
- question: String
- options: PollOption[]
- votedBy: String (JSON array of user IDs)

#### WasteAnalysis
- id: Int (Primary Key)
- imageUrl: String
- wasteType: String
- recyclingSuggestion: String (Text)

## Cập nhật Schema

Để cập nhật Prisma schema:

1. Sửa file `/prisma/schema.prisma`
2. Push thay đổi: `npx prisma db push`
3. Generate Prisma Client: `npx prisma generate`

## Kết nối Database

Database sử dụng Prisma Accelerate (connection pooling):
```
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
```

URL này đã được cấu hình trong `.env.local`

## Tiếp theo

1. Cập nhật các component để sử dụng API routes thay vì static data
2. Thêm authentication với Clerk (nếu cần)
3. Tạo thêm API routes cho các chức năng khác
4. Thêm validation và error handling
