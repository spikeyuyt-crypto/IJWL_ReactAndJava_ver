package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.A001RegDto;
import com.example.ijwl_javabackend.entity.dto.A001SignInDto;
import com.example.ijwl_javabackend.service.A001SignInAndRegisterService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.ijwl_javabackend.entity.A001LogInListBean;

@RestController
@RequestMapping("/users")
public class A001SignInAndRegisterController {
    private final A001SignInAndRegisterService a001SignInAndRegisterService;

    public A001SignInAndRegisterController(
            A001SignInAndRegisterService a001SignInAndRegisterService
    ) {
        this.a001SignInAndRegisterService = a001SignInAndRegisterService;
    }

    @PostMapping("/signIn")
    public ResponseEntity<ApiResponse<A001LogInListBean>> signIn(
            @RequestBody A001SignInDto a001SignInDto
    ) {

        A001LogInListBean userSettings = a001SignInAndRegisterService.signIn(
                a001SignInDto.getUsername(),
                a001SignInDto.getPassword()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        userSettings
                ));
    }

    @GetMapping("reSignIn")
    public ResponseEntity<ApiResponse<A001LogInListBean>> reSignIn(
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");

        A001LogInListBean userSettings = a001SignInAndRegisterService.reSignIn(
                userId
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        userSettings
                ));
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<A001LogInListBean>> register(
            @RequestBody A001RegDto a001RegDto
    ) {
        A001LogInListBean userSettings = a001SignInAndRegisterService.register(
                a001RegDto
        );
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        userSettings
                ));
    }
}
