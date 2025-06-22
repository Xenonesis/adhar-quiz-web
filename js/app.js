const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const resetButton = document.getElementById('reset');
const progressBar = document.getElementById('progress-bar');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');

let userAnswers = {};
let quizSubmitted = false;
let startTime = Date.now();

function saveQuizResult(result) {
  const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
  results.push(result);
  localStorage.setItem('quizResults', JSON.stringify(results));
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function buildQuiz() {
  const output = [];
  totalQuestionsSpan.textContent = questions.length;

  questions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    const optionLetters = ['A', 'B', 'C', 'D'];

    currentQuestion.options.forEach((option, index) => {
      const letter = optionLetters[index];
      answers.push(
        `<label data-question="${questionNumber}" data-answer="${letter}">
          <input type="radio" name="question${questionNumber}" value="${letter}">
          ${option}
        </label>`
      );
    });

    output.push(
      `<div class="question-card">
        <div class="question">
          <span class="question-number">${questionNumber + 1}</span>
          ${currentQuestion.question}
        </div>
        <div class="answers">${answers.join('')}</div>
      </div>`
    );
  });

  quizContainer.innerHTML = output.join('');
  addEventListeners();
  updateProgress();
}

function addEventListeners() {
  const radioButtons = quizContainer.querySelectorAll('input[type="radio"]');
  const labels = quizContainer.querySelectorAll('label');

  radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
      const questionNumber = this.name.replace('question', '');
      userAnswers[questionNumber] = this.value;
      
      // Remove selected class from all labels in this question
      const questionLabels = quizContainer.querySelectorAll(`label[data-question="${questionNumber}"]`);
      questionLabels.forEach(label => label.classList.remove('selected'));
      
      // Add selected class to chosen label
      this.parentElement.classList.add('selected');
      
      updateProgress();
    });
  });

  labels.forEach(label => {
    label.addEventListener('click', function() {
      if (quizSubmitted) return;
      
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });
  });
}

function updateProgress() {
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  
  progressBar.style.width = progressPercentage + '%';
  currentQuestionSpan.textContent = answeredCount;
  
  // Enable submit button when all questions are answered
  if (answeredCount === questions.length) {
    submitButton.disabled = false;
    submitButton.style.opacity = '1';
  } else {
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
  }
}

function showResults() {
  if (Object.keys(userAnswers).length !== questions.length) {
    alert('Please answer all questions before submitting!');
    return;
  }

  const endTime = Date.now();
  const timeTaken = Math.round((endTime - startTime) / 1000);
  quizSubmitted = true;
  let numCorrect = 0;
  const answerContainers = quizContainer.querySelectorAll('.answers');
  const detailedAnswers = [];

  questions.forEach((currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const userAnswer = userAnswers[questionNumber];
    const correctAnswer = currentQuestion.answer;
    const isCorrect = userAnswer === correctAnswer;
    
    detailedAnswers.push({
      question: currentQuestion.question,
      userAnswer,
      correctAnswer,
      correct: isCorrect
    });
    
    const labels = answerContainer.querySelectorAll('label');
    
    labels.forEach(label => {
      const answerValue = label.getAttribute('data-answer');
      
      if (answerValue === correctAnswer) {
        label.classList.add('correct');
      } else if (answerValue === userAnswer && userAnswer !== correctAnswer) {
        label.classList.add('incorrect');
      }
    });

    if (isCorrect) numCorrect++;
  });

  const percentage = Math.round((numCorrect / questions.length) * 100);
  let message = '';
  
  if (percentage >= 90) {
    message = 'Excellent! You\'re well prepared for the exam!';
  } else if (percentage >= 75) {
    message = 'Good job! Keep practicing to improve further.';
  } else if (percentage >= 60) {
    message = 'Not bad, but you need more practice.';
  } else {
    message = 'You need to study more. Keep practicing!';
  }

  // Save results to localStorage
  saveQuizResult({
    score: numCorrect,
    total: questions.length,
    percentage,
    date: new Date().toISOString(),
    timeTaken: `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`,
    answers: detailedAnswers
  });

  resultsContainer.innerHTML = `
    <div class="results-score">${numCorrect}/${questions.length}</div>
    <div class="results-percentage">${percentage}%</div>
    <div class="results-message">${message}</div>
    <div style="margin: 15px 0; opacity: 0.8;">Time: ${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</div>
    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
      <button onclick="resetQuiz()" class="btn-secondary">Try Again</button>
      <a href="dashboard.html" class="btn-primary" style="text-decoration: none; display: inline-block;">View Dashboard</a>
    </div>
  `;
  
  resultsContainer.classList.remove('hidden');
  submitButton.style.display = 'none';
  
  resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
  userAnswers = {};
  quizSubmitted = false;
  startTime = Date.now();
  resultsContainer.classList.add('hidden');
  submitButton.style.display = 'inline-block';
  submitButton.disabled = true;
  submitButton.style.opacity = '0.6';
  
  const labels = quizContainer.querySelectorAll('label');
  labels.forEach(label => {
    label.classList.remove('selected', 'correct', 'incorrect');
  });
  
  const radioButtons = quizContainer.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.checked = false;
  });
  
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize
buildQuiz();
initTheme();

// Event listeners
submitButton.addEventListener('click', showResults);
resetButton.addEventListener('click', resetQuiz);
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Initialize submit button state
submitButton.disabled = true;
submitButton.style.opacity = '0.6';