package ru.x5tech.hrautomatization.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.x5tech.hrautomatization.dto.auth.LoginRequest;
import ru.x5tech.hrautomatization.dto.auth.RegisterRequest;
import ru.x5tech.hrautomatization.dto.auth.UserInfo;
import ru.x5tech.hrautomatization.entity.user.PersonalData;
import ru.x5tech.hrautomatization.entity.user.Role;
import ru.x5tech.hrautomatization.entity.user.User;
import ru.x5tech.hrautomatization.exception.UnauthorizedException;
import ru.x5tech.hrautomatization.exception.UserAlreadyExistsException;
import ru.x5tech.hrautomatization.repository.PersonalDataRepository;
import ru.x5tech.hrautomatization.repository.RoleRepository;
import ru.x5tech.hrautomatization.repository.UserRepository;

import java.util.Set;
import java.util.UUID;

/**
 * Author: Дмитрий Николаенков (laplas7)
 * Creation date: 17.12.2025
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PersonalDataRepository personalDataRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserInfo register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new UserAlreadyExistsException("User with email " + registerRequest.email() + " already exists");
        }

        PersonalData personalData = new PersonalData();
        personalData.setPersonGuid(UUID.randomUUID());
        personalData.setFirstName(registerRequest.firstName());
        personalData.setLastName(registerRequest.lastName());
        personalData.setMiddleName(registerRequest.middleName());
        personalDataRepository.save(personalData);

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));

        User user = new User();
        user.setEmail(registerRequest.email());
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setPhone(registerRequest.phone());
        user.setEnabled(true);
        user.setPersonalData(personalData);
        user.setRoles(Set.of(userRole));
        userRepository.save(user);

        return new UserInfo(user.getEmail(), Set.of("ROLE_USER"));
    }

    public UserInfo login(LoginRequest loginRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    securityContext
            );

            return new UserInfo(
                    authentication.getName(),
                    authentication.getAuthorities()
            );
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid credentials");
        }
    }

    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public UserInfo getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Not authenticated");
        }

        return new UserInfo(
                authentication.getName(),
                authentication.getAuthorities()
        );
    }
}
