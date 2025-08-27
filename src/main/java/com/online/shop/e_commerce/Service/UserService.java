package com.online.shop.e_commerce.Service;

import com.online.shop.e_commerce.Dto.UserDto;
import com.online.shop.e_commerce.Entity.User;
import com.online.shop.e_commerce.Repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private ModelMapper modelMapper = new ModelMapper();

    public User createUser(UserDto userDto) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setShippingAddress(userDto.getShippingAddress());
        user.setBillingAddress(userDto.getBillingAddress());
        user.setRole(userDto.getRole());
        user.setIsActive(true);

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, UserDto userDto) {
        User existingUser = getUserById(id);
        
        // Update fields if provided
        if (userDto.getFirstName() != null) {
            existingUser.setFirstName(userDto.getFirstName());
        }
        if (userDto.getLastName() != null) {
            existingUser.setLastName(userDto.getLastName());
        }
        if (userDto.getEmail() != null && !userDto.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            existingUser.setEmail(userDto.getEmail());
        }
        if (userDto.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(userDto.getPhoneNumber());
        }
        if (userDto.getShippingAddress() != null) {
            existingUser.setShippingAddress(userDto.getShippingAddress());
        }
        if (userDto.getBillingAddress() != null) {
            existingUser.setBillingAddress(userDto.getBillingAddress());
        }

        return userRepository.save(existingUser);
    }

    public User updatePassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(true);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public List<User> getActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setShippingAddress(user.getShippingAddress());
        dto.setBillingAddress(user.getBillingAddress());
        dto.setRole(user.getRole());
        // Don't set password in DTO for security
        return dto;
    }

    public List<UserDto> convertToDtoList(List<User> users) {
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
