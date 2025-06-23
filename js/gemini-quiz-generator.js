// Gemini AI Quiz Generator
class GeminiQuizGenerator {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    }

    async generateQuiz(title, category, difficulty, questionCount) {
        const prompt = this.createPrompt(title, category, difficulty, questionCount);
        
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
            
            return this.parseQuizData(generatedText);
        } catch (error) {
            console.error('Error generating quiz:', error);
            throw new Error('Failed to generate quiz. Please check your API key and try again.');
        }
    }

    createPrompt(title, category, difficulty, questionCount) {
        const categoryText = category === 'custom' ? title : category;
        
        return `Generate a ${difficulty} level quiz about "${title}" in the ${categoryText} category with exactly ${questionCount} multiple choice questions.

IMPORTANT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Requirements:
- Each question must have exactly 4 options
- correctAnswer must be the index (0-3) of the correct option
- Questions should be ${difficulty} difficulty level
- Focus on ${categoryText} topic
- Make questions engaging and educational
- Ensure variety in question types
- No additional text, just the JSON array`;
    }

    parseQuizData(generatedText) {
        try {
            // Clean the response to extract JSON
            let jsonText = generatedText.trim();
            
            // Remove markdown code blocks if present
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            
            // Find JSON array in the text
            const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                jsonText = jsonMatch[0];
            }
            
            const questions = JSON.parse(jsonText);
            
            // Validate the structure
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array');
            }
            
            return questions.map(q => ({
                question: q.question || '',
                options: Array.isArray(q.options) ? q.options : [],
                correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0
            })).filter(q => q.question && q.options.length >= 2);
            
        } catch (error) {
            console.error('Error parsing quiz data:', error);
            throw new Error('Failed to parse generated quiz data');
        }
    }
}

// Export for use in other files
window.GeminiQuizGenerator = GeminiQuizGenerator;