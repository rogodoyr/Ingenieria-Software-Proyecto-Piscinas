package com.veranoperfecto.cliente.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veranoperfecto.cliente.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    Optional<Cliente> findByCodigo(String codigo);
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
    List<Cliente> findByTipo(String tipo);
    List<Cliente> findByEstado(String estado);
    List<Cliente> findByComunaContainingIgnoreCase(String comuna);
    List<Cliente> findByTipoAndEstado(String tipo, String estado);
    long countByEstado(String estado);
}
