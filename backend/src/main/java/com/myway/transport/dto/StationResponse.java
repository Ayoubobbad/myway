package com.myway.transport.dto;

import com.myway.transport.entity.Report;
import com.myway.transport.entity.Station;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StationResponse {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private Station.StationType type;
    private String address;
    private String city;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<String> lineNames;
    private Report.CrowdLevel currentCrowdLevel;
    private Integer recentReportsCount;
}
