package com.veranoperfecto.dashboard.controller;

import com.veranoperfecto.dashboard.dto.ApiResponse;
import com.veranoperfecto.dashboard.dto.InventarioDto;
import com.veranoperfecto.dashboard.dto.InventarioRequestDto;
import com.veranoperfecto.dashboard.dto.MantencionProximaDto;
import com.veranoperfecto.dashboard.dto.MetricaDashboardDto;
import com.veranoperfecto.dashboard.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metricas")
    public ResponseEntity<ApiResponse<MetricaDashboardDto>> getMetricas() {
        MetricaDashboardDto metricas = dashboardService.getMetricas();
        return ResponseEntity.ok(ApiResponse.success(metricas));
    }

    @GetMapping("/mantenciones-proximas")
    public ResponseEntity<ApiResponse<List<MantencionProximaDto>>> getMantencionesProximas() {
        List<MantencionProximaDto> mantenciones = dashboardService.getMantencionesProximas();
        return ResponseEntity.ok(ApiResponse.success(mantenciones));
    }

    @GetMapping("/alertas-inventario")
    public ResponseEntity<ApiResponse<List<InventarioDto>>> getAlertasInventario() {
        List<InventarioDto> alertas = dashboardService.getAlertasInventario();
        return ResponseEntity.ok(ApiResponse.success(alertas));
    }

    @PostMapping("/inventario")
    public ResponseEntity<ApiResponse<InventarioDto>> crearInventario(
            @Valid @RequestBody InventarioRequestDto requestDto
    ) {
        InventarioDto inventario = dashboardService.crearInventario(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(inventario));
    }

    @PutMapping("/inventario/{id}")
    public ResponseEntity<ApiResponse<InventarioDto>> actualizarInventario(
            @PathVariable UUID id,
            @Valid @RequestBody InventarioRequestDto requestDto
    ) {
        InventarioDto inventario = dashboardService.actualizarInventario(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success(inventario));
    }
}
