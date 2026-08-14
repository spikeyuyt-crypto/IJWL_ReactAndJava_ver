package com.example.ijwl_javabackend.mapper;

import com.example.ijwl_javabackend.entity.dto.A003SettingsDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface A003SettingsMapper {
    int updateSettings(@Param("dto") A003SettingsDto dto,@Param("userId") Integer userId);
}
