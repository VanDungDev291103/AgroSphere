/**
 * API services cho người dùng
 */

// Lấy danh sách người dùng
export const getAllUsers = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/users');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

// Lấy chi tiết người dùng
export const getUserById = async (axiosPrivate, userId) => {
  try {
    const response = await axiosPrivate.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin người dùng ID ${userId}:`, error);
    throw error;
  }
};

// Tìm kiếm người dùng theo tên
export const searchUsersByName = async (axiosPrivate, name) => {
  try {
    const response = await axiosPrivate.get('/users/findByName', {
      params: { name }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi tìm kiếm người dùng với tên "${name}":`, error);
    throw error;
  }
};

// Lấy danh sách gợi ý kết nối (dựa trên vai trò, lĩnh vực quan tâm)
export const getSuggestedConnections = async (axiosPrivate, limit = 5) => {
  try {
    // Gọi API lấy tất cả người dùng (trong thực tế cần API riêng cho gợi ý)
    const response = await axiosPrivate.get('/users', {
      params: { limit }
    });
    
    // Nếu API trả về cấu trúc dạng { data: [...] }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy gợi ý kết nối:', error);
    return [];
  }
};

// Các chức năng kết nối người dùng

// Gửi yêu cầu kết nối đến người dùng
export const sendConnectionRequest = async (axiosPrivate, targetUserId) => {
  try {
    const response = await axiosPrivate.post(`/connections/request/${targetUserId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi gửi yêu cầu kết nối đến người dùng ID ${targetUserId}:`, error);
    throw error;
  }
};

// Chấp nhận yêu cầu kết nối
export const acceptConnectionRequest = async (axiosPrivate, requesterId) => {
  try {
    const response = await axiosPrivate.put(`/connections/accept/${requesterId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi chấp nhận yêu cầu kết nối từ người dùng ID ${requesterId}:`, error);
    throw error;
  }
};

// Từ chối yêu cầu kết nối
export const rejectConnectionRequest = async (axiosPrivate, requesterId) => {
  try {
    const response = await axiosPrivate.put(`/connections/reject/${requesterId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi từ chối yêu cầu kết nối từ người dùng ID ${requesterId}:`, error);
    throw error;
  }
};

// Xóa kết nối với người dùng
export const removeConnection = async (axiosPrivate, connectedUserId) => {
  try {
    const response = await axiosPrivate.delete(`/connections/${connectedUserId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa kết nối với người dùng ID ${connectedUserId}:`, error);
    throw error;
  }
};

// Chặn người dùng
export const blockUser = async (axiosPrivate, targetUserId) => {
  try {
    const response = await axiosPrivate.post(`/connections/block/${targetUserId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi chặn người dùng ID ${targetUserId}:`, error);
    throw error;
  }
};

// Bỏ chặn người dùng
export const unblockUser = async (axiosPrivate, targetUserId) => {
  try {
    const response = await axiosPrivate.delete(`/connections/unblock/${targetUserId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi bỏ chặn người dùng ID ${targetUserId}:`, error);
    throw error;
  }
};

// Lấy danh sách kết nối của người dùng hiện tại
export const getUserConnections = async (axiosPrivate, page = 0, size = 10) => {
  try {
    const response = await axiosPrivate.get('/connections', {
      params: { page, size }
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kết nối:', error);
    throw error;
  }
};

// Lấy danh sách yêu cầu kết nối đang chờ
export const getPendingConnectionRequests = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/connections/pending');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu cầu kết nối đang chờ:', error);
    throw error;
  }
};

// Kiểm tra trạng thái kết nối với người dùng khác
export const checkConnectionStatus = async (axiosPrivate, targetUserId) => {
  try {
    const response = await axiosPrivate.get(`/connections/check/${targetUserId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi kiểm tra trạng thái kết nối với người dùng ID ${targetUserId}:`, error);
    return false;
  }
};

// Đếm số lượng kết nối của người dùng
export const countUserConnections = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/connections/count');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi đếm số lượng kết nối:', error);
    return 0;
  }
};

// Lấy ID của tất cả người dùng đã kết nối
export const getConnectedUserIds = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/connections/connected-ids');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy ID của tất cả người dùng đã kết nối:', error);
    return [];
  }
};
