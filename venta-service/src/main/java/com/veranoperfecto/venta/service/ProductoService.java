package com.veranoperfecto.venta.service;

import com.veranoperfecto.venta.dto.ProductoDto;
import com.veranoperfecto.venta.dto.ProductoRequestDto;
import com.veranoperfecto.venta.entity.Producto;
import com.veranoperfecto.venta.exception.ResourceNotFoundException;
import com.veranoperfecto.venta.exception.ValidationException;
import com.veranoperfecto.venta.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<ProductoDto> getAllProductos() {
        log.debug("Fetching all productos");
        return productoRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDto> getAlertasStock() {
        log.debug("Fetching low stock alerts from ventas");
        return productoRepository.findLowStock().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDto> buscarProductos(String search, String categoria) {
        log.debug("Searching productos with search={}, categoria={}", search, categoria);

        if (search != null && !search.isBlank() && categoria != null && !categoria.isBlank()) {
            return productoRepository.findByCategoria(categoria).stream()
                    .filter(p -> p.getNombre().toLowerCase().contains(search.toLowerCase()))
                    .map(this::toDto)
                    .toList();
        } else if (search != null && !search.isBlank()) {
            return productoRepository.findByNombreContainingIgnoreCase(search).stream()
                    .map(this::toDto)
                    .toList();
        } else if (categoria != null && !categoria.isBlank()) {
            return productoRepository.findByCategoria(categoria).stream()
                    .map(this::toDto)
                    .toList();
        }

        return getAllProductos();
    }

    @Transactional(readOnly = true)
    public ProductoDto getProductoById(UUID id) {
        log.debug("Fetching producto with id={}", id);
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return toDto(producto);
    }

    @Transactional
    public ProductoDto crearProducto(ProductoRequestDto request) {
        log.debug("Creating new producto: {}", request.nombre());

        if (request.nombre() == null || request.nombre().isBlank()) {
            throw new ValidationException("El nombre del producto es obligatorio");
        }

        Producto producto = Producto.builder()
                .nombre(request.nombre())
                .categoria(request.categoria() != null ? request.categoria() : "Insumo")
                .precio(request.precio() != null ? request.precio() : 0)
                .icono(request.icono())
                .descripcion(request.descripcion())
                .stock(request.stock() != null ? request.stock() : 0)
                .minimo(request.minimo() != null ? request.minimo() : 5)
                .activo(true)
                .build();

        Producto saved = productoRepository.save(producto);
        log.info("Producto created with id={}", saved.getId());
        return toDto(saved);
    }

    @Transactional
    public ProductoDto actualizarProducto(UUID id, ProductoRequestDto request) {
        log.debug("Updating producto with id={}", id);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));

        if (request.nombre() != null && !request.nombre().isBlank()) {
            producto.setNombre(request.nombre());
        }
        if (request.categoria() != null) {
            producto.setCategoria(request.categoria());
        }
        if (request.precio() != null) {
            producto.setPrecio(request.precio());
        }
        if (request.icono() != null) {
            producto.setIcono(request.icono());
        }
        if (request.descripcion() != null) {
            producto.setDescripcion(request.descripcion());
        }
        if (request.stock() != null) {
            producto.setStock(request.stock());
        }
        if (request.minimo() != null) {
            producto.setMinimo(request.minimo());
        }

        Producto updated = productoRepository.save(producto);
        log.info("Producto updated with id={}", updated.getId());
        return toDto(updated);
    }

    public ProductoDto toDto(Producto producto) {
        return new ProductoDto(
                producto.getId(),
                producto.getNombre(),
                producto.getCategoria(),
                producto.getPrecio(),
                producto.getIcono(),
                producto.getDescripcion(),
                producto.getActivo(),
                producto.getStock(),
                producto.getMinimo(),
                producto.getCreatedAt(),
                producto.getUpdatedAt()
        );
    }
}
