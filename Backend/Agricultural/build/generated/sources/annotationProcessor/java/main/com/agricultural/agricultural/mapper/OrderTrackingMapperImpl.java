package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.OrderTrackingDTO;
import com.agricultural.agricultural.entity.OrderTracking;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T04:48:46+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class OrderTrackingMapperImpl implements OrderTrackingMapper {

    @Override
    public OrderTrackingDTO toDTO(OrderTracking entity) {
        if ( entity == null ) {
            return null;
        }

        OrderTrackingDTO.OrderTrackingDTOBuilder orderTrackingDTO = OrderTrackingDTO.builder();

        orderTrackingDTO.id( entity.getId() );
        orderTrackingDTO.orderId( entity.getOrderId() );
        orderTrackingDTO.status( entity.getStatus() );
        orderTrackingDTO.description( entity.getDescription() );
        orderTrackingDTO.timestamp( entity.getTimestamp() );
        orderTrackingDTO.updatedBy( entity.getUpdatedBy() );

        return orderTrackingDTO.build();
    }

    @Override
    public List<OrderTrackingDTO> toDTOList(List<OrderTracking> entities) {
        if ( entities == null ) {
            return null;
        }

        List<OrderTrackingDTO> list = new ArrayList<OrderTrackingDTO>( entities.size() );
        for ( OrderTracking orderTracking : entities ) {
            list.add( toDTO( orderTracking ) );
        }

        return list;
    }

    @Override
    public OrderTracking toEntity(OrderTrackingDTO dto) {
        if ( dto == null ) {
            return null;
        }

        OrderTracking.OrderTrackingBuilder orderTracking = OrderTracking.builder();

        orderTracking.id( dto.getId() );
        orderTracking.orderId( dto.getOrderId() );
        orderTracking.status( dto.getStatus() );
        orderTracking.description( dto.getDescription() );
        orderTracking.timestamp( dto.getTimestamp() );
        orderTracking.updatedBy( dto.getUpdatedBy() );

        return orderTracking.build();
    }

    @Override
    public void updateEntityFromDTO(OrderTrackingDTO dto, OrderTracking entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setOrderId( dto.getOrderId() );
        entity.setStatus( dto.getStatus() );
        entity.setDescription( dto.getDescription() );
        entity.setTimestamp( dto.getTimestamp() );
        entity.setUpdatedBy( dto.getUpdatedBy() );
    }
}
