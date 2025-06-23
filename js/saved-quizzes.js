// Saved Quizzes Management
class SavedQuizzes {
    constructor() {
        this.quizzes = [];
        this.filteredQuizzes = [];
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadQuizzes();
        this.initializeTheme();
    }
    
    initializeElements() {
        this.quizzesGrid = document.getElementById('quizzes-grid');
        this.emptyState = document.getElementById('empty-state');
        this.noResults = document.getElementById('no-results');
        this.searchInput = document.getElementById('search-input');
        this.categoryFilter = document.getElementById('category-filter');
        this.difficultyFilter = document.getElementById('difficulty-filter');
        this.sortBy = document.getElementById('sort-by');
        this.clearAllBtn = document.getElementById('clear-all');
        this.quizModal = document.getElementById('quiz-modal');
        this.quizPlayer = document.getElementById('quiz-player');
        this.modalTitle = document.getElementById('modal-quiz-title');
    }
    
    initializeEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterQuizzes());
        this.categoryFilter.addEventListener('change', () => this.filterQuizzes());
        this.difficultyFilter.addEventListener('change', () => this.filterQuizzes());
        this.sortBy.addEventListener('change', () => this.filterQuizzes());
        this.clearAllBtn.addEventListener('click', () => this.clearAllQuizzes());
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }
        
        // Modal close events
        window.addEventListener('click', (e) => {
            if (e.target === this.quizModal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.quizModal.style.display === 'block') {
                this.closeModal();
            }
        });
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
        savedQuizzes.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    loadQuizzes() {
        this.quizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
        this.filterQuizzes();
    }
    
    filterQuizzes() {
        let filtered = [...this.quizzes];
        
        // Search filter
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(quiz => 
                quiz.title.toLowerCase().includes(searchTerm) ||
                quiz.description.toLowerCase().includes(searchTerm) ||
                quiz.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Category filter
        const categoryFilter = this.categoryFilter.value;
        if (categoryFilter) {
            filtered = filtered.filter(quiz => quiz.category === categoryFilter);
        }
        
        // Difficulty filter
        const difficultyFilter = this.difficultyFilter.value;
        if (difficultyFilter) {
            filtered = filtered.filter(quiz => quiz.difficulty === difficultyFilter);
        }
        
        // Sort
        const sortBy = this.sortBy.value;
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
        
        this.filteredQuizzes = filtered;
        this.renderQuizzes();
    }
    
    renderQuizzes() {
        if (this.quizzes.length === 0) {
            this.showEmptyState();
            return;
        }
        
        if (this.filteredQuizzes.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.hideEmptyStates();
        
        this.quizzesGrid.innerHTML = this.filteredQuizzes.map(quiz => this.createQuizCard(quiz)).join('');
    }
    
    createQuizCard(quiz) {
        const createdDate = new Date(quiz.createdAt).toLocaleDateString();
        const questionCount = quiz.questions.length;
        const timeLimit = quiz.timeLimit > 0 ? `${quiz.timeLimit} min` : 'No limit';
        
        return `
            <div class="quiz-card" data-quiz-id="${quiz.id}">
                <div class="quiz-card-header">
                    <div class="quiz-category">${this.formatCategory(quiz.category)}</div>
                    <div class="quiz-difficulty difficulty-${quiz.difficulty}">${this.formatDifficulty(quiz.difficulty)}</div>
                </div>
                
                <h3 class="quiz-title">${quiz.title}</h3>
                ${quiz.description ? `<p class="quiz-description">${quiz.description}</p>` : ''}
                
                <div class="quiz-stats">
                    <div class="quiz-stat">
                        <span class="stat-icon">❓</span>
                        <span>${questionCount} questions</span>
                    </div>
                    <div class="quiz-stat">
                        <span class="stat-icon">⏱️</span>
                        <span>${timeLimit}</span>
                    </div>
                    <div class="quiz-stat">
                        <span class="stat-icon">📅</span>
                        <span>${createdDate}</span>
                    </div>
                </div>
                
                <div class="quiz-actions">
                    <a href="play-quiz.html?id=${quiz.id}" class="btn btn-primary">
                        ▶️ Play Quiz
                    </a>
                    <button class="btn btn-secondary" onclick="savedQuizzes.editQuiz('${quiz.id}')">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger" onclick="savedQuizzes.deleteQuiz('${quiz.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
    }
    
    formatDifficulty(difficulty) {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    
    showEmptyState() {
        this.quizzesGrid.style.display = 'none';
        this.emptyState.style.display = 'block';
        this.noResults.style.display = 'none';
    }
    
    showNoResults() {
        this.quizzesGrid.style.display = 'none';
        this.emptyState.style.display = 'none';
        this.noResults.style.display = 'block';
    }
    
    hideEmptyStates() {
        this.quizzesGrid.style.display = 'grid';
        this.emptyState.style.display = 'none';
        this.noResults.style.display = 'none';
    }
    
    clearFilters() {
        this.searchInput.value = '';
        this.categoryFilter.value = '';
        this.difficultyFilter.value = '';
        this.sortBy.value = 'newest';
        this.filterQuizzes();
    }
    
    playQuiz(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) return;
        
        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        // Randomize questions if enabled
        if (quiz.randomizeQuestions) {
            this.currentQuiz.questions = this.shuffleArray([...quiz.questions]);
        }
        
        this.modalTitle.textContent = quiz.title;
        this.displayQuestion();
        this.quizModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    displayQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionNumber = this.currentQuestionIndex + 1;
        const totalQuestions = this.currentQuiz.questions.length;
        const progress = (questionNumber / totalQuestions) * 100;
        
        this.quizPlayer.innerHTML = `
            <div class="quiz-progress">
                <div class="progress-text">Question ${questionNumber} of ${totalQuestions}</div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <div class="question-card">
                <div class="question-text">
                    <span style="color: var(--color-primary); font-weight: 600;">Q${questionNumber}.</span>
                    ${question.question}
                </div>
                <div class="answer-options">
                    ${question.options.filter(opt => opt.trim()).map((option, index) => `
                        <label class="answer-option" onclick="savedQuizzes.selectAnswer(${index})">
                            <input type="radio" name="current-question" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="quiz-navigation">
                ${this.currentQuestionIndex > 0 ? 
                    '<button class="btn btn-secondary" onclick="savedQuizzes.previousQuestion()">← Previous</button>' : 
                    '<div></div>'
                }
                ${this.currentQuestionIndex < this.currentQuiz.questions.length - 1 ? 
                    '<button class="btn btn-primary" onclick="savedQuizzes.nextQuestion()">Next →</button>' : 
                    '<button class="btn btn-success" onclick="savedQuizzes.finishQuiz()">Finish Quiz</button>'
                }
            </div>
        `;
        
        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            const selectedOption = this.quizPlayer.querySelector(`input[value="${this.userAnswers[this.currentQuestionIndex]}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
                selectedOption.closest('.answer-option').classList.add('selected');
            }
        }
    }
    
    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Update UI
        this.quizPlayer.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = this.quizPlayer.querySelector(`input[value="${answerIndex}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
            selectedOption.closest('.answer-option').classList.add('selected');
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    finishQuiz() {
        const unanswered = this.currentQuiz.questions.length - this.userAnswers.filter(a => a !== undefined).length;
        
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
        
        for (let i = 0; i < this.currentQuiz.questions.length; i++) {
            if (this.userAnswers[i] === this.currentQuiz.questions[i].correctAnswer) {
                correctAnswers++;
            }
        }
        
        this.results = {
            score: correctAnswers,
            total: this.currentQuiz.questions.length,
            percentage: Math.round((correctAnswers / this.currentQuiz.questions.length) * 100),
            timeSpent: Math.round((Date.now() - this.startTime) / 1000),
            answers: this.currentQuiz.questions.map((q, i) => ({
                question: q.question,
                userAnswer: this.userAnswers[i] !== undefined ? q.options[this.userAnswers[i]] : 'Not answered',
                correctAnswer: q.options[q.correctAnswer],
                isCorrect: this.userAnswers[i] === q.correctAnswer
            }))
        };
        
        // Save result to localStorage for dashboard
        this.saveQuizResult();
    }
    
    saveQuizResult() {
        const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        const result = {
            quizId: this.currentQuiz.id,
            quizTitle: this.currentQuiz.title,
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
        const { score, total, percentage } = this.results;
        
        let grade = 'F';
        let message = 'Keep practicing!';
        let color = '#dc3545';
        
        if (percentage >= 90) {
            grade = 'A+';
            message = 'Outstanding! 🎉';
            color = '#28a745';
        } else if (percentage >= 80) {
            grade = 'A';
            message = 'Excellent work! 👏';
            color = '#28a745';
        } else if (percentage >= 70) {
            grade = 'B';
            message = 'Good job! 👍';
            color = '#ffc107';
        } else if (percentage >= 60) {
            grade = 'C';
            message = 'Not bad! 💪';
            color = '#fd7e14';
        }
        
        this.quizPlayer.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <div class="results-score" style="color: ${color}">${percentage}%</div>
                    <div class="results-grade">${grade}</div>
                    <div class="results-message">${message}</div>
                </div>
                
                <div class="results-stats">
                    <div class="stat-card">
                        <div class="stat-number" style="color: #28a745">${score}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" style="color: #dc3545">${total - score}</div>
                        <div class="stat-label">Incorrect</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Math.floor(this.results.timeSpent / 60)}:${(this.results.timeSpent % 60).toString().padStart(2, '0')}</div>
                        <div class="stat-label">Time</div>
                    </div>
                </div>
                
                <div class="results-actions">
                    ${this.currentQuiz.showCorrectAnswers ? 
                        '<button class="btn btn-secondary" onclick="savedQuizzes.showDetailedResults()">View Details</button>' : 
                        ''
                    }
                    <button class="btn btn-primary" onclick="savedQuizzes.playQuiz(\'${this.currentQuiz.id}\')">Play Again</button>
                    <button class="btn btn-outline" onclick="savedQuizzes.closeModal()">Close</button>
                </div>
            </div>
        `;
    }
    
    showDetailedResults() {
        let detailsHtml = '<div class="detailed-results">';
        detailsHtml += '<h3 style="text-align: center; margin-bottom: 2rem;">Detailed Results</h3>';
        
        this.results.answers.forEach((answer, index) => {
            const bgColor = answer.isCorrect ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)';
            const borderColor = answer.isCorrect ? '#28a745' : '#dc3545';
            
            detailsHtml += `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: ${bgColor}; border-left: 4px solid ${borderColor}; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">Question ${index + 1}: ${answer.question}</div>
                    <div style="margin-bottom: 0.25rem;">Your answer: <span style="color: ${borderColor}; font-weight: 600;">${answer.userAnswer}</span></div>
                    <div>Correct answer: <span style="color: #28a745; font-weight: 600;">${answer.correctAnswer}</span></div>
                </div>
            `;
        });
        
        detailsHtml += '<div style="text-align: center; margin-top: 2rem;"><button class="btn btn-secondary" onclick="savedQuizzes.displayResults()">Back to Summary</button></div>';
        detailsHtml += '</div>';
        
        this.quizPlayer.innerHTML = detailsHtml;
    }
    
    editQuiz(quizId) {
        // Store quiz ID for editing
        localStorage.setItem('editingQuizId', quizId);
        window.location.href = 'quiz-customizer.html?edit=' + quizId;
    }
    
    deleteQuiz(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) return;
        
        if (confirm(`Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`)) {
            this.quizzes = this.quizzes.filter(q => q.id !== quizId);
            localStorage.setItem('savedQuizzes', JSON.stringify(this.quizzes));
            this.filterQuizzes();
            this.showToast('Quiz deleted successfully', 'success');
        }
    }
    
    clearAllQuizzes() {
        if (this.quizzes.length === 0) {
            this.showToast('No quizzes to clear', 'info');
            return;
        }
        
        if (confirm(`Are you sure you want to delete all ${this.quizzes.length} quizzes? This action cannot be undone.`)) {
            localStorage.removeItem('savedQuizzes');
            this.quizzes = [];
            this.filterQuizzes();
            this.showToast('All quizzes cleared successfully', 'success');
        }
    }
    
    closeModal() {
        this.quizModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
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

// Initialize saved quizzes when DOM is loaded
let savedQuizzes;
document.addEventListener('DOMContentLoaded', () => {
    savedQuizzes = new SavedQuizzes();
});