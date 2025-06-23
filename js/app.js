document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const body = document.body;

  // Theme toggle functionality
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }
  }

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateThemeIcon('light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      updateThemeIcon('dark');
    }
  });

  // Mobile menu functionality
  function toggleMobileMenu() {
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navLinks.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    menuToggle.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    body.style.overflow = '';
  }

  // Event listeners for mobile menu
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking nav links
    const navLinkElements = navLinks.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // Add active class to current page nav link
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    navLinkElements.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  setActiveNavLink();
});