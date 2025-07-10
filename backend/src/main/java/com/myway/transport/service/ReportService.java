package com.myway.transport.service;

import com.myway.transport.dto.ReportRequest;
import com.myway.transport.dto.ReportResponse;
import com.myway.transport.entity.Report;
import com.myway.transport.entity.Station;
import com.myway.transport.entity.TransportLine;
import com.myway.transport.entity.User;
import com.myway.transport.exception.ResourceNotFoundException;
import com.myway.transport.repository.ReportRepository;
import com.myway.transport.repository.StationRepository;
import com.myway.transport.repository.TransportLineRepository;
import com.myway.transport.repository.UserRepository;
import com.myway.transport.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    private final TransportLineRepository transportLineRepository;

    @Transactional
    public ReportResponse createReport(ReportRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Report report = Report.builder()
            .crowdLevel(request.getCrowdLevel())
            .comment(request.getComment())
            .status(Report.ReportStatus.APPROVED) // Auto-approve for now
            .user(user)
            .build();

        if (request.getStationId() != null) {
            Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Station non trouvée"));
            report.setStation(station);
        }

        if (request.getLineId() != null) {
            TransportLine line = transportLineRepository.findById(request.getLineId())
                .orElseThrow(() -> new ResourceNotFoundException("Ligne non trouvée"));
            report.setLine(line);
        }

        Report savedReport = reportRepository.save(report);
        return convertToResponse(savedReport);
    }

    public List<ReportResponse> getReportsByStation(Long stationId) {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        return reportRepository.findRecentApprovedReportsByStation(stationId, oneDayAgo)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<ReportResponse> getReportsByLine(Long lineId) {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        return reportRepository.findRecentApprovedReportsByLine(lineId, oneDayAgo)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<ReportResponse> getUserReports() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return reportRepository.findByUserId(userDetails.getId())
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<ReportResponse> getPendingReports() {
        return reportRepository.findPendingReportsOrderByCreatedAt()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse moderateReport(Long reportId, Report.ReportStatus status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User moderator = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Modérateur non trouvé"));

        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Signalement non trouvé"));

        report.setStatus(status);
        report.setModeratedAt(LocalDateTime.now());
        report.setModeratedBy(moderator);

        Report updatedReport = reportRepository.save(report);
        return convertToResponse(updatedReport);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Signalement non trouvé"));
        reportRepository.delete(report);
    }

    private ReportResponse convertToResponse(Report report) {
        return ReportResponse.builder()
            .id(report.getId())
            .crowdLevel(report.getCrowdLevel())
            .status(report.getStatus())
            .comment(report.getComment())
            .createdAt(report.getCreatedAt())
            .moderatedAt(report.getModeratedAt())
            .userName(report.getUser().getName())
            .stationName(report.getStation() != null ? report.getStation().getName() : null)
            .lineName(report.getLine() != null ? report.getLine().getName() : null)
            .moderatedByName(report.getModeratedBy() != null ? report.getModeratedBy().getName() : null)
            .build();
    }
}
