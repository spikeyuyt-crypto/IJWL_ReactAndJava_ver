package com.example.ijwl_javabackend.service;

import com.example.ijwl_javabackend.entity.A001LogInListBean;
import com.example.ijwl_javabackend.entity.dto.A001RegDto;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.mapper.A001SignInAndRegisterMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class A001SignInAndRegisterService {
    private final A001SignInAndRegisterMapper a001SignInAndRegisterMapper;

    private final PasswordEncoder passwordEncoder;

    public A001SignInAndRegisterService(
            A001SignInAndRegisterMapper a001SignInAndRegisterMapper,
            PasswordEncoder passwordEncoder

    ) {
        this.a001SignInAndRegisterMapper = a001SignInAndRegisterMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public A001LogInListBean signIn(String username, String password) {
        String userPassword = a001SignInAndRegisterMapper.getUserPassword(username);

        if (userPassword == null) {
            throw new BusinessException(404, "ユーザーが見つかりませんでした");
        }

        if (!passwordEncoder.matches(password, userPassword)) {
            throw new BusinessException(401, "パスワードが違います");
        }

        return a001SignInAndRegisterMapper.getUserSettings(username);
    }

    @Transactional
    public A001LogInListBean register(A001RegDto a001RegDto) {
        boolean usernameExists = a001SignInAndRegisterMapper.checkUsername(a001RegDto.getUsername());

        if (usernameExists) {
            throw new BusinessException(409, "ユーザー名が重複しています");
        }

        String encodedPassword = passwordEncoder.encode(a001RegDto.getPassword());

        int insertedUserRows =
                a001SignInAndRegisterMapper.registerUser(
                        a001RegDto,
                        encodedPassword
                );

        if (insertedUserRows != 1) {
            throw new BusinessException(
                    500,
                    "ユーザーの登録に失敗しました"
            );
        }

        Integer userId = a001RegDto.getUserId();

        if (userId == null) {
            throw new BusinessException(
                    500,
                    "ユーザーIDの取得に失敗しました"
            );
        }

        int insertedSettingsRows =
                a001SignInAndRegisterMapper.registerUserSettings(
                        userId,
                        a001RegDto.getFontSize(),
                        a001RegDto.getBackgroundColor()
                );

        if (insertedSettingsRows != 1) {
            throw new BusinessException(
                    500,
                    "ユーザー設定の登録に失敗しました"
            );
        }

        return a001SignInAndRegisterMapper.getUserSettings(a001RegDto.getUsername());
    }
}
