package com.veranoperfecto.ruta.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veranoperfecto.ruta.dto.ApiResponse;
import com.veranoperfecto.ruta.dto.RutaDto;
import com.veranoperfecto.ruta.service.RutaService;

@RestController
@RequestMapping("/api/rutas")
public class RutaController {

    private final RutaService rutaService;

    public RutaController(RutaService rutaService) {
        this.rutaService = rutaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RutaDto>>> getRutas() {
        List<RutaDto> rutas = rutaService.getRutas();
        return ResponseEntity.ok(ApiResponse.success(rutas));
    }
}
