package com.veranoperfecto.ruta.dto;

import jakarta.validation.constraints.NotBlank;

public record CambioEstadoTecnicoDto(
        @NotBlank(message = "El estado es obligatorio")
        String estado
) {
}
