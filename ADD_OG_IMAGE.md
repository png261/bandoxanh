# 📸 Cách thêm OG Image vào project

## ✅ Code đã được cập nhật

File `app/layout.tsx` đã được cấu hình để sử dụng `/og-image.jpg`

## 🎯 Bước tiếp theo

### Cách 1: Copy thủ công
1. Lưu ảnh BandoXanh với tên: **og-image.jpg**
2. Copy vào thư mục: `/Users/png/Downloads/bandoxanh (3)/public/`
3. Xong!

### Cách 2: Sử dụng terminal
```bash
# Nếu ảnh đang ở Downloads
cp ~/Downloads/og-image.jpg "/Users/png/Downloads/bandoxanh (3)/public/"

# Hoặc kéo thả file vào thư mục public trong VS Code
```

## 🔍 Kiểm tra

Sau khi copy xong, chạy:
```bash
cd "/Users/png/Downloads/bandoxanh (3)"
ls -la public/ | grep og-image
```

Bạn sẽ thấy:
```
-rw-r--r--  1 user  staff  XXXXX  og-image.jpg
```

## 📝 Thông tin ảnh

- **File name:** og-image.jpg
- **Kích thước:** 851 x 315 pixels (Facebook cover size)
- **Format:** JPG
- **Location:** public/og-image.jpg

## 🚀 Deploy

Sau khi thêm ảnh:
1. Commit code
2. Deploy lên production
3. Test với Facebook Debugger: https://developers.facebook.com/tools/debug/

## ✨ Kết quả

Khi share link website lên Messenger/Facebook, sẽ hiển thị:
- ✅ Hình ảnh logo BandoXanh đẹp mắt
- ✅ Tiêu đề: BandoXanh - Nền tảng Tái chế & Bảo vệ Môi trường
- ✅ Mô tả ngắn gọn về website

---

**Lưu ý:** Ảnh phải nằm trong thư mục `public/` để Next.js có thể serve được!
