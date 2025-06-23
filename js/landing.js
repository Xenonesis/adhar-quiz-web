// Landing Page JavaScript
class LandingPage {
    constructor() {
        this.initializeTheme();
        this.initializeEventListeners();
        this.initializeAnimations();
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    initializeEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navOverlay = document.getElementById('nav-overlay');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navOverlay) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navOverlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            navOverlay.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Quiz preview interaction
        const quizPreview = document.querySelector('.quiz-preview');
        if (quizPreview) {
            quizPreview.addEventListener('mouseenter', this.animateQuizPreview);
            quizPreview.addEventListener('mouseleave', this.resetQuizPreview);
        }
        
        // Feature cards hover effect
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    }
    
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.feature-card, .cta-content').forEach(el => {
            observer.observe(el);
        });
        
        // Parallax effect for hero background
        window.addEventListener('scroll', this.handleParallax);
        
        // Stats counter animation
        this.animateStats();
    }
    
    handleParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }
    
    animateQuizPreview() {
        const options = document.querySelectorAll('.quiz-preview .option');
        options.forEach((option, index) => {
            setTimeout(() => {
                option.style.transform = 'translateX(5px)';
                option.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                option.style.borderColor = 'var(--color-primary)';
            }, index * 200);
        });
    }
    
    resetQuizPreview() {
        const options = document.querySelectorAll('.quiz-preview .option');
        options.forEach(option => {
            option.style.transform = '';
            option.style.backgroundColor = '';
            option.style.borderColor = '';
        });
    }
    
    animateStats() {
        // Simulate some stats for demonstration
        const stats = [
            { element: '.stat-quizzes', target: 1000, suffix: '+' },
            { element: '.stat-users', target: 5000, suffix: '+' },
            { element: '.stat-questions', target: 10000, suffix: '+' }
        ];
        
        stats.forEach(stat => {
            const element = document.querySelector(stat.element);
            if (element) {
                this.countUp(element, 0, stat.target, 2000, stat.suffix);
            }
        });
    }
    
    countUp(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    }
    
    // Utility method to show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Initialize landing page functionality
document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
    
    // Check for saved quizzes and update UI accordingly
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    if (savedQuizzes.length > 0) {
        // Update "My Quizzes" button to show count
        const myQuizzesBtn = document.querySelector('a[href="saved-quizzes.html"]');
        if (myQuizzesBtn) {
            const originalText = myQuizzesBtn.textContent;
            myQuizzesBtn.innerHTML = `${originalText} <span class="quiz-count">(${savedQuizzes.length})</span>`;
        }
    }
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.href && !this.href.includes('#')) {
                this.classList.add('loading');
                this.style.pointerEvents = 'none';
                
                // Remove loading state after navigation
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.style.pointerEvents = '';
                }, 1000);
            }
        });
    });
});

// Add some CSS for animations and notifications
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-background-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-tooltip);
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    }
    
    .notification.fade-out {
        animation: slideOutRight 0.3s ease-in;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: var(--spacing-4);
        gap: var(--spacing-3);
    }
    
    .notification-icon {
        font-size: var(--font-size-lg);
    }
    
    .notification-message {
        flex: 1;
        color: var(--color-text-primary);
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: var(--font-size-lg);
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: var(--spacing-1);
    }
    
    .notification-close:hover {
        color: var(--color-text-primary);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .quiz-count {
        background: var(--color-primary);
        color: white;
        padding: 2px 6px;
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        font-weight: 600;
    }
    
    .btn.loading {
        position: relative;
        color: transparent !important;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
    
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: var(--color-background-card);
        padding: var(--spacing-4);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-dropdown);
    }
    
    .nav-overlay.active {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: var(--z-modal);
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    @media (min-width: 769px) {
        .nav-links.active {
            position: static;
            display: flex;
            flex-direction: row;
            background: none;
            padding: 0;
            box-shadow: none;
        }
        
        .nav-overlay {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);