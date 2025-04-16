-- Thêm cột deleted vào bảng cart
ALTER TABLE cart ADD COLUMN deleted BOOLEAN DEFAULT FALSE;

-- Cập nhật các giỏ hàng hiện tại để đảm bảo chúng không bị xóa
UPDATE cart SET deleted = FALSE WHERE deleted IS NULL; 