// Unified Navbar JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navbar scroll effects
  initNavbarScroll();
  
  // Initialize smooth scrolling for anchor links
  initSmoothScroll();
});

// Function to handle navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    // Add scroll event listener for navbar background change
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Trigger initially in case page is loaded scrolled down
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
    
    // Update active nav link based on current page
    updateActiveNavLink();
    
    // Update active nav link based on scroll position (for pages with hash navigation)
    window.addEventListener('scroll', updateActiveNavLinkOnScroll);
    
    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (navbarToggler) {
      // Close menu when a link is clicked on mobile
      navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
          }
        });
      });
    }
  }
}

// Function to handle smooth scrolling for anchor links
function initSmoothScroll() {
  // Get all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only process internal anchor links
      if (this.getAttribute('href').startsWith('#') && this.getAttribute('href') !== '#' && !this.getAttribute('data-toggle')) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate the position to scroll to
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          // Smooth scroll to the target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

// Function to update active nav link based on the current page
function updateActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    
    // Handle both exact matches and also portfolio section links
    if (href === currentPath || 
        (currentPath === '/' && href === '/') || 
        (currentPath.includes('/portfolio') && href.includes('/portfolio'))) {
      
      // Don't activate section links when just on the base portfolio page
      if (href.includes('#') && currentPath === '/portfolio' && !window.location.hash) {
        return;
      }
      
      link.classList.add('active');
    }
  });
}

// Function to update active nav link based on scroll position (for portfolio page sections)
function updateActiveNavLinkOnScroll() {
  // Only run this on the portfolio page
  if (!window.location.pathname.includes('/portfolio')) return;
  
  // Get all sections that have an ID
  const sections = document.querySelectorAll('section[id]');
  
  // Get current scroll position
  const scrollPosition = window.scrollY + 100; // Adding offset for navbar height
  
  // Find the current section in view
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Get the ID of the current section
      const id = section.getAttribute('id');
      
      // Remove active class from all navigation links
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
      });
      console.log()
      
      // Add active class to corresponding navigation link
      const activeLink = document.querySelector(`.navbar-nav .nav-link[href$="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
  
  // If at top of page and no section is active, highlight home
  if (scrollPosition < 300) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      if (link.getAttribute('href') === '/portfolio#portfolio') {
        link.classList.add('active');
      }
    });
  }
}