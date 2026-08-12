package com.example.ijwl_javabackend.service;

import com.example.ijwl_javabackend.entity.A002GetSearchingWordBean;
import com.example.ijwl_javabackend.entity.A002GetWordsListBean;
import com.example.ijwl_javabackend.entity.dto.*;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.mapper.A002WordsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class A002WordsService {
    private final A002WordsMapper a002WordsMapper;

    public A002WordsService(
            A002WordsMapper a002WordsMapper
    ) {
        this.a002WordsMapper = a002WordsMapper;
    }

    public List<String> getUnitNumbers() {

        List<String> unitNumbers = a002WordsMapper.getUnitNumbers();


        if (unitNumbers == null) {
            throw new RuntimeException("単元番号が見つかりませんでした");
        }

        unitNumbers.sort(Comparator.comparingInt(Integer::parseInt));


        return unitNumbers;
    }

    public List<A002GetWordsListBean> getAllWords(
            A002GetWordsRequestDto a002GetWordsRequestDto,
            A002WordsService a002WordsService
    ) {
        List<String> unitNumbers = a002WordsService.getUnitNumbers();

        List<String> invalidUnitNumbers = a002GetWordsRequestDto.getUnitNumbers().stream()
                .filter(i -> !unitNumbers.contains(i))
                .toList();

        if (!invalidUnitNumbers.isEmpty()) {
            throw new BusinessException(404, "存在しない単元番号が指定されました: " + invalidUnitNumbers);
        }

        List<A002GetWordsListBean> words =
                a002WordsMapper.getAllWords(a002GetWordsRequestDto);

        if (words.isEmpty()) {
            throw new BusinessException(
                    404,
                    "該当する単語が見つかりませんでした"
            );
        }

        return words;
    }

    public List<A002GetWordsListBean> getBatsuWords(
            int userId
    ) {
        return a002WordsMapper.getBatsuWords(userId);
    }

    public List<A002GetWordsListBean> getMarkedWords(
            int userId
    ) {
        return a002WordsMapper.getMarkedWords(userId);
    }

    public List<A002GetSearchingWordBean> searchWord(
            String word
    ) {
        return a002WordsMapper.searchWord(word);
    }

    @Transactional
    public void markWord(
            List<A002MarkWordDto> a002MarkWordDto,
            int userId
    ) {
        if (
                a002MarkWordDto.isEmpty()
        ) {
            throw new BusinessException(
                    400,
                    "マーク単語を指定してください"
            );
        }

        List<A002GetWordsListBean> existingWordIds = a002WordsMapper.getMarkedWords(userId);

        List<A002MarkWordDto> insertTargets =
                a002MarkWordDto.stream()
                        .collect(Collectors.toMap(
                                A002MarkWordDto::getWordId,
                                item -> item,
                                (existing, duplicate) -> existing
                        ))
                        .values()
                        .stream()
                        .filter(item -> !existingWordIds.contains(item.getWordId()))
                        .toList();

        if (insertTargets.isEmpty()) {
            return;
        }

        int insertedRows = a002WordsMapper.markWord(insertTargets, userId);

        if (insertedRows != insertTargets.size()) {
            throw new BusinessException(
                    500,
                    "マーク失敗"
            );
        }
        return;
    }

    public String getComment(
            A002GetCommentDto a002GetCommentDto,
            int userId
    ) {
        return a002WordsMapper.getComment(a002GetCommentDto, userId);
    }

    public void updateComment(A002UpdateCommentDto a002UpdateCommentDto, int userId) {
        int updatedRows = a002WordsMapper.updateComment(a002UpdateCommentDto, userId);

        if (updatedRows != 1) {
            throw new BusinessException(
                    404,
                    "コメント更新対象が見つかりません"
            );
        }
        return;
    }

    public void unmarkWord(List<A002UnmarkAndDeleteWordDto> a002UnmarkAndDeleteWordDto, int userId) {
        if (
                a002UnmarkAndDeleteWordDto.isEmpty()
        ) {
            throw new BusinessException(
                    400,
                    "マーク対象選択していません"
            );
        }

        int deletedRows = a002WordsMapper.unmarkWord(a002UnmarkAndDeleteWordDto, userId);

        if (deletedRows < 1) {
            throw new BusinessException(
                    404,
                    "マーク対象が見つかりません"
            );
        }

        return;
    }


    public void deleteBatsuWord(
            List<A002UnmarkAndDeleteWordDto> a002UnmarkAndDeleteWordDto,
            Integer userId
    ) {
        if (
                a002UnmarkAndDeleteWordDto.isEmpty()
        ) {
            throw new BusinessException(
                    400,
                    "マーク対象選択していません"
            );
        }

        int deletedRows = a002WordsMapper.deleteBatsuWord(a002UnmarkAndDeleteWordDto, userId);

        if (deletedRows < 1) {
            throw new BusinessException(
                    404,
                    "削除対象のバツ単語が見つかりません"
            );
        }

        return;
    }

    @Transactional
    public void recordBatsuWord(List<A002RecordBatsuWordDto> a002RecordBatsuWordDto, int userId) {
        if (a002RecordBatsuWordDto.isEmpty()) {
            return;
        }

        List<A002GetWordsListBean> dbBatsuWords = a002WordsMapper.getBatsuWords(userId);

        List<A002RecordBatsuWordDto> insertTargets =
                a002RecordBatsuWordDto.stream()
                        .collect(Collectors.toMap(
                                A002RecordBatsuWordDto::getWordId,
                                dto -> dto,
                                (first, duplicate) -> first
                        ))
                        .values()
                        .stream()
                        .filter(dto -> !dbBatsuWords.contains(dto.getWordId()))
                        .toList();

        int insertedRows =
                a002WordsMapper.recordBatsuWord(insertTargets, userId);

        if (insertedRows != insertTargets.size()) {
            throw new BusinessException(
                    500,
                    "バツ単語の登録に失敗しました"
            );
        }
    }
}
