// cartCreate
export const createCart = async (axiosPrivate, productId, quantity, couponCode = null, isFlashSale = false, flashSalePrice = null) => {
  try {
    // Tạo params với các tham số bắt buộc
    const params = {
      productId,
      quantity
    };

    // Thêm coupon nếu có
    if (couponCode) {
      params.couponCode = couponCode;
    }

    // Thêm thông tin flash sale nếu có
    if (isFlashSale && flashSalePrice) {
      params.isFlashSale = true;
      params.flashSalePrice = flashSalePrice;
    }

    // Sử dụng params thay vì body
    const response = await axiosPrivate.post("/cart/items", null, {
      params: params
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw error;
  }
};

// getCart
export const getCart = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get("/cart");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// deleteCartItems
export const deleteCartItems = async (axiosPrivate, itemId) => {
  try {
    const response = await axiosPrivate.delete(`/cart/items/${itemId}`);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// updateCartItem
export const updateCartItem = async (axiosPrivate, itemId, quantity) => {
  try {
    const response = await axiosPrivate.put(`/cart/items/${itemId}`, null, {
      params: {
        quantity,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// updateCartItemQty
export const updateCartItemQty = async (
  axiosPrivate,
  cartItemId,
  quantity
) => {
  try {
    const response = await axiosPrivate.put(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    throw error;
  }
};

// deleteCartItem
export const deleteCartItem = async (axiosPrivate, cartItemId) => {
  try {
    const response = await axiosPrivate.delete(`/cart/items/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    throw error;
  }
};
