package com.veranoperfecto.dashboard.dto;

public record MantencionProximaDto(
        String id,
        String codigo,
        String clienteNombre,
        String comuna,
        String servicio,
        String prioridad,
        String fechaHora,
        String estado,
        String tecnicoId,
        String tecnicoNombre
) {
}
