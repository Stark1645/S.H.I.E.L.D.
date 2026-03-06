package com.shield.dto;

import lombok.Data;

@Data
public class AgentInfo {
    private String name;
    private String displayName;
    private String description;
    private String status;
    private int totalDecisions;
    private double avgConfidence;
    
    public AgentInfo(String name, String displayName, String description, String status, int totalDecisions, double avgConfidence) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.status = status;
        this.totalDecisions = totalDecisions;
        this.avgConfidence = avgConfidence;
    }
}