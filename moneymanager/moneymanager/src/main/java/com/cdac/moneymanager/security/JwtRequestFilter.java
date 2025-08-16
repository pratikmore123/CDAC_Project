package com.cdac.moneymanager.security;

import com.cdac.moneymanager.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException; // Import ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                // Attempt to extract username from the JWT
                username = jwtUtil.extractUsername(jwt);
            } catch (ExpiredJwtException e) {
                // Log the expiration and set the response status to Unauthorized (401)
                logger.warn("JWT token expired: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Set 401 status
                response.getWriter().write("JWT token expired. Please log in again."); // Optional: send a message
                return; // Stop further processing of the request in this filter chain
            } catch (SignatureException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
                // Catch other JWT parsing exceptions (malformed, invalid signature, etc.)
                logger.error("Invalid or malformed JWT token: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Set 401 status
                response.getWriter().write("Invalid JWT token."); // Optional: send a message
                return; // Stop further processing
            }
        }

        // If username is extracted and no authentication is currently set in the context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Validate the token. The `validateToken` method in JwtUtil will now primarily
            // check if the username matches and if the token is not expired (which should
            // already be caught above, but it's good for a double-check or for tokens
            // that might have just expired between extraction and validation).
            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials are null as we've authenticated via token
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                // This else block handles cases where validation fails for reasons other than expiration
                // (e.g., username mismatch, or if a token just expired between extraction and validation).
                logger.warn("JWT token validation failed for user: {}", username);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT token invalid.");
                return;
            }
        }

        // Continue the filter chain if the token was valid or not present
        filterChain.doFilter(request, response);
    }
}
