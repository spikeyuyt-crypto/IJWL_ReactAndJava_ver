package com.example.ijwl_javabackend.mapper;

import com.example.ijwl_javabackend.entity.dto.A004TestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import com.example.ijwl_javabackend.entity.A004ShowTestScoreListBean;

@Mapper
public interface A004TestMapper {
    int recordTest(A004TestDto a004TestDto, Integer userId);

    List<A004ShowTestScoreListBean> showTestScore(Integer userId);
}
