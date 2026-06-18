package com.veranoperfecto.auth.dto;

public record AuthResponse(String token, long expiresIn, String username, String nombre, String rol) {
}
