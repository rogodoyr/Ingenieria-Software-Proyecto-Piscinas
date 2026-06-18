package com.veranoperfecto.ruta.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.veranoperfecto.ruta.dto.RutaDto;
import com.veranoperfecto.ruta.dto.RutaDto.RutaParadaDto;
import com.veranoperfecto.ruta.entity.Tecnico;
import com.veranoperfecto.ruta.repository.TecnicoRepository;

@Service
public class RutaService {

    private final TecnicoRepository tecnicoRepository;

    public RutaService(TecnicoRepository tecnicoRepository) {
        this.tecnicoRepository = tecnicoRepository;
    }

    public List<RutaDto> getRutas() {
        List<Tecnico> tecnicosEnRuta = new ArrayList<>();
        tecnicosEnRuta.addAll(tecnicoRepository.findByEstado("En Ruta"));
        tecnicosEnRuta.addAll(tecnicoRepository.findByEstado("En Mantención"));

        return tecnicosEnRuta.stream()
                .map(this::toRutaDto)
                .toList();
    }

    private RutaDto toRutaDto(Tecnico tecnico) {
        List<RutaParadaDto> paradas = generarParadasSimuladas(tecnico);
        return new RutaDto(
                tecnico.getId().toString(),
                tecnico.getNombre(),
                paradas
        );
    }

    private List<RutaParadaDto> generarParadasSimuladas(Tecnico tecnico) {
        List<RutaParadaDto> paradas = new ArrayList<>();

        if ("En Ruta".equals(tecnico.getEstado())) {
            paradas.add(new RutaParadaDto("CLI-001", tecnico.getComuna() != null ? tecnico.getComuna() : "Santiago", 1));
            paradas.add(new RutaParadaDto("CLI-002", "Providencia", 2));
            paradas.add(new RutaParadaDto("CLI-003", "Las Condes", 3));
        } else if ("En Mantención".equals(tecnico.getEstado())) {
            paradas.add(new RutaParadaDto("CLI-010", tecnico.getComuna() != null ? tecnico.getComuna() : "Santiago", 1));
        }

        return paradas;
    }
}
