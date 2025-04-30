---
layout: page
title: "About"
description: ""
---
{% include JB/setup %}

<div class="about-page">
  <div class="about-section">
    <h2>About Me</h2>
    <p>I create engaging GenAI content, specializing in educational and creative videos that showcase the capabilities of artificial intelligence. With a deep understanding of various AI technologies, I explore their applications in different domains through my content.</p>
    
    <p>My videos aim to make complex AI concepts accessible to everyone, demonstrating real-world applications and creative possibilities. Whether you're interested in the educational aspects of AI or looking for inspiration on creative applications, my content covers various dimensions of this rapidly evolving field.</p>
  </div>
  
  <div class="about-section">
    <h2>My Work</h2>
    <p>My portfolio includes a variety of AI-focused content:</p>
    
    <ul class="services-list">
      <li>Educational videos explaining AI concepts</li>
      <li>Creative demonstrations of AI capabilities</li>
      <li>Technical tutorials and walkthroughs</li>
      <li>Explorations of emerging AI technologies</li>
      <li>Thought-provoking content on the future of AI</li>
    </ul>
  </div>
  
  <div class="about-section">
    <h2>My Approach</h2>
    <p>I believe in making AI accessible and understandable to everyone. My content creation process focuses on:</p>
    
    <ol class="process-list">
      <li><strong>Research</strong> - Thorough investigation of AI concepts and technologies</li>
      <li><strong>Simplification</strong> - Breaking down complex ideas into understandable components</li>
      <li><strong>Visualization</strong> - Creating clear visual representations of abstract concepts</li>
      <li><strong>Application</strong> - Demonstrating practical, real-world uses of AI</li>
      <li><strong>Engagement</strong> - Crafting compelling narratives that keep viewers interested</li>
    </ol>
  </div>
</div>

<style>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #ffffff;
}

.about-section {
  margin-bottom: 60px;
  position: relative;
  padding-left: 20px;
  border-left: 2px solid #c5a47e;
}

.about-section h2 {
  font-family: 'Syncopate', sans-serif;
  font-size: 2rem;
  margin-bottom: 30px;
  position: relative;
  color: #ffffff;
}

.about-section h2:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #c5a47e;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.services-list, .process-list {
  padding-left: 20px;
  margin-top: 30px;
}

.services-list li, .process-list li {
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
}

.services-list li:before {
  content: '•';
  position: absolute;
  left: -20px;
  color: #c5a47e;
  font-size: 1.5rem;
}

.process-list {
  counter-reset: process-counter;
}

.process-list li {
  counter-increment: process-counter;
  padding-left: 15px;
}

.process-list li strong {
  color: #ffffff;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .about-section h2 {
    font-size: 1.7rem;
  }
  
  .about-section p, .services-list li, .process-list li {
    font-size: 1rem;
  }
}
</style>
