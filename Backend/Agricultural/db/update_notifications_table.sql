-- Thêm cột redirect_url vào bảng notifications nếu chưa tồn tại
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS redirect_url VARCHAR(255) NULL; 