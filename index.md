---
layout: clean-page
title: Digvijay Singh
tagline: Gen AI Content Creator
---

{% include JB/setup %}

<div class="home-hero">
  <div class="artistic-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Welcome to My AI Portfolio</h1>
    <h2 class="hero-subtitle">GEN AI CONTENT CREATOR</h2>
    <p class="hero-text">I create engaging GenAI content, specializing in educational and creative videos that showcase the capabilities of artificial intelligence.</p>
    <div class="hero-cta">
      <a href="/portfolio" class="cta-button">Explore My Work</a>
    </div>
  </div>
</div>

<style>
body {
  background-color: #121212;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  position: relative;
}

#wrap {
  min-height: 100vh;
  position: relative;
  padding-bottom: 80px; /* Space for footer */
}

.home-hero {
  height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-image: url('https://images.unsplash.com/photo-1675483052490-4ce2e2b3b5e6?q=80&w=1932&auto=format&fit=crop'), linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9));
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  position: relative;
  overflow: hidden;
  margin-top: 60px; /* Make space for fixed navbar */
}

.artistic-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1621075160523-b936ad96132a?q=80&w=1770&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  mix-blend-mode: color-dodge;
  animation: pulse 15s infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

.hero-content {
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 10;
  padding: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.hero-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
  text-transform: uppercase;
}

.hero-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #c5a47e;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease 0.3s forwards;
}

.hero-text {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease 0.6s forwards;
}

.hero-cta {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease 0.9s forwards;
}

.cta-button {
  display: inline-block;
  background-color: transparent;
  color: #ffffff;
  border: 2px solid #c5a47e;
  padding: 15px 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.4s ease;
}

.cta-button:hover {
  background-color: #c5a47e;
  color: #121212;
  text-decoration: none;
}

.footer {
  background-color: #121212;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 30px 0;
  text-align: center;
  position: relative;
  width: 100%;
  margin-top: 50px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-text {
    font-size: 1rem;
  }
}
</style>
