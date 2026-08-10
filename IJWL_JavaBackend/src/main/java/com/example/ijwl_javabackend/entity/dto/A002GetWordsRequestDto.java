package com.example.ijwl_javabackend.entity.dto;

import java.util.List;

public class A002GetWordsRequestDto {
    private List<String> unitNumbers;

    public List<String> getUnitNumbers() {
        return unitNumbers;
    }

    public void setUnitNumbers(List<String> unitNumbers) {
        this.unitNumbers = unitNumbers;
    }
}
