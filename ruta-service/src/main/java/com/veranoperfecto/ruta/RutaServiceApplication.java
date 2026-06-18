package com.veranoperfecto.ruta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = { org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class })
public class RutaServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RutaServiceApplication.class, args);
    }
}
