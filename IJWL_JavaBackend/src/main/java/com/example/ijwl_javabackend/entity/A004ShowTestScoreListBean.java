package com.example.ijwl_javabackend.entity;
import java.time.LocalDateTime;

public class A004ShowTestScoreListBean {
    private LocalDateTime endedAt;
    private Integer score;
    private Integer sessionId;
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
    public Integer getSessionId() {
        return sessionId;
    }
    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    
}
