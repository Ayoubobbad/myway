package com.myway.transport.service;

import com.myway.transport.entity.Report;
import com.myway.transport.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CrowdPredictionService {

    private final ReportRepository reportRepository;

    public Report.CrowdLevel predictCrowdLevel(Long stationId, Long lineId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekAgo = now.minusWeeks(1);
        
        List<Report> historicalReports;
        if (stationId != null) {
            historicalReports = reportRepository.findRecentApprovedReportsByStation(stationId, oneWeekAgo);
        } else if (lineId != null) {
            historicalReports = reportRepository.findRecentApprovedReportsByLine(lineId, oneWeekAgo);
        } else {
            return Report.CrowdLevel.MOYEN; // Default prediction
        }

        return predictBasedOnTimePattern(historicalReports, now.toLocalTime());
    }

    public Double calculateConfidence(int reportsCount) {
        if (reportsCount == 0) return 0.3; // Low confidence with no data
        if (reportsCount < 5) return 0.5;  // Medium-low confidence
        if (reportsCount < 10) return 0.7; // Medium confidence
        if (reportsCount < 20) return 0.85; // High confidence
        return 0.95; // Very high confidence
    }

    private Report.CrowdLevel predictBasedOnTimePattern(List<Report> historicalReports, LocalTime currentTime) {
        if (historicalReports.isEmpty()) {
            return getDefaultPredictionByTime(currentTime);
        }

        // Group reports by hour of day
        Map<Integer, List<Report>> reportsByHour = historicalReports.stream()
            .collect(Collectors.groupingBy(report -> report.getCreatedAt().getHour()));

        int currentHour = currentTime.getHour();
        
        // Try to find reports for the current hour
        List<Report> currentHourReports = reportsByHour.get(currentHour);
        if (currentHourReports != null && !currentHourReports.isEmpty()) {
            return calculateAverageCrowdLevel(currentHourReports);
        }

        // Try adjacent hours if no data for current hour
        for (int offset = 1; offset <= 2; offset++) {
            List<Report> nearbyReports = reportsByHour.get((currentHour + offset) % 24);
            if (nearbyReports == null) {
                nearbyReports = reportsByHour.get((currentHour - offset + 24) % 24);
            }
            if (nearbyReports != null && !nearbyReports.isEmpty()) {
                return calculateAverageCrowdLevel(nearbyReports);
            }
        }

        // Fallback to overall average
        return calculateAverageCrowdLevel(historicalReports);
    }

    private Report.CrowdLevel calculateAverageCrowdLevel(List<Report> reports) {
        if (reports.isEmpty()) {
            return Report.CrowdLevel.MOYEN;
        }

        double sum = reports.stream()
            .mapToInt(report -> switch (report.getCrowdLevel()) {
                case FAIBLE -> 1;
                case MOYEN -> 2;
                case FORT -> 3;
            })
            .average()
            .orElse(2.0);

        if (sum <= 1.5) return Report.CrowdLevel.FAIBLE;
        if (sum <= 2.5) return Report.CrowdLevel.MOYEN;
        return Report.CrowdLevel.FORT;
    }

    private Report.CrowdLevel getDefaultPredictionByTime(LocalTime time) {
        int hour = time.getHour();
        
        // Rush hours: 7-9 AM and 5-7 PM
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
            return Report.CrowdLevel.FORT;
        }
        
        // Moderate hours: 10 AM - 4 PM
        if (hour >= 10 && hour <= 16) {
            return Report.CrowdLevel.MOYEN;
        }
        
        // Low traffic hours: evening, night, early morning
        return Report.CrowdLevel.FAIBLE;
    }
}
