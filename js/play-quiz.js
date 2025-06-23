// Quiz Player JavaScript
class QuizPlayer {
    constructor() {
        this.quiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.timeLimit = 0;
        this.timer = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadQuiz();
        this.initializeTheme();
    }
    
    initializeElements() {
        this.quizTitle = document.getElementById('quiz-title');
        this.quizCategory = document.getElementById('quiz-category');
        this.quizDifficulty = document.getElementById('quiz-difficulty');
        this.quizTimer = document.getElementById('quiz-timer');
        this.timeRemaining = document.getElementById('time-remaining');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.progressBar = document.getElementById('progress-bar');
        this.questionText = document.getElementById('question-text');
        this.answerOptions = document.getElementById('answer-options');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.finishBtn = document.getElementById('finish-btn');
        this.resultsSection = document.getElementById('results-section');
        this.reviewSection = document.getElementById('review-section');
    }
    
    initializeEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.finishBtn.addEventListener('click', () => this.finishQuiz());
        
        document.getElementById('review-answers').addEventListener('click', () => this.showReview());
        document.getElementById('play-again').addEventListener('click', () => this.playAgain());
        document.getElementById('back-to-results').addEventListener('click', () => this.backToResults());
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    loadQuiz() {
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('id');
        
        if (!quizId) {
            alert('No quiz selected!');
            window.location.href = 'saved-quizzes.html';
            return;
        }
        
        const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
        this.quiz = savedQuizzes.find(q => q.id === quizId);
        
        if (!this.quiz) {
            alert('Quiz not found!');
            window.location.href = 'saved-quizzes.html';
            return;
        }
        
        this.setupQuiz();
    }
    
    setupQuiz() {
        // Set quiz info
        this.quizTitle.textContent = this.quiz.title;
        this.quizCategory.textContent = this.quiz.category.charAt(0).toUpperCase() + this.quiz.category.slice(1);
        this.quizDifficulty.textContent = this.quiz.difficulty.charAt(0).toUpperCase() + this.quiz.difficulty.slice(1);
        this.totalQuestionsSpan.textContent = this.quiz.questions.length;
        
        // Setup timer if needed
        if (this.quiz.timeLimit > 0) {
            this.timeLimit = this.quiz.timeLimit * 60; // Convert to seconds
            this.quizTimer.style.display = 'inline-block';
            this.startTimer();
        }
        
        // Randomize questions if enabled
        if (this.quiz.randomizeQuestions) {
            this.quiz.questions = this.shuffleArray([...this.quiz.questions]);
        }
        
        this.startTime = Date.now();
        this.displayQuestion();
    }
    
