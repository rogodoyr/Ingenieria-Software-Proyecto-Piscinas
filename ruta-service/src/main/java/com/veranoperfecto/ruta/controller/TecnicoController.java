package com.veranoperfecto.ruta.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.veranoperfecto.ruta.dto.ApiResponse;
import com.veranoperfecto.ruta.dto.CambioEstadoTecnicoDto;
import com.veranoperfecto.ruta.dto.TecnicoDto;
import com.veranoperfecto.ruta.dto.TecnicoRequestDto;
import com.veranoperfecto.ruta.dto.UbicacionDto;
import com.veranoperfecto.ruta.service.TecnicoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tecnicos")
public class TecnicoController {

    private final TecnicoService tecnicoService;

    public TecnicoController(TecnicoService tecnicoService) {
        this.tecnicoService = tecnicoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TecnicoDto>>> getAllTecnicos() {
        List<TecnicoDto> tecnicos = tecnicoService.getAllTecnicos();
        return ResponseEntity.ok(ApiResponse.success(tecnicos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TecnicoDto>> getTecnicoById(@PathVariable UUID id) {
        TecnicoDto tecnico = tecnicoService.getTecnicoById(id);
        return ResponseEntity.ok(ApiResponse.success(tecnico));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TecnicoDto>> crearTecnico(
            @Valid @RequestBody TecnicoRequestDto request) {
        TecnicoDto tecnico = tecnicoService.crearTecnico(request);
        return new ResponseEntity<>(ApiResponse.success(tecnico), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/ubicacion")
    public ResponseEntity<ApiResponse<TecnicoDto>> actualizarUbicacion(
            @PathVariable UUID id,
            @Valid @RequestBody UbicacionDto ubicacionDto) {
        TecnicoDto tecnico = tecnicoService.actualizarUbicacion(id, ubicacionDto);
        return ResponseEntity.ok(ApiResponse.success(tecnico));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<TecnicoDto>> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambioEstadoTecnicoDto cambioEstadoDto) {
        TecnicoDto tecnico = tecnicoService.cambiarEstado(id, cambioEstadoDto);
        return ResponseEntity.ok(ApiResponse.success(tecnico));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTecnico(@PathVariable UUID id) {
        tecnicoService.deleteTecnico(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
