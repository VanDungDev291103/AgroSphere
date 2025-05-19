# Hướng dẫn thiết lập biến môi trường

Để chạy ứng dụng đúng cách, bạn cần thiết lập các biến môi trường chứa thông tin nhạy cảm như Client ID và Client Secret của Google OAuth.

## Tạo file .env

1. Tạo file `.env` trong thư mục `Backend/Agricultural/`
2. Thêm các biến môi trường sau vào file:

```
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
```

3. Thay thế các giá trị `your-google-client-id` và `your-google-client-secret` bằng thông tin thực tế từ Google Cloud Console

## Chú ý bảo mật

- File `.env` đã được thêm vào `.gitignore` để không vô tình commit thông tin nhạy cảm lên Git
- Không bao giờ commit các thông tin bí mật như Client ID, Client Secret hoặc API key trực tiếp vào mã nguồn
- Khi deploy ứng dụng lên server, sử dụng biến môi trường của server thay vì file .env 