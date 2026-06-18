package com.veranoperfecto.mantencion.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.veranoperfecto.mantencion.dto.CambioEstadoDto;
import com.veranoperfecto.mantencion.dto.OrdenTrabajoDto;
import com.veranoperfecto.mantencion.dto.OrdenTrabajoRequestDto;
import com.veranoperfecto.mantencion.entity.OrdenTrabajo;
import com.veranoperfecto.mantencion.exception.ResourceNotFoundException;
import com.veranoperfecto.mantencion.exception.ValidationException;
import com.veranoperfecto.mantencion.repository.OrdenTrabajoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MantencionService {

    private static final Set<String> ESTADOS_VALIDOS = Set.of("Pendiente", "En Curso", "Completada");
    private static final Set<String> PRIORIDADES_VALIDAS = Set.of("Baja", "Normal", "Alta", "Urgente");

    private final OrdenTrabajoRepository ordenTrabajoRepository;

    @Transactional(readOnly = true)
    public List<OrdenTrabajoDto> getAllOrdenes() {
        log.debug("Obteniendo todas las órdenes de trabajo");
        return ordenTrabajoRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrdenTrabajoDto> buscarOrdenes(String estado, String tecnicoId, String fecha) {
        log.debug("Buscando órdenes con filtros - estado: {}, tecnicoId: {}, fecha: {}", estado, tecnicoId, fecha);

        List<OrdenTrabajo> resultados = ordenTrabajoRepository.findAll();

        if (estado != null && !estado.isBlank()) {
            resultados = resultados.stream()
                    .filter(ot -> estado.equalsIgnoreCase(ot.getEstado()))
                    .toList();
        }

        if (tecnicoId != null && !tecnicoId.isBlank()) {
            resultados = resultados.stream()
                    .filter(ot -> tecnicoId.equals(ot.getTecnicoId()))
                    .toList();
        }

        if (fecha != null && !fecha.isBlank()) {
            LocalDate fechaFiltro = LocalDate.parse(fecha);
            resultados = resultados.stream()
                    .filter(ot -> ot.getFechaHora() != null && ot.getFechaHora().toLocalDate().equals(fechaFiltro))
                    .toList();
        }

        return resultados.stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrdenTrabajoDto getOrdenById(UUID id) {
        log.debug("Obteniendo orden de trabajo por ID: {}", id);
        OrdenTrabajo orden = ordenTrabajoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de trabajo no encontrada con ID: " + id));
        return toDto(orden);
    }

    @Transactional
    public OrdenTrabajoDto crearOrden(OrdenTrabajoRequestDto requestDto) {
        log.debug("Creando nueva orden de trabajo para cliente: {}", requestDto.clienteNombre());

        if (requestDto.fechaHora() == null) {
            throw new ValidationException("La fecha y hora es obligatoria");
        }

        if (requestDto.prioridad() != null && !PRIORIDADES_VALIDAS.contains(requestDto.prioridad())) {
            throw new ValidationException("Prioridad no válida. Valores permitidos: " + PRIORIDADES_VALIDAS);
        }

        OrdenTrabajo orden = OrdenTrabajo.builder()
                .clienteId(requestDto.clienteId())
                .clienteNombre(requestDto.clienteNombre())
                .comuna(requestDto.comuna())
                .tecnicoId(requestDto.tecnicoId())
                .tecnicoNombre(requestDto.tecnicoNombre())
                .fechaHora(requestDto.fechaHora())
                .servicio(requestDto.servicio())
                .prioridad(requestDto.prioridad() != null ? requestDto.prioridad() : "Normal")
                .tipo(requestDto.tipo() != null ? requestDto.tipo() : "PREVENTIVA")
                .observaciones(requestDto.observaciones())
                .build();

        OrdenTrabajo saved = ordenTrabajoRepository.save(orden);
        log.info("Orden de trabajo creada exitosamente con código: {}", saved.getCodigo());
        return toDto(saved);
    }

    @Transactional
    public OrdenTrabajoDto actualizarOrden(UUID id, OrdenTrabajoRequestDto requestDto) {
        log.debug("Actualizando orden de trabajo con ID: {}", id);

        OrdenTrabajo orden = ordenTrabajoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de trabajo no encontrada con ID: " + id));

        if (requestDto.prioridad() != null && !PRIORIDADES_VALIDAS.contains(requestDto.prioridad())) {
            throw new ValidationException("Prioridad no válida. Valores permitidos: " + PRIORIDADES_VALIDAS);
        }

        orden.setClienteId(requestDto.clienteId());
        orden.setClienteNombre(requestDto.clienteNombre());
        orden.setComuna(requestDto.comuna());
        orden.setTecnicoId(requestDto.tecnicoId());
        orden.setTecnicoNombre(requestDto.tecnicoNombre());
        orden.setFechaHora(requestDto.fechaHora());
        orden.setServicio(requestDto.servicio());
        if (requestDto.prioridad() != null) {
            orden.setPrioridad(requestDto.prioridad());
        }
        if (requestDto.tipo() != null) orden.setTipo(requestDto.tipo());
        if (requestDto.observaciones() != null) orden.setObservaciones(requestDto.observaciones());

        OrdenTrabajo updated = ordenTrabajoRepository.save(orden);
        log.info("Orden de trabajo actualizada exitosamente: {}", updated.getCodigo());
        return toDto(updated);
    }

    @Transactional
    public void eliminarOrden(UUID id) {
        log.debug("Eliminando orden de trabajo con ID: {}", id);
        OrdenTrabajo orden = ordenTrabajoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de trabajo no encontrada con ID: " + id));
        ordenTrabajoRepository.delete(orden);
        log.info("Orden de trabajo eliminada exitosamente: {}", id);
    }

    @Transactional
    public OrdenTrabajoDto cambiarEstado(UUID id, CambioEstadoDto cambioEstadoDto) {
        log.debug("Cambiando estado de orden de trabajo con ID: {} a estado: {}", id, cambioEstadoDto.estado());

        OrdenTrabajo orden = ordenTrabajoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de trabajo no encontrada con ID: " + id));

        String nuevoEstado = cambioEstadoDto.estado();
        if (!ESTADOS_VALIDOS.contains(nuevoEstado)) {
            throw new ValidationException("Estado no válido. Valores permitidos: " + ESTADOS_VALIDOS);
        }

        orden.setEstado(nuevoEstado);
        OrdenTrabajo updated = ordenTrabajoRepository.save(orden);
        log.info("Estado de orden de trabajo {} cambiado a: {}", updated.getCodigo(), nuevoEstado);
        return toDto(updated);
    }

    private OrdenTrabajoDto toDto(OrdenTrabajo orden) {
        return new OrdenTrabajoDto(
                orden.getId(),
                orden.getCodigo(),
                orden.getClienteId(),
                orden.getClienteNombre(),
                orden.getComuna(),
                orden.getTecnicoId(),
                orden.getTecnicoNombre(),
                orden.getFechaHora(),
                orden.getServicio(),
                orden.getPrioridad(),
                orden.getEstado(),
                orden.getTipo(),
                orden.getObservaciones(),
                orden.getCreatedAt(),
                orden.getUpdatedAt()
        );
    }
}
