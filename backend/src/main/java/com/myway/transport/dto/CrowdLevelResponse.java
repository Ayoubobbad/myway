package com.myway.transport.dto;

import com.myway.transport.entity.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrowdLevelResponse {
    private Long stationId;
    private String stationName;
    private Long lineId;
    private String lineName;
    private Report.CrowdLevel currentLevel;
    private Report.CrowdLevel predictedLevel;
    private Double confidence;
    private LocalDateTime lastUpdated;
    private Integer reportsCount;
}
