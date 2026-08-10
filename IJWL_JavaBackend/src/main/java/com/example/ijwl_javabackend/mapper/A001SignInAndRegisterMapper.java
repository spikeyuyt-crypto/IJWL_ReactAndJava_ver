package com.example.ijwl_javabackend.mapper;

import com.example.ijwl_javabackend.entity.A001LogInListBean;
import com.example.ijwl_javabackend.entity.dto.A001RegDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface A001SignInAndRegisterMapper {
    String getUserPassword(String username);

    A001LogInListBean getUserSettings(String username);

    boolean checkUsername(String username);

    int registerUser(@Param("user") A001RegDto a001RegDto, @Param("password") String password);

    int registerUserSettings(
            @Param("userId") Integer userId,
            @Param("fontSize") String fontSize,
            @Param("backgroundColor") String backgroundColor);


}