    startTimer() {
        this.updateTimerDisplay();
        this.timer = setInterval(() => {
            this.timeLimit--;
            this.updateTimerDisplay();
            
            if (this.timeLimit <= 0) {
                clearInterval(this.timer);
                this.finishQuiz();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLimit / 60);
        const seconds = this.timeLimit % 60;
        this.timeRemaining.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (this.timeLimit <= 60) {
            this.timeRemaining.style.color = '#dc3545';
        } else if (this.timeLimit <= 300) {
            this.timeRemaining.style.color = '#ffc107';
        }
    }
    
    displayQuestion() {
        const question = this.quiz.questions[this.currentQuestionIndex];
        const questionNumber = this.currentQuestionIndex + 1;
        
        this.questionText.innerHTML = `<span style="color: var(--color-primary); font-weight: 600;">Q${questionNumber}.</span> ${question.question}`;
        
        // Create answer options
        this.answerOptions.innerHTML = '';
        question.options.filter(opt => opt.trim()).forEach((option, index) => {
            const optionElement = document.createElement('label');
            optionElement.className = 'answer-option';
            optionElement.innerHTML = `
                <input type="radio" name="current-question" value="${index}">
                <span class="option-text">${option}</span>
            `;
            
            optionElement.addEventListener('click', () => this.selectAnswer(index));
            this.answerOptions.appendChild(optionElement);
        });
        
        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            const selectedOption = this.answerOptions.querySelector(`input[value="${this.userAnswers[this.currentQuestionIndex]}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
                selectedOption.closest('.answer-option').classList.add('selected');
            }
        }
        
        this.updateProgress();
        this.updateNavigation();
    }
    
    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Update UI
        this.answerOptions.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = this.answerOptions.querySelector(`input[value="${answerIndex}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
            selectedOption.closest('.answer-option').classList.add('selected');
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.nextBtn.style.display = this.currentQuestionIndex < this.quiz.questions.length - 1 ? 'block' : 'none';
        this.finishBtn.style.display = this.currentQuestionIndex === this.quiz.questions.length - 1 ? 'block' : 'none';
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    finishQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const unanswered = this.quiz.questions.length - this.userAnswers.filter(a => a !== undefined).length;
        
        if (unanswered > 0) {
            if (!confirm(`You have ${unanswered} unanswered questions. Do you want to finish anyway?`)) {
                return;
            }
        }
        
        this.calculateResults();
        this.displayResults();
    }
    
    calculateResults() {
        let correctAnswers = 0;
        
        for (let i = 0; i < this.quiz.questions.length; i++) {
            if (this.userAnswers[i] === this.quiz.questions[i].correctAnswer) {
                correctAnswers++;
            }
        }
        
        const percentage = Math.round((correctAnswers / this.quiz.questions.length) * 100);
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        
        let grade = 'F';
        let message = 'Keep practicing!';
        
        if (percentage >= 90) {
            grade = 'A+';
            message = 'Outstanding! 🎉';
        } else if (percentage >= 80) {
            grade = 'A';
            message = 'Excellent work! 👏';
        } else if (percentage >= 70) {
            grade = 'B';
            message = 'Good job! 👍';
        } else if (percentage >= 60) {
            grade = 'C';
            message = 'Not bad! 💪';
        } else if (percentage >= 50) {
            grade = 'D';
            message = 'You need more practice. 📚';
        }
        
        this.results = {
            score: correctAnswers,
            total: this.quiz.questions.length,
            percentage: percentage,
            grade: grade,
            message: message,
            timeSpent: timeSpent
        };
        
        // Save result
        this.saveQuizResult();
    }
    
    saveQuizResult() {
        const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        const result = {
            quizId: this.quiz.id,
            quizTitle: this.quiz.title,
            score: this.results.score,
            total: this.results.total,
            percentage: this.results.percentage,
            timeSpent: this.results.timeSpent,
            date: new Date().toISOString(),
            type: 'custom'
        };
        
        existingResults.push(result);
        localStorage.setItem('quizResults', JSON.stringify(existingResults));
    }
    
    displayResults() {
        document.querySelector('.quiz-player').style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        document.getElementById('final-score').textContent = `${this.results.percentage}%`;
        document.getElementById('final-grade').textContent = this.results.grade;
        document.getElementById('results-message').textContent = this.results.message;
        document.getElementById('correct-count').textContent = this.results.score;
        document.getElementById('incorrect-count').textContent = this.results.total - this.results.score;
        document.getElementById('total-count').textContent = this.results.total;
        
        const minutes = Math.floor(this.results.timeSpent / 60);
        const seconds = this.results.timeSpent % 60;
        document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Hide review button if answers shouldn't be shown
        if (!this.quiz.showCorrectAnswers) {
            document.getElementById('review-answers').style.display = 'none';
        }
    }
    
    showReview() {
        this.resultsSection.style.display = 'none';
        this.reviewSection.style.display = 'block';
        
        const reviewContent = document.getElementById('review-content');
        reviewContent.innerHTML = '';
        
        this.quiz.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
            reviewItem.innerHTML = `
                <div class="review-question">
                    <strong>Q${index + 1}:</strong> ${question.question}
                </div>
                <div class="review-answer">
                    <div class="user-answer">
                        Your answer: <span class="${isCorrect ? 'correct' : 'incorrect'}">${userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}</span>
                    </div>
                    <div class="correct-answer">
                        Correct answer: <span class="correct">${question.options[question.correctAnswer]}</span>
                    </div>
                </div>
            `;
            
            reviewContent.appendChild(reviewItem);
        });
    }
    
    backToResults() {
        this.reviewSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
    }
    
    playAgain() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        if (this.quiz.timeLimit > 0) {
            this.timeLimit = this.quiz.timeLimit * 60;
            this.startTimer();
        }
        
        this.resultsSection.style.display = 'none';
        this.reviewSection.style.display = 'none';
        document.querySelector('.quiz-player').style.display = 'block';
        
        this.displayQuestion();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize quiz player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizPlayer();
});