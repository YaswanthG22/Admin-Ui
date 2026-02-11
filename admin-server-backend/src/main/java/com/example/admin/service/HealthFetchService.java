package com.example.admin.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class HealthFetchService {

    private final RestTemplate restTemplate;

    public HealthFetchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> fetchHealth(String baseUrl) {

        try {
            ResponseEntity<Map> response =
                    restTemplate.getForEntity(baseUrl + "/actuator/health", Map.class);

            Map<String, Object> body = response.getBody();

            return Map.of(
                    "reachable", true,
                    "status", body.get("status"),
                    "details", body,
                    "reason", "OK",
                    "checkedAt", LocalDateTime.now().toString()
            );

        } catch (Exception e) {
            return Map.of(
                    "reachable", false,
                    "status", "NOT_RUNNING",
                    "reason", "Service not reachable",
                    "checkedAt", LocalDateTime.now().toString()
            );
        }
    }
}
