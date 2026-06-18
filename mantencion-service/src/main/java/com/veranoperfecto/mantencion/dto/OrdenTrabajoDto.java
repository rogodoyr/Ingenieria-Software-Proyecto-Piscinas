package com.veranoperfecto.mantencion.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record OrdenTrabajoDto(
        UUID id,
        String codigo,
        String clienteId,
        String clienteNombre,
        String comuna,
        String tecnicoId,
        String tecnicoNombre,
        LocalDateTime fechaHora,
        String servicio,
        String prioridad,
        String estado,
        String tipo,
        String observaciones,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
