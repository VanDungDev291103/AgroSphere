package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.WeatherMonitoredLocationDTO;
import com.agricultural.agricultural.entity.WeatherMonitoredLocation;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-01T01:10:58+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class WeatherMonitoredLocationMapperImpl implements WeatherMonitoredLocationMapper {

    @Override
    public WeatherMonitoredLocationDTO toDTO(WeatherMonitoredLocation entity) {
        if ( entity == null ) {
            return null;
        }

        WeatherMonitoredLocationDTO weatherMonitoredLocationDTO = new WeatherMonitoredLocationDTO();

        weatherMonitoredLocationDTO.setId( entity.getId() );
        weatherMonitoredLocationDTO.setName( entity.getName() );
        weatherMonitoredLocationDTO.setCity( entity.getCity() );
        weatherMonitoredLocationDTO.setCountry( entity.getCountry() );
        weatherMonitoredLocationDTO.setLatitude( entity.getLatitude() );
        weatherMonitoredLocationDTO.setLongitude( entity.getLongitude() );
        weatherMonitoredLocationDTO.setIsActive( entity.getIsActive() );
        weatherMonitoredLocationDTO.setMonitoringFrequency( entity.getMonitoringFrequency() );
        weatherMonitoredLocationDTO.setCreatedAt( entity.getCreatedAt() );
        weatherMonitoredLocationDTO.setUpdatedAt( entity.getUpdatedAt() );

        return weatherMonitoredLocationDTO;
    }

    @Override
    public WeatherMonitoredLocation toEntity(WeatherMonitoredLocationDTO dto) {
        if ( dto == null ) {
            return null;
        }

        WeatherMonitoredLocation weatherMonitoredLocation = new WeatherMonitoredLocation();

        weatherMonitoredLocation.setId( dto.getId() );
        weatherMonitoredLocation.setName( dto.getName() );
        weatherMonitoredLocation.setCity( dto.getCity() );
        weatherMonitoredLocation.setCountry( dto.getCountry() );
        weatherMonitoredLocation.setLatitude( dto.getLatitude() );
        weatherMonitoredLocation.setLongitude( dto.getLongitude() );
        weatherMonitoredLocation.setIsActive( dto.getIsActive() );
        weatherMonitoredLocation.setMonitoringFrequency( dto.getMonitoringFrequency() );
        weatherMonitoredLocation.setCreatedAt( dto.getCreatedAt() );
        weatherMonitoredLocation.setUpdatedAt( dto.getUpdatedAt() );

        return weatherMonitoredLocation;
    }
}
