package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.WeatherDataDTO;
import com.agricultural.agricultural.entity.WeatherData;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T04:48:47+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class WeatherDataMapperImpl implements WeatherDataMapper {

    @Override
    public WeatherDataDTO toDTO(WeatherData entity) {
        if ( entity == null ) {
            return null;
        }

        WeatherDataDTO weatherDataDTO = new WeatherDataDTO();

        weatherDataDTO.setId( entity.getId() );
        weatherDataDTO.setCity( entity.getCity() );
        weatherDataDTO.setCountry( entity.getCountry() );
        weatherDataDTO.setLatitude( entity.getLatitude() );
        weatherDataDTO.setLongitude( entity.getLongitude() );
        weatherDataDTO.setTemperature( entity.getTemperature() );
        weatherDataDTO.setHumidity( entity.getHumidity() );
        weatherDataDTO.setWindSpeed( entity.getWindSpeed() );
        weatherDataDTO.setWeatherDescription( entity.getWeatherDescription() );
        weatherDataDTO.setIconCode( entity.getIconCode() );
        weatherDataDTO.setRequestTime( entity.getRequestTime() );
        weatherDataDTO.setDataTime( entity.getDataTime() );
        weatherDataDTO.setCreatedAt( entity.getCreatedAt() );
        weatherDataDTO.setUpdatedAt( entity.getUpdatedAt() );

        return weatherDataDTO;
    }

    @Override
    public WeatherData toEntity(WeatherDataDTO dto) {
        if ( dto == null ) {
            return null;
        }

        WeatherData weatherData = new WeatherData();

        weatherData.setId( dto.getId() );
        weatherData.setCity( dto.getCity() );
        weatherData.setCountry( dto.getCountry() );
        weatherData.setLatitude( dto.getLatitude() );
        weatherData.setLongitude( dto.getLongitude() );
        weatherData.setTemperature( dto.getTemperature() );
        weatherData.setHumidity( dto.getHumidity() );
        weatherData.setWindSpeed( dto.getWindSpeed() );
        weatherData.setWeatherDescription( dto.getWeatherDescription() );
        weatherData.setIconCode( dto.getIconCode() );
        weatherData.setRequestTime( dto.getRequestTime() );
        weatherData.setDataTime( dto.getDataTime() );
        weatherData.setCreatedAt( dto.getCreatedAt() );
        weatherData.setUpdatedAt( dto.getUpdatedAt() );

        return weatherData;
    }
}
