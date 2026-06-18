package com.veranoperfecto.dashboard.dto;

public record MetricaDashboardDto(
        long ingresosMes,
        int variacionIngresos,
        int mantencionesHoy,
        int mantencionesCompletadas,
        int nivelQuimicos,
        int totalClientes
) {
}
