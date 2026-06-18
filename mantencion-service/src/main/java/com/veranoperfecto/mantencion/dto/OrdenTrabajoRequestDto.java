package com.veranoperfecto.mantencion.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public record OrdenTrabajoRequestDto(
        String clienteId,
        String clienteNombre,
        String comuna,
        String tecnicoId,
        String tecnicoNombre,

        @NotNull(message = "La fecha y hora es obligatoria")
        LocalDateTime fechaHora,

        String servicio,
        String prioridad,
        String tipo,
        String observaciones
) {
}
