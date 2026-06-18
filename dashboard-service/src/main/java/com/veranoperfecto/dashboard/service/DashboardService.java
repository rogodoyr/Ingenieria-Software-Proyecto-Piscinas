package com.veranoperfecto.dashboard.service;

import com.veranoperfecto.dashboard.client.ClienteServiceClient;
import com.veranoperfecto.dashboard.client.MantencionServiceClient;
import com.veranoperfecto.dashboard.client.VentaServiceClient;
import com.veranoperfecto.dashboard.dto.InventarioDto;
import com.veranoperfecto.dashboard.dto.InventarioRequestDto;
import com.veranoperfecto.dashboard.dto.MantencionProximaDto;
import com.veranoperfecto.dashboard.dto.MetricaDashboardDto;
import com.veranoperfecto.dashboard.entity.Inventario;
import com.veranoperfecto.dashboard.exception.ResourceNotFoundException;
import com.veranoperfecto.dashboard.repository.InventarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final InventarioRepository inventarioRepository;
    private final ClienteServiceClient clienteServiceClient;
    private final MantencionServiceClient mantencionServiceClient;
    private final VentaServiceClient ventaServiceClient;

    public DashboardService(
            InventarioRepository inventarioRepository,
            ClienteServiceClient clienteServiceClient,
            MantencionServiceClient mantencionServiceClient,
            VentaServiceClient ventaServiceClient
    ) {
        this.inventarioRepository = inventarioRepository;
        this.clienteServiceClient = clienteServiceClient;
        this.mantencionServiceClient = mantencionServiceClient;
        this.ventaServiceClient = ventaServiceClient;
    }

    public MetricaDashboardDto getMetricas() {
        long ingresosMes = ventaServiceClient.getIngresosMes();
        long mantencionesHoy = mantencionServiceClient.countMantencionesHoy();
        long mantencionesCompletadas = mantencionServiceClient.countMantencionesCompletadas();
        long totalClientes = clienteServiceClient.countClientesActivos();

        List<Inventario> inventarioItems = inventarioRepository.findAll();
        int nivelQuimicos = 0;
        if (!inventarioItems.isEmpty()) {
            double promedio = inventarioItems.stream()
                    .mapToInt(Inventario::getNivelPorcentaje)
                    .average()
                    .orElse(0.0);
            nivelQuimicos = (int) Math.round(promedio);
        }

        int variacionIngresos = 0;

        return new MetricaDashboardDto(
                ingresosMes,
                variacionIngresos,
                (int) mantencionesHoy,
                (int) mantencionesCompletadas,
                nivelQuimicos,
                (int) totalClientes
        );
    }

    public List<MantencionProximaDto> getMantencionesProximas() {
        return mantencionServiceClient.getMantencionesProximas();
    }

    public List<InventarioDto> getAlertasInventario() {
        return ventaServiceClient.getAlertasStock();
    }

    @Transactional
    public InventarioDto crearInventario(InventarioRequestDto requestDto) {
        Inventario inventario = Inventario.builder()
                .nombre(requestDto.nombre())
                .cantidad(requestDto.cantidad())
                .unidad(requestDto.unidad() != null ? requestDto.unidad() : "Unidades")
                .nivelPorcentaje(requestDto.nivelPorcentaje())
                .estadoCritico(evaluarEstadoCritico(requestDto.cantidad(), requestDto.nivelPorcentaje(), requestDto.estadoCritico()))
                .build();

        Inventario saved = inventarioRepository.save(inventario);
        return mapToDto(saved);
    }

    @Transactional
    public InventarioDto actualizarInventario(UUID id, InventarioRequestDto requestDto) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));

        inventario.setNombre(requestDto.nombre());
        inventario.setCantidad(requestDto.cantidad());
        inventario.setUnidad(requestDto.unidad() != null ? requestDto.unidad() : inventario.getUnidad());
        inventario.setNivelPorcentaje(requestDto.nivelPorcentaje());
        inventario.setEstadoCritico(evaluarEstadoCritico(requestDto.cantidad(), requestDto.nivelPorcentaje(), requestDto.estadoCritico()));

        Inventario updated = inventarioRepository.save(inventario);
        return mapToDto(updated);
    }

    private Boolean evaluarEstadoCritico(Integer cantidad, Integer nivelPorcentaje, Boolean estadoCritico) {
        if (Boolean.TRUE.equals(estadoCritico)) {
            return true;
        }
        return cantidad < 5 || nivelPorcentaje < 20;
    }

    private InventarioDto mapToDto(Inventario inventario) {
        return new InventarioDto(
                inventario.getId(),
                inventario.getNombre(),
                inventario.getCantidad(),
                inventario.getUnidad(),
                inventario.getNivelPorcentaje(),
                inventario.getEstadoCritico()
        );
    }
}
