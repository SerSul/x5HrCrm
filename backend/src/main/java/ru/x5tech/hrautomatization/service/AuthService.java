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
import ru.x5tech.hrautomatization.config.CustomUserDetails;
import ru.x5tech.hrautomatization.dto.auth.*;
import ru.x5tech.hrautomatization.entity.user.PersonalData;
import ru.x5tech.hrautomatization.entity.user.Role;
import ru.x5tech.hrautomatization.entity.user.User;
import ru.x5tech.hrautomatization.exception.UnauthorizedException;
import ru.x5tech.hrautomatization.exception.UserAlreadyExistsException;
import ru.x5tech.hrautomatization.repository.PersonalDataRepository;
import ru.x5tech.hrautomatization.repository.RoleRepository;
import ru.x5tech.hrautomatization.repository.UserRepository;

import java.util.Optional;
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
    public UserInfo register(RegisterRequest registerRequest, HttpServletRequest request) {
        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new UserAlreadyExistsException("User already exists: " + registerRequest.email());
        }
        return performRegistration(registerRequest, request);
    }



    private UserInfo performRegistration(RegisterRequest registerRequest, HttpServletRequest request) {
        var personalData = personalDataRepository.save(
                PersonalData.builder()
                        .personGuid(UUID.randomUUID())
                        .firstName(registerRequest.firstName())
                        .lastName(registerRequest.lastName())
                        .middleName(registerRequest.middleName())
                        .build()
        );

        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));

        var user = userRepository.save(User.builder()
                .email(registerRequest.email())
                .password(passwordEncoder.encode(registerRequest.password()))
                .phone(registerRequest.phone())
                .enabled(true)
                .personalData(personalData)
                .roles(Set.of(userRole))
                .build()
        );

        return establishSessionAndReturnInfo(new CustomUserDetails(user), request);
    }

    public UserInfo login(LoginRequest loginRequest, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        return establishSessionAndReturnInfo(authentication, request);
    }

    public boolean hasAnyRole(Authentication auth, String... roles) {
        if (auth == null) return false;

        var authorities = auth.getAuthorities();
        for (String r : roles) {
            String role = r.startsWith("ROLE_") ? r : "ROLE_" + r;
            boolean ok = authorities.stream().anyMatch(a -> role.equals(a.getAuthority()));
            if (ok) return true;
        }
        return false;
    }

    private UserInfo establishSessionAndReturnInfo(Object principal, HttpServletRequest request) {
        Authentication authentication = createAuthentication(principal);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        request.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );

        return new UserInfo(
                authentication.getName(),
                authentication.getAuthorities()
        );
    }

    private Authentication createAuthentication(Object principal) {
        if (principal instanceof CustomUserDetails cud) {
            return new UsernamePasswordAuthenticationToken(
                    cud,
                    null,
                    cud.getAuthorities()
            );
        }

        if (principal instanceof Authentication auth) {
            return userRepository.findByEmail(auth.getName())
                    .map(user -> {
                        CustomUserDetails fullDetails = new CustomUserDetails(user);
                        return new UsernamePasswordAuthenticationToken(
                                fullDetails,
                                auth.getCredentials(),
                                auth.getAuthorities()
                        );
                    })
                    .orElseThrow(() -> new RuntimeException("User not found after login: " + auth.getName()));
        }

        throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
    }


    private String extractUsername(Object principal) {
        return principal instanceof CustomUserDetails cud
                ? cud.getEmail()
                : principal instanceof Authentication auth
                ? auth.getName()
                : principal.toString();
    }

    public void logout(HttpServletRequest request) {
        Optional.ofNullable(request.getSession(false))
                .ifPresent(HttpSession::invalidate);

        SecurityContextHolder.clearContext();
    }

    public UserInfo getCurrentUser() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(this::isValidAuthentication)
                .map(auth -> new UserInfo(auth.getName(), auth.getAuthorities()))
                .orElseThrow(() -> new UnauthorizedException("Not authenticated"));
    }

    private boolean isValidAuthentication(Authentication auth) {
        return auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal());
    }
}
