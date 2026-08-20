package com.example.ijwl_javabackend.security;

import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
        private static final String SECRET = "";

        private static final long ACCESS_TOKEN_EXPIRATION = 30 * 60 * 1000;

        private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

        public String generateAccessToken(Integer userId) {

                Date now = new Date();
                Date expiration = new Date(now.getTime() + ACCESS_TOKEN_EXPIRATION);

                return Jwts.builder()
                                .subject(String.valueOf(userId))
                                .issuedAt(now)
                                .expiration(expiration)
                                .signWith(key)
                                .compact();
        }

}
