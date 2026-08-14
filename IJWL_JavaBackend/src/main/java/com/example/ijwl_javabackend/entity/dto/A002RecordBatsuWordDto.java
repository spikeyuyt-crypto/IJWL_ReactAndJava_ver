package com.example.ijwl_javabackend.entity.dto;

public class A002RecordBatsuWordDto {
   private int wordId;
   private Integer sessionId = null;

    public A002RecordBatsuWordDto(int wordId, Integer sessionId) {
        this.wordId = wordId;
        this.sessionId = sessionId;
    }

   public int getWordId() {
      return wordId;
   }

   public void setWordId(int wordId) {
      this.wordId = wordId;
   }

   public Integer getSessionId() {
      return sessionId;
   }

   public void setSessionId(Integer sessionId) {
      this.sessionId = sessionId;
   }
}
