package com.veranoperfecto.mantencion.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veranoperfecto.mantencion.entity.OrdenTrabajo;

@Repository
public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, UUID> {
    Optional<OrdenTrabajo> findByCodigo(String codigo);
    List<OrdenTrabajo> findByEstado(String estado);
    List<OrdenTrabajo> findByTecnicoId(String tecnicoId);
    List<OrdenTrabajo> findByClienteId(String clienteId);
    List<OrdenTrabajo> findByPrioridad(String prioridad);
    long countByEstado(String estado);
}
