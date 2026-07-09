# ✨ Actualizaciones y Mejoras del Proyecto

¡Bienvenido al registro de actualizaciones de **Verano Perfecto**! Aquí documentamos las integraciones clave, mejoras de seguridad y arquitectura que hacen de esta plataforma una solución robusta y profesional.

---

## 🚀 1. Integración de Telegram (Notificaciones en Tiempo Real)

Se ha implementado un sistema de mensajería instantánea automatizado para mejorar el tiempo de respuesta del negocio.

> **Objetivo:** Notificar de manera inmediata a los administradores cada vez que un cliente potencial solicita una cotización desde la Landing Page.

* **Flujo Implementado:**
  1. El cliente llena el formulario en la web pública (`landing-verano`).
  2. Los datos viajan al microservicio central (`cliente-service`).
  3. El sistema guarda al cliente en la base de datos PostgreSQL del ERP de forma segura.
  4. Simultáneamente, el backend dispara una notificación asíncrona mediante la API HTTP de Telegram.
  5. El bot designado (`pruebas_proyectos_bot`) entrega el mensaje detallado directamente al celular del trabajador asignado de ventas.
* **Seguridad:** El Token del bot de Telegram está fuertemente protegido mediante **Variables de Entorno (`.env`)**, garantizando que las credenciales nunca sean expuestas en repositorios públicos de GitHub.

---

## 🛡️ 2. Sistema de Seguridad, Roles y Accesos (JWT)

Se ha implementado un robusto sistema de autenticación y autorización basado en **JSON Web Tokens (JWT)** para proteger las rutas tanto en el Backend como en el Frontend.

> **Cierre de Registro Público:** Como medida estricta de seguridad corporativa, se ha eliminado por completo la capacidad de auto-registro ("Sign Up") desde la interfaz pública. El acceso al ERP ahora es exclusivamente por invitación o mediante creación interna por parte del departamento de IT, previniendo así la creación de cuentas "fantasma" o infiltraciones.

### 👑 Rol: ADMIN (Acceso Total)
El administrador del sistema posee privilegios absolutos sobre la plataforma ERP:
* **Privilegios de Backend:** Acceso sin restricciones a todos los endpoints de los 6 microservicios.
* **Privilegios de Frontend (ERP):** 
  * Acceso exclusivo al **Dashboard Global** con métricas y finanzas.
  * **Acceso exclusivo a la pestaña "Técnicos"**, siendo el *único* rol autorizado para registrar, asignar y gestionar al personal en terreno.
  * Visibilidad total de todas las pestañas: Clientes, Mantenciones, Ventas/Facturación y Rutas.

### 🕵️‍♂️ Rol: SUPERVISOR
Encargado de la logística y seguimiento operativo, enfocado en el área técnica sin acceso a finanzas globales.
* **Privilegios de Frontend:**
  * **Acceso Restringido:** No tiene acceso al Dashboard Global ni a la pestaña de Técnicos.
  * **Pestañas Habilitadas:** Control total sobre **Mantenciones**, **Rutas** y **Clientes**. Puede gestionar y ver las asignaciones de servicios en curso para asegurar la operatividad.
  * *Landing Inicial:* Al iniciar sesión, entra directamente a la gestión operativa (Mantenciones).

### 💳 Rol: VENTAS
Especialista enfocado puramente en la atención comercial y facturación.
* **Privilegios de Frontend:**
  * **Acceso Restringido:** No tiene acceso al Dashboard Global, ni a Mantenciones, Rutas, o Técnicos.
  * **Pestañas Habilitadas:** Acceso exclusivo a **Ventas y Facturación** y al registro de **Clientes**.
  * *Landing Inicial:* Al iniciar sesión, entra directamente a la emisión y control de ventas.
* **Atención al Cliente (Telegram):** Es el rol designado para recibir directamente en su celular las **notificaciones del bot de Telegram** sobre nuevas cotizaciones web, siendo el principal encargado de contactar rápidamente a esos prospectos.

---

## 💾 3. Poblamiento de Datos y Cuentas por Defecto (Seed)

Para facilitar la demostración de la plataforma en entornos limpios o después de clonar el repositorio, se ha implementado un script de inicialización (`seed-demo.js`).

* **Propósito:** Inyectar datos de prueba realistas (clientes, órdenes, ventas) y generar las cuentas de acceso iniciales pre-configuradas con sus respectivos roles (ADMIN, SUPERVISOR, VENTAS) con contraseñas encriptadas.
* **Uso Obligatorio:** Es estrictamente necesario que, tras levantar los contenedores Docker y ejecutar los microservicios con Gradle, se ejecute este script (`node seed-demo.js`). Solo así el sistema quedará poblado, habilitando el acceso seguro al ERP sin necesidad de hacer registros manuales.

---

## 🏗️ 4. Resumen de la Arquitectura (Microservicios)

La plataforma ha abandonado la arquitectura monolítica tradicional en favor de un sistema distribuido altamente escalable. Cada dominio cuenta con su propia base de datos, garantizando aislamiento y tolerancia a fallos.

| Microservicio | Responsabilidad Clave |
| :--- | :--- |
| **🔐 Auth Service** | Emisión y validación de tokens JWT. Control de usuarios. |
| **👥 Cliente Service** | Registro de clientes (el motor detrás de la Landing Page). |
| **🛠️ Mantencion Service** | Control de servicios técnicos en terreno. |
| **💰 Venta Service** | Catálogo e inventario. Emisión de notas/facturas. |
| **🗺️ Ruta Service** | Geolocalización y asignación eficiente de técnicos. |
| **📊 Dashboard Service** | Consolidación y visualización de KPIs para el Admin. |

> **Nota Técnica:** Toda la arquitectura corre sobre contenedores **Docker** orquestados localmente, y la comunicación entre la capa React y la capa Java Spring Boot está totalmente protegida mediante cabeceras `Authorization: Bearer`.
