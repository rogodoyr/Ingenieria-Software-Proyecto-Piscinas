package com.veranoperfecto.auth.exception;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends ApiException {

    public AuthenticationException(String message) {
        super(HttpStatus.UNAUTHORIZED, "AUTHENTICATION_ERROR", message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(HttpStatus.UNAUTHORIZED, "AUTHENTICATION_ERROR", message, cause);
    }
}
