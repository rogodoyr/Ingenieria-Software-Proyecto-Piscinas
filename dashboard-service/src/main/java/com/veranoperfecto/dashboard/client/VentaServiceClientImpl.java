package com.veranoperfecto.dashboard.client;

import com.veranoperfecto.dashboard.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import com.veranoperfecto.dashboard.dto.InventarioDto;

@Component
public class VentaServiceClientImpl implements VentaServiceClient {

    private final RestClient restClient;

    public VentaServiceClientImpl(@Value("${apiVenta.url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    @SuppressWarnings("unchecked")
    public long getIngresosMes() {
        try {
            String mesActual = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
            ApiResponse<List<Map<String, Object>>> response = restClient.get()
                    .uri("/ventas")
                    .retrieve()
                    .body(ApiResponse.class);
            if (response != null && response.data() != null) {
                List<Map<String, Object>> ventas = (List<Map<String, Object>>) response.data();
                return ventas.stream()
                        .filter(v -> {
                            Object fecha = v.get("fecha");
                            if (fecha != null) {
                                String fechaStr = fecha.toString();
                                return fechaStr.startsWith(mesActual);
                            }
                            return false;
                        })
                        .mapToLong(v -> {
                            Object total = v.get("total");
                            if (total != null) {
                                try {
                                    return Long.parseLong(total.toString());
                                } catch (NumberFormatException e) {
                                    return 0L;
                                }
                            }
                            return 0L;
                        })
                        .sum();
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<InventarioDto> getAlertasStock() {
        try {
            ApiResponse<List<Map<String, Object>>> response = restClient.get()
                    .uri("/productos/alertas-stock")
                    .retrieve()
                    .body(ApiResponse.class);
            if (response != null && response.data() != null) {
                List<Map<String, Object>> productos = response.data();
                return productos.stream().map(p -> {
                    java.util.UUID id = p.get("id") != null ? java.util.UUID.fromString(p.get("id").toString()) : null;
                    String nombre = p.get("nombre") != null ? p.get("nombre").toString() : "";
                    int stock = p.get("stock") != null ? Integer.parseInt(p.get("stock").toString()) : 0;
                    int minimo = p.get("minimo") != null ? Integer.parseInt(p.get("minimo").toString()) : 5;
                    if (minimo <= 0) minimo = 5;
                    int pct = (int) Math.round(((double) stock / minimo) * 100);
                    return new InventarioDto(id, nombre, stock, "Unidades", pct, stock < 20);
                }).toList();
            }
        } catch (Exception e) {
            System.err.println("Error fetching alertas stock: " + e.getMessage());
        }
        return List.of();
    }
}
