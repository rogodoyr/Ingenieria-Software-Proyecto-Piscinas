package com.veranoperfecto.ruta.entity;

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
@Table(name = "tecnicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 20)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 100)
    private String comuna;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "Disponible";

    @Column
    @Builder.Default
    private Double lat = -33.456940;

    @Column
    @Builder.Default
    private Double lng = -70.648270;

    @Column(length = 50)
    private String telefono;

    @Column(name = "ruta_progreso")
    @Builder.Default
    private Integer rutaProgreso = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (codigo == null || codigo.isBlank()) {
            codigo = "TEC-" + String.format("%02d", (int) (Math.random() * 99) + 1);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
