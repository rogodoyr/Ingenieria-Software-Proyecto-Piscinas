package com.veranoperfecto.mantencion.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ordenes_trabajo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenTrabajo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "codigo", unique = true, nullable = false, length = 20)
    private String codigo;

    @Column(name = "cliente_id", length = 50)
    private String clienteId;

    @Column(name = "cliente_nombre")
    private String clienteNombre;

    @Column(name = "comuna", length = 100)
    private String comuna;

    @Column(name = "tecnico_id", length = 50)
    private String tecnicoId;

    @Column(name = "tecnico_nombre")
    private String tecnicoNombre;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "servicio")
    private String servicio;

    @Column(name = "prioridad", nullable = false, length = 20)
    @Builder.Default
    private String prioridad = "Normal";

    @Column(name = "estado", nullable = false, length = 20)
    @Builder.Default
    private String estado = "Pendiente";

    @Column(name = "tipo", length = 50)
    private String tipo;

    @Column(name = "observaciones", length = 1000)
    private String observaciones;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.prioridad == null) {
            this.prioridad = "Normal";
        }
        if (this.estado == null) {
            this.estado = "Pendiente";
        }
        if (this.codigo == null || this.codigo.isBlank()) {
            this.codigo = generateCodigo();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    private String generateCodigo() {
        int seq = (int) (System.currentTimeMillis() % 10000);
        return String.format("OT-%04d", seq);
    }
}
