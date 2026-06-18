# Arquitectura de la Plataforma "Verano Perfecto"

El siguiente diagrama detalla la interacción y estructura de todo el proyecto, abarcando las aplicaciones Frontend (Capa de Presentación), los Microservicios (Backend) y sus respectivas Bases de Datos.

```mermaid
graph TD
    %% Definición de estilos
    classDef frontend fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff;
    classDef microservice fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff;
    classDef database fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
    classDef actor fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff;

    %% Actores del Sistema
    Cliente((Cliente / Visitante)):::actor
    Tecnico((Técnico en Terreno)):::actor
    Admin((Administrador / Backoffice)):::actor

    %% Aplicaciones Frontend
    subgraph CapaPresentacion ["Capa de Presentación (Frontend)"]
        Landing["Landing Page<br/>(/landing-verano)"]:::frontend
        AppFront["App ERP / Dashboard<br/>(/front)"]:::frontend
    end

    %% Microservicios Spring Boot
    subgraph CapaNegocio ["Capa de Negocio (Microservicios Spring Boot)"]
        AuthService["Auth Service<br/>(Puerto: 3333)"]:::microservice
        ClienteService["Cliente Service<br/>(Puerto: 3334)"]:::microservice
        MantencionService["Mantención Service<br/>(Puerto: 3335)"]:::microservice
        VentaService["Venta Service<br/>(Puerto: 3336)"]:::microservice
        RutaService["Ruta Service<br/>(Puerto: 3337)"]:::microservice
        DashboardService["Dashboard Service<br/>(Puerto: 3338)"]:::microservice
    end

    %% Bases de datos PostgreSQL
    subgraph CapaDatos ["Capa de Datos (PostgreSQL Docker)"]
        AuthDB[(Auth DB<br/>Puerto: 5433)]:::database
        ClienteDB[(Cliente DB<br/>Puerto: 5434)]:::database
        MantencionDB[(Mantención DB<br/>Puerto: 5435)]:::database
        VentaDB[(Venta DB<br/>Puerto: 5436)]:::database
        RutaDB[(Ruta DB<br/>Puerto: 5437)]:::database
        DashboardDB[(Dashboard DB<br/>Puerto: 5438)]:::database
    end

    %% Relaciones de los Actores con el Frontend
    Cliente -->|Visita web y servicios| Landing
    Tecnico -->|Revisa rutas y tareas| AppFront
    Admin -->|Gestiona operaciones| AppFront

    %% Relaciones del Frontend con los Microservicios
    Landing -.->|Consulta pública / Contacto| ClienteService
    Landing -.->|Autenticación| AuthService

    AppFront -->|Login y Validación JWT| AuthService
    AppFront -->|Gestión de Perfiles| ClienteService
    AppFront -->|Asignación de Trabajos| MantencionService
    AppFront -->|Facturación y Productos| VentaService
    AppFront -->|Ubicación GPS (Leaflet)| RutaService
    AppFront -->|Estadísticas globales| DashboardService

    %% Relaciones de Microservicios con sus Bases de Datos
    AuthService --> AuthDB
    ClienteService --> ClienteDB
    MantencionService --> MantencionDB
    VentaService --> VentaDB
    RutaService --> RutaDB
    DashboardService --> DashboardDB

    %% Interacciones Internas (Inter-Service Communication)
    DashboardService -.->|API REST Interna| ClienteService
    DashboardService -.->|API REST Interna| VentaService
    DashboardService -.->|API REST Interna| MantencionService
```

## Explicación del Diagrama

1. **Capa de Presentación:** Muestra las dos interfaces de React. El `Landing Page` está destinado al público general y clientes prospecto, mientras que el `App ERP / Dashboard` es el panel principal usado por los técnicos (para ver sus rutas y mantenimientos en un mapa interactivo con Leaflet) y por la administración para el control del negocio.
2. **Capa de Negocio:** Se listan los 6 microservicios principales construidos en Java Spring Boot. Cada uno tiene delimitada su responsabilidad y puerto.
3. **Capa de Datos:** Cada microservicio es dueño absoluto de su propia base de datos PostgreSQL, garantizando independencia (Pattern Database-per-Service).
4. **Comunicación:** El Frontend se comunica de forma asíncrona con los servicios mediante HTTP REST enviando el JWT correspondiente. A su vez, existen servicios aglutinadores (como el `DashboardService`) que consumen APIs internas de otros microservicios para consolidar métricas de la plataforma.
