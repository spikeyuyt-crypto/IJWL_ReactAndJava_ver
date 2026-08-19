package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.A003SettingsDto;
import com.example.ijwl_javabackend.service.A003SettingsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/settings")
public class A003SettingsController {
    private final A003SettingsService a003SettingsService;

    public A003SettingsController(A003SettingsService a003SettingsService) {
        this.a003SettingsService = a003SettingsService;
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Void>> updateSettings(
            @RequestBody A003SettingsDto dto,
            HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        a003SettingsService.updateSettings(dto, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "設定更新成功",
                        null));
    }
}
