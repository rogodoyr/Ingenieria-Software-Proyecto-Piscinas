package com.veranoperfecto.cliente.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ClienteDto(
        UUID id,
        String codigo,
        String nombre,
        String tipo,
        String rut,
        String comuna,
        String telefono,
        String email,
        String direccion,
        String estado,
        String notas,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
