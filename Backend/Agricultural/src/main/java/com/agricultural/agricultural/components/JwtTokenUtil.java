package com.agricultural.agricultural.components;

import com.agricultural.agricultural.entity.User;
import com.agricultural.agricultural.exception.BadRequestException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;

import java.security.Key;


import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private static final long expiration = 3600; // Token có hạn 1 giờ (3600 giây)
    
    @Value("${jwt.refreshExpiration:604800}") // 7 ngày mặc định
    private long refreshExpiration; 

    private static Key signInKey;

    @PostConstruct
    public void init() {
        signInKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    private Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    private String generateSecretKey() {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[32]; // 256-bit key
        random.nextBytes(keyBytes);
        String secretKey = Encoders.BASE64.encode(keyBytes);
        return secretKey;
    }

    public String generateToken(User user) throws Exception{
        //properties => claims
        Map<String, Object> claims = new HashMap<>();
        //this.generateSecretKey();
        claims.put("mail", user.getEmail());
        
        // Thêm role vào token
        claims.put("role", user.getRole().getRoleName());
        
        // Thêm dòng debug
        System.out.println("===== JWT TOKEN DEBUG =====");
        System.out.println("USER: " + user.getEmail());
        System.out.println("ROLE: " + user.getRole().getRoleName());
        
        try {
            String token = Jwts.builder()
                    .setClaims(claims) //how to extract claims from this ?
                    .setSubject(user.getEmail())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
            return token;
        }catch (Exception e) {
            throw new BadRequestException("Không thể tạo JWT token, lỗi: " + e.getMessage());
        }
    }
    
    // Tạo refresh token mới
    public String generateRefreshToken(User user) throws Exception {
        try {
            return Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration * 1000L))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new BadRequestException("Không thể tạo refresh token, lỗi: " + e.getMessage());
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public  <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractEmail(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null; // Xử lý ngoại lệ và trả về null
        }
    }

    public String extractPhoneNumber(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, String email) {
        try {
            String extractedEmail = extractEmail(token); // Gọi extractEmail và lưu kết quả
            
            // Thêm log để debug
            System.out.println("===== VALIDATE TOKEN DEBUG =====");
            System.out.println("Token: " + token.substring(0, 20) + "...");
            System.out.println("Email from token: " + extractedEmail);
            System.out.println("Email to compare: " + email);
            
            // Hiển thị thêm thông tin về claims trong token
            Claims claims = extractAllClaims(token);
            System.out.println("Token Claims: " + claims);
            System.out.println("Role in token: " + claims.get("role"));
            
            return extractedEmail != null && extractedEmail.equals(email) && !isTokenExpired(token);
        } catch (Exception e) {
            System.out.println("Error validating token: " + e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }
}
