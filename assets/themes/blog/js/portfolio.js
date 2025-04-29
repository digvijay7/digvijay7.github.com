// Portfolio page JavaScript functions - Xavier Perchaud inspired

// Ensure the document is fully loaded before executing any scripts
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations for elements as they come into view
  initScrollAnimations();
  
  // Initialize the video functionality
  initVideos();
  
  // Initialize navbar scroll effects
  initNavbarScroll();
  
  // Initialize smooth scrolling for anchor links
  initSmoothScroll();
  
  // Initialize tab functionality
  initTabs();
});

// Function to handle animations for elements as they come into view
function initScrollAnimations() {
  // Animation targets: video items, about sections, contact items
  const animationTargets = document.querySelectorAll('.video-item, .about-image, .about-content, .contact-item');
  
  // Create an Intersection Observer to detect when elements are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element is visible
      if (entry.isIntersecting) {
        // Add the animation class
        entry.target.classList.add('animate');
        // Stop observing once it's animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the item is visible
    rootMargin: '0px 0px -50px 0px' // Slightly adjust when the animation triggers
  });
  
  // Observe each animation target with a staggered delay
  animationTargets.forEach(item => {
    observer.observe(item);
  });
}

// Function to handle video player functionality
function initVideos() {
  // Get all video containers
  const videoContainers = document.querySelectorAll('.video-container');
  
  // Add click event to each container to load YouTube iframe
  videoContainers.forEach(container => {
    container.addEventListener('click', function() {
      const videoId = this.dataset.videoId;
      if(!videoId) return;
      
      // Create iframe element
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      
      // Remove thumbnail and play button
      const thumbnail = this.querySelector('.video-thumbnail');
      if(thumbnail) thumbnail.remove();
      
      // Add iframe to container
      this.appendChild(iframe);
      
      // Mark container as loaded
      this.classList.add('loaded');
    });
  });
  
  // Create an Intersection Observer to detect when video cards are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        
        // Lazy load the thumbnail if needed
        const thumbnail = container.querySelector('.video-thumbnail');
        if (thumbnail && !thumbnail.style.backgroundImage) {
          const videoId = container.dataset.videoId;
          thumbnail.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`;
        }
        
        // Stop observing
        observer.unobserve(container);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '100px'
  });
  
  // Observe each video container
  videoContainers.forEach(container => {
    observer.observe(container);
  });
}

// Function to handle navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    // Add scroll event listener
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Trigger initially in case page is loaded scrolled down
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
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

// Function to handle tab functionality
function initTabs() {
  const tabLinks = document.querySelectorAll('.category-tabs .nav-link');
  
  tabLinks.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all tabs
      tabLinks.forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Get the target panel ID from the href attribute
      const targetId = this.getAttribute('href');
      
      // Hide all tab panels
      document.querySelectorAll('.tab-pane').forEach(panel => {
        panel.classList.remove('show', 'active');
      });
      
      // Show the target panel
      const targetPanel = document.querySelector(targetId);
      if (targetPanel) {
        targetPanel.classList.add('show', 'active');
        
        // Re-animate the videos in the newly active panel
        const videoItems = targetPanel.querySelectorAll('.video-item');
        videoItems.forEach((item, index) => {
          // Remove animation class
          item.classList.remove('animate');
          
          // Force a reflow
          void item.offsetWidth;
          
          // Add animation class again with a delay
          setTimeout(() => {
            item.classList.add('animate');
          }, index * 100);
        });
      }
    });
  });
}