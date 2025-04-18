package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.ProductVariantDTO;
import com.agricultural.agricultural.entity.MarketPlace;
import com.agricultural.agricultural.entity.ProductVariant;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T23:33:07+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class ProductVariantMapperImpl implements ProductVariantMapper {

    @Override
    public ProductVariantDTO toDTO(ProductVariant variant) {
        if ( variant == null ) {
            return null;
        }

        ProductVariantDTO.ProductVariantDTOBuilder productVariantDTO = ProductVariantDTO.builder();

        productVariantDTO.productId( variantProductId( variant ) );
        productVariantDTO.productName( variantProductProductName( variant ) );
        productVariantDTO.id( variant.getId() );
        productVariantDTO.name( variant.getName() );
        productVariantDTO.attributes( variant.getAttributes() );
        productVariantDTO.priceAdjustment( variant.getPriceAdjustment() );
        productVariantDTO.sku( variant.getSku() );
        productVariantDTO.quantity( variant.getQuantity() );
        productVariantDTO.imageUrl( variant.getImageUrl() );

        productVariantDTO.finalPrice( variant.getFinalPrice() );

        return productVariantDTO.build();
    }

    @Override
    public ProductVariant toEntity(ProductVariantDTO variantDTO) {
        if ( variantDTO == null ) {
            return null;
        }

        ProductVariant.ProductVariantBuilder productVariant = ProductVariant.builder();

        productVariant.id( variantDTO.getId() );
        productVariant.name( variantDTO.getName() );
        productVariant.attributes( variantDTO.getAttributes() );
        productVariant.priceAdjustment( variantDTO.getPriceAdjustment() );
        productVariant.sku( variantDTO.getSku() );
        productVariant.quantity( variantDTO.getQuantity() );
        productVariant.imageUrl( variantDTO.getImageUrl() );

        return productVariant.build();
    }

    @Override
    public List<ProductVariantDTO> toDTOList(List<ProductVariant> variants) {
        if ( variants == null ) {
            return null;
        }

        List<ProductVariantDTO> list = new ArrayList<ProductVariantDTO>( variants.size() );
        for ( ProductVariant productVariant : variants ) {
            list.add( toDTO( productVariant ) );
        }

        return list;
    }

    @Override
    public void updateVariantFromDTO(ProductVariantDTO dto, ProductVariant entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setName( dto.getName() );
        entity.setAttributes( dto.getAttributes() );
        entity.setPriceAdjustment( dto.getPriceAdjustment() );
        entity.setSku( dto.getSku() );
        entity.setQuantity( dto.getQuantity() );
        entity.setImageUrl( dto.getImageUrl() );
    }

    private Integer variantProductId(ProductVariant productVariant) {
        if ( productVariant == null ) {
            return null;
        }
        MarketPlace product = productVariant.getProduct();
        if ( product == null ) {
            return null;
        }
        Integer id = product.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String variantProductProductName(ProductVariant productVariant) {
        if ( productVariant == null ) {
            return null;
        }
        MarketPlace product = productVariant.getProduct();
        if ( product == null ) {
            return null;
        }
        String productName = product.getProductName();
        if ( productName == null ) {
            return null;
        }
        return productName;
    }
}
