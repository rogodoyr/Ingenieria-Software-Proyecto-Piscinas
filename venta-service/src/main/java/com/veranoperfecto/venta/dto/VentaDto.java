package com.veranoperfecto.venta.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record VentaDto(
        UUID id,
        String clienteId,
        String clienteNombre,
        String tipoDocumento,
        Integer subtotal,
        Integer iva,
        Integer total,
        LocalDateTime fecha,
        String estado,
        List<VentaItemDto> items,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
