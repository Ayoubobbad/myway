package com.myway.transport.controller;

import com.myway.transport.dto.CrowdLevelResponse;
import com.myway.transport.dto.StationResponse;
import com.myway.transport.entity.Station;
import com.myway.transport.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
@Tag(name = "Stations", description = "API de gestion des stations")
public class StationController {

    private final StationService stationService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les stations")
    public ResponseEntity<List<StationResponse>> getAllStations() {
        List<StationResponse> stations = stationService.getAllStations();
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une station par ID")
    public ResponseEntity<StationResponse> getStationById(@PathVariable Long id) {
        StationResponse station = stationService.getStationById(id);
        return ResponseEntity.ok(station);
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des stations par nom")
    public ResponseEntity<List<StationResponse>> searchStations(@RequestParam String name) {
        List<StationResponse> stations = stationService.searchStations(name);
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/nearby")
    @Operation(summary = "Trouver des stations à proximité")
    public ResponseEntity<List<StationResponse>> getStationsNearby(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "1.0") Double radius) {
        List<StationResponse> stations = stationService.getStationsNearby(latitude, longitude, radius);
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Récupérer les stations par type")
    public ResponseEntity<List<StationResponse>> getStationsByType(@PathVariable Station.StationType type) {
        List<StationResponse> stations = stationService.getStationsByType(type);
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/{id}/crowd-level")
    @Operation(summary = "Récupérer le niveau d'affluence d'une station")
    public ResponseEntity<CrowdLevelResponse> getStationCrowdLevel(@PathVariable Long id) {
        CrowdLevelResponse crowdLevel = stationService.getStationCrowdLevel(id);
        return ResponseEntity.ok(crowdLevel);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer une nouvelle station")
    public ResponseEntity<StationResponse> createStation(@Valid @RequestBody Station station) {
        StationResponse createdStation = stationService.createStation(station);
        return ResponseEntity.ok(createdStation);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mettre à jour une station")
    public ResponseEntity<StationResponse> updateStation(@PathVariable Long id, @Valid @RequestBody Station station) {
        StationResponse updatedStation = stationService.updateStation(id, station);
        return ResponseEntity.ok(updatedStation);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer une station")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
        return ResponseEntity.noContent().build();
    }
}
