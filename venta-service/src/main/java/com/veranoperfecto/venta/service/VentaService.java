package com.veranoperfecto.venta.service;

import com.veranoperfecto.venta.dto.VentaDto;
import com.veranoperfecto.venta.dto.VentaItemDto;
import com.veranoperfecto.venta.dto.VentaRequestDto;
import com.veranoperfecto.venta.entity.Venta;
import com.veranoperfecto.venta.entity.VentaItem;
import com.veranoperfecto.venta.entity.Producto;
import com.veranoperfecto.venta.exception.ResourceNotFoundException;
import com.veranoperfecto.venta.exception.ValidationException;
import com.veranoperfecto.venta.repository.VentaRepository;
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
public class VentaService {

    private static final double IVA_RATE = 0.19;
    private static final List<String> VALID_ESTADOS = List.of("Borrador", "Emitida", "Pagada");

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<VentaDto> getAllVentas() {
        log.debug("Fetching all ventas");
        return ventaRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public VentaDto getVentaById(UUID id) {
        log.debug("Fetching venta with id={}", id);
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));
        return toDto(venta);
    }

    @Transactional
    public VentaDto crearVenta(VentaRequestDto request) {
        log.debug("Creating new venta for cliente={}", request.clienteNombre());

        if (request.items() == null || request.items().isEmpty()) {
            throw new ValidationException("La venta debe tener al menos un item");
        }

        // Calculate subtotal from items (cantidad * precioUnitario)
        int subtotal = request.items().stream()
                .mapToInt(item -> item.cantidad() * item.precioUnitario())
                .sum();

        // Calculate Chilean IVA (19%)
        int iva = (int) Math.round(subtotal * IVA_RATE);

        // Calculate total
        int total = subtotal + iva;

        Venta venta = Venta.builder()
                .clienteId(request.clienteId())
                .clienteNombre(request.clienteNombre())
                .tipoDocumento(request.tipoDocumento() != null ? request.tipoDocumento() : "Factura Electrónica")
                .subtotal(subtotal)
                .iva(iva)
                .total(total)
                .estado("Borrador")
                .build();

        // Add items and deduct stock
        for (VentaItemDto itemDto : request.items()) {
            Producto p = productoRepository.findById(itemDto.productoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + itemDto.productoId()));
            
            int cantidad = itemDto.cantidad() != null ? itemDto.cantidad() : 1;
            
            if (p.getStock() < cantidad) {
                throw new ValidationException("Stock insuficiente para el producto: " + p.getNombre() + " (Disponible: " + p.getStock() + ", Solicitado: " + cantidad + ")");
            }
            
            // Descontar stock
            p.setStock(p.getStock() - cantidad);
            productoRepository.save(p);

            VentaItem item = VentaItem.builder()
                    .productoId(itemDto.productoId())
                    .productoNombre(itemDto.productoNombre())
                    .cantidad(cantidad)
                    .precioUnitario(itemDto.precioUnitario() != null ? itemDto.precioUnitario() : 0)
                    .venta(venta)
                    .build();
            venta.getItems().add(item);
        }

        Venta saved = ventaRepository.save(venta);
        log.info("Venta created with id={}, total={}", saved.getId(), saved.getTotal());
        return toDto(saved);
    }

    @Transactional
    public VentaDto cambiarEstado(UUID id, String nuevoEstado) {
        log.debug("Changing estado of venta {} to {}", id, nuevoEstado);

        if (!VALID_ESTADOS.contains(nuevoEstado)) {
            throw new ValidationException("Estado inválido: " + nuevoEstado + ". Estados válidos: " + VALID_ESTADOS);
        }

        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));

        venta.setEstado(nuevoEstado);
        Venta updated = ventaRepository.save(venta);
        log.info("Venta {} estado changed to {}", id, nuevoEstado);
        return toDto(updated);
    }

    public VentaDto toDto(Venta venta) {
        List<VentaItemDto> items = venta.getItems().stream()
                .map(this::toItemDto)
                .toList();

        return new VentaDto(
                venta.getId(),
                venta.getClienteId(),
                venta.getClienteNombre(),
                venta.getTipoDocumento(),
                venta.getSubtotal(),
                venta.getIva(),
                venta.getTotal(),
                venta.getFecha(),
                venta.getEstado(),
                items,
                venta.getCreatedAt(),
                venta.getUpdatedAt()
        );
    }

    private VentaItemDto toItemDto(VentaItem item) {
        return new VentaItemDto(
                item.getProductoId(),
                item.getProductoNombre(),
                item.getCantidad(),
                item.getPrecioUnitario()
        );
    }
}
