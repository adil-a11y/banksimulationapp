// AI Service - Feature Disabled
export const getAIResponse = async (message) => {
  // Return disabled message immediately without making API calls
  return "AI feature is currently disabled. Please contact support for more information.";
};

// Legacy compatibility for existing components
export const askAI = async (message) => {
  // Return disabled message immediately without making API calls
  return "AI feature is currently disabled. Please contact support for more information.";
};

export const aiService = {
  async generateResponse(prompt, userContext = {}) {
    // Return disabled message immediately without making API calls
    return "AI feature is currently disabled. Please contact support for more information.";
  }
};
