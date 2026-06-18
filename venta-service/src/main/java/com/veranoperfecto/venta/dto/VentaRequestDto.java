package com.veranoperfecto.venta.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record VentaRequestDto(
        String clienteId,
        String clienteNombre,
        String tipoDocumento,
        @NotEmpty(message = "La venta debe tener al menos un item")
        List<VentaItemDto> items
) {
}
