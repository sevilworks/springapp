package com.springapp.springapp.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GrammarService {

    private final RestTemplate restTemplate;
    private static final String GRAMMAR_API_URL = "https://api.languagetool.org/v2/check";

    public GrammarService() {
        this.restTemplate = new RestTemplate();
    }

    public Double checkGrammar(String text) {
        try {
            if (text == null || text.trim().isEmpty()) {
                return 100.0;
            }

            // Prepare form data for POST request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("text", text);
            map.add("language", "en-US");
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            // Make POST request to LanguageTool API
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                GRAMMAR_API_URL, 
                request, 
                (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("matches")) {
                List<Map<String, Object>> matches = (List<Map<String, Object>>) responseBody.get("matches");
                int errorCount = matches.size();
                
                // Calculate score based on error count and text length
                int wordCount = text.trim().split("\\s+").length;
                if (wordCount == 0) return 100.0;
                
                // Score calculation: fewer errors relative to word count = higher score
                double errorRate = (double) errorCount / wordCount;
                double score = Math.max(0, 100 - (errorRate * 50)); // Penalize errors
                return Math.round(score * 10.0) / 10.0; // Round to 1 decimal place
            }
            
            return 100.0; // No errors found
        } catch (Exception e) {
            // If API fails, return a default score
            System.err.println("Grammar check failed: " + e.getMessage());
            return 50.0; // Return neutral score on error
        }
    }
}

