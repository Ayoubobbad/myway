package com.myway.transport.dto;

import com.myway.transport.entity.Report;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {
    
    @NotNull(message = "Le niveau d'affluence est obligatoire")
    private Report.CrowdLevel crowdLevel;
    
    private String comment;
    
    private Long stationId;
    
    private Long lineId;
}
