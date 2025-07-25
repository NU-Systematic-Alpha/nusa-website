document.addEventListener('DOMContentLoaded', function() {
  // Navigation functionality
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Email signup form
  const emailForm = document.getElementById('email-form');
  const formMessage = document.getElementById('form-message');

  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = e.target.querySelector('input[type="email"]').value;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      
      // Show loading state
      submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
      submitBtn.disabled = true;
      
      // Simulate API call (replace with actual endpoint)
      try {
        // await fetch('/api/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email })
        // });
        
        // Simulated success
        setTimeout(() => {
          formMessage.textContent = 'Thank you for subscribing! We\'ll keep you updated.';
          formMessage.className = 'form-message success';
          emailForm.reset();
          submitBtn.innerHTML = 'Join Newsletter';
          submitBtn.disabled = false;
          
          // Clear message after 5 seconds
          setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
          }, 5000);
        }, 1000);
        
      } catch (error) {
        formMessage.textContent = 'Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
        submitBtn.innerHTML = 'Join Newsletter';
        submitBtn.disabled = false;
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // For staggered animations
        if (entry.target.classList.contains('stagger-parent')) {
          const children = entry.target.querySelectorAll('.stagger-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-parent');
  animatedElements.forEach(el => observer.observe(el));

  // Make sure all elements are visible by default and add animation classes only if needed
  // Force visibility for critical sections
  document.querySelectorAll('.about-description, .about-stats, .team-member, .project-card').forEach(element => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });

  document.querySelectorAll('.event-card').forEach(event => {
    event.classList.add('fade-in-right');
  });

  // Parallax effect for hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      heroBg.style.transform = `translateY(${parallax}px)`;
    });
  }

  // Counter animation for statistics
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  };

  // Observe stat values for counter animation
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const value = entry.target.textContent;
        if (!isNaN(value)) {
          animateCounter(entry.target, parseInt(value));
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stat-value').forEach(stat => {
    if (!isNaN(stat.textContent)) {
      statObserver.observe(stat);
    }
  });

  // Add hover effect classes
  document.querySelectorAll('.about-card, .project-card, .event-card').forEach(card => {
    card.classList.add('hover-lift');
  });

  document.querySelectorAll('.cta-button, .submit-btn').forEach(btn => {
    btn.classList.add('glow');
  });

  // Horizontal scroll for team and projects sections
  const addHorizontalScroll = (container) => {
    container.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    });
  };

  const teamScroll = document.querySelector('.team-scroll');
  const projectsScroll = document.querySelector('.projects-scroll');
  
  if (teamScroll) {
    addHorizontalScroll(teamScroll);
  }
  
  if (projectsScroll) {
    addHorizontalScroll(projectsScroll);
  }

  // Typing effect for hero title (optional)
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && false) { // Set to true to enable typing effect
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.visibility = 'visible';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    
    setTimeout(typeWriter, 500);
  }
});