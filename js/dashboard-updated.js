// Enhanced Dashboard with Visual Analytics
class Dashboard {
    constructor() {
        this.quizResults = [];
        this.charts = {};
        
        this.initializeTheme();
        this.loadData();
        this.initializeCharts();
        this.updateStats();
        this.renderRecentResults();
        this.renderCategoryStats();
        this.initializeEventListeners();
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Update chart colors for theme
        this.updateChartTheme();
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    loadData() {
        this.quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        this.savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    }
    
    initializeEventListeners() {
        // Add clear data functionality if needed
        const clearBtn = document.getElementById('clear-data');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }
    }
    
    updateStats() {
        const totalQuizzes = this.savedQuizzes.length;
        const completedQuizzes = this.quizResults.length;
        const scores = this.quizResults.map(r => r.percentage);
        const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
        
        document.getElementById('total-quizzes').textContent = totalQuizzes;
        document.getElementById('quizzes-completed').textContent = completedQuizzes;
        document.getElementById('average-score').textContent = `${averageScore}%`;
        document.getElementById('best-score').textContent = `${bestScore}%`;
        
        // Update time analytics
        this.updateTimeAnalytics();
        this.updateTrendAnalytics();
    }
    
    updateTimeAnalytics() {
        const times = this.quizResults.map(r => r.timeSpent || 0);
        const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        const fastestTime = times.length > 0 ? Math.min(...times) : 0;
        const totalTime = times.reduce((a, b) => a + b, 0);
        
        document.getElementById('avg-time').textContent = this.formatTime(avgTime);
        document.getElementById('fastest-time').textContent = this.formatTime(fastestTime);
        document.getElementById('total-time').textContent = this.formatTime(totalTime);
    }
    
    updateTrendAnalytics() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const weekResults = this.quizResults.filter(r => new Date(r.date) >= weekAgo);
        const monthResults = this.quizResults.filter(r => new Date(r.date) >= monthAgo);
        
        const weekAvg = weekResults.length > 0 ? Math.round(weekResults.reduce((a, b) => a + b.percentage, 0) / weekResults.length) : 0;
        const monthAvg = monthResults.length > 0 ? Math.round(monthResults.reduce((a, b) => a + b.percentage, 0) / monthResults.length) : 0;
        
        const overallAvg = this.quizResults.length > 0 ? Math.round(this.quizResults.reduce((a, b) => a + b.percentage, 0) / this.quizResults.length) : 0;
        
        const weekTrend = weekAvg - overallAvg;
        const monthTrend = monthAvg - overallAvg;
        
        document.getElementById('week-trend').textContent = `${weekTrend >= 0 ? '+' : ''}${weekTrend}%`;
        document.getElementById('month-trend').textContent = `${monthTrend >= 0 ? '+' : ''}${monthTrend}%`;
        
        // Color code trends
        document.getElementById('week-trend').style.color = weekTrend >= 0 ? '#28a745' : '#dc3545';
        document.getElementById('month-trend').style.color = monthTrend >= 0 ? '#28a745' : '#dc3545';
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    initializeCharts() {
        this.createPerformanceChart();
        this.createScoreDistributionChart();
        this.createDifficultyChart();
    }
    
    createPerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;
        
