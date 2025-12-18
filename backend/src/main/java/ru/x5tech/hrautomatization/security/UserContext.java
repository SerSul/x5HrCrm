package ru.x5tech.hrautomatization.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.x5tech.hrautomatization.config.CustomUserDetails;

import java.util.Optional;

@Component
public class UserContext {

    public Optional<Authentication> authentication() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());
    }

    public boolean isAuthenticated() {
        return authentication().filter(this::isAuthenticated).isPresent();
    }

    public Optional<Long> currentUserId() {
        return authentication()
                .filter(this::isAuthenticated)
                .map(this::extractUserId);
    }

    public Long requireUserId() {
        return currentUserId().orElseThrow(() -> new AccessDeniedException("Not authenticated"));
    }

    public boolean hasAnyRole(String... roles) {
        return authentication()
                .filter(this::isAuthenticated)
                .map(auth -> hasAnyRole(auth, roles))
                .orElse(false);
    }

    public void requireAnyRole(String... roles) {
        if (!hasAnyRole(roles)) {
            throw new AccessDeniedException("Forbidden");
        }
    }

    private boolean isAuthenticated(Authentication auth) {
        return auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken)
                && !"anonymousUser".equals(auth.getPrincipal());
    }

    private Long extractUserId(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            return cud.getId();
        }
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
    }

    private boolean hasAnyRole(Authentication auth, String... roles) {
        for (String r : roles) {
            String role = r.startsWith("ROLE_") ? r : "ROLE_" + r;
            boolean ok = auth.getAuthorities().stream().anyMatch(a -> role.equals(a.getAuthority()));
            if (ok) return true;
        }
        return false;
    }
}
