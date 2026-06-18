package com.veranoperfecto.dashboard.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veranoperfecto.dashboard.entity.Inventario;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, UUID> {
    List<Inventario> findByEstadoCriticoTrue();
}
