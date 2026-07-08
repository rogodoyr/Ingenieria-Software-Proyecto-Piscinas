package com.veranoperfecto.ruta.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.veranoperfecto.ruta.dto.CambioEstadoTecnicoDto;
import com.veranoperfecto.ruta.dto.TecnicoDto;
import com.veranoperfecto.ruta.dto.TecnicoRequestDto;
import com.veranoperfecto.ruta.dto.UbicacionDto;
import com.veranoperfecto.ruta.entity.Tecnico;
import com.veranoperfecto.ruta.exception.ResourceNotFoundException;
import com.veranoperfecto.ruta.exception.ValidationException;
import com.veranoperfecto.ruta.repository.TecnicoRepository;

@Service
public class TecnicoService {

    private static final Set<String> ESTADOS_VALIDOS = Set.of("Disponible", "En Ruta");

    private final TecnicoRepository tecnicoRepository;

    public TecnicoService(TecnicoRepository tecnicoRepository) {
        this.tecnicoRepository = tecnicoRepository;
    }

    public List<TecnicoDto> getAllTecnicos() {
        return tecnicoRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public TecnicoDto getTecnicoById(UUID id) {
        Tecnico tecnico = tecnicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado con ID: " + id));
        return toDto(tecnico);
    }

    public TecnicoDto crearTecnico(TecnicoRequestDto request) {
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw new ValidationException("El nombre del técnico es obligatorio");
        }

        Tecnico tecnico = Tecnico.builder()
                .nombre(request.nombre())
                .comuna(request.comuna())
                .telefono(request.telefono())
                .estado("Disponible")
                .lat(-33.456940)
                .lng(-70.648270)
                .rutaProgreso(0)
                .build();

        tecnicoRepository.save(tecnico);
        return toDto(tecnico);
    }

    public TecnicoDto actualizarUbicacion(UUID id, UbicacionDto ubicacionDto) {
        Tecnico tecnico = tecnicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado con ID: " + id));

        tecnico.setLat(ubicacionDto.lat());
        tecnico.setLng(ubicacionDto.lng());

        tecnicoRepository.save(tecnico);
        return toDto(tecnico);
    }

    public TecnicoDto cambiarEstado(UUID id, CambioEstadoTecnicoDto cambioEstadoDto) {
        Tecnico tecnico = tecnicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado con ID: " + id));

        String nuevoEstado = cambioEstadoDto.estado();
        if (!ESTADOS_VALIDOS.contains(nuevoEstado)) {
            throw new ValidationException("Estado inválido: " + nuevoEstado + ". Estados válidos: " + ESTADOS_VALIDOS);
        }

        tecnico.setEstado(nuevoEstado);
        tecnicoRepository.save(tecnico);
        return toDto(tecnico);
    }

    public void deleteTecnico(UUID id) {
        Tecnico tecnico = tecnicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado con ID: " + id));
        tecnicoRepository.delete(tecnico);
    }

    private TecnicoDto toDto(Tecnico tecnico) {
        return new TecnicoDto(
                tecnico.getId(),
                tecnico.getCodigo(),
                tecnico.getNombre(),
                tecnico.getComuna(),
                tecnico.getEstado(),
                tecnico.getLat(),
                tecnico.getLng(),
                tecnico.getTelefono(),
                tecnico.getRutaProgreso(),
                tecnico.getCreatedAt(),
                tecnico.getUpdatedAt()
        );
    }
}
