# Gemini AI Quiz Setup Guide

## Overview
This quiz application now generates questions dynamically using Google's Gemini AI instead of predefined questions.

## Setup Instructions

### 1. Get a Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the Application
1. Open `js/config.js` file
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```javascript
   GEMINI_API_KEY: 'your-actual-api-key-here',
   ```

### 3. Customize Quiz Settings (Optional)
In `js/config.js`, you can modify:
- `DEFAULT_QUESTION_COUNT`: Number of questions to generate (default: 20)
- `DEFAULT_TOPIC`: Topic for questions (default: Aadhaar Enrolment)
- `DEFAULT_DIFFICULTY`: Difficulty level (easy, medium, hard)

## Features

### Dynamic Question Generation
- Questions are generated fresh each time using Gemini AI
- No more predefined questions
- Variety in question types and difficulty

### Customizable Topics
You can modify the topic in `config.js` or extend the application to allow users to select topics.

### Error Handling
- Graceful handling of API errors
- Fallback options when API is unavailable
- User-friendly error messages

### Loading States
- Shows loading animation while generating questions
- Progress indicators for better user experience

## Usage

### Basic Usage
1. Open `index.html` in a web browser
2. The app will automatically generate questions from Gemini AI
3. Take the quiz as normal

### Temporary API Key
If you don't want to modify the config file, you can:
1. Enter your API key in the temporary input field
2. Click "Use This Key" to start the quiz

### Generate New Quiz
- Click "New Quiz" after completing a quiz to generate fresh questions
- Each new quiz will have different questions on the same topic

## Troubleshooting

### "API Key Setup Required" Message
- Make sure you've set your API key in `js/config.js`
- Verify the API key is correct and active

### "Failed to generate questions" Error
- Check your internet connection
- Verify your API key is valid
- Check browser console for detailed error messages

### Questions Not Loading
- Ensure all JavaScript files are properly linked in `index.html`
- Check for any JavaScript errors in browser console

## API Limits
- Gemini API has usage limits
- For high-volume usage, consider implementing caching
- Monitor your API usage in Google AI Studio

## Security Note
- Never commit your actual API key to version control
- Consider using environment variables for production deployments
- The current setup is suitable for local development and testing