package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.AgriculturalAdviceDTO;
import com.agricultural.agricultural.entity.AgriculturalAdvice;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T04:48:47+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class AgriculturalAdviceMapperImpl implements AgriculturalAdviceMapper {

    @Autowired
    private WeatherDataMapper weatherDataMapper;

    @Override
    public AgriculturalAdviceDTO toDTO(AgriculturalAdvice entity) {
        if ( entity == null ) {
            return null;
        }

        AgriculturalAdviceDTO agriculturalAdviceDTO = new AgriculturalAdviceDTO();

        agriculturalAdviceDTO.setWeatherData( weatherDataMapper.toDTO( entity.getWeatherData() ) );
        agriculturalAdviceDTO.setId( entity.getId() );
        agriculturalAdviceDTO.setWeatherSummary( entity.getWeatherSummary() );
        agriculturalAdviceDTO.setFarmingAdvice( entity.getFarmingAdvice() );
        agriculturalAdviceDTO.setCropAdvice( entity.getCropAdvice() );
        agriculturalAdviceDTO.setWarnings( entity.getWarnings() );
        agriculturalAdviceDTO.setIsRainySeason( entity.getIsRainySeason() );
        agriculturalAdviceDTO.setIsDrySeason( entity.getIsDrySeason() );
        agriculturalAdviceDTO.setIsSuitableForPlanting( entity.getIsSuitableForPlanting() );
        agriculturalAdviceDTO.setIsSuitableForHarvesting( entity.getIsSuitableForHarvesting() );
        agriculturalAdviceDTO.setRecommendedActivities( entity.getRecommendedActivities() );
        agriculturalAdviceDTO.setCreatedAt( entity.getCreatedAt() );
        agriculturalAdviceDTO.setUpdatedAt( entity.getUpdatedAt() );

        return agriculturalAdviceDTO;
    }

    @Override
    public AgriculturalAdvice toEntity(AgriculturalAdviceDTO dto) {
        if ( dto == null ) {
            return null;
        }

        AgriculturalAdvice agriculturalAdvice = new AgriculturalAdvice();

        agriculturalAdvice.setId( dto.getId() );
        agriculturalAdvice.setWeatherSummary( dto.getWeatherSummary() );
        agriculturalAdvice.setFarmingAdvice( dto.getFarmingAdvice() );
        agriculturalAdvice.setCropAdvice( dto.getCropAdvice() );
        agriculturalAdvice.setWarnings( dto.getWarnings() );
        agriculturalAdvice.setIsRainySeason( dto.getIsRainySeason() );
        agriculturalAdvice.setIsDrySeason( dto.getIsDrySeason() );
        agriculturalAdvice.setIsSuitableForPlanting( dto.getIsSuitableForPlanting() );
        agriculturalAdvice.setIsSuitableForHarvesting( dto.getIsSuitableForHarvesting() );
        agriculturalAdvice.setRecommendedActivities( dto.getRecommendedActivities() );
        agriculturalAdvice.setCreatedAt( dto.getCreatedAt() );
        agriculturalAdvice.setUpdatedAt( dto.getUpdatedAt() );

        return agriculturalAdvice;
    }
}
