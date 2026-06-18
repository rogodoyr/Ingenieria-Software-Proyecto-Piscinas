package com.veranoperfecto.venta.controller;

import com.veranoperfecto.venta.dto.ApiResponse;
import com.veranoperfecto.venta.dto.ProductoDto;
import com.veranoperfecto.venta.dto.ProductoRequestDto;
import com.veranoperfecto.venta.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductoDto>>> listarProductos(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoria
    ) {
        log.debug("GET /api/productos - search={}, categoria={}", search, categoria);

        List<ProductoDto> productos;
        if (search != null || categoria != null) {
            productos = productoService.buscarProductos(search, categoria);
        } else {
            productos = productoService.getAllProductos();
        }

        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    @GetMapping("/alertas-stock")
    public ResponseEntity<ApiResponse<List<ProductoDto>>> getAlertasStock() {
        log.debug("GET /api/productos/alertas-stock");
        List<ProductoDto> alertas = productoService.getAlertasStock();
        return ResponseEntity.ok(ApiResponse.success(alertas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDto>> getProducto(@PathVariable UUID id) {
        log.debug("GET /api/productos/{}", id);
        ProductoDto producto = productoService.getProductoById(id);
        return ResponseEntity.ok(ApiResponse.success(producto));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductoDto>> crearProducto(
            @Valid @RequestBody ProductoRequestDto request
    ) {
        log.debug("POST /api/productos - nombre={}", request.nombre());
        ProductoDto producto = productoService.crearProducto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDto>> actualizarProducto(
            @PathVariable UUID id,
            @Valid @RequestBody ProductoRequestDto request
    ) {
        log.debug("PUT /api/productos/{}", id);
        ProductoDto producto = productoService.actualizarProducto(id, request);
        return ResponseEntity.ok(ApiResponse.success(producto));
    }
}
