package com.veranoperfecto.mantencion.dto;

import jakarta.validation.constraints.NotBlank;

public record CambioEstadoDto(
        @NotBlank(message = "El estado es obligatorio")
        String estado
) {
}
