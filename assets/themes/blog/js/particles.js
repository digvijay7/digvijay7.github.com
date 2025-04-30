/**
 * Interactive Particle System for Portfolio
 * Creates a dynamic, responsive particle animation in the hero section
 */

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas element with id '${canvasId}' not found.`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mousePosition = { x: null, y: null };
    this.isAnimating = false;
    
    // Default options
    this.options = {
      particleCount: options.particleCount || 100,
      particleColor: options.particleColor || '#c5a47e',
      particleSize: options.particleSize || { min: 1, max: 3 },
      particleSpeed: options.particleSpeed || { min: 0.2, max: 0.8 },
      connectDistance: options.connectDistance || 120,
      connectOpacity: options.connectOpacity || 0.3,
      mouseInteraction: options.mouseInteraction !== undefined ? options.mouseInteraction : true,
      mouseRadius: options.mouseRadius || 150
    };
    
    this.init();
  }
  
  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    if (this.options.mouseInteraction) {
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('mouseleave', () => {
        this.mousePosition = { x: null, y: null };
      });
      
      // For touch devices
      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
      });
      
      this.canvas.addEventListener('touchend', () => {
        this.mousePosition = { x: null, y: null };
      });
    }
    
    this.createParticles();
    this.startAnimation();
  }
  
  resizeCanvas() {
    // Match canvas size to parent element
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
    
    // Recreate particles when canvas is resized
    if (this.particles.length > 0) {
      this.particles = [];
      this.createParticles();
    }
  }
  
  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: this.getRandomValue(this.options.particleSize),
        speed: this.getRandomValue(this.options.particleSpeed),
        directionX: Math.random() * 2 - 1,
        directionY: Math.random() * 2 - 1,
        color: this.getParticleColor(),
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  getRandomValue(range) {
    return Math.random() * (range.max - range.min) + range.min;
  }
  
  getParticleColor() {
    // If particleColor is a string, use it directly
    if (typeof this.options.particleColor === 'string') {
      return this.options.particleColor;
    }
    
    // If it's an array, randomly select one
    if (Array.isArray(this.options.particleColor)) {
      const index = Math.floor(Math.random() * this.options.particleColor.length);
      return this.options.particleColor[index];
    }
    
    // Default fallback
    return '#c5a47e';
  }
  
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Move particles
      particle.x += particle.directionX * particle.speed;
      particle.y += particle.directionY * particle.speed;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.directionX *= -1;
      }
      
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.directionY *= -1;
      }
      
      // Mouse interaction
      if (this.options.mouseInteraction && 
          this.mousePosition.x !== null && 
          this.mousePosition.y !== null) {
          
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.options.mouseRadius) {
          // Calculate repulsion force
          const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
          const angle = Math.atan2(dy, dx);
          
          // Apply force in opposite direction
          particle.directionX -= Math.cos(angle) * force * 0.05;
          particle.directionY -= Math.sin(angle) * force * 0.05;
          
          // Limit max speed
          const speed = Math.sqrt(particle.directionX * particle.directionX + 
                                 particle.directionY * particle.directionY);
          if (speed > 2) {
            particle.directionX = (particle.directionX / speed) * 2;
            particle.directionY = (particle.directionY / speed) * 2;
          }
        }
      }
    });
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections first (behind particles)
    this.drawConnections();
    
    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.options.connectDistance) {
          // Calculate opacity based on distance
          const opacity = 
            (1 - distance / this.options.connectDistance) * 
            this.options.connectOpacity;
          
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.particles[i].color;
          this.ctx.globalAlpha = opacity;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }
    }
  }
  
  animate() {
    if (!this.isAnimating) return;
    
    this.updateParticles();
    this.drawParticles();
    
    requestAnimationFrame(() => this.animate());
  }
  
  startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }
  
  stopAnimation() {
    this.isAnimating = false;
  }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the portfolio page with a header
  const portfolioHeader = document.querySelector('.portfolio-header');
  if (portfolioHeader) {
    // Create canvas element if it doesn't exist
    if (!document.getElementById('particle-canvas')) {
      const canvas = document.createElement('canvas');
      canvas.id = 'particle-canvas';
      canvas.className = 'particle-canvas';
      // Insert before the first child of portfolio header
      portfolioHeader.insertBefore(canvas, portfolioHeader.firstChild);
    }
    
    // Initialize the particle system
    const particles = new ParticleSystem('particle-canvas', {
      particleCount: 120,
      particleColor: '#c5a47e',
      particleSize: { min: 1, max: 3 },
      particleSpeed: { min: 0.1, max: 0.5 },
      connectDistance: 150,
      mouseRadius: 120
    });
  }
});