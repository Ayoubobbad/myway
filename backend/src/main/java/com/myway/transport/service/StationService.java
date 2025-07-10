package com.myway.transport.service;

import com.myway.transport.dto.CrowdLevelResponse;
import com.myway.transport.dto.StationResponse;
import com.myway.transport.entity.Report;
import com.myway.transport.entity.Station;
import com.myway.transport.entity.TransportLine;
import com.myway.transport.exception.ResourceNotFoundException;
import com.myway.transport.repository.ReportRepository;
import com.myway.transport.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StationService {

    private final StationRepository stationRepository;
    private final ReportRepository reportRepository;
    private final CrowdPredictionService crowdPredictionService;

    public List<StationResponse> getAllStations() {
        return stationRepository.findByIsActiveTrue()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public StationResponse getStationById(Long id) {
        Station station = stationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Station non trouvée avec l'ID: " + id));
        return convertToResponse(station);
    }

    public List<StationResponse> searchStations(String name) {
        return stationRepository.findByNameContainingIgnoreCase(name)
            .stream()
            .filter(Station::getIsActive)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<StationResponse> getStationsNearby(Double latitude, Double longitude, Double radius) {
        return stationRepository.findStationsNearby(latitude, longitude, radius)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<StationResponse> getStationsByType(Station.StationType type) {
        return stationRepository.findByType(type)
            .stream()
            .filter(Station::getIsActive)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public CrowdLevelResponse getStationCrowdLevel(Long stationId) {
        Station station = stationRepository.findById(stationId)
            .orElseThrow(() -> new ResourceNotFoundException("Station non trouvée avec l'ID: " + stationId));

        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Report> recentReports = reportRepository.findRecentApprovedReportsByStation(stationId, oneHourAgo);

        Report.CrowdLevel currentLevel = calculateCurrentCrowdLevel(recentReports);
        Report.CrowdLevel predictedLevel = crowdPredictionService.predictCrowdLevel(stationId, null);
        Double confidence = crowdPredictionService.calculateConfidence(recentReports.size());

        return CrowdLevelResponse.builder()
            .stationId(stationId)
            .stationName(station.getName())
            .currentLevel(currentLevel)
            .predictedLevel(predictedLevel)
            .confidence(confidence)
            .lastUpdated(recentReports.isEmpty() ? null : recentReports.get(0).getCreatedAt())
            .reportsCount(recentReports.size())
            .build();
    }

    @Transactional
    public StationResponse createStation(Station station) {
        station.setIsActive(true);
        Station savedStation = stationRepository.save(station);
        return convertToResponse(savedStation);
    }

    @Transactional
    public StationResponse updateStation(Long id, Station stationDetails) {
        Station station = stationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Station non trouvée avec l'ID: " + id));

        station.setName(stationDetails.getName());
        station.setLatitude(stationDetails.getLatitude());
        station.setLongitude(stationDetails.getLongitude());
        station.setType(stationDetails.getType());
        station.setAddress(stationDetails.getAddress());
        station.setCity(stationDetails.getCity());

        Station updatedStation = stationRepository.save(station);
        return convertToResponse(updatedStation);
    }

    @Transactional
    public void deleteStation(Long id) {
        Station station = stationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Station non trouvée avec l'ID: " + id));
        station.setIsActive(false);
        stationRepository.save(station);
    }

    private StationResponse convertToResponse(Station station) {
        List<String> lineNames = station.getLines() != null ? 
            station.getLines().stream()
                .map(TransportLine::getName)
                .collect(Collectors.toList()) : List.of();

        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Report> recentReports = reportRepository.findRecentApprovedReportsByStation(station.getId(), oneHourAgo);
        Report.CrowdLevel currentLevel = calculateCurrentCrowdLevel(recentReports);

        return StationResponse.builder()
            .id(station.getId())
            .name(station.getName())
            .latitude(station.getLatitude())
            .longitude(station.getLongitude())
            .type(station.getType())
            .address(station.getAddress())
            .city(station.getCity())
            .isActive(station.getIsActive())
            .createdAt(station.getCreatedAt())
            .lineNames(lineNames)
            .currentCrowdLevel(currentLevel)
            .recentReportsCount(recentReports.size())
            .build();
    }

    private Report.CrowdLevel calculateCurrentCrowdLevel(List<Report> reports) {
        if (reports.isEmpty()) {
            return Report.CrowdLevel.MOYEN; // Default level
        }

        // Calculate weighted average based on report recency
        double totalWeight = 0;
        double weightedSum = 0;
        LocalDateTime now = LocalDateTime.now();

        for (Report report : reports) {
            long minutesAgo = java.time.Duration.between(report.getCreatedAt(), now).toMinutes();
            double weight = Math.max(0.1, 1.0 - (minutesAgo / 60.0)); // Decrease weight over time
            
            int levelValue = switch (report.getCrowdLevel()) {
                case FAIBLE -> 1;
                case MOYEN -> 2;
                case FORT -> 3;
            };
            
            weightedSum += levelValue * weight;
            totalWeight += weight;
        }

        double averageLevel = weightedSum / totalWeight;
        
        if (averageLevel <= 1.5) return Report.CrowdLevel.FAIBLE;
        if (averageLevel <= 2.5) return Report.CrowdLevel.MOYEN;
        return Report.CrowdLevel.FORT;
    }
}
