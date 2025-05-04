-- Tạo bảng subscription_plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_months INT NOT NULL,
    max_locations INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng user_subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    payment_amount DECIMAL(10, 2),
    payment_status VARCHAR(20),
    transaction_id VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    locations_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Thêm các gói đăng ký mặc định
INSERT INTO subscription_plans (name, description, price, duration_months, max_locations, is_active, is_free)
VALUES 
    ('Gói Miễn Phí', 'Theo dõi tối đa 3 địa điểm. Gói này hoàn toàn miễn phí.', 0.00, 12, 3, TRUE, TRUE),
    ('Gói Cơ Bản', 'Theo dõi tối đa 10 địa điểm. Phù hợp với người dùng cá nhân.', 50000.00, 1, 10, TRUE, FALSE),
    ('Gói Nâng Cao', 'Theo dõi tối đa 25 địa điểm. Phù hợp với các hộ sản xuất nhỏ.', 100000.00, 1, 25, TRUE, FALSE),
    ('Gói Chuyên Nghiệp', 'Theo dõi tối đa 50 địa điểm. Phù hợp với các doanh nghiệp vừa và nhỏ.', 200000.00, 1, 50, TRUE, FALSE),
    ('Gói Doanh Nghiệp', 'Theo dõi tối đa 100 địa điểm. Phù hợp với các doanh nghiệp lớn.', 500000.00, 1, 100, TRUE, FALSE);

-- Thêm gói tiết kiệm (6 tháng)
INSERT INTO subscription_plans (name, description, price, duration_months, max_locations, is_active, is_free)
VALUES 
    ('Gói Cơ Bản 6 Tháng', 'Theo dõi tối đa 10 địa điểm trong 6 tháng. Tiết kiệm 10%.', 270000.00, 6, 10, TRUE, FALSE),
    ('Gói Nâng Cao 6 Tháng', 'Theo dõi tối đa 25 địa điểm trong 6 tháng. Tiết kiệm 10%.', 540000.00, 6, 25, TRUE, FALSE),
    ('Gói Chuyên Nghiệp 6 Tháng', 'Theo dõi tối đa 50 địa điểm trong 6 tháng. Tiết kiệm 10%.', 1080000.00, 6, 50, TRUE, FALSE),
    ('Gói Doanh Nghiệp 6 Tháng', 'Theo dõi tối đa 100 địa điểm trong 6 tháng. Tiết kiệm 10%.', 2700000.00, 6, 100, TRUE, FALSE);

-- Thêm gói tiết kiệm (12 tháng)
INSERT INTO subscription_plans (name, description, price, duration_months, max_locations, is_active, is_free)
VALUES 
    ('Gói Cơ Bản 12 Tháng', 'Theo dõi tối đa 10 địa điểm trong 12 tháng. Tiết kiệm 20%.', 480000.00, 12, 10, TRUE, FALSE),
    ('Gói Nâng Cao 12 Tháng', 'Theo dõi tối đa 25 địa điểm trong 12 tháng. Tiết kiệm 20%.', 960000.00, 12, 25, TRUE, FALSE),
    ('Gói Chuyên Nghiệp 12 Tháng', 'Theo dõi tối đa 50 địa điểm trong 12 tháng. Tiết kiệm 20%.', 1920000.00, 12, 50, TRUE, FALSE),
    ('Gói Doanh Nghiệp 12 Tháng', 'Theo dõi tối đa 100 địa điểm trong 12 tháng. Tiết kiệm 20%.', 4800000.00, 12, 100, TRUE, FALSE); 