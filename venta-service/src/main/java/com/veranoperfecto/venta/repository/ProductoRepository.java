package com.veranoperfecto.venta.repository;

import com.veranoperfecto.venta.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, UUID> {

    List<Producto> findByCategoria(String categoria);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByActivoTrue();

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Producto p WHERE p.stock < 20 AND p.activo = true")
    List<Producto> findLowStock();
}
