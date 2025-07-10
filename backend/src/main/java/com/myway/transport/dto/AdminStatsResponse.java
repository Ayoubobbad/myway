package com.myway.transport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private Long totalUsers;
    private Long totalStations;
    private Long totalReports;
    private Long newUsersToday;
    private Long newReportsToday;
    private Long activeUsersThisWeek;
    private Integer pendingReports;
}
