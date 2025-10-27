# Cấu hình Facebook Sharing

Hướng dẫn cấu hình chức năng chia sẻ lên Facebook với Open Graph meta tags.

## 1. Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Đăng nhập với tài khoản Facebook
3. Click **My Apps** → **Create App**
4. Chọn loại app: **Consumer** hoặc **Business**
5. Điền thông tin:
   - **App Name**: Tên ứng dụng (VD: BandoXanh)
   - **App Contact Email**: Email liên hệ

## 2. Cấu hình App Settings

### Basic Settings
1. Vào **Settings** → **Basic**
2. Sao chép **App ID** và **App Secret**
3. Thêm vào file `.env`:
   ```env
   NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
   FACEBOOK_APP_SECRET=your_app_secret_here
   ```

### App Domains
1. Scroll xuống **App Domains**
2. Thêm domain của bạn (không có http/https):
   - Development: `localhost` (Facebook không hỗ trợ)
   - Production: `bandoxanh.com`, `yourdomain.com`

### Website Platform
1. Click **Add Platform** → chọn **Website**
2. Nhập **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://bandoxanh.com`

## 3. Chuyển App sang Live Mode

### Yêu cầu trước khi Live:
1. **Privacy Policy URL**: Thêm URL chính sách bảo mật
   - Vào **Settings** → **Basic** → **Privacy Policy URL**
   - VD: `https://bandoxanh.com/privacy`

2. **App Category**: Chọn danh mục phù hợp
   - VD: "Environment & Recycling" hoặc "Community"

3. **App Icon**: Upload icon 1024x1024px

### Chuyển sang Live:
1. Ở đầu trang, click nút **App Mode**
2. Chuyển từ **Development** sang **Live**
3. Xác nhận các thông tin đã điền đầy đủ

## 4. Cách hoạt động

### Dynamic Share Routes
Ứng dụng sử dụng dynamic routes để tạo Open Graph meta tags riêng cho mỗi nội dung:

- **Posts**: `/share/post/[id]` → redirect về `/community?post=[id]`
- **News**: `/share/news/[id]` → redirect về `/news#article-[id]`
- **Events**: Sử dụng URL map trực tiếp

### Open Graph Meta Tags
Mỗi share route tự động generate:
- `og:title` - Tiêu đề bài viết
- `og:description` - Mô tả/excerpt
- `og:image` - Hình ảnh đầu tiên của post hoặc default image
- `og:type` - article
- `og:locale` - vi_VN

### Workflow:
1. User click nút "Chia sẻ"
2. ShareModal mở với URL: `/share/post/123`
3. User click Facebook
4. Facebook crawl `/share/post/123` để lấy OG tags
5. Hiển thị preview với title, description, và image
6. Sau khi share, URL tự động redirect về trang chính

## 5. Testing

### Development (localhost):
⚠️ **Facebook KHÔNG thể crawl localhost**

Giải pháp:
1. **Deploy lên Vercel/Netlify** (khuyến nghị)
2. **Sử dụng ngrok**: Tạo public URL tạm thời
   ```bash
   npx ngrok http 3000
   ```
   Sau đó thêm ngrok URL vào Facebook App Domains

### Production:
1. Deploy app lên domain public
2. Cập nhật `.env`:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Thêm domain vào Facebook App Settings
4. Test share:
   - Click nút share → chọn Facebook
   - Kiểm tra preview có hiển thị đầy đủ không

### Debug với Facebook Sharing Debugger:
1. Truy cập: https://developers.facebook.com/tools/debug/
2. Nhập URL share (VD: `https://yourdomain.com/share/post/1`)
3. Click **Debug** để xem Facebook đọc được gì
4. Click **Scrape Again** nếu cần refresh cache

## 6. Troubleshooting

### Issue: Facebook không hiển thị ảnh
**Giải pháp:**
- Kiểm tra ảnh có accessible từ public không
- Ảnh phải có kích thước tối thiểu 200x200px (khuyến nghị 1200x630px)
- Kiểm tra OG tags bằng Facebook Debugger

### Issue: "Can't load URL - domain not included"
**Giải pháp:**
- Thêm domain vào **App Domains** trong Facebook App Settings
- Thêm **Site URL** trong Website Platform
- Đảm bảo domain khớp chính xác (không có trailing slash)

### Issue: Nội dung không update khi share lại
**Giải pháp:**
- Facebook cache OG tags trong 24h
- Sử dụng Facebook Sharing Debugger → click **Scrape Again**
- Hoặc thêm query parameter: `?v=timestamp`

### Issue: Share từ localhost không hoạt động
**Giải pháp:**
- Facebook không thể access localhost
- Sử dụng ngrok hoặc deploy lên staging server
- Hoặc test các platform khác (Telegram, WhatsApp) trước

## 7. Best Practices

1. **Image Dimensions**: Sử dụng 1200x630px cho OG images
2. **Title**: Giới hạn 60-90 ký tự
3. **Description**: Giới hạn 150-200 ký tự
4. **URL Structure**: Sử dụng clean URLs, không có query parameters phức tạp
5. **Testing**: Luôn test với Facebook Debugger trước khi deploy

## 8. Environment Variables

File `.env` cần có:
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=1355636276138350
FACEBOOK_APP_SECRET=e5b40a416580be57a602d641737a1b36
NEXT_PUBLIC_APP_URL=https://bandoxanh.com
```

⚠️ **Lưu ý bảo mật:**
- KHÔNG commit file `.env` vào Git
- KHÔNG share App Secret publicly
- Sử dụng `.env.local` cho development
- Sử dụng environment variables của hosting platform cho production

## 9. Tài liệu tham khảo

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Open Graph Protocol](https://ogp.me/)
- [Facebook App Dashboard](https://developers.facebook.com/apps/)
- [Facebook Share Dialog Documentation](https://developers.facebook.com/docs/sharing/reference/share-dialog)
