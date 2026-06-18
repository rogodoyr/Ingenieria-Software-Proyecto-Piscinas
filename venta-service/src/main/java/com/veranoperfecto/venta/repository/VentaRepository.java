package com.veranoperfecto.venta.repository;

import com.veranoperfecto.venta.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VentaRepository extends JpaRepository<Venta, UUID> {

    List<Venta> findByClienteId(String clienteId);

    List<Venta> findByEstado(String estado);
}
