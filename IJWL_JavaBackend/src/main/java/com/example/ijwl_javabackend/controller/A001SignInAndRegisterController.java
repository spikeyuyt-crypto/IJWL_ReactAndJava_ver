package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.A001RegDto;
import com.example.ijwl_javabackend.entity.dto.A001SignInDto;
import com.example.ijwl_javabackend.entity.A001ReissueToken;
import com.example.ijwl_javabackend.entity.dto.A001SignInResult;
import com.example.ijwl_javabackend.service.A001SignInAndRegisterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import com.example.ijwl_javabackend.entity.A001LogInListBean;
import java.time.Duration;

@RestController
@RequestMapping("/users")
public class A001SignInAndRegisterController {
        private final A001SignInAndRegisterService a001SignInAndRegisterService;

        public A001SignInAndRegisterController(
                        A001SignInAndRegisterService a001SignInAndRegisterService) {
                this.a001SignInAndRegisterService = a001SignInAndRegisterService;
        }

        @PostMapping("/signIn")
        public ResponseEntity<ApiResponse<A001LogInListBean>> signIn(
                        @RequestBody A001SignInDto a001SignInDto) {

                A001SignInResult result = a001SignInAndRegisterService.signIn(
                                a001SignInDto.getUsername(),
                                a001SignInDto.getPassword());

                ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(Duration.ofDays(7))
                                .sameSite("Lax")
                                .build();

                return ResponseEntity.ok()
                                .header(
                                                "Set-Cookie",
                                                refreshCookie.toString())
                                .body(
                                                new ApiResponse<>(
                                                                "success",
                                                                result.getUserInfo()));
        }

        @GetMapping("/getUserInfoByAccessToken")
        public ResponseEntity<ApiResponse<A001LogInListBean>> getUserInfoByAccessToken(
                        HttpServletRequest request) {
                Integer userId = (Integer) request.getAttribute("userId");

                A001LogInListBean userSettings = a001SignInAndRegisterService.getUserInfoByAccessToken(
                                userId);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                "success",
                                                userSettings));
        }

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<A001LogInListBean>> register(
                        @RequestBody A001RegDto a001RegDto) {
                A001SignInResult result = a001SignInAndRegisterService.register(
                                a001RegDto);

                A001LogInListBean userSettings = result.getUserInfo();

                String newRefreshToken = result.getRefreshToken();

                ResponseCookie refreshCookie = ResponseCookie
                                .from("refreshToken", newRefreshToken)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(Duration.ofDays(7))
                                .sameSite("Lax")
                                .build();

                ResponseEntity.BodyBuilder response = ResponseEntity.ok();

                return response
                                .header("Set-Cookie", refreshCookie.toString())
                                .body(
                                                new ApiResponse<>(
                                                                "success",
                                                                userSettings));
        }

        @PostMapping("/refresh")
        public ResponseEntity<ApiResponse<String>> refresh(
                        @CookieValue(value = "refreshToken", required = false) String refreshToken) {

                A001ReissueToken result = a001SignInAndRegisterService.refresh(refreshToken);

                if (result == null) {
                        return ResponseEntity.ok(
                                        new ApiResponse<>(
                                                        "unauthenticated",
                                                        null));
                }

                ResponseEntity.BodyBuilder response = ResponseEntity.ok();

                if (result.getRefreshToken() != null) {
                        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                                        .httpOnly(true)
                                        .secure(false)
                                        .path("/")
                                        .maxAge(Duration.ofDays(7))
                                        .sameSite("Lax")
                                        .build();

                        response.header("Set-Cookie", refreshCookie.toString());
                }

                return response.body(
                                new ApiResponse<>(
                                                "success",
                                                result.getAccessToken()));
        }

        @PostMapping("/signOut")
        public ResponseEntity<ApiResponse<Void>> signOut(
                        HttpServletRequest request,
                        HttpServletResponse response) {
                Integer userId = (Integer) request.getAttribute("userId");
                a001SignInAndRegisterService.signOut(userId.toString());

                ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(0)
                                .build();

                response.addHeader("Set-Cookie", cookie.toString());

                return ResponseEntity.ok().build();
        }
}
