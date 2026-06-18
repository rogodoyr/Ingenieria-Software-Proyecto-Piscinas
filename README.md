# ☀️ Verano Perfecto - Plataforma Integral de Gestión de Piscinas

Bienvenido al repositorio oficial de **Verano Perfecto**, un completo sistema ERP diseñado específicamente para la gestión, mantenimiento y administración de servicios de piscinas. La plataforma está compuesta por una robusta arquitectura de microservicios en el backend y aplicaciones frontend modernas, brindando una solución escalable, segura y de alto rendimiento.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura orientada a microservicios, donde cada dominio de negocio está aislado y cuenta con su propia base de datos. Para ver un diagrama visual completo de la arquitectura y cómo interactúan las distintas piezas, por favor revisa el archivo [diagrama.md](./diagrama.md).

### 🖥️ Frontend (Capa de Presentación)

La plataforma cuenta con dos interfaces construidas con tecnologías modernas:

| Aplicación | Descripción | Tecnologías Clave |
|------------|-------------|-------------------|
| **Landing Page** (`/landing-verano`) | Sitio web público y presentación del servicio. | React 19, Tailwind CSS, Framer Motion, Headless UI |
| **ERP / Dashboard** (`/front`) | Panel de administración y sistema central de gestión para administradores y técnicos. | React 19, Tailwind CSS, React Leaflet (Mapas/GPS) |

### ⚙️ Backend (Microservicios)

El backend está construido con **Java 25** y **Spring Boot 4.0.6**, dividiéndose en 6 servicios independientes:

| Servicio | Puerto | Base de Datos | Responsabilidad Principal |
|----------|--------|---------------|---------------------------|
| **auth-service** | `3333` | `auth_db` (`5433`) | Autenticación JWT, autorización y gestión de usuarios. |
| **cliente-service** | `3334` | `cliente_db` (`5434`) | CRUD y administración de clientes (Persona Natural / Jurídica). |
| **mantencion-service**| `3335` | `mantencion_db` (`5435`) | Gestión de órdenes de trabajo, mantenimientos y servicios. |
| **venta-service** | `3336` | `venta_db` (`5436`) | Catálogo de productos, gestión de ventas y facturación (cálculo IVA). |
| **ruta-service** | `3337` | `ruta_db` (`5437`) | Administración de técnicos, planificación de rutas y tracking GPS. |
| **dashboard-service** | `3338` | `dashboard_db` (`5438`) | Consolidación de métricas, estadísticas globales e inventario. |

---

## 🛠️ Stack Tecnológico

**Backend & Bases de Datos:**
- **Lenguaje:** Java 25 (toolchain)
- **Framework:** Spring Boot 4.0.6
- **Persistencia:** Spring Data JPA + Hibernate
- **Seguridad:** Spring Security + JWT (jjwt 0.11.5)
- **Bases de Datos:** PostgreSQL 16 (vía Docker)
- **Migraciones:** Flyway
- **Construcción:** Gradle 9.4.1 + Lombok

**Frontend:**
- **Framework Core:** React 19 + Vite
- **Estilos:** Tailwind CSS 4.0
- **Mapas y Geolocalización:** Leaflet & React Leaflet
- **Animaciones:** Framer Motion

**Infraestructura:**
- **Contenedores:** Docker & Docker Compose

---

## 🚀 Guía de Inicio Rápido (Local Environment)

Para ejecutar el proyecto de forma local, necesitarás tener instalado **Docker**, **Docker Compose**, **Java 25**, y **Node.js (v18+)**.

### 1. Levantar Infraestructura de Bases de Datos
Se ha provisto un archivo `docker-compose.yml` en la raíz del proyecto para inicializar todas las bases de datos PostgreSQL de forma simultánea.

```bash
# Levantar todas las bases de datos en segundo plano
docker-compose up -d
```

### 2. Ejecutar Microservicios Backend
Cada servicio debe ser ejecutado de forma independiente. Puedes abrir múltiples terminales y ejecutar:

```bash
cd auth-service && ./gradlew bootRun
cd cliente-service && ./gradlew bootRun
cd mantencion-service && ./gradlew bootRun
cd venta-service && ./gradlew bootRun
cd ruta-service && ./gradlew bootRun
cd dashboard-service && ./gradlew bootRun
```

### 3. Ejecutar Aplicaciones Frontend
Para levantar las interfaces de usuario (Landing y ERP), necesitas instalar las dependencias y ejecutar el servidor de desarrollo Vite.

**Para el Dashboard ERP:**
```bash
cd front
npm install
npm run dev
```

**Para el Landing Page:**
```bash
cd landing-verano
npm install
npm run dev
```

---

## 🔐 Autenticación y Seguridad

La plataforma está protegida mediante tokens **JWT (JSON Web Tokens)**. 
- Cualquier petición a los servicios (excepto registro/login y el landing público) requiere un token válido.
- **Flujo:**
  1. Realiza una petición `POST` a `/api/auth/login` (en el puerto `3333`).
  2. Recibe el JWT en la respuesta.
  3. Adjunta el token en los headers de las siguientes peticiones HTTP: `Authorization: Bearer <tu_token_jwt>`.

---

## 📁 Estructura del Código Backend

Todos los microservicios siguen una arquitectura limpia estructurada en paquetes estándar:

```text
com.veranoperfecto.{nombre_servicio}/
├── controller/     # Controladores REST API
├── service/        # Reglas y lógica de negocio
├── repository/     # Interfaces de acceso a datos (Spring Data JPA)
├── entity/         # Entidades de dominio y mapeo relacional
├── dto/            # Data Transfer Objects (Records de Java)
├── config/         # Configuraciones globales (CORS, Security Beans)
├── exception/      # Manejo centralizado de excepciones (GlobalExceptionHandler)
└── client/         # (Solo en ciertos servicios) Clientes Feign/REST inter-servicios
```

---

## ⚙️ Variables de Entorno y Configuración

Los microservicios están pre-configurados para funcionar "out-of-the-box" en local. Las propiedades más relevantes (ubicadas en los `application.yml` o inyectadas por entorno) incluyen:

| Variable / Propiedad | Valor por Defecto | Descripción |
|----------------------|-------------------|-------------|
| `DB_URL` / `spring.datasource.url` | `jdbc:postgresql://localhost:54XX/nombre_db` | Cadena de conexión JDBC |
| `DB_USERNAME` | `[servicio]_user` | Usuario de BD autogenerado en Docker |
| `DB_PASSWORD` | `[servicio]_pass` | Contraseña de BD autogenerada en Docker |
| `JWT_SECRET` | *(Ver application.yml del auth-service)* | Clave secreta para firma y validación JWT |

---

## 📄 Formato Estándar de Respuestas API

Con el objetivo de proveer predictibilidad a los clientes (Frontend), todas las respuestas de la API utilizan un envoltorio o "wrapper" global estandarizado:

**Respuesta Exitosa:**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

**Respuesta con Error:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Detalle del error ocurrido"
  }
}
```

---
*Desarrollado con ❤️ para Verano Perfecto.*
