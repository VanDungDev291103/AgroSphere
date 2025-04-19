-- Tạo bảng flash_sales
CREATE TABLE IF NOT EXISTS flash_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    discount_percentage INT NOT NULL,
    max_discount_amount DECIMAL(15, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT check_status CHECK (status IN ('UPCOMING', 'ACTIVE', 'ENDED', 'CANCELLED')),
    CONSTRAINT check_discount_percentage CHECK (discount_percentage BETWEEN 1 AND 100)
);

-- Tạo bảng flash_sale_items
CREATE TABLE IF NOT EXISTS flash_sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flash_sale_id INT NOT NULL,
    product_id INT NOT NULL,
    stock_quantity INT NOT NULL,
    sold_quantity INT NOT NULL DEFAULT 0,
    discount_price DECIMAL(15, 2) NOT NULL,
    original_price DECIMAL(15, 2) NOT NULL,
    discount_percentage INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_flash_sale FOREIGN KEY (flash_sale_id) REFERENCES flash_sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_flash_sale_product FOREIGN KEY (product_id) REFERENCES market_place(id) ON DELETE CASCADE,
    CONSTRAINT uq_flash_sale_product UNIQUE (flash_sale_id, product_id),
    CONSTRAINT check_stock_quantity CHECK (stock_quantity > 0),
    CONSTRAINT check_sold_quantity CHECK (sold_quantity >= 0),
    CONSTRAINT check_item_discount_percentage CHECK (discount_percentage BETWEEN 1 AND 100)
);

-- Tạo index để tăng hiệu suất truy vấn
CREATE INDEX idx_flash_sale_status ON flash_sales(status, start_time, end_time);
CREATE INDEX idx_flash_sale_time ON flash_sales(start_time, end_time);
CREATE INDEX idx_flash_sale_items_product ON flash_sale_items(product_id);
CREATE INDEX idx_flash_sale_items_flash_sale ON flash_sale_items(flash_sale_id); 