package com.veranoperfecto.cliente.service;

import com.veranoperfecto.cliente.dto.ClienteDto;
import com.veranoperfecto.cliente.dto.ClienteRequestDto;
import com.veranoperfecto.cliente.entity.Cliente;
import com.veranoperfecto.cliente.exception.ResourceNotFoundException;
import com.veranoperfecto.cliente.exception.ValidationException;
import com.veranoperfecto.cliente.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteDto> getAllClientes() {
        log.debug("Fetching all clientes");
        return clienteRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClienteDto> buscarClientes(String search, String tipo, String estado) {
        log.debug("Searching clientes - search: {}, tipo: {}, estado: {}", search, tipo, estado);

        List<Cliente> resultados;

        if (tipo != null && estado != null) {
            resultados = clienteRepository.findByTipoAndEstado(tipo, estado);
        } else if (tipo != null) {
            resultados = clienteRepository.findByTipo(tipo);
        } else if (estado != null) {
            resultados = clienteRepository.findByEstado(estado);
        } else if (search != null && !search.isBlank()) {
            resultados = clienteRepository.findByNombreContainingIgnoreCase(search);
        } else {
            resultados = clienteRepository.findAll();
        }

        return resultados.stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteDto getClienteById(UUID id) {
        log.debug("Fetching cliente by id: {}", id);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + id));
        return toDto(cliente);
    }

    @Transactional
    public ClienteDto crearCliente(ClienteRequestDto request) {
        log.debug("Creating cliente: {}", request.nombre());

        // Validate
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw new ValidationException("El nombre del cliente es obligatorio");
        }

        // Generate sequential codigo
        long count = clienteRepository.count();
        String codigo = String.format("CLI-%03d", count + 1);

        // Ensure uniqueness
        while (clienteRepository.findByCodigo(codigo).isPresent()) {
            count++;
            codigo = String.format("CLI-%03d", count + 1);
        }

        Cliente cliente = Cliente.builder()
                .codigo(codigo)
                .nombre(request.nombre())
                .tipo(request.tipo() != null ? request.tipo() : "Natural")
                .rut(request.rut())
                .comuna(request.comuna())
                .telefono(request.telefono())
                .email(request.email())
                .direccion(request.direccion())
                .estado(request.estado() != null ? request.estado() : "Activo")
                .notas(request.notas())
                .build();

        Cliente saved = clienteRepository.save(cliente);
        log.debug("Cliente created successfully with codigo: {}", saved.getCodigo());
        return toDto(saved);
    }

    @Transactional
    public ClienteDto actualizarCliente(UUID id, ClienteRequestDto request) {
        log.debug("Updating cliente id: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + id));

        if (request.nombre() != null && !request.nombre().isBlank()) {
            cliente.setNombre(request.nombre());
        }
        if (request.tipo() != null) {
            cliente.setTipo(request.tipo());
        }
        if (request.rut() != null) {
            cliente.setRut(request.rut());
        }
        if (request.comuna() != null) {
            cliente.setComuna(request.comuna());
        }
        if (request.telefono() != null) {
            cliente.setTelefono(request.telefono());
        }
        if (request.email() != null) {
            cliente.setEmail(request.email());
        }
        if (request.direccion() != null) {
            cliente.setDireccion(request.direccion());
        }
        if (request.estado() != null) {
            cliente.setEstado(request.estado());
        }
        if (request.notas() != null) {
            cliente.setNotas(request.notas());
        }

        Cliente updated = clienteRepository.save(cliente);
        log.debug("Cliente updated successfully: {}", updated.getCodigo());
        return toDto(updated);
    }

    @Transactional
    public ClienteDto eliminarCliente(UUID id) {
        log.debug("Soft deleting cliente id: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + id));

        cliente.setEstado("Inactivo");
        Cliente updated = clienteRepository.save(cliente);
        log.debug("Cliente soft deleted successfully: {}", updated.getCodigo());
        return toDto(updated);
    }

    private ClienteDto toDto(Cliente cliente) {
        return new ClienteDto(
                cliente.getId(),
                cliente.getCodigo(),
                cliente.getNombre(),
                cliente.getTipo(),
                cliente.getRut(),
                cliente.getComuna(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getDireccion(),
                cliente.getEstado(),
                cliente.getNotas(),
                cliente.getCreatedAt(),
                cliente.getUpdatedAt()
        );
    }
}
