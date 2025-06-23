class QuizAnalytics {
  constructor() {
    this.results = this.loadResults();
    this.initTheme();
    this.initEventListeners();
    this.renderDashboard();
  }

  loadResults() {
    return JSON.parse(localStorage.getItem('quizResults') || '[]');
  }

  saveResults(results) {
    localStorage.setItem('quizResults', JSON.stringify(results));
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  initEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    const clearButton = document.getElementById('clear-data');
    
    if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
    if (clearButton) clearButton.addEventListener('click', () => this.clearAllData());
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  renderDashboard() {
    this.renderStats();
    this.renderCharts();
    this.renderHistory();
    this.renderTopicAnalysis();
  }

  renderStats() {
    const totalAttempts = this.results.length;
    const avgScore = totalAttempts > 0 ? Math.round(this.results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts) : 0;
    const bestScore = totalAttempts > 0 ? Math.max(...this.results.map(r => r.percentage)) : 0;
    const improvement = this.calculateImprovement();

    document.getElementById('total-attempts').textContent = totalAttempts;
    document.getElementById('avg-score').textContent = avgScore + '%';
    document.getElementById('best-score').textContent = bestScore + '%';
    document.getElementById('improvement').textContent = improvement + '%';
  }

  calculateImprovement() {
    if (this.results.length < 2) return 0;
    const recent = this.results.slice(-3).reduce((sum, r) => sum + r.percentage, 0) / Math.min(3, this.results.length);
    const older = this.results.slice(0, -3).reduce((sum, r) => sum + r.percentage, 0) / Math.max(1, this.results.length - 3);
    return Math.round(recent - older);
  }

  renderCharts() {
    this.renderProgressChart();
    this.renderPerformanceChart();
  }

  renderProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.results.map((_, i) => `Attempt ${i + 1}`),
        datasets: [{
          label: 'Score %',
          data: this.results.map(r => r.percentage),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });
  }

  renderPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const ranges = { 'Excellent (90-100%)': 0, 'Good (75-89%)': 0, 'Average (60-74%)': 0, 'Poor (0-59%)': 0 };
    
    this.results.forEach(r => {
      if (r.percentage >= 90) ranges['Excellent (90-100%)']++;
      else if (r.percentage >= 75) ranges['Good (75-89%)']++;
      else if (r.percentage >= 60) ranges['Average (60-74%)']++;
      else ranges['Poor (0-59%)']++;
    });

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(ranges),
        datasets: [{
          data: Object.values(ranges),
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  renderHistory() {
    const historyList = document.getElementById('history-list');
    if (this.results.length === 0) {
      historyList.innerHTML = '<div class="empty-state"><p>No quiz attempts yet. <a href="index.html" class="btn-primary">Take your first quiz!</a></p></div>';
      return;
    }

    historyList.innerHTML = this.results.slice(-10).reverse().map((result) => `
      <div class="history-item">
        <div class="history-main">
          <div class="history-score" style="color: ${this.getScoreColor(result.percentage)}; font-weight: 600;">
            ${result.score}/${result.total} (${result.percentage}%)
          </div>
          <div class="history-grade" style="background: ${this.getScoreColor(result.percentage)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
            ${this.calculateGrade(result.percentage)}
          </div>
        </div>
        <div class="history-details">
          <div class="history-quiz-title" style="color: var(--color-text-secondary); font-size: 14px; margin-bottom: 4px;">
            ${result.quizTitle || 'Quiz'}
          </div>
          <div class="history-date" style="color: var(--color-text-secondary); font-size: 14px;">
            ${new Date(result.date).toLocaleDateString()} at ${new Date(result.date).toLocaleTimeString()}
          </div>
        </div>
      </div>
    `).join('');
  }

  calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  getScoreColor(percentage) {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#2196F3';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  }

  renderTopicAnalysis() {
    const topics = this.analyzeTopics();
    const topicStats = document.getElementById('topic-stats');
    
    if (Object.keys(topics).length === 0) {
      topicStats.innerHTML = '<p>Complete more quizzes to see topic analysis.</p>';
      return;
    }

    topicStats.innerHTML = Object.entries(topics).map(([topic, data]) => `
      <div class="topic-item">
        <span>${topic}</span>
        <div class="topic-progress">
          <div class="topic-progress-bar" style="width: ${data.accuracy}%"></div>
        </div>
        <span>${data.accuracy}% (${data.correct}/${data.total})</span>
      </div>
    `).join('');
  }

  analyzeTopics() {
    const topics = {};
    this.results.forEach(result => {
      if (result.answers && Array.isArray(result.answers)) {
        result.answers.forEach((answer) => {
          const topic = this.categorizeQuestion(answer.question);
          if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
          topics[topic].total++;
          if (answer.correct || answer.isCorrect) topics[topic].correct++;
        });
      }
    });

    Object.keys(topics).forEach(topic => {
      topics[topic].accuracy = Math.round((topics[topic].correct / topics[topic].total) * 100);
    });

    return topics;
  }

  categorizeQuestion(question) {
    const keywords = {
      'Biometrics': ['biometric', 'fingerprint', 'iris', 'face', 'photo'],
      'Documents': ['document', 'proof', 'poi', 'poa', 'identity', 'address'],
      'UIDAI Procedures': ['uidai', 'procedure', 'process', 'enrolment', 'enrollment'],
      'Equipment': ['equipment', 'device', 'scanner', 'camera', 'hardware'],
      'Software': ['software', 'application', 'system', 'ecmp', 'client'],
      'Regulations': ['regulation', 'rule', 'compliance', 'guideline', 'policy'],
      'Authentication': ['authentication', 'verification', 'validate', 'confirm'],
      'Quality Control': ['quality', 'standard', 'specification', 'requirement']
    };
    
    const lowerQuestion = question.toLowerCase();
    for (const [topic, words] of Object.entries(keywords)) {
      if (words.some(word => lowerQuestion.includes(word))) {
        return topic;
      }
    }
    return 'General';
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all quiz data? This cannot be undone.')) {
      localStorage.removeItem('quizResults');
      this.results = [];
      this.renderDashboard();
    }
  }
}

// Initialize dashboard
new QuizAnalytics();