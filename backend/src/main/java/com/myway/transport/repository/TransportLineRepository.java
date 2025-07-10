package com.myway.transport.repository;

import com.myway.transport.entity.TransportLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportLineRepository extends JpaRepository<TransportLine, Long> {
    
    List<TransportLine> findByNameContainingIgnoreCase(String name);
    
    List<TransportLine> findByType(TransportLine.LineType type);
    
    List<TransportLine> findByIsActiveTrue();
    
    @Query("SELECT l FROM TransportLine l JOIN l.stations s WHERE s.id = :stationId AND l.isActive = true")
    List<TransportLine> findByStationId(@Param("stationId") Long stationId);
    
    @Query("SELECT l FROM TransportLine l WHERE l.isActive = true AND " +
           "(:type IS NULL OR l.type = :type)")
    List<TransportLine> findActiveLinesWithFilters(@Param("type") TransportLine.LineType type);
}
