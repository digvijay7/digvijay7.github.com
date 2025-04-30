// Portfolio page JavaScript - Artistic Edition

// Ensure the document is fully loaded before executing any scripts
document.addEventListener('DOMContentLoaded', function() {
  // Add particles.js library
  if (!document.querySelector('script[src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"]')) {
    const particlesScript = document.createElement('script');
    particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    particlesScript.onload = function() {
      // Initialize our particles config after library is loaded
      if (!document.querySelector('script[src="/assets/themes/blog/js/particles.js"]')) {
        const configScript = document.createElement('script');
        configScript.src = '/assets/themes/blog/js/particles.js';
        document.body.appendChild(configScript);
      }
      
      // Add particles container if needed
      if (!document.getElementById('particles-js')) {
        const header = document.querySelector('.portfolio-header');
        if (header) {
          const particlesContainer = document.createElement('div');
          particlesContainer.id = 'particles-js';
          particlesContainer.className = 'particle-canvas';
          header.appendChild(particlesContainer);
        }
      }
    };
    document.body.appendChild(particlesScript);
  }
  
  // Initialize animations for elements as they come into view
  initScrollAnimations();
  
  // Initialize the video functionality
  initVideos();
  
  // Initialize tab functionality
  initTabs();
  
  // Initialize header parallax effect
  initHeaderParallax();
  
  // Initialize 3D parallax for featured items (after small delay to ensure DOM is ready)
  setTimeout(initFeaturedParallax, 100);
  
  // Initialize dynamic color themes for videos
  setTimeout(initDynamicThemes, 200);
});

// Function to handle animations for elements as they come into view
function initScrollAnimations() {
  // Animation targets: featured items, video items, about sections, contact items
  const animationTargets = document.querySelectorAll('.featured-item, .video-item, .about-image, .about-content, .contact-item');
  
  // Create an Intersection Observer to detect when elements are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      // If the element is visible
      if (entry.isIntersecting) {
        // Add the animation class with a staggered delay
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, index * 100); // Stagger the animations by 100ms per item
        
        // Stop observing once it's animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the item is visible
    rootMargin: '0px 0px -50px 0px' // Slightly adjust when the animation triggers
  });
  
  // Observe each animation target
  animationTargets.forEach(item => {
    observer.observe(item);
  });
}

