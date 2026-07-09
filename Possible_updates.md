# 🚀 Posibles Actualizaciones y Mejoras Futuras (Roadmap)

Este documento detalla el plan de evolución tecnológica para **Verano Perfecto**. Al ser un sistema construido sobre una arquitectura de microservicios moderna y escalable, el proyecto está preparado para integrar herramientas avanzadas de grado empresarial en futuras iteraciones.

---

## 🏗️ 1. Evolución de la Arquitectura (Backend y Microservicios)

Para llevar la robustez, seguridad y escalabilidad del backend al siguiente nivel, se proponen las siguientes implementaciones técnicas:

### 🌐 API Gateway
* **Descripción:** Implementar un único punto de entrada (como Spring Cloud Gateway) para todas las peticiones que vienen desde el Frontend.
* **Beneficios:** Enrutamiento centralizado, manejo global de seguridad, limitación de peticiones (Rate Limiting) y protección de la infraestructura al ocultar los puertos internos de los microservicios.

### 🧭 Eureka (Service Discovery)
* **Descripción:** Integrar Spring Cloud Netflix Eureka.
* **Beneficios:** Permitir que los microservicios se registren, se descubran y se comuniquen entre sí dinámicamente sin depender de IPs o puertos fijos (ej. `localhost:3334`). Es indispensable si el día de mañana la demanda crece y necesitamos levantar 3 instancias simultáneas del `cliente-service` para balancear la carga.

### 📝 Centralización de Logs (ELK Stack o Grafana Loki)
* **Descripción:** Recolectar todos los registros de la consola de los 6 microservicios en un solo lugar.
* **Beneficios:** Si ocurre un error, en lugar de revisar 6 terminales distintas, el administrador puede buscar el problema en un único panel visual (Dashboard), trazando exactamente dónde falló la petición.

### 📱 Tracking GPS en Tiempo Real (App Android + WebSockets)
* **Descripción:** Evolucionar el módulo actual de rutas conectando el mapa Leaflet del Frontend con una Aplicación Nativa de Android para los técnicos en terreno.
* **Beneficios y Funcionamiento Técnico:** 
  * El técnico descarga una App Android que utiliza el *Fused Location Provider* del celular para leer coordenadas GPS exactas, incluso en segundo plano.
  * La App Android transmite su latitud y longitud cada pocos segundos hacia el `ruta-service` utilizando **WebSockets** (en lugar de HTTP tradicional) para no saturar el servidor y tener comunicación bidireccional instantánea.
  * El Frontend de React se suscribe a este WebSocket. Como resultado, el Administrador verá los íconos de los vehículos moverse en vivo sobre el mapa de Leaflet en la pantalla, calculando de forma automática el "ETA" (Tiempo Estimado de Llegada) al domicilio del cliente.

### 🌉 Patrón BFF (Backend For Frontend)
* **Descripción:** Crear un servicio intermedio (como un agregador) diseñado específicamente para las necesidades de las pantallas de React.
* **Beneficios:** En lugar de que el Frontend haga 3 peticiones distintas (a Clientes, Ventas y Mantenciones) para armar el Dashboard, hace solo 1 petición al BFF. El BFF consolida la información en el servidor y la entrega lista, reduciendo la latencia y acelerando la página web dramáticamente.

---

## 🤖 2. Automatización e Inteligencia Artificial (Operaciones)

El área comercial y de atención al cliente puede potenciarse exponencialmente integrando herramientas No-Code y motores avanzados de IA:

### ⚙️ Automatización de Flujos con n8n
* **Descripción:** Conectar el ERP con **n8n** (plataforma de automatización de flujos de trabajo).
* **Beneficios:** 
  * Crear "recetas" automáticas (ej. "Cuando se asigne una mantención en la Base de Datos, envía un SMS automático al cliente avisando que el técnico va en camino").
  * Sincronizar datos automáticamente con plataformas externas (Google Sheets, Mailchimp, CRMs externos) sin necesidad de programar integraciones a mano.

### 🧠 Respuestas Directas y Asistentes de IA (Agentes)
* **Descripción:** Reemplazar las notificaciones simples (como la del bot de Telegram actual) por verdaderos asistentes inteligentes entrenados con los precios y datos de **Verano Perfecto**.
* **Beneficios:** 
  * Cuando un cliente envíe una cotización desde la Landing Page, un LLM (como GPT-4o o Gemini) leerá la solicitud, calculará el presupuesto aproximado y le responderá inmediatamente al cliente por WhatsApp o Email de forma natural y humana.
  * El Agente de IA puede acceder al `ruta-service` para verificar qué técnico está libre y proponerle una fecha concreta de visita al cliente en ese mismo instante, automatizando el trabajo del rol de Ventas casi en un 100%.
