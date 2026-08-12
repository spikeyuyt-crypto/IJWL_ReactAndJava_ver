package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.A002GetSearchingWordBean;
import com.example.ijwl_javabackend.entity.A002GetWordsListBean;
import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.*;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.service.A002WordsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/word")
public class A002WordsController {
    private final A002WordsService a002WordsService;

    public A002WordsController(A002WordsService a002WordsService) {
        this.a002WordsService = a002WordsService;
    }

    @GetMapping("/getUnitNumbers")
    public ResponseEntity<ApiResponse<List<String>>> getUnitNumbers() {
        return ResponseEntity.ok(
                new ApiResponse<>
                        ("Success", a002WordsService.getUnitNumbers()));
    }

    @PostMapping("/getAllWords")
    public ResponseEntity<ApiResponse<List<A002GetWordsListBean>>> getAllWords(
            @RequestBody A002GetWordsRequestDto a002GetWordsRequestDto
    ) {
        List<A002GetWordsListBean> allWords = a002WordsService.getAllWords(
                a002GetWordsRequestDto,
                a002WordsService
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "全単語取得成功",
                        allWords
                )
        );
    }

    @GetMapping("/getBatsuWords")
    public ResponseEntity<ApiResponse<List<A002GetWordsListBean>>> getBatsuWord(
            HttpServletRequest request
    ) {

        Integer userId = (Integer) request.getAttribute("userId");

        List<A002GetWordsListBean> batsuWords = a002WordsService.getBatsuWords(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "バツ単語取得成功",
                        batsuWords
                )
        );
    }

    @GetMapping("/getMarkedWords")
    public ResponseEntity<ApiResponse<List<A002GetWordsListBean>>> getMarkedWord(
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");

        List<A002GetWordsListBean> markedWords = a002WordsService.getMarkedWords(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "マーク単語取得成功",
                        markedWords
                )
        );
    }

    @PostMapping("/searchWord")
    public ResponseEntity<ApiResponse<List<A002GetSearchingWordBean>>> searchWord(
            @RequestBody String word
    ) {
        List<A002GetSearchingWordBean> res = a002WordsService.searchWord(word);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "検索成功",
                        res
                )
        );
    }

    @PostMapping("/markWord")
    public ResponseEntity<ApiResponse<Void>> markWord(
            @RequestBody List<A002MarkWordDto> a002MarkWordDto,
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");

        if (userId == null) {
            throw new BusinessException(401, "ログインが必要です");
        }

        a002WordsService.markWord(a002MarkWordDto, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "マーク成功",
                        null
                )
        );
    }

    @PostMapping("/comment")
    public ResponseEntity<ApiResponse<Map<String, String>>> getComment(
            @RequestBody A002GetCommentDto a002GetCommentDto,
            HttpServletRequest request

    ) {
        Integer userId = (Integer) request.getAttribute("userId");
        String memo = a002WordsService.getComment(a002GetCommentDto, userId);

        Map<String, String> data = Map.of(
                "memo", memo == null ? "" : memo
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "コメント取得成功",
                        data
                )
        );
    }

    @PutMapping("/updateComment")
    public ResponseEntity<ApiResponse<Void>> updateComment(
            @RequestBody A002UpdateCommentDto a002UpdateCommentDto,
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");

        a002WordsService.updateComment(a002UpdateCommentDto, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "コメント更新成功",
                        null
                )
        );
    }

    @DeleteMapping("/unmarkWord")
    public ResponseEntity<ApiResponse<Void>> unmarkWord(
            @RequestBody List<A002UnmarkAndDeleteWordDto> a002UnmarkAndDeleteWordDto,
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");
        a002WordsService.unmarkWord(a002UnmarkAndDeleteWordDto, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "マーク解除成功",
                        null
                )
        );
    }

    @DeleteMapping("/deleteBatsuWord")
    public ResponseEntity<ApiResponse<Void>> deleteBatsuWord(
            @RequestBody List<A002UnmarkAndDeleteWordDto> a002UnmarkAndDeleteWordDto,
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");
        a002WordsService.deleteBatsuWord(a002UnmarkAndDeleteWordDto, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "バツ単語削除成功",
                        null
                )
        );
    }

    @PostMapping("recordBatsuWord")
    public ResponseEntity<ApiResponse<Void>> recordBatsuWord(
            @RequestBody A002RecordBatsuWordDto a002RecordBatsuWordDto,
            HttpServletRequest request
    ) {
        Integer userId = (Integer) request.getAttribute("userId");
        a002WordsService.recordBatsuWord(List.of(a002RecordBatsuWordDto), userId);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "バツ単語記録成功",
                        null
                )
        );
    }
}
