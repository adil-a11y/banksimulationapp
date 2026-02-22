// Test script to verify frontend-backend connection
import { getAIResponse } from './src/services/aiService.js';

// Test the AI service
getAIResponse("Hello, this is a test message")
  .then(response => {
    console.log("✅ Test successful! AI Response:", response);
  })
  .catch(error => {
    console.error("❌ Test failed:", error);
  });
