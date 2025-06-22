// Quiz Application with Gemini AI Integration
class QuizApp {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.quizCompleted = false;
    this.geminiGenerator = null;
    
    this.initializeElements();
    this.initializeEventListeners();
    this.initializeGemini();
  }

  initializeElements() {
    this.quizContainer = document.getElementById('quiz');
    this.progressBar = document.getElementById('progress-bar');
    this.currentQuestionSpan = document.getElementById('current-question');
    this.totalQuestionsSpan = document.getElementById('total-questions');
    this.resetButton = document.getElementById('reset');
    this.submitButton = document.getElementById('submit');
    this.resultsContainer = document.getElementById('results');
  }

  initializeEventListeners() {
    this.resetButton.addEventListener('click', () => this.resetQuiz());
    this.submitButton.addEventListener('click', () => this.submitQuiz());
  }

  async initializeGemini() {
    if (!isApiKeyConfigured()) {
      this.showError(CONFIG.MESSAGES.NO_API_KEY);
      this.showApiKeySetup();
      return;
    }

    this.geminiGenerator = new GeminiQuizGenerator(CONFIG.GEMINI_API_KEY);
    await this.loadQuestions();
  }

  showApiKeySetup() {
    this.quizContainer.innerHTML = `
      <div class="card">
        <h3>🔑 API Key Setup Required</h3>
        <p>To generate questions from Gemini AI, you need to:</p>
        <ol>
          <li>Get a free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
          <li>Open <code>js/config.js</code> file</li>
          <li>Replace <code>YOUR_GEMINI_API_KEY_HERE</code> with your actual API key</li>
          <li>Refresh this page</li>
        </ol>
        <div style="margin-top: 20px;">
          <input type="text" id="temp-api-key" placeholder="Or paste your API key here temporarily" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <button onclick="quizApp.setTempApiKey()" class="btn-primary">Use This Key</button>
        </div>
      </div>
    `;
  }

  setTempApiKey() {
    const tempKey = document.getElementById('temp-api-key').value.trim();
    if (tempKey) {
      CONFIG.GEMINI_API_KEY = tempKey;
      this.geminiGenerator = new GeminiQuizGenerator(tempKey);
      this.loadQuestions();
    }
  }

  async loadQuestions() {
    try {
      this.showLoading();
      this.questions = await this.geminiGenerator.generateQuestions(
        CONFIG.DEFAULT_TOPIC,
        CONFIG.DEFAULT_QUESTION_COUNT,
        CONFIG.DEFAULT_DIFFICULTY
      );
      
      if (this.questions.length === 0) {
        throw new Error('No valid questions generated');
      }
      
      this.initializeQuiz();
    } catch (error) {
      console.error('Error loading questions:', error);
      this.showError(CONFIG.MESSAGES.ERROR);
    }
  }

  showLoading() {
    this.quizContainer.innerHTML = `
      <div class="card" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">🤖</div>
        <h3>${CONFIG.MESSAGES.LOADING}</h3>
        <div style="margin: 20px 0;">
          <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
        <p>This may take a few moments...</p>
      </div>
    `;
  }

  showError(message) {
    this.quizContainer.innerHTML = `
      <div class="card" style="text-align: center; border-left: 4px solid #f44336;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn-primary" style="margin-top: 20px;">Retry</button>
      </div>
    `;
  }

  initializeQuiz() {
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.quizCompleted = false;
    
    this.totalQuestionsSpan.textContent = this.questions.length;
    this.updateProgress();
    this.displayQuestion();
    this.resultsContainer.classList.add('hidden');
  }

  displayQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.submitQuiz();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    const questionNumber = this.currentQuestionIndex + 1;

    this.quizContainer.innerHTML = `
      <div class="question-card card">
        <div class="question">
          <div class="question-number">${questionNumber}</div>
          <div>${question.question}</div>
        </div>
        <div class="answers">
          ${question.options.map((option, index) => `
            <label>
              <input type="radio" name="question-${this.currentQuestionIndex}" value="${String.fromCharCode(65 + index)}">
              ${option}
            </label>
          `).join('')}
        </div>
        <div style="margin-top: 20px; text-align: center;">
          ${this.currentQuestionIndex > 0 ? '<button onclick="quizApp.previousQuestion()" class="btn-secondary">Previous</button>' : ''}
          <button onclick="quizApp.nextQuestion()" class="btn-primary" style="margin-left: 10px;">Next</button>
        </div>
      </div>
    `;

    // Add event listeners for answer selection
    const radioButtons = this.quizContainer.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.userAnswers[this.currentQuestionIndex] = e.target.value;
        // Add visual feedback
        const labels = this.quizContainer.querySelectorAll('label');
        labels.forEach(label => label.classList.remove('selected'));
        e.target.closest('label').classList.add('selected');
      });
    });

    // Restore previous answer if exists
    if (this.userAnswers[this.currentQuestionIndex]) {
      const previousAnswer = this.userAnswers[this.currentQuestionIndex];
      const radioToCheck = this.quizContainer.querySelector(`input[value="${previousAnswer}"]`);
      if (radioToCheck) {
        radioToCheck.checked = true;
        radioToCheck.closest('label').classList.add('selected');
      }
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateProgress();
      this.displayQuestion();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateProgress();
      this.displayQuestion();
    }
  }

  updateProgress() {
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    this.progressBar.style.width = `${progress}%`;
    this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
  }

  submitQuiz() {
    if (this.quizCompleted) return;

    this.calculateScore();
    this.displayResults();
    this.quizCompleted = true;
  }

  calculateScore() {
    this.score = 0;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.userAnswers[i] === this.questions[i].answer) {
        this.score++;
      }
    }
  }

  displayResults() {
    const percentage = Math.round((this.score / this.questions.length) * 100);
    let grade = 'F';
    let message = 'Keep practicing!';
    
    if (percentage >= 90) {
      grade = 'A+';
      message = 'Excellent work! 🎉';
    } else if (percentage >= 80) {
      grade = 'A';
      message = 'Great job! 👏';
    } else if (percentage >= 70) {
      grade = 'B';
      message = 'Good work! 👍';
    } else if (percentage >= 60) {
      grade = 'C';
      message = 'Not bad, but you can do better! 💪';
    } else if (percentage >= 50) {
      grade = 'D';
      message = 'You need more practice. 📚';
    }

    this.resultsContainer.innerHTML = `
      <div class="card">
        <h2>Quiz Results</h2>
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 72px; margin-bottom: 10px;">${grade}</div>
          <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">${percentage}%</div>
          <div style="font-size: 18px; color: var(--color-text-secondary);">${message}</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
          <div style="text-align: center; padding: 15px; background: var(--color-success); color: white; border-radius: 10px;">
            <div style="font-size: 24px; font-weight: 600;">${this.score}</div>
            <div>Correct</div>
          </div>
          <div style="text-align: center; padding: 15px; background: var(--color-danger); color: white; border-radius: 10px;">
            <div style="font-size: 24px; font-weight: 600;">${this.questions.length - this.score}</div>
            <div>Incorrect</div>
          </div>
          <div style="text-align: center; padding: 15px; background: var(--color-primary); color: white; border-radius: 10px;">
            <div style="font-size: 24px; font-weight: 600;">${this.questions.length}</div>
            <div>Total</div>
          </div>
        </div>
        <button onclick="quizApp.showDetailedResults()" class="btn-secondary" style="margin-right: 10px;">View Details</button>
        <button onclick="quizApp.generateNewQuiz()" class="btn-primary">New Quiz</button>
      </div>
    `;
    
    this.resultsContainer.classList.remove('hidden');
    this.quizContainer.style.display = 'none';
  }

  showDetailedResults() {
    let detailsHtml = '<div class="card"><h3>Detailed Results</h3>';
    
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      const userAnswer = this.userAnswers[i] || 'Not answered';
      const isCorrect = userAnswer === question.answer;
      
      detailsHtml += `
        <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; background: var(--color-border);">
          <div style="font-weight: 600; margin-bottom: 10px;">Question ${i + 1}: ${question.question}</div>
          <div style="margin-bottom: 5px;">Your answer: <span style="color: ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">${userAnswer}</span></div>
          <div>Correct answer: <span style="color: var(--color-success); font-weight: 600;">${question.answer}</span></div>
        </div>
      `;
    }
    
    detailsHtml += '<button onclick="quizApp.displayResults()" class="btn-secondary">Back to Summary</button></div>';
    this.resultsContainer.innerHTML = detailsHtml;
  }

  async generateNewQuiz() {
    this.resultsContainer.classList.add('hidden');
    this.quizContainer.style.display = 'block';
    await this.loadQuestions();
  }

  resetQuiz() {
    if (confirm('Are you sure you want to reset the quiz? All progress will be lost.')) {
      this.initializeQuiz();
    }
  }
}

// Initialize the quiz app when the page loads
let quizApp;
document.addEventListener('DOMContentLoaded', () => {
  quizApp = new QuizApp();
});
