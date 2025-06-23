// Configuration for Gemini API and Quiz Settings
const CONFIG = {
  // Gemini API Configuration
  GEMINI_API_KEY: 'AIzaSyDrMFl5HyTQNcTPixIdGU9roFvvByiveD4',
  
  // Quiz Settings
  DEFAULT_QUESTION_COUNT: 20,
  DEFAULT_TOPIC: 'Aadhaar Enrolment Operator and Supervisor procedures, requirements, biometrics, documents, and regulations',
  DEFAULT_DIFFICULTY: 'medium',
  
  // Available Topics
  TOPICS: [
    'Aadhaar Enrolment',
    'Biometric Authentication',
    'UIDAI Procedures',
    'Document Verification',
    'Data Security',
    'Quality Assurance',
    'Software Operations',
    'Regulatory Compliance'
  ],
  
  // Difficulty Levels
  DIFFICULTY_LEVELS: [
    'easy',
    'medium',
    'hard'
  ],
  
  // UI Messages
  MESSAGES: {
    LOADING: 'Generating questions from Gemini AI...',
    ERROR: 'Failed to generate questions. Please check your API key and try again.',
    NO_API_KEY: 'Please set your Gemini API key in the configuration.',
    GENERATION_SUCCESS: 'Questions generated successfully!',
    INVALID_RESPONSE: 'Received invalid response from Gemini API.'
  }
};

// Function to check if API key is configured
function isApiKeyConfigured() {
  return CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
}

// Export configuration
window.CONFIG = CONFIG;
window.isApiKeyConfigured = isApiKeyConfigured;