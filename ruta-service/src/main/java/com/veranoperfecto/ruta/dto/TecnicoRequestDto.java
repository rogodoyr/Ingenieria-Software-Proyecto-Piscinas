package com.veranoperfecto.ruta.dto;

import jakarta.validation.constraints.NotBlank;

public record TecnicoRequestDto(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        String comuna,
        String telefono
) {
}
