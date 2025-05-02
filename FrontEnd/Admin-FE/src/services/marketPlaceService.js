import api from './api';

const marketPlaceService = {
  /**
   * Lấy danh sách sản phẩm (phân trang)
   * @param {number} page - Số trang (bắt đầu từ 0)
   * @param {number} size - Kích thước trang
   * @param {string} sort - Trường cần sắp xếp
   * @returns {Promise} - Promise chứa dữ liệu phân trang
   */
  getAllProducts: async (page = 0, size = 10, sort = 'id,desc') => {
    try {
      const response = await api.get(`/marketplace/products`, {
        params: { page, size, sort }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin sản phẩm theo ID
   * @param {number} id - ID của sản phẩm
   * @returns {Promise} - Promise chứa thông tin sản phẩm
   */
  getProductById: async (id) => {
    try {
      const response = await api.get(`/marketplace/product/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product #${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo sản phẩm mới
   * @param {FormData} formData - FormData chứa thông tin sản phẩm
   * @returns {Promise} - Promise chứa thông tin sản phẩm được tạo
   */
  createProduct: async (formData) => {
    try {
      const response = await api.post('/marketplace/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Cập nhật sản phẩm
   * @param {number} id - ID của sản phẩm
   * @param {FormData} formData - FormData chứa thông tin sản phẩm
   * @returns {Promise} - Promise chứa thông tin sản phẩm sau khi cập nhật
   */
  updateProduct: async (id, formData) => {
    try {
      const response = await api.put(`/marketplace/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product #${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa sản phẩm
   * @param {number} id - ID của sản phẩm cần xóa
   * @returns {Promise} - Promise kết quả xóa
   */
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/marketplace/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product #${id}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sản phẩm
   * @param {string} keyword - Từ khóa tìm kiếm
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise} - Promise chứa kết quả tìm kiếm
   */
  searchProducts: async (keyword, page = 0, size = 10) => {
    try {
      const response = await api.get(`/marketplace/search`, {
        params: { keyword, page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm theo danh mục
   * @param {number} categoryId - ID của danh mục
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  getProductsByCategory: async (categoryId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/marketplace/category/${categoryId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category #${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm nâng cao
   * @param {Object} filters - Bộ lọc tìm kiếm
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise} - Promise chứa kết quả tìm kiếm
   */
  advancedSearch: async (filters, page = 0, size = 10) => {
    try {
      const response = await api.get(`/marketplace/advanced-search`, {
        params: {
          ...filters,
          page,
          size
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm theo khoảng giá
   * @param {number} minPrice - Giá tối thiểu
   * @param {number} maxPrice - Giá tối đa
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  getProductsByPriceRange: async (minPrice, maxPrice, page = 0, size = 10) => {
    try {
      const response = await api.get(`/marketplace/price-range`, {
        params: {
          minPrice,
          maxPrice,
          page,
          size
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by price range:', error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm đang khuyến mãi
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  getOnSaleProducts: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/marketplace/on-sale`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching on sale products:', error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm phổ biến
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  getPopularProducts: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/marketplace/popular`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular products:', error);
      throw error;
    }
  }
};

export default marketPlaceService; 