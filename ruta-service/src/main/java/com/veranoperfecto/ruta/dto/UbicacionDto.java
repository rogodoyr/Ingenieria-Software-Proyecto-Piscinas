package com.veranoperfecto.ruta.dto;

import jakarta.validation.constraints.NotNull;

public record UbicacionDto(
        @NotNull(message = "La latitud es obligatoria")
        Double lat,
        @NotNull(message = "La longitud es obligatoria")
        Double lng
) {
}
