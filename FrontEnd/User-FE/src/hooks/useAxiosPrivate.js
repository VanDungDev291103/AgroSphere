import { axiosPrivate } from "@/services/api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();

  useEffect(() => {
    // Tránh log token đầy đủ ra console
    if (auth?.accessToken) {
      console.log("Auth token in useAxiosPrivate: Có token");
    } else {
      console.log("Auth token in useAxiosPrivate: Không có token", auth);
    }
    
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        // Luôn đặt token mới nhất vào header, bất kể đã có trước đó hay không
        if (auth?.accessToken) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
          console.log(`Đã thêm token vào request: ${config.method} ${config.url}`);
        } else {
          console.warn(`Request không có token: ${config.method} ${config.url}`);
        }
        
        return config;
      }, (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => {
        console.log("Response from:", response.config.url, "Status:", response.status);
        return response;
      },
      async (error) => {
        // Xử lý lỗi 401 Unauthorized
        if (error.response?.status === 401) {
          console.error("Lỗi 401 Unauthorized - Token không hợp lệ hoặc đã hết hạn");
          // Tùy chọn: Có thể thêm logic chuyển hướng đến trang đăng nhập
          // window.location.href = '/account/login';
        }
        console.error("Response error:", error);
        return Promise.reject(error);
      }
    );
    
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);
  
  return axiosPrivate;
};

export default useAxiosPrivate;
