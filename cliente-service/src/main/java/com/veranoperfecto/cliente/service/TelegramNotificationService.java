package com.veranoperfecto.cliente.service;

import com.veranoperfecto.cliente.entity.Cliente;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class TelegramNotificationService {

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.bot.chatId:}")
    private String chatId;

    private final RestTemplate restTemplate = new RestTemplate();

    public void enviarNotificacionNuevaCotizacion(Cliente cliente) {
        if (botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            log.warn("Telegram bot token or chat ID is not configured. Skipping notification.");
            return;
        }

        // Ejecutar de forma asíncrona para no bloquear la respuesta HTTP al usuario
        CompletableFuture.runAsync(() -> {
            try {
                String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

                String mensaje = "🚨 *NUEVA COTIZACIÓN WEB* 🚨\n\n" +
                        "*Nombre:* " + (cliente.getNombre() != null ? cliente.getNombre() : "N/A") + "\n" +
                        "*Email:* " + (cliente.getEmail() != null ? cliente.getEmail() : "N/A") + "\n" +
                        "*Teléfono:* " + (cliente.getTelefono() != null ? cliente.getTelefono() : "N/A") + "\n\n" +
                        "*Notas/Mensaje:*\n" + (cliente.getNotas() != null ? cliente.getNotas() : "Sin mensaje");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> body = new HashMap<>();
                body.put("chat_id", chatId);
                body.put("text", mensaje);
                body.put("parse_mode", "Markdown");

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                restTemplate.postForEntity(url, request, String.class);
                log.info("Notificación enviada a Telegram exitosamente para el cliente: {}", cliente.getCodigo());

            } catch (Exception e) {
                log.error("Error al enviar notificación a Telegram: {}", e.getMessage());
                // No lanzamos la excepción para no interrumpir el flujo del ERP si Telegram falla
            }
        });
    }
}
