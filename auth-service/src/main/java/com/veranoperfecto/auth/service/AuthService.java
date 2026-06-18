package com.veranoperfecto.auth.service;

import com.veranoperfecto.auth.dto.AuthResponse;
import com.veranoperfecto.auth.dto.LoginRequest;
import com.veranoperfecto.auth.dto.RegisterRequest;
import com.veranoperfecto.auth.entity.User;
import com.veranoperfecto.auth.exception.AuthenticationException;
import com.veranoperfecto.auth.exception.ValidationException;
import com.veranoperfecto.auth.repository.UserRepository;
import com.veranoperfecto.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.debug("Registering user: {}", request.username());

        // Validate input
        if (request.username() == null || request.username().isBlank()) {
            throw new ValidationException("Username is required");
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new ValidationException("Password is required");
        }

        // Check username uniqueness
        if (userRepository.existsByUsername(request.username())) {
            throw new ValidationException("Username already exists: " + request.username());
        }

        // Create user
        User user = User.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .nombre(request.nombre())
                .email(request.email())
                .rol("OPERADOR")
                .build();

        User savedUser = userRepository.save(user);
        log.debug("User registered successfully: {}", savedUser.getUsername());

        // Generate JWT
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRol());

        return new AuthResponse(token, jwtExpiration, savedUser.getUsername(), savedUser.getNombre(), savedUser.getRol());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.debug("Login attempt for user: {}", request.username());

        // Find user
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new AuthenticationException("Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid username or password");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user.getUsername(), user.getRol());

        log.debug("Login successful for user: {}", user.getUsername());
        return new AuthResponse(token, jwtExpiration, user.getUsername(), user.getNombre(), user.getRol());
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String username) {
        log.debug("Fetching current user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("User not found: " + username));

        return new AuthResponse(null, 0, user.getUsername(), user.getNombre(), user.getRol());
    }
}
