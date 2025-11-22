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

    private RestTemplate restTemplate;
    private String apiUrl = "https://api.languagetool.org/v2/check";

    public GrammarService() {
        restTemplate = new RestTemplate();
    }

    public Double checkGrammar(String text) {
        try {
            if (text == null || text.isEmpty()) {
                return 100.0;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("text", text);
            params.add("language", "en-US");
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);
            Map<String, Object> result = response.getBody();

            List<Map<String, Object>> matches = (List<Map<String, Object>>) result.get("matches");
            int errors = matches.size();
            
            String[] words = text.trim().split("\\s+");
            int wordCount = words.length;
            if (wordCount == 0) {
                return 0.00;
            }
            
            double errorRate = (double) errors / wordCount;
            double score = 100 - (errorRate * 50);
            if (score < 0) score = 0;
            
            return Math.round(score * 10.0) / 10.0;
            
        } catch (Exception e) {
            System.err.println("Error checking grammar: " + e.getMessage());
            return 0.00;
        }
    }
}
