package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.repository.ThreatEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeolocationService {
    private final ThreatEventRepository threatRepository;
    private static final Map<String, String> IP_TO_COUNTRY = new HashMap<>();
    
    static {
        IP_TO_COUNTRY.put("192.168", "Internal Network");
        IP_TO_COUNTRY.put("10.0", "Internal Network");
        IP_TO_COUNTRY.put("172.16", "Internal Network");
        IP_TO_COUNTRY.put("45.142", "Russia");
        IP_TO_COUNTRY.put("103.253", "China");
        IP_TO_COUNTRY.put("185.220", "Germany");
        IP_TO_COUNTRY.put("91.219", "Ukraine");
        IP_TO_COUNTRY.put("198.98", "United States");
        IP_TO_COUNTRY.put("159.65", "United States");
        IP_TO_COUNTRY.put("104.248", "United States");
    }

    public List<Map<String, Object>> getThreatGeolocation() {
        List<ThreatEvent> threats = threatRepository.findAll();
        
        Map<String, List<ThreatEvent>> countryGroups = threats.stream()
            .collect(Collectors.groupingBy(t -> getCountryFromIP(t.getSourceIP())));

        return countryGroups.entrySet().stream().map(entry -> {
            Map<String, Object> location = new HashMap<>();
            location.put("country", entry.getKey());
            location.put("threatCount", entry.getValue().size());
            location.put("avgSeverity", entry.getValue().stream()
                .mapToDouble(ThreatEvent::getSeverityScore)
                .average().orElse(0));
            location.put("coordinates", getCoordinates(entry.getKey()));
            return location;
        }).collect(Collectors.toList());
    }

    private String getCountryFromIP(String ip) {
        if (ip == null) return "Unknown";
        String prefix = ip.substring(0, Math.min(ip.lastIndexOf('.'), ip.length()));
        return IP_TO_COUNTRY.entrySet().stream()
            .filter(e -> ip.startsWith(e.getKey()))
            .map(Map.Entry::getValue)
            .findFirst()
            .orElse("Unknown");
    }

    private Map<String, Double> getCoordinates(String country) {
        Map<String, Double> coords = new HashMap<>();
        switch (country) {
            case "Russia": coords.put("lat", 55.7558); coords.put("lon", 37.6173); break;
            case "China": coords.put("lat", 39.9042); coords.put("lon", 116.4074); break;
            case "Germany": coords.put("lat", 52.5200); coords.put("lon", 13.4050); break;
            case "Ukraine": coords.put("lat", 50.4501); coords.put("lon", 30.5234); break;
            case "United States": coords.put("lat", 38.9072); coords.put("lon", -77.0369); break;
            default: coords.put("lat", 0.0); coords.put("lon", 0.0);
        }
        return coords;
    }
}
