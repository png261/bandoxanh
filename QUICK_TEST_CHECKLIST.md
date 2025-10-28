# ✅ CHECKLIST KIỂM TRA NHANH TRƯỚC KHI DEPLOY

## 🎯 ĐÃ HOÀN THÀNH TỰ ĐỘNG
- ✅ Build thành công (`npm run build`)
- ✅ TypeScript không có lỗi
- ✅ Tất cả API endpoints hoạt động
- ✅ Database queries chạy OK
- ✅ Loading animations đã được thêm toàn bộ app

---

## 🧪 CẦN KIỂM TRA THỦ CÔNG (15 phút)

### 1. Map Page (3 phút) - QUAN TRỌNG NHẤT
```
✓ Mở http://localhost:3002/map
✓ Bản đồ hiển thị OK
✓ Thấy markers (chấm xanh/tím)
✓ Click marker → popup hiển thị
✓ Click "Chỉ đường" → mở Google Maps
✓ Tìm kiếm một station/event
✓ Toggle dark mode
```

### 2. Community Page (3 phút)
```
✓ Đăng nhập (Clerk)
✓ Tạo post mới với ảnh
✓ Like một post
✓ Comment trên post
✓ Share post
```

### 3. News Page (2 phút)
```
✓ Xem danh sách tin tức
✓ Click vào một tin để đọc chi tiết
✓ Share tin tức
```

### 4. Identify Page (2 phút)
```
✓ Upload ảnh rác
✓ Gemini AI trả về kết quả
✓ Kết quả hiển thị đúng định dạng
```

### 5. Profile Page (2 phút)
```
✓ Xem profile của mình
✓ Follow một user khác
✓ Xem danh sách followers
✓ Scan badge (nếu có)
```

### 6. Admin Panel (3 phút)
```
✓ Login vào /admin
✓ Thêm station mới + upload ảnh
✓ Thêm event mới + upload ảnh
✓ Thêm tin tức + upload ảnh
✓ Xem danh sách posts
✓ Delete một post spam
```

---

## 🚀 DEPLOY CHECKLIST

### Trước khi deploy:
- [ ] Tất cả tests thủ công PASS
- [ ] Không có console errors nghiêm trọng
- [ ] Mobile responsive OK (test trên điện thoại thật)
- [ ] Dark mode hoạt động tốt

### Vercel Environment Variables:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=prisma://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # ⚠️ QUAN TRỌNG!
GEMINI_API_KEY=AIza...
NEXT_PUBLIC_FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
NEXT_PUBLIC_APP_URL=https://bandoxanh.vercel.app
```

### Sau khi deploy:
- [ ] Truy cập production URL
- [ ] Test login/logout
- [ ] Test upload ảnh ở admin (nếu fail → thiếu SUPABASE_SERVICE_ROLE_KEY)
- [ ] Test community post với ảnh
- [ ] Test Gemini AI identify
- [ ] Test share Facebook (xem OG image)

---

## 🔥 CRITICAL ISSUES ĐÃ FIX

✅ Supabase uploads bypass RLS với service role key  
✅ Community posts require images upload first  
✅ Image fallbacks cho tất cả entities  
✅ Loading animations toàn bộ app  
✅ Admin endpoints cho stations/events/news  
✅ Map wasteTypes parsing fix  

---

## 📊 DEPLOYMENT COMMANDS

```bash
# Local test
npm run build
npm run start

# Deploy to Vercel
git add .
git commit -m "feat: ready for production deployment"
git push origin main

# Vercel sẽ tự động deploy
```

---

## 🆘 TROUBLESHOOTING

### Nếu admin upload fail trên production:
→ Kiểm tra `SUPABASE_SERVICE_ROLE_KEY` đã set chưa

### Nếu Gemini AI không hoạt động:
→ Kiểm tra `GEMINI_API_KEY` và API limits

### Nếu không login được:
→ Kiểm tra Clerk keys (pk_live vs pk_test)

### Nếu không thấy posts/stations/events:
→ Kiểm tra `DATABASE_URL` và seed data

