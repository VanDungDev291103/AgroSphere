package com.agricultural.agricultural.service.impl;

import com.agricultural.agricultural.dto.UserAddressDTO;
import com.agricultural.agricultural.entity.User;
import com.agricultural.agricultural.entity.UserAddress;
import com.agricultural.agricultural.mapper.UserAddressMapper;
import com.agricultural.agricultural.repository.IUserAddressRepository;
import com.agricultural.agricultural.repository.IUserRepository;
import com.agricultural.agricultural.service.IUserAddressService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserAddressService implements IUserAddressService {
    private final IUserAddressRepository addressRepository;
    private final IUserRepository userRepository;
    private final UserAddressMapper userAddressMapper;

    /**
     * Thêm địa chỉ mới cho User
     */
    @Override
    @Transactional
    public UserAddressDTO addAddress(UserAddressDTO addressDTO) {
        // Lấy userId từ DTO
        Integer userId = addressDTO.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với ID: " + userId));
        
        UserAddress userAddress = userAddressMapper.toEntity(addressDTO);
        userAddress.setUser(user);

        userAddress = addressRepository.save(userAddress);
        return userAddressMapper.toDTO(userAddress);
    }

    /**
     * Cập nhật địa chỉ
     */
    @Override
    @Transactional
    public UserAddressDTO updateAddress(int addressId, UserAddressDTO addressDTO) {
        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

        // Cập nhật thông tin địa chỉ
        address.setAddress(addressDTO.getAddress());
        address.setCity(addressDTO.getCity());
        address.setCountry(addressDTO.getCountry());
        address.setPostalCode(addressDTO.getPostalCode());
        // Không thay đổi User

        UserAddress updatedAddress = addressRepository.save(address);
        return userAddressMapper.toDTO(updatedAddress);
    }

    /**
     * Xóa địa chỉ theo ID
     */
    @Override
    @Transactional
    public void deleteAddress(int addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new EntityNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId);
        }
        addressRepository.deleteById(addressId);
    }

    /**
     * Lấy tất cả địa chỉ của User
     */
    @Override
    public List<UserAddressDTO> getUserAddresses(int userId) {
        // Kiểm tra người dùng có tồn tại không
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("Không tìm thấy người dùng với ID: " + userId);
        }
        
        return addressRepository.findByUserId(userId)
                .stream()
                .map(userAddressMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy địa chỉ theo ID
     */
    @Override
    public UserAddressDTO getAddressById(int addressId) {
        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

        return userAddressMapper.toDTO(address);
    }
}
