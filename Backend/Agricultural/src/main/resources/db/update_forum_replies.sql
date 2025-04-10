-- Thêm các cột để hỗ trợ bình luận phân cấp giống Facebook

-- Thêm cột parent_id để hỗ trợ bình luận phân cấp (bình luận cha-con)
ALTER TABLE forum_replies 
ADD COLUMN parent_id INT NULL,
ADD CONSTRAINT fk_forum_replies_parent 
    FOREIGN KEY (parent_id) REFERENCES forum_replies(id) 
    ON DELETE CASCADE;

-- Thêm cột created_at và updated_at để theo dõi thời gian 
ALTER TABLE forum_replies
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Thêm cột like_count để theo dõi số lượt thích cho mỗi bình luận
ALTER TABLE forum_replies
ADD COLUMN like_count INT NOT NULL DEFAULT 0;

-- Thêm cột is_deleted để hỗ trợ xóa mềm
ALTER TABLE forum_replies
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Tạo chỉ mục để tối ưu hiệu suất
CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX idx_forum_replies_parent_id ON forum_replies(parent_id);
CREATE INDEX idx_forum_replies_created_at ON forum_replies(created_at); 