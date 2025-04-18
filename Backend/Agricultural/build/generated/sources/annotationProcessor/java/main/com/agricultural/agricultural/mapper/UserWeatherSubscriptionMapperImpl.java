package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.UserWeatherSubscriptionDTO;
import com.agricultural.agricultural.dto.WeatherMonitoredLocationDTO;
import com.agricultural.agricultural.entity.User;
import com.agricultural.agricultural.entity.UserWeatherSubscription;
import com.agricultural.agricultural.entity.WeatherMonitoredLocation;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T23:33:08+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class UserWeatherSubscriptionMapperImpl implements UserWeatherSubscriptionMapper {

    @Override
    public UserWeatherSubscriptionDTO toDTO(UserWeatherSubscription entity) {
        if ( entity == null ) {
            return null;
        }

        UserWeatherSubscriptionDTO.UserWeatherSubscriptionDTOBuilder userWeatherSubscriptionDTO = UserWeatherSubscriptionDTO.builder();

        userWeatherSubscriptionDTO.userId( entityUserId( entity ) );
        userWeatherSubscriptionDTO.userName( entityUserUsername( entity ) );
        userWeatherSubscriptionDTO.locationId( entityLocationId( entity ) );
        userWeatherSubscriptionDTO.locationName( entityLocationName( entity ) );
        userWeatherSubscriptionDTO.city( entityLocationCity( entity ) );
        userWeatherSubscriptionDTO.country( entityLocationCountry( entity ) );
        if ( entity.getId() != null ) {
            userWeatherSubscriptionDTO.id( entity.getId().intValue() );
        }
        userWeatherSubscriptionDTO.enableNotifications( entity.getEnableNotifications() );
        userWeatherSubscriptionDTO.location( weatherMonitoredLocationToWeatherMonitoredLocationDTO( entity.getLocation() ) );
        userWeatherSubscriptionDTO.createdAt( entity.getCreatedAt() );
        userWeatherSubscriptionDTO.updatedAt( entity.getUpdatedAt() );

        return userWeatherSubscriptionDTO.build();
    }

    @Override
    public UserWeatherSubscription toEntity(UserWeatherSubscriptionDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserWeatherSubscription userWeatherSubscription = new UserWeatherSubscription();

        if ( dto.getId() != null ) {
            userWeatherSubscription.setId( dto.getId().longValue() );
        }
        userWeatherSubscription.setEnableNotifications( dto.getEnableNotifications() );
        userWeatherSubscription.setCreatedAt( dto.getCreatedAt() );
        userWeatherSubscription.setUpdatedAt( dto.getUpdatedAt() );

        return userWeatherSubscription;
    }

    private Integer entityUserId(UserWeatherSubscription userWeatherSubscription) {
        if ( userWeatherSubscription == null ) {
            return null;
        }
        User user = userWeatherSubscription.getUser();
        if ( user == null ) {
            return null;
        }
        int id = user.getId();
        return id;
    }

    private String entityUserUsername(UserWeatherSubscription userWeatherSubscription) {
        if ( userWeatherSubscription == null ) {
            return null;
        }
        User user = userWeatherSubscription.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    private Integer entityLocationId(UserWeatherSubscription userWeatherSubscription) {
        if ( userWeatherSubscription == null ) {
            return null;
        }
        WeatherMonitoredLocation location = userWeatherSubscription.getLocation();
        if ( location == null ) {
            return null;
        }
        Integer id = location.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityLocationName(UserWeatherSubscription userWeatherSubscription) {
        if ( userWeatherSubscription == null ) {
            return null;
        }
        WeatherMonitoredLocation location = userWeatherSubscription.getLocation();
        if ( location == null ) {
            return null;
        }
        String name = location.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String entityLocationCity(UserWeatherSubscription userWeatherSubscription) {
        if ( userWeatherSubscription == null ) {
            return null;
        }
        WeatherMonitoredLocation location = userWeatherSubscription.getLocation();
        if ( location == null ) {
            return null;
        }
        String city = location.getCity();
        if ( city == null ) {
            return null;
        }
        return city;
    }

    private String entityLocationCountry(UserWeatherSubscription userWeatherSubscription) {
        if ( userWeatherSubscription == null ) {
            return null;
        }
        WeatherMonitoredLocation location = userWeatherSubscription.getLocation();
        if ( location == null ) {
            return null;
        }
        String country = location.getCountry();
        if ( country == null ) {
            return null;
        }
        return country;
    }

    protected WeatherMonitoredLocationDTO weatherMonitoredLocationToWeatherMonitoredLocationDTO(WeatherMonitoredLocation weatherMonitoredLocation) {
        if ( weatherMonitoredLocation == null ) {
            return null;
        }

        WeatherMonitoredLocationDTO weatherMonitoredLocationDTO = new WeatherMonitoredLocationDTO();

        weatherMonitoredLocationDTO.setId( weatherMonitoredLocation.getId() );
        weatherMonitoredLocationDTO.setName( weatherMonitoredLocation.getName() );
        weatherMonitoredLocationDTO.setCity( weatherMonitoredLocation.getCity() );
        weatherMonitoredLocationDTO.setCountry( weatherMonitoredLocation.getCountry() );
        weatherMonitoredLocationDTO.setLatitude( weatherMonitoredLocation.getLatitude() );
        weatherMonitoredLocationDTO.setLongitude( weatherMonitoredLocation.getLongitude() );
        weatherMonitoredLocationDTO.setIsActive( weatherMonitoredLocation.getIsActive() );
        weatherMonitoredLocationDTO.setMonitoringFrequency( weatherMonitoredLocation.getMonitoringFrequency() );
        weatherMonitoredLocationDTO.setCreatedAt( weatherMonitoredLocation.getCreatedAt() );
        weatherMonitoredLocationDTO.setUpdatedAt( weatherMonitoredLocation.getUpdatedAt() );

        return weatherMonitoredLocationDTO;
    }
}
