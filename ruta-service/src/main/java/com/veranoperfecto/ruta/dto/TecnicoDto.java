package com.veranoperfecto.ruta.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TecnicoDto(
        UUID id,
        String codigo,
        String nombre,
        String comuna,
        String estado,
        Double lat,
        Double lng,
        String telefono,
        Integer rutaProgreso,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
