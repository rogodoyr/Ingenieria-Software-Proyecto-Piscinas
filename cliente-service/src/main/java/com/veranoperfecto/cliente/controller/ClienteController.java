package com.veranoperfecto.cliente.controller;

import com.veranoperfecto.cliente.dto.ApiResponse;
import com.veranoperfecto.cliente.dto.ClienteDto;
import com.veranoperfecto.cliente.dto.ClienteRequestDto;
import com.veranoperfecto.cliente.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClienteDto>>> listarClientes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String estado) {
        log.debug("GET /api/clientes - search: {}, tipo: {}, estado: {}", search, tipo, estado);

        List<ClienteDto> clientes;
        if (search != null || tipo != null || estado != null) {
            clientes = clienteService.buscarClientes(search, tipo, estado);
        } else {
            clientes = clienteService.getAllClientes();
        }

        return ResponseEntity.ok(ApiResponse.success(clientes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDto>> getCliente(@PathVariable UUID id) {
        log.debug("GET /api/clientes/{}", id);
        ClienteDto cliente = clienteService.getClienteById(id);
        return ResponseEntity.ok(ApiResponse.success(cliente));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClienteDto>> crearCliente(@Valid @RequestBody ClienteRequestDto request) {
        log.debug("POST /api/clientes - nombre: {}", request.nombre());
        ClienteDto cliente = clienteService.crearCliente(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDto>> actualizarCliente(
            @PathVariable UUID id,
            @Valid @RequestBody ClienteRequestDto request) {
        log.debug("PUT /api/clientes/{}", id);
        ClienteDto cliente = clienteService.actualizarCliente(id, request);
        return ResponseEntity.ok(ApiResponse.success(cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDto>> eliminarCliente(@PathVariable UUID id) {
        log.debug("DELETE /api/clientes/{}", id);
        ClienteDto cliente = clienteService.eliminarCliente(id);
        return ResponseEntity.ok(ApiResponse.success(cliente));
    }
}
