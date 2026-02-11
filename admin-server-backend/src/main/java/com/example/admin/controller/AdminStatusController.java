package com.example.admin.controller;

import com.example.admin.model.ServiceStatus;
import com.example.admin.service.HealthFetchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AdminStatusController {

    private final HealthFetchService healthFetchService;

    public AdminStatusController(HealthFetchService healthFetchService) {
        this.healthFetchService = healthFetchService;
    }

    @GetMapping("/admin/status")
    public List<ServiceStatus> getStatus() {

        Map<String, Object> exceptionHealth =
                healthFetchService.fetchHealth("http://localhost:8081");

        Map<String, Object> numberHealth =
                healthFetchService.fetchHealth("http://localhost:8082");

        return List.of(
                new ServiceStatus(
                        "Exception Server",
                        "http://localhost:8081",
                        exceptionHealth
                ),
                new ServiceStatus(
                        "Number-To-Words Server",
                        "http://localhost:8082",
                        numberHealth
                )
        );
    }
}
