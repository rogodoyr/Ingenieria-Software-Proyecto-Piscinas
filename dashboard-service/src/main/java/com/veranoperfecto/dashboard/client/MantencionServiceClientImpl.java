package com.veranoperfecto.dashboard.client;

import com.veranoperfecto.dashboard.dto.ApiResponse;
import com.veranoperfecto.dashboard.dto.MantencionProximaDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class MantencionServiceClientImpl implements MantencionServiceClient {

    private final RestClient restClient;

    public MantencionServiceClientImpl(@Value("${apiMantencion.url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    @SuppressWarnings("unchecked")
    public long countMantencionesHoy() {
        try {
            String hoy = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            ApiResponse<List<Map<String, Object>>> response = restClient.get()
                    .uri("/mantenciones?fecha=" + hoy)
                    .retrieve()
                    .body(ApiResponse.class);
            if (response != null && response.data() != null) {
                return ((List<?>) response.data()).size();
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public long countMantencionesCompletadas() {
        try {
            ApiResponse<List<Map<String, Object>>> response = restClient.get()
                    .uri("/mantenciones?estado=Completada")
                    .retrieve()
                    .body(ApiResponse.class);
            if (response != null && response.data() != null) {
                return ((List<?>) response.data()).size();
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<MantencionProximaDto> getMantencionesProximas() {
        try {
            ApiResponse<List<Map<String, Object>>> response = restClient.get()
                    .uri("/mantenciones")
                    .retrieve()
                    .body(ApiResponse.class);
            if (response != null && response.data() != null) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.data();
                List<MantencionProximaDto> result = new ArrayList<>();
                for (Map<String, Object> item : data) {
                    String estado = item.get("estado") != null ? item.get("estado").toString() : "";
                    if (!"Completada".equalsIgnoreCase(estado) && !"Cancelada".equalsIgnoreCase(estado)) {
                        result.add(mapToDto(item));
                    }
                }
                return result;
            }
            return new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private MantencionProximaDto mapToDto(Map<String, Object> item) {
        return new MantencionProximaDto(
                item.get("id") != null ? item.get("id").toString() : null,
                item.get("codigo") != null ? item.get("codigo").toString() : null,
                item.get("clienteNombre") != null ? item.get("clienteNombre").toString() : null,
                item.get("comuna") != null ? item.get("comuna").toString() : null,
                item.get("servicio") != null ? item.get("servicio").toString() : null,
                item.get("prioridad") != null ? item.get("prioridad").toString() : null,
                item.get("fechaHora") != null ? item.get("fechaHora").toString() : null,
                item.get("estado") != null ? item.get("estado").toString() : null,
                item.get("tecnicoId") != null ? item.get("tecnicoId").toString() : null,
                item.get("tecnicoNombre") != null ? item.get("tecnicoNombre").toString() : null
        );
    }
}