        const sortedResults = [...this.quizResults].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedResults.map((_, index) => `Quiz ${index + 1}`);
        const data = sortedResults.map(r => r.percentage);
        
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score %',
                    data: data,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createScoreDistributionChart() {
        const ctx = document.getElementById('score-chart');
        if (!ctx) return;
        
        const scoreRanges = {
            'A (90-100%)': 0,
            'B (80-89%)': 0,
            'C (70-79%)': 0,
            'D (60-69%)': 0,
            'F (0-59%)': 0
        };
        
        this.quizResults.forEach(result => {
            const score = result.percentage;
            if (score >= 90) scoreRanges['A (90-100%)']++;
            else if (score >= 80) scoreRanges['B (80-89%)']++;
            else if (score >= 70) scoreRanges['C (70-79%)']++;
            else if (score >= 60) scoreRanges['D (60-69%)']++;
            else scoreRanges['F (0-59%)']++;
        });
        
        this.charts.scoreDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(scoreRanges),
                datasets: [{
                    data: Object.values(scoreRanges),
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#ffc107',
                        '#fd7e14',
                        '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    createDifficultyChart() {
        const ctx = document.getElementById('difficulty-chart');
        if (!ctx) return;
        
        const difficultyStats = {};
        this.quizResults.forEach(result => {
            const quiz = this.savedQuizzes.find(q => q.id === result.quizId);
            if (quiz) {
                const difficulty = quiz.difficulty || 'medium';
                if (!difficultyStats[difficulty]) {
                    difficultyStats[difficulty] = { total: 0, sum: 0 };
                }
                difficultyStats[difficulty].total++;
                difficultyStats[difficulty].sum += result.percentage;
            }
        });
        
        const labels = Object.keys(difficultyStats);
        const averages = labels.map(diff => 
            difficultyStats[diff].total > 0 ? 
            Math.round(difficultyStats[diff].sum / difficultyStats[diff].total) : 0
        );
        
        this.charts.difficulty = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
                datasets: [{
                    label: 'Average Score %',
                    data: averages,
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    renderCategoryStats() {
        const categoryContainer = document.getElementById('category-stats');
        if (!categoryContainer) return;
        
        const categoryStats = {};
        
        this.quizResults.forEach(result => {
            const quiz = this.savedQuizzes.find(q => q.id === result.quizId);
            if (quiz) {
                const category = quiz.category || 'general';
                if (!categoryStats[category]) {
                    categoryStats[category] = { total: 0, sum: 0, best: 0 };
                }
                categoryStats[category].total++;
                categoryStats[category].sum += result.percentage;
                categoryStats[category].best = Math.max(categoryStats[category].best, result.percentage);
            }
        });
        
        categoryContainer.innerHTML = Object.keys(categoryStats).map(category => {
            const stats = categoryStats[category];
            const average = Math.round(stats.sum / stats.total);
            
            return `
                <div class="category-card">
                    <div class="category-header">
                        <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                        <span class="category-count">${stats.total} quiz${stats.total !== 1 ? 'es' : ''}</span>
                    </div>
                    <div class="category-stats">
                        <div class="category-stat">
                            <span class="stat-label">Average:</span>
                            <span class="stat-value">${average}%</span>
                        </div>
                        <div class="category-stat">
                            <span class="stat-label">Best:</span>
                            <span class="stat-value">${stats.best}%</span>
                        </div>
                    </div>
                    <div class="category-progress">
                        <div class="progress-bar" style="width: ${average}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderRecentResults() {
        const resultsContainer = document.getElementById('recent-results');
        if (!resultsContainer) return;
        
        const recentResults = [...this.quizResults]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
        
        if (recentResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>No Quiz Results Yet</h3>
                    <p>Take some quizzes to see your performance analytics here!</p>
                    <a href="saved-quizzes.html" class="btn btn-primary">Browse Quizzes</a>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = recentResults.map(result => {
            const quiz = this.savedQuizzes.find(q => q.id === result.quizId);
            const date = new Date(result.date).toLocaleDateString();
            const time = new Date(result.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            let gradeColor = '#dc3545';
            if (result.percentage >= 90) gradeColor = '#28a745';
            else if (result.percentage >= 80) gradeColor = '#17a2b8';
            else if (result.percentage >= 70) gradeColor = '#ffc107';
            else if (result.percentage >= 60) gradeColor = '#fd7e14';
            
            return `
                <div class="result-card">
                    <div class="result-header">
                        <h4>${quiz ? quiz.title : 'Unknown Quiz'}</h4>
                        <div class="result-score" style="color: ${gradeColor}">${result.percentage}%</div>
                    </div>
                    <div class="result-details">
                        <span class="result-detail">
                            <strong>${result.score}/${result.total}</strong> correct
                        </span>
                        <span class="result-detail">
                            ${this.formatTime(result.timeSpent || 0)}
                        </span>
                        <span class="result-detail">
                            ${date} ${time}
                        </span>
                    </div>
                    <div class="result-progress">
                        <div class="progress-bar" style="width: ${result.percentage}%; background-color: ${gradeColor}"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateChartTheme() {
        // Update chart colors based on theme
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#f8fafc' : '#333';
        const gridColor = isDark ? '#374151' : '#e9ecef';
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                chart.options.scales.x.ticks.color = textColor;
                chart.options.scales.y.ticks.color = textColor;
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.y.grid.color = gridColor;
                chart.update();
            }
        });
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to clear all quiz results? This action cannot be undone.')) {
            localStorage.removeItem('quizResults');
            this.quizResults = [];
            this.updateStats();
            this.renderRecentResults();
            this.renderCategoryStats();
            
            // Recreate charts with empty data
            Object.values(this.charts).forEach(chart => chart.destroy());
            this.initializeCharts();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});