import api from './api';

const productService = {
  async getAllProducts(page = 0, size = 10) {
    try {
      const response = await api.get(`/products`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
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
      const response = await api.post('/product-categories', categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/product-categories/${id}`, categoryData);
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
  }
};

export default productService; 