package com.example.ijwl_javabackend.controller;

import com.example.ijwl_javabackend.entity.A002GetSearchingWordBean;
import com.example.ijwl_javabackend.entity.A002GetWordsListBean;
import com.example.ijwl_javabackend.entity.ApiResponse;
import com.example.ijwl_javabackend.entity.dto.A002GetWordsRequestDto;
import com.example.ijwl_javabackend.entity.dto.A002MarkWordDto;
import com.example.ijwl_javabackend.service.A002WordsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/words")
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

    @GetMapping("/getBatsuWords/{userId}")
    public ResponseEntity<ApiResponse<List<A002GetWordsListBean>>> getBatsuWord(
            @PathVariable int userId
    ) {
        List<A002GetWordsListBean> batsuWords = a002WordsService.getBatsuWords(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "バツ単語取得成功",
                        batsuWords
                )
        );
    }

    @GetMapping("/getMarkedWords/{userId}")
    public ResponseEntity<ApiResponse<List<A002GetWordsListBean>>> getMarkedWord(
            @PathVariable int userId
    ) {
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
            @RequestBody List<A002MarkWordDto> a002MarkWordDto
    ) {
        a002WordsService.markWord(a002MarkWordDto);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "マーク成功",
                        null
                )
        );
    }


}
