package com.agricultural.agricultural.service.impl;

import com.agricultural.agricultural.config.VNPAYConfig;
import com.agricultural.agricultural.dto.request.PaymentRequest;
import com.agricultural.agricultural.dto.request.RefundRequest;
import com.agricultural.agricultural.dto.response.PaymentResponse;
import com.agricultural.agricultural.dto.response.PaymentUrlResponse;
import com.agricultural.agricultural.entity.Order;
import com.agricultural.agricultural.entity.Payment;
import com.agricultural.agricultural.entity.User;
import com.agricultural.agricultural.entity.enumeration.OrderStatus;
import com.agricultural.agricultural.entity.enumeration.PaymentStatus;
import com.agricultural.agricultural.exception.BadRequestException;
import com.agricultural.agricultural.exception.ResourceNotFoundException;
import com.agricultural.agricultural.repository.IOrderRepository;
import com.agricultural.agricultural.repository.IPaymentRepository;
import com.agricultural.agricultural.repository.IUserRepository;
import com.agricultural.agricultural.service.IPaymentService;
import com.agricultural.agricultural.utils.VNPayUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {

    private final IOrderRepository orderRepository;
    private final IPaymentRepository paymentRepository;
    private final IUserRepository userRepository;
    private final VNPAYConfig vnPayConfig;
    private final VNPayUtils vnPayUtils;

    @Value("${app.backend-url:http://localhost:8080}")
    private String backendBaseUrl;

    @Override
    @Transactional
    public PaymentUrlResponse processPayment(PaymentRequest paymentRequest) {
        if (paymentRequest.getOrderId() == null || paymentRequest.getAmount() == null) {
            throw new BadRequestException("OrderId và amount không được để trống");
        }

        String paymentMethod = paymentRequest.getPaymentMethod();
        if (paymentMethod == null) {
            throw new BadRequestException("Phương thức thanh toán không được để trống");
        }

        try {
            if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                return createVnpayPaymentUrl(paymentRequest);
            } else {
                Integer currentUserId = getCurrentUserId();
                if (currentUserId == null) {
                    throw new BadRequestException("Người dùng chưa đăng nhập");
                }

                Payment payment = new Payment();
                payment.setOrderId(Math.toIntExact(paymentRequest.getOrderId()));
                payment.setAmount(paymentRequest.getAmount());
                payment.setPaymentMethod(paymentMethod);
                payment.setDescription(paymentRequest.getDescription());
                payment.setStatus(PaymentStatus.PENDING);
                payment.setTransactionId(UUID.randomUUID().toString());
                payment.setPaymentId("PAY" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8));
                payment.setUserId(currentUserId);

                payment = paymentRepository.save(payment);

                PaymentUrlResponse response = new PaymentUrlResponse();
                response.setOrderId(Math.toIntExact(paymentRequest.getOrderId()));
                response.setAmount(paymentRequest.getAmount());
                response.setTransactionId(payment.getTransactionId());
                response.setPaymentUrl(backendBaseUrl + "/api/v1/payment/check-return?transactionId=" + payment.getTransactionId());

                return response;
            }
        } catch (Exception e) {
            log.error("Lỗi khi xử lý thanh toán: ", e);
            throw new BadRequestException("Không thể xử lý thanh toán lúc này, vui lòng thử lại sau");
        }
    }

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                if (authentication.getPrincipal() instanceof User) {
                    User user = (User) authentication.getPrincipal();
                    return user.getId();
                }

                String username = authentication.getName();
                Optional<User> userOpt = userRepository.findByUserName(username);
                return userOpt.map(User::getId).orElse(null);
            } catch (Exception e) {
                log.error("Lỗi khi lấy ID người dùng hiện tại: {}", e.getMessage());
                return null;
            }
        }
        return null;
    }

    private PaymentUrlResponse createVnpayPaymentUrl(PaymentRequest paymentRequest) {
        log.info("=== BẮT ĐẦU TẠO URL THANH TOÁN VNPAY ===");
        log.info("Tạo URL thanh toán VNPAY cho đơn hàng: {}", paymentRequest.getOrderId());
        log.info("Cấu hình VNPAY - TMN Code: {}, HashSecret: {}", vnPayConfig.getTmnCode(), vnPayConfig.getHashSecret());

        Order order = orderRepository.findById(Math.toIntExact(paymentRequest.getOrderId()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + paymentRequest.getOrderId()));

        Long amount = paymentRequest.getAmount() != null ? paymentRequest.getAmount() : order.getTotalAmount().longValue();
        String description = paymentRequest.getDescription();
        if (description == null || description.isEmpty()) {
            description = "Thanh toán đơn hàng #" + paymentRequest.getOrderId();
        }

        Integer currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            currentUserId = order.getBuyerId();
        }

        Payment payment = new Payment();
        payment.setOrderId(order.getId());
        payment.setAmount(amount);
        payment.setPaymentMethod("VNPAY");
        payment.setDescription(description);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentId("PAY" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8));
        payment.setUserId(currentUserId);

        payment = paymentRepository.save(payment);
        log.info("Đã tạo bản ghi Payment: orderId={}, amount={}, transactionId={}, paymentId={}", 
                 payment.getOrderId(), payment.getAmount(), payment.getTransactionId(), payment.getPaymentId());

        String returnUrl = backendBaseUrl + "/api/v1/payment/vnpay-return";
        String ipAddress = paymentRequest.getClientIp() != null ? paymentRequest.getClientIp() : "127.0.0.1";

        // Tạo URL thanh toán với VNPAY
        log.info("Tạo URL thanh toán VNPAY với returnUrl: {}, ipAddress: {}", returnUrl, ipAddress);
        String paymentUrl = vnPayUtils.createPaymentUrl(
                order.getId().longValue(),
                amount,
                description,
                returnUrl,
                ipAddress
        );
        
        // Trích xuất vnp_TxnRef từ URL tạo ra để lưu vào payment
        try {
            // URL có dạng: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...&vnp_TxnRef=44177281&...
            String vnp_TxnRef = null;
            if (paymentUrl.contains("vnp_TxnRef=")) {
                int startIdx = paymentUrl.indexOf("vnp_TxnRef=") + "vnp_TxnRef=".length();
                int endIdx = paymentUrl.indexOf("&", startIdx);
                if (endIdx == -1) endIdx = paymentUrl.length();
                vnp_TxnRef = paymentUrl.substring(startIdx, endIdx);
            }
            
            if (vnp_TxnRef != null) {
                log.info("Đã trích xuất vnp_TxnRef từ URL: {}", vnp_TxnRef);
                
                // Cập nhật thông tin vnp_TxnRef vào trường payment_note của Payment
                payment.setPaymentNote("vnp_TxnRef=" + vnp_TxnRef);
                paymentRepository.save(payment);
                log.info("Đã cập nhật vnp_TxnRef vào Payment note: {}", vnp_TxnRef);
            }
        } catch (Exception e) {
            // Bắt lỗi nhưng không dừng lại flow
            log.error("Lỗi khi trích xuất vnp_TxnRef: {}", e.getMessage());
        }
        
        log.info("URL thanh toán VNPAY đã được tạo: {}", paymentUrl);
        log.info("=== KẾT THÚC TẠO URL THANH TOÁN VNPAY ===");

        PaymentUrlResponse response = new PaymentUrlResponse();
        response.setOrderId((int) order.getId().longValue());
        response.setAmount(amount);
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentUrl(paymentUrl);

        return response;
    }


    @Override
    public PaymentResponse processRefund(RefundRequest refundRequest) {
        return PaymentResponse.builder()
                .success(true)
                .message("Hoàn tiền thành công")
                .transactionId(refundRequest.getTransactionId())
                .amount(refundRequest.getAmount())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public Optional<Payment> getPaymentHistory(Long orderId) {
        return paymentRepository.findByOrderIdOrderByCreatedAtDesc(Math.toIntExact(orderId));
    }

    @Override
    public PaymentResponse checkPaymentStatus(String transactionId) {
        try {
            Payment payment = paymentRepository.findByTransactionId(transactionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch với ID: " + transactionId));

            return PaymentResponse.builder()
                    .success(payment.getStatus() == PaymentStatus.COMPLETED)
                    .message("Trạng thái thanh toán: " + payment.getStatus().name())
                    .transactionId(transactionId)
                    .paymentMethod(payment.getPaymentMethod())
                    .amount(payment.getAmount())
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra trạng thái thanh toán: {}", e.getMessage());
            throw new BadRequestException("Không thể kiểm tra trạng thái thanh toán: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PaymentResponse processVnpayReturn(Map<String, String> vnpParams) {
        log.info("=== BẮT ĐẦU XỬ LÝ CALLBACK TỪ VNPAY ===");
        log.info("Tham số callback VNPAY: {}", vnpParams);
        log.info("Secure Hash từ VNPAY: {}", vnpParams.get("vnp_SecureHash"));
        
        boolean isValidSignature = vnPayUtils.validateVnpayCallback(vnpParams);
        log.info("Kết quả xác thực chữ ký: {}", isValidSignature ? "HỢP LỆ" : "KHÔNG HỢP LỆ");
        
        if (!isValidSignature) {
            log.error("Chữ ký không hợp lệ từ VNPAY callback");
            throw new BadRequestException("Chữ ký không hợp lệ");
        }

        String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
        String vnp_TxnRef = vnpParams.get("vnp_TxnRef");
        String vnp_TransactionNo = vnpParams.get("vnp_TransactionNo");
        log.info("Mã phản hồi: {}, Mã giao dịch: {}, Số giao dịch: {}", 
                 vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo);

        if (vnp_TxnRef == null || vnp_ResponseCode == null) {
            throw new BadRequestException("Thiếu thông tin giao dịch");
        }

        String orderId_str = vnp_TxnRef.replaceAll("\\d{6}$", "");
        log.info("Đã trích xuất orderId từ vnp_TxnRef: [{}] -> [{}]", vnp_TxnRef, orderId_str);
        
        if (orderId_str.isEmpty()) {
            log.error("Không thể trích xuất orderId từ vnp_TxnRef: {}", vnp_TxnRef);
            throw new BadRequestException("Mã giao dịch không hợp lệ");
        }
        
        Integer orderId;
        try {
            orderId = Integer.valueOf(orderId_str);
        } catch (NumberFormatException e) {
            log.error("Không thể chuyển đổi orderId từ chuỗi: {}", orderId_str);
            throw new BadRequestException("Mã đơn hàng không hợp lệ");
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        Optional<Payment> paymentOpt = paymentRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        if (paymentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy thanh toán cho đơn hàng: " + orderId);
        }

        Payment payment = paymentOpt.get();
        boolean isSuccess = "00".equals(vnp_ResponseCode);
        PaymentStatus paymentStatus = isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
        log.info("Cập nhật trạng thái thanh toán: {} - {}", paymentStatus, isSuccess ? "Thành công" : "Thất bại");

        payment.setStatus(paymentStatus);
        if (vnp_TransactionNo != null) {
            payment.setTransactionReference(vnp_TransactionNo);
        }

        paymentRepository.save(payment);

        if (isSuccess) {
            order.setStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);
            log.info("Cập nhật trạng thái đơn hàng thành PROCESSING");
        }
        
        log.info("=== KẾT THÚC XỬ LÝ CALLBACK TỪ VNPAY ===");

        return PaymentResponse.builder()
                .success(isSuccess)
                .message(isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại")
                .transactionId(payment.getTransactionId())
                .paymentMethod("VNPAY")
                .amount(payment.getAmount())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse processVnpayIpn(Map<String, String> vnpParams) {
        log.info("=== BẮT ĐẦU XỬ LÝ IPN TỪ VNPAY ===");
        log.info("Tham số IPN VNPAY: {}", vnpParams);
        log.info("Secure Hash từ VNPAY: {}", vnpParams.get("vnp_SecureHash"));

        try {
            boolean isValidSignature = vnPayUtils.validateVnpayCallback(vnpParams);
            log.info("Kết quả xác thực chữ ký IPN: {}", isValidSignature ? "HỢP LỆ" : "KHÔNG HỢP LỆ");
            
            if (!isValidSignature) {
                log.error("Chữ ký không hợp lệ từ VNPAY IPN");
                throw new BadRequestException("Chữ ký không hợp lệ");
            }

            String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
            String vnp_TxnRef = vnpParams.get("vnp_TxnRef");
            String vnp_TransactionNo = vnpParams.get("vnp_TransactionNo");
            log.info("Mã phản hồi IPN: {}, Mã giao dịch: {}, Số giao dịch: {}", 
                     vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo);

            if (vnp_TxnRef == null || vnp_ResponseCode == null) {
                throw new BadRequestException("Thiếu thông tin giao dịch");
            }

            String orderId_str = vnp_TxnRef.replaceAll("\\d{6}$", "");
            log.info("Đã trích xuất orderId từ vnp_TxnRef: [{}] -> [{}]", vnp_TxnRef, orderId_str);
            
            if (orderId_str.isEmpty()) {
                log.error("Không thể trích xuất orderId từ vnp_TxnRef: {}", vnp_TxnRef);
                throw new BadRequestException("Mã giao dịch không hợp lệ");
            }
            
            Integer orderId;
            try {
                orderId = Integer.valueOf(orderId_str);
            } catch (NumberFormatException e) {
                log.error("Không thể chuyển đổi orderId từ chuỗi: {}", orderId_str);
                throw new BadRequestException("Mã đơn hàng không hợp lệ");
            }

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

            Optional<Payment> paymentOpt = paymentRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
            if (paymentOpt.isEmpty()) {
                throw new ResourceNotFoundException("Không tìm thấy thanh toán cho đơn hàng: " + orderId);
            }

            Payment payment = paymentOpt.get();
            boolean isSuccess = "00".equals(vnp_ResponseCode);
            PaymentStatus paymentStatus = isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
            log.info("Cập nhật trạng thái thanh toán IPN: {} - {}", paymentStatus, isSuccess ? "Thành công" : "Thất bại");

            payment.setStatus(paymentStatus);
            if (vnp_TransactionNo != null) {
                payment.setTransactionReference(vnp_TransactionNo);
            }

            paymentRepository.save(payment);

            if (isSuccess) {
                order.setStatus(OrderStatus.PROCESSING);
                orderRepository.save(order);
                log.info("Cập nhật trạng thái đơn hàng IPN thành PROCESSING");
            }
            
            log.info("=== KẾT THÚC XỬ LÝ IPN TỪ VNPAY ===");

            return PaymentResponse.builder()
                    .success(isSuccess)
                    .message("IPN xử lý thành công")
                    .transactionId(payment.getTransactionId())
                    .paymentMethod("VNPAY")
                    .amount(payment.getAmount())
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi xử lý IPN từ VNPAY: {}", e.getMessage());
            throw new BadRequestException("Lỗi khi xử lý IPN: " + e.getMessage());
        }
    }
}
