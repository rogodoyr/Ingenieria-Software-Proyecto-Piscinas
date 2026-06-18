package com.veranoperfecto.dashboard.dto;

import java.util.UUID;

public record InventarioDto(
        UUID id,
        String nombre,
        Integer cantidad,
        String unidad,
        Integer nivelPorcentaje,
        Boolean estadoCritico
) {
}
