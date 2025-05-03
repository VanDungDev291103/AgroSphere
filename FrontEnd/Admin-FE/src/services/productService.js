import api from './api';

const productService = {
  async getAllProducts(page = 0, size = 10) {
    try {
      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime();
      const response = await api.get(`/marketplace/products`, {
        params: { 
          page, 
          size,
          _t: timestamp // Tham số này sẽ khiến request luôn là mới
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getProductById(id) {
    try {
      const response = await api.get(`/marketplace/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async createProduct(productData) {
    try {
      const formData = new FormData();
      
      console.log("===== DEBUG: Tạo sản phẩm mới =====");
      console.log("Thông tin đầu vào:", productData);
      
      // Chuyển đổi FormData đã nhận được
      for (let [key, value] of productData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
        
        // Bỏ qua trường images và các giá trị chuỗi "null"
        if (key === 'images' || key === 'additionalImages') {
          console.log(`Bỏ qua trường ${key} để tránh lỗi chuyển đổi`);
          continue;
        }
        
        if (value === "null" || value === "undefined") {
          console.log(`Bỏ qua ${key} vì giá trị là chuỗi "${value}"`);
          continue;
        }
        
        // Xử lý các trường BẮT BUỘC
        if (key === 'productName') {
          console.log(`Thêm trường bắt buộc ${key}: ${value}`);
          formData.append('productName', value);
          continue;
        }
        
        if (key === 'price') {
          const priceValue = parseFloat(value) || 0;
          console.log(`Thêm trường bắt buộc ${key}: ${priceValue}`);
          formData.append('price', priceValue);
          continue;
        }
        
        // Xử lý quantity 
        if (key === 'quantity') {
          const quantityValue = parseInt(value, 10) || 0;
          console.log(`Đảm bảo quantity là số: ${quantityValue}`);
          formData.append('quantity', quantityValue);
          continue;
        }
        
        // Xử lý trường salePrice - khi giá trị là 0 hay rỗng thì cần gửi null để tắt giảm giá
        if (key === 'salePrice') {
          if (value === "" || value === "0" || value === 0) {
            console.log(`${key} = ${value} => Gửi null để backend xử lý TẮT giảm giá`);
            formData.append(key, null); // Gửi giá trị null để tắt giảm giá
          } else {
            const priceValue = parseFloat(value) || 0;
            console.log(`Đảm bảo ${key} là số: ${priceValue}`);
            formData.append(key, priceValue);
          }
          continue;
        }
        
        // Xử lý các trường ngày tháng
        if (key === 'saleStartDate' || key === 'saleEndDate') {
          if (value === "" || value === "0") {
            console.log(`${key} trống => Gửi "null" để backend xử lý`);
            formData.append(key, "null"); // Gửi chuỗi "null" để backend hiểu là null
          } else if (value === "null" || value === "undefined") {
            console.log(`${key} là chuỗi ${value} => Bỏ qua`);
            continue;
          } else {
            try {
              // Chuyển đổi sang chuỗi yyyy-MM-dd'T'HH:mm
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                console.log(`Đang thêm ${key} sau khi định dạng: ${formattedDate}`);
                formData.append(key, formattedDate);
              } else {
                console.log(`${key} có giá trị không hợp lệ (${value}), không thể chuyển đổi thành ngày`);
              }
            } catch (err) {
              console.error(`Lỗi khi chuyển đổi ${key}:`, err);
            }
          }
          continue;
        }
        
        // Xử lý trường image
        if (key === 'image') {
          if (value instanceof File) {
            console.log("Đang xử lý file ảnh:", value.name, "Loại:", value.type);
            formData.append('imageFile', value); // Đổi tên trường thành 'imageFile' để phù hợp với backend
          } else {
            console.log(`Dữ liệu ${key} không phải File, bỏ qua`);
          }
          continue;
        }
        
        // Xử lý các trường khác
        console.log(`Đang thêm ${key}: ${value}`);
        formData.append(key, value);
      }
      
      // Log tất cả các trường trong FormData để debug
      console.log("===== DEBUG: FormData sau khi xử lý =====");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await api.post('/marketplace/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("===== DEBUG: Server response =====");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      
      // Sau khi tạo thành công, làm mới trạng thái
      try {
        console.log("Làm mới trạng thái sản phẩm sau khi tạo...");
        await this.refreshAllStockStatus();
        console.log("Đã làm mới trạng thái thành công");
      } catch (refreshError) {
        console.error("Lỗi khi làm mới trạng thái sản phẩm:", refreshError);
      }
      
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      // Log chi tiết lỗi để debug
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      }
      throw error;
    }
  },
  
  async updateProduct(id, productData) {
    try {
      const formData = new FormData();
      
      console.log("===== DEBUG: productData trước khi xử lý =====");
      
      // Thêm timestamp để đảm bảo không bị cache
      const timestamp = new Date().getTime();
      formData.append("timestamp", timestamp.toString());
      
      // Chuyển đổi FormData đã nhận được
      for (let [key, value] of productData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
        
        // Bỏ qua trường images và các giá trị chuỗi "null"
        if (key === 'images' || key === 'additionalImages') {
          console.log(`Bỏ qua trường ${key} để tránh lỗi chuyển đổi`);
          continue;
        }
        
        if (value === "null" || value === "undefined") {
          console.log(`Bỏ qua ${key} vì giá trị là chuỗi "${value}"`);
          continue;
        }
        
        // ĐẢM BẢO CÁC TRƯỜNG BẮT BUỘC
        if (key === 'productName') {
          console.log(`Thêm trường bắt buộc ${key}: ${value}`);
          formData.append('productName', value);
          continue;
        }
        
        if (key === 'price') {
          const priceValue = parseFloat(value) || 0;
          console.log(`Thêm trường bắt buộc ${key}: ${priceValue}`);
          formData.append('price', priceValue);
          continue;
        }
        
        // Xử lý trường hợp đặc biệt cho quantity - đảm bảo là số
        if (key === 'quantity') {
          const quantityValue = parseInt(value, 10) || 0;
          console.log(`Đảm bảo quantity là số: ${quantityValue}`);
          formData.append(key, quantityValue);
          continue;
        } 
        
        // Xử lý trường salePrice - khi giá trị là 0 hay rỗng thì cần gửi null để tắt giảm giá
        if (key === 'salePrice') {
          if (value === "" || value === "0" || value === 0) {
            console.log(`${key} = ${value} => Gửi null để backend xử lý TẮT giảm giá`);
            formData.append(key, "null"); // Gửi chuỗi "null" để tắt giảm giá
          } else {
            const priceValue = parseFloat(value) || 0;
            console.log(`Đảm bảo ${key} là số: ${priceValue}`);
            formData.append(key, priceValue);
          }
          continue;
        }
        
        // Xử lý các trường ngày tháng
        if (key === 'saleStartDate' || key === 'saleEndDate') {
          if (value === "" || value === "0") {
            console.log(`${key} trống => Gửi "null" để backend xử lý`);
            formData.append(key, "null"); // Gửi chuỗi "null" để backend hiểu là null
          } else if (value === "null" || value === "undefined") {
            console.log(`${key} là chuỗi ${value} => Bỏ qua`);
            continue;
          } else {
            try {
              // Chuyển đổi sang chuỗi yyyy-MM-dd'T'HH:mm
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                console.log(`Đang thêm ${key} sau khi định dạng: ${formattedDate}`);
                formData.append(key, formattedDate);
              } else {
                console.log(`${key} có giá trị không hợp lệ (${value}), không thể chuyển đổi thành ngày`);
              }
            } catch (err) {
              console.error(`Lỗi khi chuyển đổi ${key}:`, err);
            }
          }
          continue;
        }
        
        // XỬ LÝ TRƯỜNG IMAGE - ĐẢM BẢO ĐÚNG TÊN TRƯỜNG 
        if (key === 'image' || key === 'imageFile') {
          if (value instanceof File) {
            console.log("Đang xử lý file ảnh:", value.name, "Loại:", value.type, "Kích thước:", value.size);
            formData.append('imageFile', value);  // Đổi tên trường thành 'imageFile' để phù hợp với backend
            console.log("ĐÃ THÊM FILE ẢNH MỚI");
          } else {
            console.log(`Dữ liệu ${key} không phải File, bỏ qua`);
          }
          continue;
        }
        
        // Xử lý các trường khác
        console.log(`Đang thêm ${key}: ${value}`);
        formData.append(key, value);
      }
      
      // Thêm log chi tiết
      console.log("===== DEBUG: FormData sau khi xử lý cho cập nhật =====");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Gửi yêu cầu cập nhật với cache-busting headers và endpoint đúng
      const response = await api.put(`/marketplace/update/${id}?_t=${timestamp}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log("===== DEBUG: Kết quả cập nhật từ server =====");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      
      // Sau khi cập nhật thành công, làm mới trạng thái
      try {
        console.log("Làm mới trạng thái sản phẩm sau khi cập nhật...");
        await this.refreshAllStockStatus();
        console.log("Đã làm mới trạng thái thành công");
      } catch (refreshError) {
        console.error("Lỗi khi làm mới trạng thái sản phẩm:", refreshError);
      }
      
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      // Log chi tiết lỗi để debug
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      }
      throw error;
    }
  },
  
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/marketplace/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getAllCategories() {
    try {
      const response = await api.get('/product-categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async createCategory(categoryData) {
    try {
      const formData = new FormData();
      
      // Thêm các trường dữ liệu vào formData
      Object.keys(categoryData).forEach(key => {
        if (key === 'image') {
          if (categoryData[key] && categoryData[key] instanceof File) {
            formData.append('image', categoryData[key]);
          }
        } else if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      
      const response = await api.post('/product-categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async updateCategory(id, categoryData) {
    try {
      const formData = new FormData();
      
      // Thêm các trường dữ liệu vào formData
      Object.keys(categoryData).forEach(key => {
        if (key === 'image') {
          if (categoryData[key] && categoryData[key] instanceof File) {
            formData.append('image', categoryData[key]);
          }
        } else if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      
      const response = await api.put(`/product-categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/product-categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async advancedSearch(filters, page = 0, size = 10) {
    try {
      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime();
      const response = await api.get('/marketplace/advanced-search', {
        params: {
          ...filters,
          page,
          size,
          _t: timestamp // Tham số này sẽ khiến request luôn là mới
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async uploadProductImages(productId, files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await api.post(`/product-images/product/${productId}/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getProductImages(productId) {
    try {
      const response = await api.get(`/product-images/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteProductImage(imageId) {
    try {
      const response = await api.delete(`/product-images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Thêm phương thức mới để force refresh dữ liệu sản phẩm
  async forceRefreshProducts(page = 0, size = 10) {
    try {
      const timestamp = new Date().getTime();
      const response = await api.get(`/marketplace/products`, {
        params: { 
          page, 
          size,
          force: true,
          _t: timestamp
        },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      console.log("Forced refresh data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi force refresh dữ liệu:", error);
      throw error;
    }
  },
  
  async refreshProductsData() {
    try {
      console.log("Gửi yêu cầu làm mới dữ liệu sản phẩm...");
      
      // Thêm timestamp để đảm bảo không gọi từ cache
      const timestamp = new Date().getTime();
      
      // Gọi API endpoint để làm mới dữ liệu
      const response = await api.post(`/marketplace/admin/refresh-products?_t=${timestamp}`, null, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log("Kết quả làm mới dữ liệu:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu sản phẩm:", error);
      throw error;
    }
  },
  
  // Thêm phương thức mới để force refresh trạng thái tồn kho và thông tin giảm giá cho tất cả sản phẩm
  async refreshAllStockStatus() {
    try {
      console.log("Gửi yêu cầu làm mới trạng thái hàng của tất cả sản phẩm...");
      
      // Thêm timestamp để đảm bảo không gọi từ cache
      const timestamp = new Date().getTime();
      
      // Gọi API endpoint để làm mới trạng thái hàng
      const response = await api.post(`/marketplace/admin/refresh-stock-status?_t=${timestamp}`, null, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log("Kết quả làm mới trạng thái hàng:", response.data);
      
      // Xóa cache của các API khác bằng cách gọi với query param mới
      await this.forceRefreshProducts(0, 10);
      
      // Nếu có bất kỳ ảnh sản phẩm nào đang hiển thị trên trang, thêm tham số timestamp vào URL
      // để buộc trình duyệt tải lại ảnh mới
      const productImages = document.querySelectorAll('img[src*="cloudinary"]');
      productImages.forEach(img => {
        const currentSrc = img.src;
        // Nếu URL đã có tham số query, thêm timestamp
        if (currentSrc.includes('?')) {
          img.src = `${currentSrc}&_t=${timestamp}`;
        } else {
          img.src = `${currentSrc}?_t=${timestamp}`;
        }
        console.log(`Đã thêm timestamp cho ảnh: ${img.src}`);
      });
      
      return response.data;
    } catch (error) {
      console.error("Lỗi khi làm mới trạng thái hàng:", error);
      throw error;
    }
  }
};

export default productService; 