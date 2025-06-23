document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const navbar = document.querySelector('.navbar');
  const body = document.body;
  let lastScrollY = window.scrollY;

  // Scroll-aware navbar behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      // Scrolling down
      navbar.classList.add('hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;

    // Add shadow when scrolled
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

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
    const themeToggleElement = themeToggle;
    themeToggleElement.style.pointerEvents = 'none';
    
    // Add click animation
    themeToggleElement.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.9)', opacity: 0.8 },
      { transform: 'scale(1.1)', opacity: 1 }
    ], {
      duration: 200,
      easing: 'ease-out'
    });
    
    let theme = document.documentElement.getAttribute('data-theme');
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateThemeIcon('light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      updateThemeIcon('dark');
    }
    
    setTimeout(() => {
      themeToggleElement.style.pointerEvents = 'auto';
    }, 300);
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
    document.documentElement.style.setProperty('--menu-transition-duration', '0.3s');
    navLinks.style.transition = 'transform var(--menu-transition-duration) ease-in-out';
    navOverlay.style.transition = 'opacity var(--menu-transition-duration) ease-in-out';
    
    navLinks.classList.add('active');
    if (navOverlay) {
      navOverlay.classList.add('active');
      navOverlay.style.opacity = '1';
    }
    menuToggle.classList.add('active');
    body.style.overflow = 'hidden';
    
    // Focus management
    const firstLink = navLinks.querySelector('a');
    if (firstLink) {
      firstLink.focus();
    }
  }

  function closeMobileMenu() {
    document.documentElement.style.setProperty('--menu-transition-duration', '0.25s');
    navLinks.style.transition = 'transform var(--menu-transition-duration) ease-in-out';
    navOverlay.style.transition = 'opacity var(--menu-transition-duration) ease-in-out';
    
    navLinks.classList.remove('active');
    if (navOverlay) {
      navOverlay.style.opacity = '0';
      setTimeout(() => {
        navOverlay.classList.remove('active');
      }, 250); // Match transition duration
    }
    menuToggle.classList.remove('active');
    body.style.overflow = '';
    
    // Return focus to menu toggle
    menuToggle.focus();
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