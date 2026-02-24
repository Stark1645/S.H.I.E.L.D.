package com.shield;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ShieldApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShieldApplication.class, args);
    }
}
