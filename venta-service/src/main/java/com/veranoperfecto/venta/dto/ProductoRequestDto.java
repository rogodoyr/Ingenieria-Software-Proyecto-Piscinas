package com.veranoperfecto.venta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductoRequestDto(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        String categoria,
        Integer precio,
        String icono,
        String descripcion,
        Integer stock,
        Integer minimo
) {
}
