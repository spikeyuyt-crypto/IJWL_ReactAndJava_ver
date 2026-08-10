package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.A001RegDto;
import com.example.ijwl_javabackend.service.A001SignInAndRegisterService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
            String username,
            String password
    ) {

        A001LogInListBean userSettings = a001SignInAndRegisterService.signIn(
                username,
                password
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        userSettings
                ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<A001LogInListBean>> register(
          @RequestBody A001RegDto a001RegDto
    ){
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
