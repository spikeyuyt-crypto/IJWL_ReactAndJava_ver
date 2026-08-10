package com.example.ijwl_javabackend.service;

import com.example.ijwl_javabackend.entity.A002GetSearchingWordBean;
import com.example.ijwl_javabackend.entity.A002GetWordsListBean;
import com.example.ijwl_javabackend.entity.dto.A002GetWordsRequestDto;
import com.example.ijwl_javabackend.entity.dto.A002MarkWordDto;
import com.example.ijwl_javabackend.exceptionHandler.BusinessException;
import com.example.ijwl_javabackend.mapper.A002WordsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;

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
        return a002WordsMapper.getSearchingWords(word);
    }

    @Transactional
    public void markWord(
            List<A002MarkWordDto> a002MarkWordDto
    ) {

    }


}
