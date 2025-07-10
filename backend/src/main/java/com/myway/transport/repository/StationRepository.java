package com.myway.transport.repository;

import com.myway.transport.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    
    List<Station> findByNameContainingIgnoreCase(String name);
    
    List<Station> findByType(Station.StationType type);
    
    List<Station> findByIsActiveTrue();
    
    List<Station> findByCity(String city);
    
    @Query("SELECT s FROM Station s WHERE s.isActive = true AND " +
           "(:type IS NULL OR s.type = :type) AND " +
           "(:city IS NULL OR s.city = :city)")
    List<Station> findActiveStationsWithFilters(@Param("type") Station.StationType type, 
                                               @Param("city") String city);
    
    @Query(value = "SELECT * FROM stations s WHERE s.is_active = true AND " +
                   "(6371 * acos(cos(radians(:lat)) * cos(radians(s.latitude)) * " +
                   "cos(radians(s.longitude) - radians(:lng)) + " +
                   "sin(radians(:lat)) * sin(radians(s.latitude)))) < :radius",
           nativeQuery = true)
    List<Station> findStationsNearby(@Param("lat") Double latitude, 
                                   @Param("lng") Double longitude, 
                                   @Param("radius") Double radiusKm);
}