// Function to handle video player functionality
function initVideos() {
  console.log("Initializing videos");
  // Get all video containers
  const videoContainers = document.querySelectorAll('.video-container, .featured-item');
  console.log(`Found ${videoContainers.length} video containers`);
  
  if (videoContainers.length === 0) {
    console.log("No video containers found on this page");
    return;
  }
  
  // Add click event to each container to load YouTube iframe
  videoContainers.forEach((container, index) => {
    // Make sure thumbnails are loaded
    const videoId = container.dataset.videoId;
    console.log(`Container ${index+1} - Video ID: ${videoId}`);
    
    if(!videoId) {
      console.warn(`Container ${index+1} has no video ID`);
      return;
    }
    
    // Get or create the thumbnail
    let thumbnail = container.querySelector('.video-thumbnail');
    if (!thumbnail) {
      console.log(`Creating new thumbnail for video ${videoId}`);
      thumbnail = document.createElement('div');
      thumbnail.className = 'video-thumbnail';
      container.appendChild(thumbnail);
    }
    
    // Set the thumbnail background
    try {
      // First try the maxresdefault image (highest quality)
      const imgUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Load image in a way we can detect if it fails
      const img = new Image();
      img.onload = () => {
        // Image loaded successfully
        console.log(`Loaded high quality thumbnail for ${videoId}`);
        thumbnail.style.backgroundImage = `url('${imgUrl}')`;
      };
      
      img.onerror = () => {
        // Fall back to standard quality if high quality fails
        console.log(`Falling back to standard thumbnail for ${videoId}`);
        thumbnail.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`;
      };
      
      // Start loading the image
      img.src = imgUrl;
      
      // Set a default immediately while we wait for load/error
      thumbnail.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`;
      
    } catch (e) {
      console.error(`Error loading thumbnail for ${videoId}:`, e);
      thumbnail.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`;
    }
    
    // Add play button if it doesn't exist
    if (!thumbnail.querySelector('.play-button') && !thumbnail.querySelector('.featured-play')) {
      console.log(`Adding play button for ${videoId}`);
      const playButton = document.createElement('div');
      playButton.className = 'play-button';
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      thumbnail.appendChild(playButton);
    }
    
    // Remove any existing click handlers to prevent duplicates
    const newContainer = container.cloneNode(true);
    container.parentNode.replaceChild(newContainer, container);
    
    // Add click event listener to the new container
    newContainer.addEventListener('click', function(e) {
      e.preventDefault();
      console.log(`Loading YouTube iframe for ${videoId}`);
      
      // Create iframe element with correct attributes
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      
      // Get the thumbnail element from the new container
      const newThumbnail = newContainer.querySelector('.video-thumbnail');
      
      // Remove thumbnail
      if (newThumbnail) {
        newThumbnail.remove();
      }
      
      // Add iframe to container and set class
      newContainer.appendChild(iframe);
      newContainer.classList.add('loaded');
      
      console.log(`Video ${videoId} iframe added and loaded`);
    });
  });
  
  console.log("Video initialization complete");
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

// Function to handle header parallax effect
function initHeaderParallax() {
  const header = document.querySelector('.portfolio-header');
  const headerContent = document.querySelector('.header-content');
  
  if (!header || !headerContent) return;
  
  // Add event listeners for mouse movement
  header.addEventListener('mousemove', (e) => {
    // Get the mouse position relative to the center of the header
    const rect = header.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate the distance from center (normalized from -1 to 1)
    const mouseX = ((e.clientX - rect.left) - centerX) / centerX;
    const mouseY = ((e.clientY - rect.top) - centerY) / centerY;
    
    // Apply the parallax effect to the header content
    headerContent.style.transform = `translateX(${mouseX * -20}px) translateY(${mouseY * -20}px) translateZ(50px)`;
    
    // Also adjust background image position slightly
    header.style.backgroundPosition = `calc(50% + ${mouseX * 10}px) calc(50% + ${mouseY * 10}px)`;
    
    // Add subtle rotation
    headerContent.style.transform += ` rotateX(${mouseY * 2}deg) rotateY(${mouseX * -2}deg)`;
  });
  
  // Reset on mouse leave
  header.addEventListener('mouseleave', () => {
    headerContent.style.transform = 'translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0)';
    header.style.backgroundPosition = 'center';
  });
  
  // Add color shift effect on scroll
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const headerHeight = header.offsetHeight;
    
    // Calculate scroll percentage within header
    const scrollPercentage = Math.min(scrollPosition / headerHeight, 1);
    
    // Adjust the header overlay opacity based on scroll
    const headerOverlay = header.querySelector('.header-overlay');
    if (headerOverlay) {
      headerOverlay.style.opacity = 0.7 + (scrollPercentage * 0.3);
    }
    
    // Create a subtle color shift effect on scroll
    const hue = 35 + (scrollPercentage * 5); // Subtle shift in gold/amber hue
    const saturation = 75 - (scrollPercentage * 15); // Slightly decrease saturation as we scroll
    
    // Apply the color shift to the accent elements
    const root = document.documentElement;
    root.style.setProperty('--accent-color', `hsl(${hue}, ${saturation}%, 60%)`);
    root.style.setProperty('--accent-color-light', `hsl(${hue}, ${saturation - 10}%, 70%)`);
    root.style.setProperty('--accent-color-dark', `hsl(${hue}, ${saturation + 10}%, 50%)`);
    
    // Update the gradient as well
    root.style.setProperty('--accent-gradient', 
      `linear-gradient(45deg, hsl(${hue}, ${saturation + 10}%, 50%), 
      hsl(${hue}, ${saturation}%, 60%), 
      hsl(${hue}, ${saturation - 10}%, 70%))`
    );
  });
}

// Function to handle 3D parallax for featured items
function initFeaturedParallax() {
  const featuredContainer = document.querySelector('.featured-container');
  const featuredItems = document.querySelectorAll('.featured-item');
  
  if (!featuredContainer || featuredItems.length === 0) return;
  
  // Add perspective to container
  featuredContainer.style.perspective = '1000px';
  
  // Add mouse move event to create parallax effect
  featuredContainer.addEventListener('onmouseover', (e) => {
    const rect = featuredContainer.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate mouse position relative to center
    const mouseX = ((e.clientX - rect.left) - centerX) / centerX;
    const mouseY = ((e.clientY - rect.top) - centerY) / centerY;
    
    // Apply parallax effect to each featured item
    featuredItems.forEach((item, index) => {
      // Calculate 3D transform with staggered effect
      const depth = 30 + (index * 10);
      const rotateX = mouseY * 5;
      const rotateY = mouseX * -5;
      const translateZ = depth;
      const translateX = mouseX * -(10 + (index * 5));
      const translateY = mouseY * -(10 + (index * 5));
      
      // Apply transform
      item.style.transform = `
        translateX(${translateX}px) 
        translateY(${translateY}px) 
        translateZ(${translateZ}px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `;
    });
  });
  
  // Reset transforms when mouse leaves container
  featuredContainer.addEventListener('onmouseout', () => {
    featuredItems.forEach(item => {
      item.style.transform = 'translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0)';
    });
  });
}

// Function to create dynamic color themes based on video thumbnails
function initDynamicThemes() {
  console.log("Initializing dynamic themes");
  
  // Get all video cards
  const videoCards = document.querySelectorAll('.video-card');
  const colorThemes = ['theme-warm', 'theme-cool', 'theme-nature', 'theme-vibrant', 'theme-dark'];
  
  // Process each video card
  videoCards.forEach((card, index) => {
    // Get the thumbnail element
    const thumbnail = card.querySelector('.video-thumbnail');
    if (!thumbnail) return;
    
    // Get the background image URL
    const bgImage = window.getComputedStyle(thumbnail).backgroundImage;
    if (!bgImage || bgImage === 'none') return;
    
    // For simplicity in this demo, assign themes based on index
    const themeClass = colorThemes[index % colorThemes.length];
    card.classList.add(themeClass);
    
    // In a real implementation, you could use a Canvas to analyze the dominant color of the image
    // This is a simplified version:
    try {
      // Create observer to detect when thumbnail loads
      const observer = new MutationObserver((mutations) => {
        if (thumbnail.complete && thumbnail.naturalHeight !== 0) {
          // Set custom property for this specific card's theme
          document.documentElement.style.setProperty(
            `--card-${index}-accent`, 
            getComputedStyle(card).getPropertyValue('--accent-color')
          );
          observer.disconnect();
        }
      });
      
      observer.observe(thumbnail, { attributes: true, childList: true, subtree: true });
    } catch (e) {
      console.error("Error setting dynamic theme:", e);
    }
  });
  
  console.log("Dynamic themes initialized");
}