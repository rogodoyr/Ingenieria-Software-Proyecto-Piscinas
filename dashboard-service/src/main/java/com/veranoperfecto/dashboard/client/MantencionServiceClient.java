package com.veranoperfecto.dashboard.client;

import com.veranoperfecto.dashboard.dto.MantencionProximaDto;

import java.util.List;

public interface MantencionServiceClient {
    long countMantencionesHoy();
    long countMantencionesCompletadas();
    List<MantencionProximaDto> getMantencionesProximas();
}
