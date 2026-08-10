package com.example.ijwl_javabackend.mapper;

import com.example.ijwl_javabackend.entity.A002GetSearchingWordBean;
import com.example.ijwl_javabackend.entity.A002GetWordsListBean;
import com.example.ijwl_javabackend.entity.dto.A002GetWordsRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface A002WordsMapper {
    List<String> getUnitNumbers();

    List<A002GetWordsListBean> getAllWords(A002GetWordsRequestDto a002GetWordsRequestDto);

    List<A002GetWordsListBean> getBatsuWords(int userId);

    List<A002GetWordsListBean> getMarkedWords(int userId);

    List<A002GetSearchingWordBean> getSearchingWords(String word);
}
