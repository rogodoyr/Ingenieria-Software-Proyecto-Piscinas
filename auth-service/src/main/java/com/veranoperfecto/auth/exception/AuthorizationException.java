package com.veranoperfecto.auth.exception;

import org.springframework.http.HttpStatus;

public class AuthorizationException extends ApiException {

    public AuthorizationException(String message) {
        super(HttpStatus.FORBIDDEN, "AUTHORIZATION_ERROR", message);
    }

    public AuthorizationException(String message, Throwable cause) {
        super(HttpStatus.FORBIDDEN, "AUTHORIZATION_ERROR", message, cause);
    }
}
