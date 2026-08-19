package com.example.ijwl_javabackend.entity.dto;

import com.example.ijwl_javabackend.entity.A001LogInListBean;

public class A001SignInResult {

    private A001LogInListBean userInfo;
    private String refreshToken;

    public A001SignInResult(A001LogInListBean userInfo, String refreshToken) {
        this.userInfo = userInfo;
        this.refreshToken = refreshToken;
    }

    public A001LogInListBean getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(A001LogInListBean userInfo) {
        this.userInfo = userInfo;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}