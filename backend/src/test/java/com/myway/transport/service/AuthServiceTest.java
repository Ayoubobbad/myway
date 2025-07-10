package com.myway.transport.service;

import com.myway.transport.dto.AuthRequest;
import com.myway.transport.dto.AuthResponse;
import com.myway.transport.dto.RegisterRequest;
import com.myway.transport.entity.User;
import com.myway.transport.exception.EmailAlreadyExistsException;
import com.myway.transport.repository.UserRepository;
import com.myway.transport.security.JwtTokenProvider;
import com.myway.transport.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider tokenProvider;
    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loginReturnsAuthResponseWhenCredentialsAreValid() {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        User user = User.builder()
                .id(1L)
                .name("Test")
                .email("test@example.com")
                .password("password")
                .role(User.Role.USER)
                .status(User.UserStatus.ACTIVE)
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(UserDetailsImpl.build(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt-token");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(user.getId(), response.getId());
        assertEquals(user.getName(), response.getName());
        assertEquals(user.getEmail(), response.getEmail());
        assertEquals(user.getRole().name(), response.getRole());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerCreatesUserAndReturnsAuthResponse() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setEmail("new@example.com");
        request.setPassword("password");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");

        User saved = User.builder()
                .id(2L)
                .name("Test")
                .email("new@example.com")
                .password("encoded")
                .role(User.Role.USER)
                .status(User.UserStatus.ACTIVE)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(saved);

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(saved.getId(), response.getId());
        assertEquals(saved.getName(), response.getName());
        assertEquals(saved.getEmail(), response.getEmail());
        assertEquals(saved.getRole().name(), response.getRole());
    }

    @Test
    void registerThrowsExceptionWhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setEmail("exists@example.com");
        request.setPassword("password");

        when(userRepository.existsByEmail("exists@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
    }
}
