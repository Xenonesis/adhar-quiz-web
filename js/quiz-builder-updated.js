// Quiz Builder JavaScript - Updated Version
class QuizBuilder {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.quizData = {
            title: '',
            description: '',
            category: 'general',
            difficulty: 'medium',
            theme: 'default',
            timeLimit: 0,
            showCorrectAnswers: true,
            randomizeQuestions: false
        };
        this.isPreviewMode = false;
        this.startTime = null;
        this.editingQuizId = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.checkForEditMode();
    }
    
    initializeElements() {
        // Builder elements
        this.builderContainer = document.getElementById('quiz-builder');
        this.questionsContainer = document.getElementById('questions-container');
        this.previewBtn = document.getElementById('preview-quiz');
        this.saveGenerateBtn = document.getElementById('save-generate-quiz');
        
        // Preview elements
        this.previewContainer = document.getElementById('quiz-preview');
        this.quizContent = document.getElementById('quiz-content');
        this.progressBar = document.getElementById('progress-bar');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.prevBtn = document.getElementById('prev-question');
        this.nextBtn = document.getElementById('next-question');
        this.finishBtn = document.getElementById('finish-quiz');
        this.backToBuilderBtn = document.getElementById('back-to-builder');
        this.saveAndExitBtn = document.getElementById('save-and-exit');
        
        // Results elements
        this.resultsContainer = document.getElementById('quiz-results');
        
        // Form elements
        this.titleInput = document.getElementById('quiz-title');
        this.descriptionInput = document.getElementById('quiz-description');
        this.categorySelect = document.getElementById('quiz-category');
        this.difficultySelect = document.getElementById('quiz-difficulty');
        this.themeSelect = document.getElementById('quiz-theme');
        this.timeLimitSelect = document.getElementById('time-limit');
        this.showAnswersCheck = document.getElementById('show-correct-answers');
        this.randomizeCheck = document.getElementById('randomize-questions');
    }
    
    initializeEventListeners() {
        // Builder events
        if (this.previewBtn) this.previewBtn.addEventListener('click', () => this.previewQuiz());
        if (this.saveGenerateBtn) this.saveGenerateBtn.addEventListener('click', () => this.saveAndGenerate());
        
        // Preview events
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.previousQuestion());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextQuestion());
        if (this.finishBtn) this.finishBtn.addEventListener('click', () => this.finishQuiz());
        if (this.backToBuilderBtn) this.backToBuilderBtn.addEventListener('click', () => this.backToBuilder());
        if (this.saveAndExitBtn) this.saveAndExitBtn.addEventListener('click', () => this.saveAndExit());
        
        // Form events
        if (this.titleInput) this.titleInput.addEventListener('input', () => this.updateQuizData());
        if (this.descriptionInput) this.descriptionInput.addEventListener('input', () => this.updateQuizData());
        if (this.categorySelect) this.categorySelect.addEventListener('change', () => this.updateQuizData());
        if (this.difficultySelect) this.difficultySelect.addEventListener('change', () => this.updateQuizData());
        if (this.themeSelect) this.themeSelect.addEventListener('change', () => this.updateQuizData());
        if (this.timeLimitSelect) this.timeLimitSelect.addEventListener('change', () => this.updateQuizData());
        if (this.showAnswersCheck) this.showAnswersCheck.addEventListener('change', () => this.updateQuizData());
        if (this.randomizeCheck) this.randomizeCheck.addEventListener('change', () => this.updateQuizData());
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Initialize theme
        this.initializeTheme();
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
    
    updateQuizData() {
        if (!this.categorySelect || !this.titleInput) return;
        
        const category = this.categorySelect.value;
        const customCategoryElement = document.getElementById('custom-category');
        const customCategory = customCategoryElement ? customCategoryElement.value.trim() : '';
        
        this.quizData = {
            title: this.titleInput.value,
            description: this.descriptionInput ? this.descriptionInput.value : '',
            category: category === 'custom' ? customCategory : category,
            difficulty: this.difficultySelect ? this.difficultySelect.value : 'medium',
            theme: this.themeSelect ? this.themeSelect.value : 'default',
            timeLimit: this.timeLimitSelect ? parseInt(this.timeLimitSelect.value) : 0,
            showCorrectAnswers: this.showAnswersCheck ? this.showAnswersCheck.checked : true,
            randomizeQuestions: this.randomizeCheck ? this.randomizeCheck.checked : false
        };
    }
    
    checkForEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit') || localStorage.getItem('editingQuizId');
        
        if (editId) {
            this.loadQuizForEditing(editId);
            localStorage.removeItem('editingQuizId');
        } else {
            this.updateQuestionsCount();
        }
        
        this.initializeAI();
    }
    
    initializeAI() {
        // Add event listeners with null checks
        const categorySelect = document.getElementById('quiz-category');
        if (categorySelect && !categorySelect.hasAttribute('data-listener-added')) {
            categorySelect.addEventListener('change', () => this.toggleCustomCategory());
            categorySelect.setAttribute('data-listener-added', 'true');
        }
        
        this.toggleCustomCategory();
    }
    
    toggleCustomCategory() {
        const categorySelect = document.getElementById('quiz-category');
        const customGroup = document.getElementById('custom-category-group');
        
        if (categorySelect && customGroup) {
            customGroup.style.display = categorySelect.value === 'custom' ? 'block' : 'none';
        }
    }
    
    updateQuestionCountDisplay() {
        const countInput = document.getElementById('question-count');
        const aiNote = document.querySelector('.ai-note');
        
        if (countInput && aiNote) {
            const count = countInput.value;
            aiNote.textContent = `Generate ${count} questions automatically based on your title and category`;
        }
    }
    
    async generateAIQuiz() {
        const title = document.getElementById('quiz-title').value.trim();
        const category = document.getElementById('quiz-category').value;
        const customCategory = document.getElementById('custom-category').value.trim();
        const difficulty = document.getElementById('quiz-difficulty').value;
        const questionCount = parseInt(document.getElementById('question-count').value);
        
        if (!title) {
            alert('Please enter a quiz title first!');
            return;
        }
        
        if (category === 'custom' && !customCategory) {
            alert('Please enter a custom category name!');
            return;
        }
        
        // Initialize generator if not already done
        if (!this.geminiGenerator) {
            const apiKey = localStorage.getItem('gemini-api-key');
            if (!apiKey) {
                document.getElementById('api-key-modal').style.display = 'block';
                return;
            }
            this.geminiGenerator = new GeminiQuizGenerator(apiKey);
        }
        
        const generateBtn = document.getElementById('generate-ai-quiz');
        const originalText = generateBtn.textContent;
        
        try {
            generateBtn.textContent = '🤖 Generating...';
            generateBtn.disabled = true;
            
            const finalCategory = category === 'custom' ? customCategory : category;
            const questions = await this.geminiGenerator.generateQuiz(title, finalCategory, difficulty, questionCount);
            
            if (questions.length === 0) {
                throw new Error('No questions were generated');
            }
            
            // Clear existing questions and add generated ones
            this.questions = questions;
            this.refreshAllQuestions();
            this.updateQuestionsCount();
            
            this.showToast(`Successfully generated ${questions.length} questions!`, 'success');
            
        } catch (error) {
            console.error('AI Generation Error:', error);
            if (error.message.includes('API request failed: 401')) {
                this.showToast('Invalid API key. Please check your Gemini API key.', 'error');
                document.getElementById('api-key-modal').style.display = 'block';
            } else {
                this.showToast('Failed to generate quiz. Please try again.', 'error');
            }
        } finally {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }
    }
    
    clearAllQuestions() {
        if (this.questions.length === 0) return;
        
        if (confirm('Are you sure you want to clear all questions?')) {
            this.questions = [];
            if (this.questionsContainer) {
                this.questionsContainer.innerHTML = '';
            }
            this.updateQuestionsCount();
            this.showToast('All questions cleared', 'info');
        }
    }
    
    updateQuestionsCount() {
        const count = this.questions.length;
        const countElement = document.getElementById('questions-count');
        const clearBtn = document.getElementById('clear-questions');
        
        if (countElement) {
            countElement.textContent = `${count} question${count !== 1 ? 's' : ''} added`;
        }
        if (clearBtn) {
            clearBtn.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }
    
    loadQuizForEditing(quizId) {
        const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
        const quiz = savedQuizzes.find(q => q.id === quizId);
        
        if (quiz) {
            this.editingQuizId = quizId;
            this.quizData = { ...quiz };
            this.questions = [...quiz.questions];
            
            // Populate form fields
            this.titleInput.value = quiz.title;
            this.descriptionInput.value = quiz.description || '';
            this.categorySelect.value = quiz.category;
            this.difficultySelect.value = quiz.difficulty;
            this.themeSelect.value = quiz.theme;
            this.timeLimitSelect.value = quiz.timeLimit.toString();
            this.showAnswersCheck.checked = quiz.showCorrectAnswers;
            this.randomizeCheck.checked = quiz.randomizeQuestions;
            
            // Load questions
            this.refreshAllQuestions();
            
            // Update save button text
            this.saveGenerateBtn.textContent = '💾 Update Quiz';
            
            // Show notification
            this.showToast('Quiz loaded for editing', 'info');
        } else {
            this.addDefaultQuestion();
        }
    }
    
    addDefaultQuestion() {
        if (this.questions.length === 0) {
            this.addQuestion();
        }
    }
    
    addQuestion() {
        const questionIndex = this.questions.length;
        const questionData = {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        };
        
        this.questions.push(questionData);
        
        const questionElement = this.createQuestionElement(questionIndex);
        this.questionsContainer.appendChild(questionElement);
        
        // Focus on the question input
        const questionInput = questionElement.querySelector('.question-input');
        questionInput.focus();
        
        this.updateQuestionsCount();
    }
    
    createQuestionElement(index) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.dataset.index = index;
        
        questionDiv.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${index + 1}</span>
                <div class="question-actions">
                    <button class="btn-icon-small btn-delete" onclick="quizBuilder.removeQuestion(${index})" title="Delete Question">🗑️</button>
                </div>
            </div>
            
            <input type="text" class="question-input" placeholder="Enter your question..." 
                   onchange="quizBuilder.updateQuestion(${index}, 'question', this.value)">
            
            <div class="options-container">
                <label style="font-weight: 600; margin-bottom: 10px; display: block;">Answer Options:</label>
                ${this.questions[index].options.map((option, optionIndex) => `
                    <div class="option-item">
                        <input type="radio" name="correct-${index}" value="${optionIndex}" 
                               class="option-radio" ${optionIndex === 0 ? 'checked' : ''}
                               onchange="quizBuilder.updateQuestion(${index}, 'correctAnswer', ${optionIndex})">
                        <input type="text" class="option-input" placeholder="Option ${optionIndex + 1}" 
                               onchange="quizBuilder.updateQuestionOption(${index}, ${optionIndex}, this.value)">
                        ${this.questions[index].options.length > 2 ? `
                            <button class="option-remove" onclick="quizBuilder.removeOption(${index}, ${optionIndex})" title="Remove Option">×</button>
                        ` : ''}
                    </div>
                `).join('')}
                <button class="add-option" onclick="quizBuilder.addOption(${index})">+ Add Option</button>
            </div>
        `;
        
        return questionDiv;
    }
    
    updateQuestion(questionIndex, field, value) {
        if (this.questions[questionIndex]) {
            this.questions[questionIndex][field] = value;
        }
    }
    
    updateQuestionOption(questionIndex, optionIndex, value) {
        if (this.questions[questionIndex] && this.questions[questionIndex].options[optionIndex] !== undefined) {
            this.questions[questionIndex].options[optionIndex] = value;
        }
    }
    
    addOption(questionIndex) {
        if (this.questions[questionIndex] && this.questions[questionIndex].options.length < 6) {
            this.questions[questionIndex].options.push('');
            this.refreshQuestion(questionIndex);
        }
    }
    
    removeOption(questionIndex, optionIndex) {
        if (this.questions[questionIndex] && this.questions[questionIndex].options.length > 2) {
            this.questions[questionIndex].options.splice(optionIndex, 1);
            
            // Adjust correct answer if needed
            if (this.questions[questionIndex].correctAnswer >= optionIndex) {
                this.questions[questionIndex].correctAnswer = Math.max(0, this.questions[questionIndex].correctAnswer - 1);
            }
            
            this.refreshQuestion(questionIndex);
        }
    }
    
    removeQuestion(questionIndex) {
        if (this.questions.length > 1 && confirm('Are you sure you want to delete this question?')) {
            this.questions.splice(questionIndex, 1);
            this.refreshAllQuestions();
            this.updateQuestionsCount();
        }
    }
    
    refreshQuestion(questionIndex) {
        const questionElement = this.questionsContainer.children[questionIndex];
        const newElement = this.createQuestionElement(questionIndex);
        
        // Preserve values
        const questionInput = questionElement.querySelector('.question-input');
        const optionInputs = questionElement.querySelectorAll('.option-input');
        const correctRadio = questionElement.querySelector('input[type="radio"]:checked');
        
        newElement.querySelector('.question-input').value = questionInput.value;
        newElement.querySelectorAll('.option-input').forEach((input, i) => {
            if (optionInputs[i]) {
                input.value = optionInputs[i].value;
            }
        });
        
        if (correctRadio) {
            const newCorrectRadio = newElement.querySelector(`input[value="${correctRadio.value}"]`);
            if (newCorrectRadio) {
                newCorrectRadio.checked = true;
            }
        }
        
        questionElement.replaceWith(newElement);
    }
    
    refreshAllQuestions() {
        this.questionsContainer.innerHTML = '';
        this.questions.forEach((question, index) => {
            const questionElement = this.createQuestionElement(index);
            
            // Populate with existing data
            const questionInput = questionElement.querySelector('.question-input');
            const optionInputs = questionElement.querySelectorAll('.option-input');
            const correctRadio = questionElement.querySelector(`input[value="${question.correctAnswer}"]`);
            
            questionInput.value = question.question;
            optionInputs.forEach((input, i) => {
                if (question.options[i]) {
                    input.value = question.options[i];
                }
            });
            
            if (correctRadio) {
                correctRadio.checked = true;
            }
            
            this.questionsContainer.appendChild(questionElement);
        });
        
        this.updateQuestionsCount();
    }
    
    validateQuiz() {
        this.updateQuizData();
        
        if (!this.quizData.title.trim()) {
            alert('Please enter a quiz title.');
            this.titleInput.focus();
            return false;
        }
        
        if (this.questions.length === 0) {
            alert('Please add at least one question.');
            return false;
        }
        
        for (let i = 0; i < this.questions.length; i++) {
            const question = this.questions[i];
            
            if (!question.question.trim()) {
                alert(`Please enter text for question ${i + 1}.`);
                return false;
            }
            
            const validOptions = question.options.filter(opt => opt.trim());
            if (validOptions.length < 2) {
                alert(`Question ${i + 1} must have at least 2 answer options.`);
                return false;
            }
            
            if (!question.options[question.correctAnswer] || !question.options[question.correctAnswer].trim()) {
                alert(`Please select a valid correct answer for question ${i + 1}.`);
                return false;
            }
        }
        
        return true;
    }
    
    previewQuiz() {
        if (!this.validateQuiz()) return;
        
        this.collectFormData();
        this.isPreviewMode = true;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        // Apply theme
        document.body.className = `quiz-theme-${this.quizData.theme}`;
        
        // Show preview container
        this.builderContainer.style.display = 'none';
        this.previewContainer.style.display = 'block';
        this.resultsContainer.style.display = 'none';
        
        // Update preview header
        document.getElementById('preview-title').textContent = this.quizData.title;
        document.getElementById('preview-category').textContent = this.quizData.category.charAt(0).toUpperCase() + this.quizData.category.slice(1);
        document.getElementById('preview-difficulty').textContent = this.quizData.difficulty.charAt(0).toUpperCase() + this.quizData.difficulty.slice(1);
        
        const timeText = this.quizData.timeLimit > 0 ? `${this.quizData.timeLimit} min` : 'No limit';
        document.getElementById('preview-time').textContent = timeText;
        
        // Setup questions
        this.totalQuestionsSpan.textContent = this.questions.length;
        
        // Randomize if needed
        if (this.quizData.randomizeQuestions) {
            this.questions = this.shuffleArray([...this.questions]);
        }
        
        this.displayCurrentQuestion();
        this.updateProgress();
    }
    
    collectFormData() {
        // Collect all form data including questions
        this.questionsContainer.querySelectorAll('.question-item').forEach((element, index) => {
            const questionInput = element.querySelector('.question-input');
            const optionInputs = element.querySelectorAll('.option-input');
            const correctRadio = element.querySelector('input[type="radio"]:checked');
            
            if (this.questions[index]) {
                this.questions[index].question = questionInput.value;
                this.questions[index].options = Array.from(optionInputs).map(input => input.value);
                this.questions[index].correctAnswer = correctRadio ? parseInt(correctRadio.value) : 0;
            }
        });
    }
    
    displayCurrentQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const questionNumber = this.currentQuestionIndex + 1;
        
        this.quizContent.innerHTML = `
            <div class="question-card fade-in">
                <div class="question-text">
                    <span style="color: var(--color-primary); font-weight: 600;">Q${questionNumber}.</span>
                    ${question.question}
                </div>
                <div class="answer-options">
                    ${question.options.filter(opt => opt.trim()).map((option, index) => `
                        <label class="answer-option" onclick="quizBuilder.selectAnswer(${index})">
                            <input type="radio" name="current-question" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            const selectedOption = this.quizContent.querySelector(`input[value="${this.userAnswers[this.currentQuestionIndex]}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
                selectedOption.closest('.answer-option').classList.add('selected');
            }
        }
        
        // Update navigation buttons
        this.prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        this.nextBtn.style.display = this.currentQuestionIndex < this.questions.length - 1 ? 'block' : 'none';
        this.finishBtn.style.display = this.currentQuestionIndex === this.questions.length - 1 ? 'block' : 'none';
    }
    
    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Update UI
        this.quizContent.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = this.quizContent.querySelector(`input[value="${answerIndex}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
            selectedOption.closest('.answer-option').classList.add('selected');
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
            this.updateProgress();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
    }
    
    finishQuiz() {
        const unanswered = this.questions.length - this.userAnswers.filter(a => a !== undefined).length;
        
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
        
        for (let i = 0; i < this.questions.length; i++) {
            if (this.userAnswers[i] === this.questions[i].correctAnswer) {
                correctAnswers++;
            }
        }
        
        this.results = {
            score: correctAnswers,
            total: this.questions.length,
            percentage: Math.round((correctAnswers / this.questions.length) * 100),
            timeSpent: Math.round((Date.now() - this.startTime) / 1000),
            answers: this.questions.map((q, i) => ({
                question: q.question,
                userAnswer: this.userAnswers[i] !== undefined ? q.options[this.userAnswers[i]] : 'Not answered',
                correctAnswer: q.options[q.correctAnswer],
                isCorrect: this.userAnswers[i] === q.correctAnswer
            }))
        };
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
        
        this.resultsContainer.innerHTML = `
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
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                ${this.quizData.showCorrectAnswers ? '<button class="btn btn-secondary" onclick="quizBuilder.showDetailedResults()">View Details</button>' : ''}
                <button class="btn btn-primary" onclick="quizBuilder.backToBuilder()">Edit Quiz</button>
                <button class="btn btn-success" onclick="quizBuilder.saveQuiz()">Save Quiz</button>
            </div>
        `;
        
        this.previewContainer.style.display = 'none';
        this.resultsContainer.style.display = 'block';
    }
    
    showDetailedResults() {
        let detailsHtml = '<div style="text-align: left; max-width: 800px; margin: 0 auto;">';
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
        
        detailsHtml += '<div style="text-align: center; margin-top: 2rem;"><button class="btn btn-secondary" onclick="quizBuilder.displayResults()">Back to Summary</button></div>';
        detailsHtml += '</div>';
        
        this.resultsContainer.innerHTML = detailsHtml;
    }
    
    backToBuilder() {
        document.body.className = '';
        this.builderContainer.style.display = 'block';
        this.previewContainer.style.display = 'none';
        this.resultsContainer.style.display = 'none';
        this.isPreviewMode = false;
    }
    
    saveAndExit() {
        this.saveQuiz();
        window.location.href = 'saved-quizzes.html';
    }
    
    saveQuiz() {
        if (!this.validateQuiz()) return;
        
        this.collectFormData();
        
        const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
        
        if (this.editingQuizId) {
            // Update existing quiz
            const quizIndex = savedQuizzes.findIndex(q => q.id === this.editingQuizId);
            if (quizIndex !== -1) {
                const existingQuiz = savedQuizzes[quizIndex];
                savedQuizzes[quizIndex] = {
                    ...existingQuiz,
                    ...this.quizData,
                    questions: this.questions,
                    lastModified: new Date().toISOString()
                };
            }
            this.showToast('Quiz updated successfully! 🎉', 'success');
        } else {
            // Create new quiz
            const quizToSave = {
                id: Date.now().toString(),
                ...this.quizData,
                questions: this.questions,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            savedQuizzes.push(quizToSave);
            this.showToast('Quiz saved successfully! 🎉', 'success');
        }
        
        localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'saved-quizzes.html';
        }, 1500);
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
    
    async saveAndGenerate() {
        const title = this.titleInput.value.trim();
        const category = this.categorySelect.value;
        const customCategory = document.getElementById('custom-category').value.trim();
        const difficulty = this.difficultySelect.value;
        const questionCount = parseInt(document.getElementById('question-count').value);
        
        if (!title) {
            alert('Please enter a quiz title!');
            return;
        }
        
        if (category === 'custom' && !customCategory) {
            alert('Please enter a custom category name!');
            return;
        }
        
        const btn = this.saveGenerateBtn;
        const originalText = btn.textContent;
        
        try {
            btn.textContent = '🤖 Generating & Saving...';
            btn.disabled = true;
            
            // Use hardcoded API key
            const apiKey = 'AIzaSyDrMFl5HyTQNcTPixIdGU9roFvvByiveD4';
            this.geminiGenerator = new GeminiQuizGenerator(apiKey);
            
            // Generate questions with AI
            const finalCategory = category === 'custom' ? customCategory : category;
            const questions = await this.geminiGenerator.generateQuiz(title, finalCategory, difficulty, questionCount);
            
            if (questions.length === 0) {
                throw new Error('No questions generated');
            }
            
            // Update quiz data and questions
            this.updateQuizData();
            this.questions = questions;
            
            // Save the quiz
            const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
            const quizToSave = {
                id: Date.now().toString(),
                ...this.quizData,
                questions: this.questions,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            
            savedQuizzes.push(quizToSave);
            localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
            
            this.showToast(`Quiz saved with ${questions.length} AI-generated questions! 🎉`, 'success');
            
            setTimeout(() => {
                window.location.href = 'saved-quizzes.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Failed to generate quiz. Please try again.', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
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

// Initialize quiz builder when DOM is loaded
let quizBuilder;
document.addEventListener('DOMContentLoaded', () => {
    quizBuilder = new QuizBuilder();
});