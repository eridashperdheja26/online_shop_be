package com.online.shop.e_commerce.Controller;

import com.online.shop.e_commerce.Dto.LoginDto;
import com.online.shop.e_commerce.Dto.UserDto;
import com.online.shop.e_commerce.Entity.User;
import com.online.shop.e_commerce.Repository.UserRepository;
import com.online.shop.e_commerce.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDto userDto) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username already exists!");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if email already exists
            if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email already exists!");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userService.createUser(userDto);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully!");
            response.put("userId", user.getId().toString());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody UserDto userDto) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username already exists!");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if email already exists
            if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email already exists!");
                return ResponseEntity.badRequest().body(response);
            }

            // Force role to be ADMIN
            userDto.setRole("ADMIN");
            User user = userService.createUser(userDto);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin user registered successfully!");
            response.put("userId", user.getId().toString());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Admin registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
        try {
            User user = userRepository.findByUsername(loginDto.getUsername()).orElse(null);

            if (user == null || !passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Invalid credentials!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (!user.getIsActive()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Account is deactivated!");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // Generate JWT token (you'll need to implement this)
            // String token = jwtUtils.generateToken(user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            // response.put("token", token);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<UserDto> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserDto userDto) {
        User updatedUser = userService.updateUser(userId, userDto);
        UserDto response = userService.convertToDto(updatedUser);
        return ResponseEntity.ok(response);
    }
}