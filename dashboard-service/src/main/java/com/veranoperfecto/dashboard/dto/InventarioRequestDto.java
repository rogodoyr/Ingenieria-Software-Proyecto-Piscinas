package com.veranoperfecto.dashboard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InventarioRequestDto(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 0, message = "La cantidad no puede ser negativa")
        Integer cantidad,

        String unidad,

        @NotNull(message = "El nivel de porcentaje es obligatorio")
        @Min(value = 0, message = "El nivel de porcentaje no puede ser negativo")
        Integer nivelPorcentaje,

        Boolean estadoCritico
) {
}
