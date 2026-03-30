package com.example.SkillForge.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptRequest {
    private Long quizId;
    private Long studentId;
    /**
     * questionId -> selected answer (for MCQ) or text (for SHORT_ANSWER)
     */
    private Map<Long, String> answers;
    private Integer timeSpentSeconds;
}
