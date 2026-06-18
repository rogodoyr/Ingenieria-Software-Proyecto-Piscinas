package com.veranoperfecto.venta.controller;

import com.veranoperfecto.venta.dto.ApiResponse;
import com.veranoperfecto.venta.dto.VentaDto;
import com.veranoperfecto.venta.dto.VentaRequestDto;
import com.veranoperfecto.venta.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VentaDto>>> listarVentas() {
        log.debug("GET /api/ventas");
        List<VentaDto> ventas = ventaService.getAllVentas();
        return ResponseEntity.ok(ApiResponse.success(ventas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VentaDto>> getVenta(@PathVariable UUID id) {
        log.debug("GET /api/ventas/{}", id);
        VentaDto venta = ventaService.getVentaById(id);
        return ResponseEntity.ok(ApiResponse.success(venta));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VentaDto>> crearVenta(
            @Valid @RequestBody VentaRequestDto request
    ) {
        log.debug("POST /api/ventas - cliente={}", request.clienteNombre());
        VentaDto venta = ventaService.crearVenta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(venta));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<VentaDto>> cambiarEstado(
            @PathVariable UUID id,
            @RequestParam String estado
    ) {
        log.debug("PATCH /api/ventas/{}/estado?estado={}", id, estado);
        VentaDto venta = ventaService.cambiarEstado(id, estado);
        return ResponseEntity.ok(ApiResponse.success(venta));
    }
}
