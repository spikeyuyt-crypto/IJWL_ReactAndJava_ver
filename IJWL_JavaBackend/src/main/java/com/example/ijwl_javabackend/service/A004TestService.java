package com.example.ijwl_javabackend.service;

import com.example.ijwl_javabackend.entity.A004RecordTestResponse;
import com.example.ijwl_javabackend.entity.dto.A002RecordBatsuWordDto;
import com.example.ijwl_javabackend.entity.dto.A004TestDto;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.mapper.A004TestMapper;
import com.example.ijwl_javabackend.entity.A004ShowTestScoreListBean;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class A004TestService {
    private final A004TestMapper a004TestMapper;
    private final A002WordsService a002WordsService;

    public A004TestService(
            A004TestMapper a004TestMapper,
            A002WordsService a002WordsService) {
        this.a004TestMapper = a004TestMapper;
        this.a002WordsService = a002WordsService;
    }

    @Transactional
    public A004RecordTestResponse recordTest(
            A004TestDto a004TestDto, Integer userId) {
        int insertedRows = a004TestMapper.recordTest(a004TestDto, userId);

        if (insertedRows != 1) {
            throw new BusinessException(
                    500,
                    "テスト結果保存失敗");
        }

        Integer sessionId = a004TestDto.getSessionId();

        if (sessionId == null) {
            throw new BusinessException(
                    500,
                    "テストID取得失敗");
        }
        List<A002RecordBatsuWordDto> batsuWords = a004TestDto.getWrongWordIds()
                .stream()
                .map(wordId -> new A002RecordBatsuWordDto(
                        wordId,
                        sessionId))
                .toList();

        a002WordsService.recordBatsuWord(batsuWords, userId);

        return new A004RecordTestResponse(sessionId);
    }

    public List<A004ShowTestScoreListBean> showTestScore(
            Integer userId
        ) {
        return a004TestMapper.showTestScore(userId);
    }

}
