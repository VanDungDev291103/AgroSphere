package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.UserAddressDTO;
import com.agricultural.agricultural.entity.User;
import com.agricultural.agricultural.entity.UserAddress;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-19T14:39:24+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class UserAddressMapperImpl implements UserAddressMapper {

    @Override
    public UserAddressDTO toDTO(UserAddress userAddress) {
        if ( userAddress == null ) {
            return null;
        }

        UserAddressDTO userAddressDTO = new UserAddressDTO();

        userAddressDTO.setUserId( userAddressUserId( userAddress ) );
        userAddressDTO.setId( userAddress.getId() );
        userAddressDTO.setAddress( userAddress.getAddress() );
        userAddressDTO.setCity( userAddress.getCity() );
        userAddressDTO.setCountry( userAddress.getCountry() );
        userAddressDTO.setPostalCode( userAddress.getPostalCode() );

        return userAddressDTO;
    }

    @Override
    public UserAddress toEntity(UserAddressDTO userAddressDTO) {
        if ( userAddressDTO == null ) {
            return null;
        }

        UserAddress userAddress = new UserAddress();

        userAddress.setId( userAddressDTO.getId() );
        userAddress.setAddress( userAddressDTO.getAddress() );
        userAddress.setCity( userAddressDTO.getCity() );
        userAddress.setCountry( userAddressDTO.getCountry() );
        userAddress.setPostalCode( userAddressDTO.getPostalCode() );

        return userAddress;
    }

    private int userAddressUserId(UserAddress userAddress) {
        if ( userAddress == null ) {
            return 0;
        }
        User user = userAddress.getUser();
        if ( user == null ) {
            return 0;
        }
        int id = user.getId();
        return id;
    }
}
