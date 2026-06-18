package com.veranoperfecto.venta.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductoDto(
        UUID id,
        String nombre,
        String categoria,
        Integer precio,
        String icono,
        String descripcion,
        Boolean activo,
        Integer stock,
        Integer minimo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
