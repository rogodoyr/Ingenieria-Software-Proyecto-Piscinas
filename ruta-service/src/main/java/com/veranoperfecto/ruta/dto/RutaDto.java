package com.veranoperfecto.ruta.dto;

import java.util.List;

public record RutaDto(
        String tecnicoId,
        String tecnicoNombre,
        List<RutaParadaDto> paradas
) {

    public record RutaParadaDto(
            String clienteId,
            String comuna,
            Integer orden
    ) {
    }
}
