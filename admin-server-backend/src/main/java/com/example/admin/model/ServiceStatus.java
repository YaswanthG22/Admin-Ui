package com.example.admin.model;

import java.util.Map;

public class ServiceStatus {

    private String serviceName;
    private String url;
    private boolean reachable;
    private String status;
    private String dbStatus;
    private String reason;
    private String checkedAt;

    public ServiceStatus(String serviceName, String url, Map<String, Object> health) {
        this.serviceName = serviceName;
        this.url = url;
        this.reachable = (boolean) health.get("reachable");
        this.status = health.get("status").toString();
        this.reason = health.get("reason").toString();
        this.checkedAt = health.get("checkedAt").toString();

        // DB STATUS EXTRACTION
        try {
            Map<String, Object> details = (Map<String, Object>) health.get("details");
            Map<String, Object> components =
                    (Map<String, Object>) details.get("components");

            if (components != null && components.containsKey("db")) {
                Map<String, Object> db =
                        (Map<String, Object>) components.get("db");
                this.dbStatus = db.get("status").toString();
            } else {
                this.dbStatus = "N/A";
            }
        } catch (Exception e) {
            this.dbStatus = "N/A";
        }
    }

    public String getServiceName() { return serviceName; }
    public String getUrl() { return url; }
    public boolean isReachable() { return reachable; }
    public String getStatus() { return status; }
    public String getDbStatus() { return dbStatus; }
    public String getReason() { return reason; }
    public String getCheckedAt() { return checkedAt; }
}
