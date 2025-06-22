// Gemini API Configuration and Question Generation
class GeminiQuizGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  async generateQuestions(topic = 'Aadhaar Enrolment', count = 20, difficulty = 'medium') {
    const prompt = `Generate ${count} multiple choice questions about ${topic} for ${difficulty} difficulty level.
    
    Format each question as a JSON object with this exact structure:
    {
      "question": "Question text here?",
      "options": [
        "A. Option 1",
        "B. Option 2", 
        "C. Option 3",
        "D. Option 4"
      ],
      "answer": "A"
    }
    
    Return only a valid JSON array of ${count} questions. No additional text or formatting.
    Make sure questions are relevant to ${topic} and cover various aspects like procedures, requirements, documents, biometrics, software, and regulations.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Clean and parse the JSON response
      const cleanedText = this.cleanJsonResponse(generatedText);
      const questions = JSON.parse(cleanedText);
      
      return this.validateQuestions(questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions from Gemini API');
    }
  }

  cleanJsonResponse(text) {
    // Remove markdown code blocks and extra formatting
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    cleaned = cleaned.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
    cleaned = cleaned.trim();
    
    // Ensure it starts with [ and ends with ]
    if (!cleaned.startsWith('[')) {
      cleaned = '[' + cleaned;
    }
    if (!cleaned.endsWith(']')) {
      cleaned = cleaned + ']';
    }
    
    return cleaned;
  }

  validateQuestions(questions) {
    if (!Array.isArray(questions)) {
      throw new Error('Generated content is not a valid array');
    }

    return questions.filter(q => {
      return q.question && 
             Array.isArray(q.options) && 
             q.options.length === 4 && 
             q.answer && 
             ['A', 'B', 'C', 'D'].includes(q.answer);
    });
  }

  async generateCustomQuestions(customPrompt, count = 10) {
    const prompt = `${customPrompt}
    
    Generate ${count} multiple choice questions based on the above requirements.
    
    Format each question as a JSON object with this exact structure:
    {
      "question": "Question text here?",
      "options": [
        "A. Option 1",
        "B. Option 2", 
        "C. Option 3",
        "D. Option 4"
      ],
      "answer": "A"
    }
    
    Return only a valid JSON array of ${count} questions. No additional text or formatting.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      const cleanedText = this.cleanJsonResponse(generatedText);
      const questions = JSON.parse(cleanedText);
      
      return this.validateQuestions(questions);
    } catch (error) {
      console.error('Error generating custom questions:', error);
      throw new Error('Failed to generate custom questions from Gemini API');
    }
  }
}

// Export for use in other files
window.GeminiQuizGenerator = GeminiQuizGenerator;