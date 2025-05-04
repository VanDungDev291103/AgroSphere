package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.ProductCategoryDTO;
import com.agricultural.agricultural.entity.ProductCategory;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-03T11:29:46+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class ProductCategoryMapperImpl implements ProductCategoryMapper {

    @Override
    public ProductCategoryDTO toDTO(ProductCategory category) {
        if ( category == null ) {
            return null;
        }

        ProductCategoryDTO.ProductCategoryDTOBuilder productCategoryDTO = ProductCategoryDTO.builder();

        productCategoryDTO.parentId( categoryParentId( category ) );
        productCategoryDTO.parentName( categoryParentName( category ) );
        productCategoryDTO.id( category.getId() );
        productCategoryDTO.name( category.getName() );
        productCategoryDTO.description( category.getDescription() );
        productCategoryDTO.imageUrl( category.getImageUrl() );
        productCategoryDTO.isActive( category.getIsActive() );
        productCategoryDTO.displayOrder( category.getDisplayOrder() );
        productCategoryDTO.createdAt( category.getCreatedAt() );

        return productCategoryDTO.build();
    }

    @Override
    public ProductCategory toEntity(ProductCategoryDTO categoryDTO) {
        if ( categoryDTO == null ) {
            return null;
        }

        ProductCategory.ProductCategoryBuilder productCategory = ProductCategory.builder();

        productCategory.id( categoryDTO.getId() );
        productCategory.name( categoryDTO.getName() );
        productCategory.description( categoryDTO.getDescription() );
        productCategory.imageUrl( categoryDTO.getImageUrl() );
        productCategory.isActive( categoryDTO.getIsActive() );
        productCategory.displayOrder( categoryDTO.getDisplayOrder() );

        return productCategory.build();
    }

    @Override
    public List<ProductCategoryDTO> toDTOList(List<ProductCategory> categories) {
        if ( categories == null ) {
            return null;
        }

        List<ProductCategoryDTO> list = new ArrayList<ProductCategoryDTO>( categories.size() );
        for ( ProductCategory productCategory : categories ) {
            list.add( toDTO( productCategory ) );
        }

        return list;
    }

    @Override
    public void updateCategoryFromDTO(ProductCategoryDTO dto, ProductCategory entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setName( dto.getName() );
        entity.setDescription( dto.getDescription() );
        entity.setImageUrl( dto.getImageUrl() );
        entity.setIsActive( dto.getIsActive() );
        entity.setDisplayOrder( dto.getDisplayOrder() );
    }

    private Integer categoryParentId(ProductCategory productCategory) {
        if ( productCategory == null ) {
            return null;
        }
        ProductCategory parent = productCategory.getParent();
        if ( parent == null ) {
            return null;
        }
        Integer id = parent.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String categoryParentName(ProductCategory productCategory) {
        if ( productCategory == null ) {
            return null;
        }
        ProductCategory parent = productCategory.getParent();
        if ( parent == null ) {
            return null;
        }
        String name = parent.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
