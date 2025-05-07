import axios from "axios";
import { toast } from "react-toastify";

// Kiểm tra môi trường và sử dụng URL phù hợp
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Các URL API có thể dùng (để thử kết nối)
const API_URLS = {
  dev: [
    "http://localhost:8080/api/v1"   // Chỉ dùng port 8080
  ],
  prod: [
    "https://e42a-14-191-241-100.ngrok-free.app/api/v1"
  ]
};

// Lấy danh sách URLs sẽ thử
const apiUrlsToTry = isDevelopment ? API_URLS.dev : API_URLS.prod;

// URL mặc định ban đầu
let currentApiUrlIndex = 0;
let API_URL = apiUrlsToTry[currentApiUrlIndex];
const API_TIMEOUT = 20000; // Tăng timeout lên 20 giây

console.log(`API URL: ${API_URL}`);

// Cấu hình Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Thêm interceptor request để log request
axiosInstance.interceptors.request.use(
  (config) => {
    // Cập nhật baseURL mới nhất cho mỗi request
    config.baseURL = API_URL;
    
    // Chỉ log các API call quan trọng và không gây nhiễu
    if (!config.url.includes('/posts') && !config.url.includes('/users') && !config.url.includes('/hashtags')) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Thêm interceptor response để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xem xét lỗi kết nối và thử URL khác nếu cần
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.warn("Lỗi kết nối:", error.message);
      
      // Hiển thị thông báo lỗi chỉ một lần thay vì cho mỗi request
      if (!window.hasShownConnectionError) {
        window.hasShownConnectionError = true;
        toast.error(
          "Không thể kết nối đến máy chủ Backend tại " + API_URL + ". Vui lòng kiểm tra nếu server đã được khởi động.",
          { autoClose: 10000 } // Hiển thị lâu hơn (10 giây)
        );
        
        // Reset flag sau 10 giây để cho phép hiển thị lại thông báo nếu vẫn lỗi
        setTimeout(() => {
          window.hasShownConnectionError = false;
        }, 10000);
      }
    } else if (error.response) {
      // Có phản hồi từ server nhưng status code không phải 2xx
      // Chỉ log lỗi 500 và các lỗi nghiêm trọng khác, bỏ qua lỗi 401/404 thông thường
      if (error.response.status >= 500) {
        console.error(`Lỗi server ${error.response.status}:`, error.response.data);
        
        // Hiển thị toast chỉ cho lỗi server
        if (!window.hasShownServerError) {
          window.hasShownServerError = true;
          toast.error("Lỗi máy chủ, vui lòng thử lại sau.", { autoClose: 5000 });
          
          // Reset flag sau 5 giây
          setTimeout(() => {
            window.hasShownServerError = false;
          }, 5000);
        }
      }
      
      // Xử lý các lỗi phổ biến
      if (error.response.status === 401) {
        console.warn("Lỗi xác thực, cần đăng nhập lại");
      } else if (error.response.status === 403) {
        toast.error("Bạn không có quyền thực hiện thao tác này.");
      }
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true,
  timeout: API_TIMEOUT,
});

// Thêm interceptor request cho axiosPrivate
axiosPrivate.interceptors.request.use(
  (config) => {
    // Cập nhật baseURL mới nhất cho mỗi request
    config.baseURL = API_URL;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response cho axiosPrivate
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xem xét lỗi kết nối
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.warn("Lỗi kết nối (Private):", error.message);
      
      // Hiển thị thông báo lỗi chỉ một lần thay vì cho mỗi request
      if (!window.hasShownConnectionError) {
        window.hasShownConnectionError = true;
        toast.error(
          "Không thể kết nối đến máy chủ Backend tại " + API_URL + ". Vui lòng kiểm tra nếu server đã được khởi động.",
          { autoClose: 10000 } // Hiển thị lâu hơn (10 giây)
        );
        
        // Reset flag sau 10 giây để cho phép hiển thị lại thông báo nếu vẫn lỗi
        setTimeout(() => {
          window.hasShownConnectionError = false;
        }, 10000);
      }
    }
    
    // Các lỗi khác sẽ được xử lý bởi useAxiosPrivate hook
    return Promise.reject(error);
  }
);

export default axiosInstance;