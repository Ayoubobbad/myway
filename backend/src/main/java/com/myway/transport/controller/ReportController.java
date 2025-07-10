package com.myway.transport.controller;

import com.myway.transport.dto.ReportRequest;
import com.myway.transport.dto.ReportResponse;
import com.myway.transport.entity.Report;
import com.myway.transport.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "API de gestion des signalements")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @Operation(summary = "Créer un nouveau signalement")
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody ReportRequest request) {
        ReportResponse report = reportService.createReport(request);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/station/{stationId}")
    @Operation(summary = "Récupérer les signalements d'une station")
    public ResponseEntity<List<ReportResponse>> getReportsByStation(@PathVariable Long stationId) {
        List<ReportResponse> reports = reportService.getReportsByStation(stationId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/line/{lineId}")
    @Operation(summary = "Récupérer les signalements d'une ligne")
    public ResponseEntity<List<ReportResponse>> getReportsByLine(@PathVariable Long lineId) {
        List<ReportResponse> reports = reportService.getReportsByLine(lineId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Récupérer mes signalements")
    public ResponseEntity<List<ReportResponse>> getUserReports() {
        List<ReportResponse> reports = reportService.getUserReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Récupérer les signalements en attente")
    public ResponseEntity<List<ReportResponse>> getPendingReports() {
        List<ReportResponse> reports = reportService.getPendingReports();
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modérer un signalement")
    public ResponseEntity<ReportResponse> moderateReport(
            @PathVariable Long id, 
            @RequestParam Report.ReportStatus status) {
        ReportResponse report = reportService.moderateReport(id, status);
        return ResponseEntity.ok(report);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un signalement")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
