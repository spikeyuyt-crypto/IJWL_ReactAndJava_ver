package com.example.ijwl_javabackend.service;

import com.example.ijwl_javabackend.entity.dto.A003SettingsDto;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.mapper.A003SettingsMapper;
import org.springframework.stereotype.Service;

@Service
public class A003SettingsService {
    private final A003SettingsMapper a003SettingsMapper;

    public A003SettingsService(A003SettingsMapper a003SettingsMapper) {
        this.a003SettingsMapper = a003SettingsMapper;
    }

    public void updateSettings(A003SettingsDto dto, Integer userId) {


        int updatedRows = a003SettingsMapper.updateSettings(dto, userId);
        if (updatedRows == 0) {
            throw new BusinessException(
                    404,
                    "更新失敗"
            );
        }


    }
}
