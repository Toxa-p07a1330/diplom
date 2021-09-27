package ru.shtrih.kds.tools;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "private")
public class ApplicationPrivateProperties {
    private String uploadDir;
    private Long sessionTimeout;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public Long getSessionTimeout() {
        return sessionTimeout;
    }

    public void setSessionTimeout(Long sessionTimeout) {
        this.sessionTimeout = sessionTimeout;
    }
}