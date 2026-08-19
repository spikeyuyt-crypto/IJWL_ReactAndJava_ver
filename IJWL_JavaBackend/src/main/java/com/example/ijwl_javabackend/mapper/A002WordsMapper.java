package com.example.ijwl_javabackend.mapper;

import com.example.ijwl_javabackend.entity.A002GetSearchingWordBean;
import com.example.ijwl_javabackend.entity.A002GetWordsListBean;
import com.example.ijwl_javabackend.entity.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface A002WordsMapper {
    List<String> getUnitNumbers();

    List<A002GetWordsListBean> getAllWords(A002GetWordsRequestDto a002GetWordsRequestDto);

    List<A002GetWordsListBean> getBatsuWords(int userId);

    List<A002GetWordsListBean> getMarkedWords(int userId);

    List<A002GetSearchingWordBean> searchWord(String word);

    int markWord(@Param("insertTargets") List<A002MarkWordDto> insertTargets,
            @Param("userId") int userId);

    String getComment(@Param("a002GetCommentDto") A002GetCommentDto a002GetCommentDto,
            @Param("userId") int userId);

    int updateComment(@Param("a002UpdateCommentDto") A002UpdateCommentDto a002UpdateCommentDto,
            @Param("userId") int userId);

    int unmarkWord(@Param("a002UnmarkAndDeleteWordDto") List<A002UnmarkAndDeleteWordDto> a002UnmarkAndDeleteWordDto,
            @Param("userId") int userId);

    int deleteBatsuWord(
            @Param("a002UnmarkAndDeleteWordDto") List<A002UnmarkAndDeleteWordDto> a002UnmarkAndDeleteWordDto,
            @Param("userId") Integer userId);

    int recordBatsuWord(List<A002RecordBatsuWordDto> insertTargets, @Param("userId") int userId);
}
