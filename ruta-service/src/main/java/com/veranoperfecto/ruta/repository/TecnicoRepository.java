package com.veranoperfecto.ruta.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veranoperfecto.ruta.entity.Tecnico;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, UUID> {
    Optional<Tecnico> findByCodigo(String codigo);
    List<Tecnico> findByEstado(String estado);
    List<Tecnico> findByComunaContainingIgnoreCase(String comuna);
}
