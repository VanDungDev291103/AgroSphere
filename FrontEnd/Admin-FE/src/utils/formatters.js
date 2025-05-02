/**
 * Format a number as a currency string (VND)
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'N/A';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a date to a localized string
 * @param {string|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time
 * @returns {string} The formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return 'N/A';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  try {
    return new Date(date).toLocaleDateString('vi-VN', options);
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Hàm định dạng kích thước file
 * @param {number} bytes - Kích thước file tính bằng byte
 * @returns {string} - Chuỗi đã định dạng (ví dụ: 1.2 MB)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (value) => {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} salePrice - The sale price
 * @returns {number} The discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= 0) return 0;
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Hàm định dạng phần trăm
 * @param {number} number - Số cần định dạng
 * @param {number} decimalPlaces - Số chữ số thập phân
 * @returns {string} - Chuỗi đã định dạng (ví dụ: 12,34%)
 */
export const formatPercent = (number, decimalPlaces = 0) => {
  if (number === null || number === undefined) return '0%';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(number / 100); // Chia cho 100 vì đầu vào đã là phần trăm
};

/**
 * Hàm rút gọn văn bản
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Hàm chuyển đổi chuỗi thành slug
 * @param {string} text - Chuỗi cần chuyển đổi
 * @returns {string} - Slug đã chuyển đổi
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD') // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '') // loại bỏ dấu
    .replace(/[đĐ]/g, 'd') // đổi đ thành d
    .replace(/[^a-z0-9\s-]/g, '') // loại bỏ ký tự đặc biệt
    .replace(/[\s-]+/g, '-') // thay khoảng trắng và nhiều dấu gạch thành một dấu gạch
    .replace(/^-+|-+$/g, ''); // cắt dấu gạch ở đầu và cuối
}; 