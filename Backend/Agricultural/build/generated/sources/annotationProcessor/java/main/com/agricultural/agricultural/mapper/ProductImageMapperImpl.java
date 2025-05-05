package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.ProductImageDTO;
import com.agricultural.agricultural.entity.MarketPlace;
import com.agricultural.agricultural.entity.ProductImage;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-05T15:27:32+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class ProductImageMapperImpl implements ProductImageMapper {

    @Override
    public ProductImageDTO toDTO(ProductImage productImage) {
        if ( productImage == null ) {
            return null;
        }

        ProductImageDTO.ProductImageDTOBuilder productImageDTO = ProductImageDTO.builder();

        productImageDTO.productId( productImageProductId( productImage ) );
        productImageDTO.id( productImage.getId() );
        productImageDTO.imageUrl( productImage.getImageUrl() );
        if ( productImage.getIsPrimary() != null ) {
            productImageDTO.isPrimary( productImage.getIsPrimary() );
        }
        productImageDTO.displayOrder( productImage.getDisplayOrder() );
        productImageDTO.altText( productImage.getAltText() );
        productImageDTO.title( productImage.getTitle() );
        productImageDTO.createdAt( productImage.getCreatedAt() );

        return productImageDTO.build();
    }

    @Override
    public List<ProductImageDTO> toDTOList(List<ProductImage> productImages) {
        if ( productImages == null ) {
            return null;
        }

        List<ProductImageDTO> list = new ArrayList<ProductImageDTO>( productImages.size() );
        for ( ProductImage productImage : productImages ) {
            list.add( toDTO( productImage ) );
        }

        return list;
    }

    @Override
    public ProductImage toEntity(ProductImageDTO productImageDTO) {
        if ( productImageDTO == null ) {
            return null;
        }

        ProductImage.ProductImageBuilder productImage = ProductImage.builder();

        productImage.id( productImageDTO.getId() );
        productImage.imageUrl( productImageDTO.getImageUrl() );
        productImage.altText( productImageDTO.getAltText() );
        productImage.title( productImageDTO.getTitle() );
        productImage.displayOrder( productImageDTO.getDisplayOrder() );

        return productImage.build();
    }

    @Override
    public void updateEntityFromDTO(ProductImageDTO dto, ProductImage entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setImageUrl( dto.getImageUrl() );
        entity.setAltText( dto.getAltText() );
        entity.setTitle( dto.getTitle() );
        entity.setDisplayOrder( dto.getDisplayOrder() );
    }

    private Integer productImageProductId(ProductImage productImage) {
        if ( productImage == null ) {
            return null;
        }
        MarketPlace product = productImage.getProduct();
        if ( product == null ) {
            return null;
        }
        Integer id = product.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
