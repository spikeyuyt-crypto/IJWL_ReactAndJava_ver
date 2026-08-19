package com.example.ijwl_javabackend.service;

import com.example.ijwl_javabackend.entity.A001LogInListBean;
import com.example.ijwl_javabackend.entity.dto.A001RegDto;
import com.example.ijwl_javabackend.entity.dto.A001SignInResult;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.mapper.A001SignInAndRegisterMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ijwl_javabackend.security.JwtUtil;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.StringRedisTemplate;
import com.example.ijwl_javabackend.entity.A001ReissueToken;

@Service
public class A001SignInAndRegisterService {
    private final A001SignInAndRegisterMapper a001SignInAndRegisterMapper;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final StringRedisTemplate stringRedisTemplate;

    public A001SignInAndRegisterService(
            A001SignInAndRegisterMapper a001SignInAndRegisterMapper,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            StringRedisTemplate stringRedisTemplate) {
        this.a001SignInAndRegisterMapper = a001SignInAndRegisterMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    private String generateAccessToken(String userId) {
        return jwtUtil.generateAccessToken(userId);
    }

    private String generateRefreshToken(String userId) {
        return jwtUtil.generateRefreshToken(userId);
    }

    public A001SignInResult signIn(String username, String password) {
        String userPassword = a001SignInAndRegisterMapper.getUserPassword(username);

        if (userPassword == null) {
            throw new BusinessException(404, "ユーザーが見つかりませんでした");
        }

        if (!passwordEncoder.matches(password, userPassword)) {
            throw new BusinessException(401, "パスワードが違います");
        }

        A001LogInListBean userInfo = a001SignInAndRegisterMapper.getUserSettings(username);

        String accessToken = generateAccessToken(userInfo.getUserId());

        String refreshToken = generateRefreshToken(userInfo.getUserId());

        stringRedisTemplate.opsForValue().set("refreshToken:" + userInfo.getUserId(), refreshToken, 7, TimeUnit.DAYS);

        userInfo.setAccessToken(accessToken);

        return new A001SignInResult(userInfo, refreshToken);
    }

    @Transactional
    public A001LogInListBean register(A001RegDto a001RegDto) {
        boolean usernameExists = a001SignInAndRegisterMapper.checkUsername(a001RegDto.getUsername());

        if (usernameExists) {
            throw new BusinessException(409, "ユーザー名が重複しています");
        }

        String encodedPassword = passwordEncoder.encode(a001RegDto.getPassword());

        int insertedUserRows = a001SignInAndRegisterMapper.registerUser(
                a001RegDto,
                encodedPassword);

        if (insertedUserRows != 1) {
            throw new BusinessException(
                    500,
                    "ユーザーの登録に失敗しました");
        }

        Integer userId = a001RegDto.getUserId();

        if (userId == null) {
            throw new BusinessException(
                    500,
                    "ユーザーIDの取得に失敗しました");
        }

        int insertedSettingsRows = a001SignInAndRegisterMapper.registerUserSettings(
                userId,
                a001RegDto.getFontSize(),
                a001RegDto.getBackgroundColor());

        if (insertedSettingsRows != 1) {
            throw new BusinessException(
                    500,
                    "ユーザー設定の登録に失敗しました");
        }

        String accessToken = generateAccessToken(userId.toString());

        A001LogInListBean userInfo = a001SignInAndRegisterMapper.getUserSettings(a001RegDto.getUsername());

        userInfo.setAccessToken(accessToken);

        return userInfo;
    }

    public A001LogInListBean getUserInfoByAccessToken(int userId) {
        return a001SignInAndRegisterMapper.getUserSettingsById(userId);
    }

    public A001ReissueToken refresh(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            return null;
        }

        Integer userId = jwtUtil.getUserIdFromRefreshToken(refreshToken);

        String currentRefreshToken = stringRedisTemplate.opsForValue().get("refreshToken:" + userId);

        if (currentRefreshToken == null) {
            return null;
        }

        if (!currentRefreshToken.equals(refreshToken)) {
            throw new BusinessException(
                    401,
                    "不正なリフレッシュトークン");
        }

        long expirationTime = stringRedisTemplate.getExpire("refreshToken:" + userId, TimeUnit.SECONDS);

        String newRefreshToken = null;

        if (expirationTime <= 24 * 60 * 60) {
            newRefreshToken = generateRefreshToken(userId.toString());

            stringRedisTemplate.opsForValue().set("refreshToken:" + userId, newRefreshToken, 7, TimeUnit.DAYS);
        }

        String accessToken = generateAccessToken(userId.toString());

        return new A001ReissueToken(newRefreshToken, accessToken);
    }

    public void signOut(String userId) {

        stringRedisTemplate.delete("refreshToken:" + userId);
    }

}
