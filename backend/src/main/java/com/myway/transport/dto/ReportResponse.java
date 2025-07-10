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
public class ReportResponse {
    private Long id;
    private Report.CrowdLevel crowdLevel;
    private Report.ReportStatus status;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime moderatedAt;
    private String userName;
    private String stationName;
    private String lineName;
    private String moderatedByName;
}
