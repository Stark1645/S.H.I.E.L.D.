package com.shield.service;

import org.springframework.stereotype.Service;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.util.*;

@Service
public class SystemHealthService {
    private final MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
    private final OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
    private final Runtime runtime = Runtime.getRuntime();

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        Map<String, Object> memory = new HashMap<>();
        memory.put("used", usedMemory / (1024 * 1024));
        memory.put("free", freeMemory / (1024 * 1024));
        memory.put("total", totalMemory / (1024 * 1024));
        memory.put("max", maxMemory / (1024 * 1024));
        memory.put("usagePercent", (usedMemory * 100.0) / totalMemory);
        
        Map<String, Object> cpu = new HashMap<>();
        cpu.put("availableProcessors", osBean.getAvailableProcessors());
        cpu.put("systemLoadAverage", osBean.getSystemLoadAverage());
        
        Map<String, Object> jvm = new HashMap<>();
        jvm.put("uptime", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);
        jvm.put("threads", ManagementFactory.getThreadMXBean().getThreadCount());
        
        health.put("status", usedMemory * 100.0 / totalMemory > 90 ? "WARNING" : "HEALTHY");
        health.put("memory", memory);
        health.put("cpu", cpu);
        health.put("jvm", jvm);
        health.put("timestamp", new Date());
        
        return health;
    }

    public List<Map<String, Object>> getPerformanceMetrics() {
        List<Map<String, Object>> metrics = new ArrayList<>();
        
        for (int i = 0; i < 20; i++) {
            Map<String, Object> metric = new HashMap<>();
            metric.put("timestamp", System.currentTimeMillis() - (i * 30000));
            metric.put("cpuUsage", 20 + Math.random() * 60);
            metric.put("memoryUsage", 40 + Math.random() * 40);
            metric.put("responseTime", 50 + Math.random() * 200);
            metrics.add(0, metric);
        }
        
        return metrics;
    }
}
