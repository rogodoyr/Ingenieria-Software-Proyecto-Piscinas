package com.veranoperfecto.mantencion.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.veranoperfecto.mantencion.dto.ApiResponse;
import com.veranoperfecto.mantencion.dto.CambioEstadoDto;
import com.veranoperfecto.mantencion.dto.OrdenTrabajoDto;
import com.veranoperfecto.mantencion.dto.OrdenTrabajoRequestDto;
import com.veranoperfecto.mantencion.service.MantencionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/mantenciones")
public class MantencionController {

    private final MantencionService mantencionService;

    public MantencionController(MantencionService mantencionService) {
        this.mantencionService = mantencionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrdenTrabajoDto>>> listarOrdenes(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String tecnicoId,
            @RequestParam(required = false) String fecha) {

        List<OrdenTrabajoDto> ordenes;
        if (estado != null || tecnicoId != null || fecha != null) {
            ordenes = mantencionService.buscarOrdenes(estado, tecnicoId, fecha);
        } else {
            ordenes = mantencionService.getAllOrdenes();
        }

        return ResponseEntity.ok(ApiResponse.success(ordenes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrdenTrabajoDto>> obtenerOrden(@PathVariable UUID id) {
        OrdenTrabajoDto orden = mantencionService.getOrdenById(id);
        return ResponseEntity.ok(ApiResponse.success(orden));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrdenTrabajoDto>> crearOrden(
            @Valid @RequestBody OrdenTrabajoRequestDto requestDto) {
        OrdenTrabajoDto created = mantencionService.crearOrden(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrdenTrabajoDto>> actualizarOrden(
            @PathVariable UUID id,
            @Valid @RequestBody OrdenTrabajoRequestDto requestDto) {
        OrdenTrabajoDto updated = mantencionService.actualizarOrden(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarOrden(@PathVariable UUID id) {
        mantencionService.eliminarOrden(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<OrdenTrabajoDto>> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambioEstadoDto cambioEstadoDto) {
        OrdenTrabajoDto updated = mantencionService.cambiarEstado(id, cambioEstadoDto);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }
}
