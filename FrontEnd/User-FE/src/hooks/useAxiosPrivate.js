import { useEffect } from "react";
import useAuth from "./useAuth";
import { axiosPrivate } from "../services/api/axios";
import { toast } from "react-toastify";

const useAxiosPrivate = () => {
  const { auth } = useAuth();

  useEffect(() => {
    // Tránh log token đầy đủ ra console
    if (auth?.accessToken) {
      console.log("Auth token in useAxiosPrivate: Có token");
    } else {
      console.log("Auth token in useAxiosPrivate: Không có token");
    }
    
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
          console.log("Đã gắn token vào request");
        }
        return config;
      },
      (error) => {
        console.error("Lỗi khi gửi request:", error);
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Ghi log lỗi có kiểm tra
        if (error?.response) {
          console.error("Lỗi response:", error.response.status, error.response.data);
        } else {
          console.error("Lỗi không có response:", error.message);
        }
        
        // Kiểm tra lỗi 401 Unauthorized
        if (error?.response?.status === 401) {
          console.log("Phát hiện lỗi 401, chuyển hướng về trang đăng nhập");
          // Hiển thị thông báo
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          // Delay đôi chút trước khi chuyển hướng
          setTimeout(() => {
            window.location.href = "/account/login";
          }, 1000);
        }
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
