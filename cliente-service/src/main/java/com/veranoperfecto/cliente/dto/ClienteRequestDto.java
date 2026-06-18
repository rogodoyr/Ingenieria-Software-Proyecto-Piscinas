package com.veranoperfecto.cliente.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequestDto(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        String tipo,
        String rut,
        String comuna,
        String telefono,
        String email,
        String direccion,
        String estado,
        String notas
) {
}
