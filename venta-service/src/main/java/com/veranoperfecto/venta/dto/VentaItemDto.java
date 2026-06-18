package com.veranoperfecto.venta.dto;

import java.util.UUID;

public record VentaItemDto(
        UUID productoId,
        String productoNombre,
        Integer cantidad,
        Integer precioUnitario
) {
}
