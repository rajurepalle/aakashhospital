/* ═══════════════════════════════════════════════
   AAKASH HOSPITAL — INTERACTIVE JAVASCRIPT
   Theme Toggle · Animations · Mobile-Optimized
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  // ══ PAGE LOAD ANIMATION ══
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 50);
  });

  // ══ THEME TOGGLE ══
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;
  
  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('aakash-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀︎' : '🌙';
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('aakash-theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });

  // ══ NAVBAR SCROLL BEHAVIOR ══
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ══ MOBILE MENU ══
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    
    // Hamburger animation
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
      document.body.style.overflow = '';
    }
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });
  
  // Close mobile menu when link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
      });
      document.body.style.overflow = '';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && 
        !mobileMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
      });
      document.body.style.overflow = '';
    }
  });

  // ══ REVEAL ON SCROLL (MOBILE-OPTIMIZED) ══
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for elements in the same container
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
        );
        const idx = siblings.indexOf(entry.target);
        
        // Reduced stagger on mobile for faster animations
        const staggerDelay = isMobile ? Math.min(idx * 40, 200) : Math.min(idx * 60, 300);
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, staggerDelay);
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -40px 0px'
  });
  
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ══ COUNTER ANIMATION ══
  function animateCounter(el, target, duration = 1800) {
    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      
      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal 
          ? target.toFixed(1) 
          : target.toLocaleString();
      }
    }
    
    requestAnimationFrame(update);
  }
  
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        
        if (!isNaN(target)) {
          // Faster animation on mobile
          const duration = isMobile ? 1200 : 1800;
          animateCounter(el, target, duration);
        }
        
        statObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.5
  });
  
  // Observe both hero stats and any other stat numbers
  document.querySelectorAll('.hs-num[data-target], .stat-num[data-target]').forEach(el => {
    statObserver.observe(el);
  });

  // ══ SMOOTH SCROLL ══
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    });
  });

  // ══ DOCTOR FILTER ══
  const filterBtns = document.querySelectorAll('.fb');
  const docCards = document.querySelectorAll('.doc-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      docCards.forEach(card => {
        const categories = card.dataset.cat || '';
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => {
            card.classList.add('visible');
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });

  // ══ GALLERY LIGHTBOX (MOBILE-OPTIMIZED) ══
  document.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', function(e) {
      // Don't trigger if clicking on iframe
      if (e.target.tagName === 'IFRAME') return;
      
      const iframe = this.querySelector('iframe');
      const label = this.querySelector('.gal-label');
      
      if (!iframe) return;
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease;
        cursor: zoom-out;
        overflow-y: auto;
      `;
      
      // Add fade-in animation
      const style = document.createElement('style');
      style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
      document.head.appendChild(style);
      
      // Clone iframe for fullscreen
      const fullIframe = iframe.cloneNode(true);
      fullIframe.style.cssText = `
        width: min(90vw, 1200px);
        height: min(70vh, 800px);
        border-radius: 16px;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
        margin-bottom: 16px;
      `;
      
      // Caption
      const caption = document.createElement('div');
      caption.textContent = label ? label.textContent : '';
      caption.style.cssText = `
        font-size: 15px;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        font-family: inherit;
      `;
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        font-size: 18px;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 100000;
      `;
      
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1.1)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        closeBtn.style.transform = 'scale(1)';
      });
      
      overlay.appendChild(fullIframe);
      overlay.appendChild(caption);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      
      // Close handlers
      const closeOverlay = () => {
        if (document.body.contains(overlay)) {
          overlay.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(overlay);
          }, 200);
        }
        document.body.style.overflow = '';
        document.removeEventListener('keydown', keyHandler);
      };
      
      const keyHandler = (e) => {
        if (e.key === 'Escape') closeOverlay();
      };
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
      });
      
      closeBtn.addEventListener('click', closeOverlay);
      document.addEventListener('keydown', keyHandler);
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });

  // ══ PERFORMANCE: LAZY LOAD IFRAMES ══
  const lazyIframes = document.querySelectorAll('iframe[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const iframeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
          }
          iframeObserver.unobserve(iframe);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyIframes.forEach(iframe => iframeObserver.observe(iframe));
  }

  // ══ TOUCH OPTIMIZATION FOR MOBILE ══
  if (isMobile) {
    // Add touch-friendly classes
    document.body.classList.add('touch-device');
    
    // Improve click responsiveness
    document.addEventListener('touchstart', function() {}, { passive: true });
  }

  // ══ CONSOLE BRANDING ══
  console.log(
    '%c🏥 Aakash Hospitals',
    'color: #4a90ff; font-size: 20px; font-weight: bold; padding: 10px;'
  );
  console.log(
    '%cModern Healthcare · Kurnool · Andhra Pradesh',
    'color: #a8a8b8; font-size: 12px; padding: 10px;'
  );
  
  // ══ DETECT SLOW NETWORK ══
  if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      console.log('Slow network detected - optimizing animations');
      document.body.classList.add('reduced-motion');
    }
  }

  // ══ SERVICE WORKER REGISTRATION (OPTIONAL) ══
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker not available, continue normally
      });
    });
  }

})();
