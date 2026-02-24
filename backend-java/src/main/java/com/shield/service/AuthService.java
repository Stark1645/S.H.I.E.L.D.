package com.shield.service;

import com.shield.entity.User;
import com.shield.repository.UserRepository;
import com.shield.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, String> login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtUtil.generateAccessToken(username, user.getRole()));
        tokens.put("refreshToken", jwtUtil.generateRefreshToken(username));
        tokens.put("role", user.getRole());
        return tokens;
    }

    public User register(String username, String password, String role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role != null ? role : "USER");
        return userRepository.save(user);
    }

    public Map<String, String> refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtUtil.generateAccessToken(username, user.getRole()));
        return tokens;
    }
}
