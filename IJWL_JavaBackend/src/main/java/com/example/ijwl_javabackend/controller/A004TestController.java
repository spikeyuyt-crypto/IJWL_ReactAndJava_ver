package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.A004RecordTestResponse;
import com.example.ijwl_javabackend.entity.A004ShowTestScoreListBean;
import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.A004TestDto;
import com.example.ijwl_javabackend.service.A004TestService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class A004TestController {
        private final A004TestService a004TestService;

        public A004TestController(
                        A004TestService a004TestService) {
                this.a004TestService = a004TestService;

        }

        @PostMapping("/record")
        public ResponseEntity<ApiResponse<A004RecordTestResponse>> recordTest(
                        @RequestBody A004TestDto a004TestDto,
                        HttpServletRequest request) {
                Integer userId = (Integer) request.getAttribute("userId");

                A004RecordTestResponse sessionId = a004TestService.recordTest(a004TestDto, userId);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                "success",
                                                sessionId));
        }

        @PostMapping("/showTestScore")
        public ResponseEntity<ApiResponse<List<A004ShowTestScoreListBean>>> showTestScore(
                        HttpServletRequest request) {

                Integer userId = (Integer) request.getAttribute("userId");
                List<A004ShowTestScoreListBean> entity = a004TestService.showTestScore(userId);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                "success",
                                                entity));
        }

}
