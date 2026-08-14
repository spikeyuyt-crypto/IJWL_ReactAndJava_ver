package com.example.ijwl_javabackend.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.Collections.emptyList;

public class A004TestDto {
   private LocalDateTime startedAt;
   private LocalDateTime endedAt;
   private Integer score;
   private List<Integer> wrongWordIds = emptyList();
   private Integer sessionId = null;

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public List<Integer> getWrongWordIds() {
        return wrongWordIds;
    }

    public void setWrongWordIds(List<Integer> wrongWordIds) {
        this.wrongWordIds = wrongWordIds;
    }

    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }
}
