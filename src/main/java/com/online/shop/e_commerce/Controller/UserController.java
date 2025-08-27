package com.online.shop.e_commerce.Controller;

import com.online.shop.e_commerce.Dto.UserDto;
import com.online.shop.e_commerce.Entity.User;
import com.online.shop.e_commerce.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = userService.convertToDtoList(users);
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        List<UserDto> userDtos = userService.convertToDtoList(users);
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/active")
    public ResponseEntity<List<UserDto>> getActiveUsers() {
        List<User> users = userService.getActiveUsers();
        List<UserDto> userDtos = userService.convertToDtoList(users);
        return ResponseEntity.ok(userDtos);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserDto userDto) {
        User updatedUser = userService.updateUser(userId, userDto);
        UserDto response = userService.convertToDto(updatedUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable Long userId,
            @RequestParam String newPassword) {
        userService.updatePassword(userId, newPassword);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok().build();
    }
}
