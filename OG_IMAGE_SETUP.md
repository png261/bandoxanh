# Hướng dẫn thêm Thumbnail/OG Image cho Website

## Vấn đề hiện tại
Khi chia sẻ link website lên Messenger/Facebook, chỉ hiển thị link text mà không có hình ảnh preview.

## Giải pháp đã thực hiện

### 1. ✅ Cập nhật Open Graph Meta Tags
File `app/layout.tsx` đã có đầy đủ OG tags:
- `og:title` - Tiêu đề website
- `og:description` - Mô tả ngắn gọn
- `og:image` - Hình ảnh thumbnail
- `og:type` - Loại nội dung (website)
- `og:locale` - Ngôn ngữ (vi_VN)
- `og:url` - URL của website

### 2. 🎨 Tạo OG Image (Cần làm)

**Option 1: Sử dụng HTML Template có sẵn**
1. Mở file `scripts/generate-og-image.html` trong trình duyệt
2. Làm theo hướng dẫn trong file để tạo screenshot
3. Lưu file với tên `og-image.png`
4. Di chuyển vào thư mục `public/`

**Option 2: Sử dụng Canva (Khuyến nghị - Dễ nhất)**
1. Truy cập https://www.canva.com
2. Tạo design mới với kích thước **1200 x 630 pixels**
3. Thiết kế với nội dung:
   - Logo/Icon BandoXanh
   - Tên: "BandoXanh"
   - Tagline: "Nền tảng Tái chế & Bảo vệ Môi trường"
   - Icon/Hình ảnh liên quan đến môi trường
4. Download dưới dạng PNG
5. Đổi tên thành `og-image.png`
6. Copy vào thư mục `public/`

**Option 3: Sử dụng Figma**
1. Tạo frame 1200x630px
2. Design theo ý thích
3. Export as PNG
4. Lưu vào `public/og-image.png`

**Option 4: Sử dụng tool online**
- https://og-image.vercel.app
- https://metatags.io
- https://www.opengraph.xyz

### 3. 📝 Cập nhật lại code sau khi có OG image

Sau khi tạo xong file `public/og-image.png`, update `app/layout.tsx`:

```typescript
openGraph: {
  // ...
  images: [
    {
      url: '/og-image.png',        // ← Đổi lại từ android-chrome-512x512.png
      width: 1200,                  // ← Đổi lại từ 512
      height: 630,                  // ← Đổi lại từ 512
      alt: 'BandoXanh - Nền tảng Tái chế',
    },
  ],
},
twitter: {
  // ...
  images: ['/og-image.png'],       // ← Đổi lại từ android-chrome-512x512.png
}
```

## Kích thước chuẩn

### Open Graph Image (Facebook, Messenger, LinkedIn)
- **Kích thước:** 1200 x 630 pixels
- **Tỷ lệ:** 1.91:1
- **Format:** PNG, JPG
- **Dung lượng:** < 8MB (khuyến nghị < 1MB)

### Twitter Card
- **Kích thước:** 1200 x 675 pixels (16:9)
- Hoặc dùng chung với OG image 1200x630

## Testing

### 1. Test local
Sau khi thêm OG image, test bằng cách:
```bash
npm run build
npm start
```

### 2. Test với Facebook Debugger
**⚠️ Quan trọng:** Facebook không thể crawl localhost!

Cần deploy lên server trước:
1. Deploy lên Vercel/Netlify
2. Truy cập https://developers.facebook.com/tools/debug/
3. Nhập URL của bạn (VD: https://bandoxanh.vercel.app)
4. Click "Debug" để xem preview
5. Click "Scrape Again" nếu cần refresh cache

### 3. Test với LinkedIn
https://www.linkedin.com/post-inspector/

### 4. Test với Twitter
https://cards-dev.twitter.com/validator

## Checklist

- [x] Cập nhật OG meta tags trong `layout.tsx`
- [ ] Tạo file `public/og-image.png` (1200x630px)
- [ ] Update lại URL trong `layout.tsx` từ android-chrome sang og-image.png
- [ ] Deploy lên production
- [ ] Test với Facebook Debugger
- [ ] Clear Facebook cache nếu cần

## Nội dung gợi ý cho OG Image

**Text:**
- Logo/Tiêu đề: 🌱 BandoXanh
- Tagline: Nền tảng Tái chế & Bảo vệ Môi trường
- Mô tả: Cộng đồng xanh tại Việt Nam

**Màu sắc:**
- Primary: #10b981 (Brand Green)
- Background: Gradient từ #10b981 đến #059669
- Text: White với shadow để dễ đọc

**Icons/Elements:**
- ♻️ Recycling symbol
- 🌱 Plant/Leaf
- 📍 Location pin (cho tìm điểm thu gom)
- 🤝 Community

**Layout gợi ý:**
```
┌─────────────────────────────────────┐
│  🌱 BandoXanh                       │
│                                     │
│  Nền tảng Tái chế &                 │
│  Bảo vệ Môi trường                  │
│                                     │
│  Cộng đồng xanh tại Việt Nam        │
│                                     │
│  [♻️ Tái chế] [📍 Thu gom] [🤝]    │
└─────────────────────────────────────┘
```

## Lưu ý

1. **File name phải chính xác:** `og-image.png` (lowercase, có dấu gạch ngang)
2. **Vị trí:** Phải nằm trong thư mục `public/` 
3. **Không commit vào Git:** Thêm vào `.gitignore` nếu file quá lớn
4. **Deploy:** Phải deploy lên server public để Facebook có thể crawl
5. **Cache:** Facebook cache OG image trong 24-48h, dùng Debugger để force refresh

## Troubleshooting

**Vấn đề:** Facebook vẫn không hiển thị ảnh
**Giải pháp:**
1. Kiểm tra file `public/og-image.png` có tồn tại không
2. Kiểm tra URL trong `layout.tsx` đúng chưa
3. Deploy lên production
4. Dùng Facebook Debugger → Scrape Again
5. Đợi vài phút để Facebook cache update

**Vấn đề:** Ảnh bị mờ/vỡ
**Giải pháp:**
1. Đảm bảo kích thước đúng 1200x630px
2. Sử dụng PNG thay vì JPG để chất lượng tốt hơn
3. Không scale ảnh nhỏ hơn lên to

**Vấn đề:** Messenger vẫn chỉ hiện link
**Giải pháp:**
1. Website phải được deploy public (không phải localhost)
2. Clear cache bằng Facebook Debugger
3. Đợi 5-10 phút cho Facebook crawl lại
