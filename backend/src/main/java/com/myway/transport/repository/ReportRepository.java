package com.myway.transport.repository;

import com.myway.transport.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByStatus(Report.ReportStatus status);
    
    List<Report> findByUserId(Long userId);
    
    List<Report> findByStationId(Long stationId);
    
    List<Report> findByLineId(Long lineId);
    
    @Query("SELECT r FROM Report r WHERE r.station.id = :stationId AND r.status = 'APPROVED' AND " +
           "r.createdAt >= :since ORDER BY r.createdAt DESC")
    List<Report> findRecentApprovedReportsByStation(@Param("stationId") Long stationId, 
                                                   @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM Report r WHERE r.line.id = :lineId AND r.status = 'APPROVED' AND " +
           "r.createdAt >= :since ORDER BY r.createdAt DESC")
    List<Report> findRecentApprovedReportsByLine(@Param("lineId") Long lineId, 
                                               @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.createdAt >= :date")
    long countReportsAfter(@Param("date") LocalDateTime date);
    
    @Query("SELECT r.crowdLevel, COUNT(r) FROM Report r WHERE r.status = 'APPROVED' AND " +
           "r.createdAt >= :since GROUP BY r.crowdLevel")
    List<Object[]> getCrowdLevelStatistics(@Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM Report r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Report> findPendingReportsOrderByCreatedAt();
}
