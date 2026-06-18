package com.veranoperfecto.dashboard.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.veranoperfecto.dashboard.dto.ApiResponse;

import java.util.List;
import java.util.Map;

@Component
public class ClienteServiceClientImpl implements ClienteServiceClient {

    private final RestClient restClient;

    public ClienteServiceClientImpl(@Value("${apiCliente.url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    @SuppressWarnings("unchecked")
    public long countClientesActivos() {
        try {
            ApiResponse<List<Map<String, Object>>> response = restClient.get()
                    .uri("/clientes?estado=Activo")
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
}
