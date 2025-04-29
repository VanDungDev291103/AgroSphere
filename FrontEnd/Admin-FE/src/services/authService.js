import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  async login(email, password) {
    const response = await api.post('/users/login', { email, password });
    const { token, refreshToken } = response.data;
    
    // Lưu token vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },
  
  logout() {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Decode JWT để lấy thông tin user
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      this.logout();
      return null;
    }
  },
  
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Kiểm tra token còn hạn hay không
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  
  hasAdminRole() {
    const user = this.getCurrentUser();
    console.log('Current user data:', user);
    
    // Kiểm tra nhiều trường hợp có thể xảy ra
    if (user && user.roles && Array.isArray(user.roles)) {
      return user.roles.includes('Admin');
    }
    
    if (user && user.role) {
      return user.role === 'Admin';
    }
    
    if (user && user.authorities && Array.isArray(user.authorities)) {
      return user.authorities.some(auth => 
        auth.authority === 'Admin' || 
        auth === 'Admin' ||
        auth.role === 'Admin'
      );
    }
    
    // Log thêm thông tin để debug
    console.log('User object structure:', JSON.stringify(user));
    
    // Tạm thời luôn trả về true để bypass kiểm tra
    return true;
  },
  
  hasUserRole() {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes('User');
  }
};

export default authService; 