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
  
  // Get saved theme or default to light (corporate)
  const savedTheme = localStorage.getItem('aakash-theme') || 'light';
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

  // ══ COUNTER ANIMATION (triggers on page load) ══
  function animateCounter(el, target, duration = 1800, delay = 0) {
    const isDecimal = el.dataset.decimal === '1' || target % 1 !== 0;
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      if (elapsed < delay) { requestAnimationFrame(update); return; }
      const adjusted = elapsed - delay;
      const progress = Math.min(adjusted / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      
      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }
      
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  
  // Start counters after hero animation delay
  function startHeroCounters() {
    document.querySelectorAll('.hsb-num[data-target], .hs-num[data-target]').forEach((el, i) => {
      const target = parseFloat(el.dataset.target);
      if (!isNaN(target)) {
        const duration = isMobile ? 1200 : 1800;
        const delay = 600 + (i * 150); // stagger after hero animations
        animateCounter(el, target, duration, delay);
      }
    });
  }
  startHeroCounters();

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

  // ══ DEPT CARD → DOCTOR FILTER ══
  document.querySelectorAll('.dept-card[data-dept-filter]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const filter = card.dataset.deptFilter;
      // Activate the matching filter button
      filterBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.filter === filter);
      });
      // Filter doctor cards
      applyFilter(filter);
      // Scroll to doctors section
      const doctorsSection = document.getElementById('doctors');
      if (doctorsSection) {
        doctorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  function applyFilter(filter) {
    docCards.forEach(card => {
      const categories = card.dataset.cat || '';
      const shouldShow = filter === 'all' || categories.includes(filter);
      if (shouldShow) {
        card.classList.remove('hidden');
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // ══ DOCTOR FILTER ══
  const filterBtns = document.querySelectorAll('.fb');
  const docCards = document.querySelectorAll('.doc-card');
  
  const isTouchCardMode = window.matchMedia('(max-width: 768px)').matches;
  
  function setDoctorCardState(card, expanded) {
    card.classList.toggle('is-expanded', expanded);
    card.classList.toggle('is-collapsed', !expanded);
    card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
  
  function collapseAllDoctorCards() {
    docCards.forEach(card => setDoctorCardState(card, false));
  }
  
  function initDoctorCardAccordion() {
    if (!isTouchCardMode) return;

    document.body.classList.add('touch-device');
    docCards.forEach(card => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-expanded', 'false');
      card.classList.add('is-collapsed');

      const toggleCard = () => {
        const shouldExpand = !card.classList.contains('is-expanded');
        collapseAllDoctorCards();
        setDoctorCardState(card, shouldExpand);
      };

      card.addEventListener('click', (e) => {
        if (!document.body.classList.contains('touch-device')) return;
        if (e.target.closest('.dc-tags a')) return;
        toggleCard();
      });

      card.addEventListener('keydown', (e) => {
        if (!document.body.classList.contains('touch-device')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });

    // Keep the first card expanded so the section starts readable, while still compact.
    if (docCards.length) {
      setDoctorCardState(docCards[0], true);
    }
  }
  
  initDoctorCardAccordion();
  
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
        
        if (isTouchCardMode) {
          setDoctorCardState(card, false);
        }
      });
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    document.body.classList.remove('touch-device');
    docCards.forEach(card => {
      card.removeAttribute('role');
      card.removeAttribute('tabindex');
      card.removeAttribute('aria-expanded');
      card.classList.remove('is-expanded', 'is-collapsed');
    });
  });

  // ══ MAP IMAGE CLICKS ══
  // Gallery items now use <a> tags to open Google Maps directly
  // No lightbox needed - links open in new tab

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
    'color: #1565C0; font-size: 20px; font-weight: bold; padding: 10px;'
  );
  console.log(
    '%cCorporate Healthcare · Kurnool · Andhra Pradesh',
    'color: #455A64; font-size: 12px; padding: 10px;'
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

  // ══ DOCTOR PHOTO AUTO-LOAD ══
  // Drop images into images/ folder with these exact names:
  //   dr-srihari.jpg       dr-santosh.jpg       dr-haritha.jpg
  //   dr-jaswanth.jpg      dr-ajay.jpg           dr-arshiya.jpg
  //   dr-sreedhar.jpg      dr-surendra.jpg       dr-praveen.jpg
  //   dr-siva.jpg          dr-naga.jpg           dr-madhavi.jpg
  //   dr-vamsi.jpg         dr-raviteja.jpg       dr-muthyasree.jpg
  //   dr-ravikumar.jpg     dr-roshan.jpg         dr-rambalaji.jpg
  //   dr-kakshaiah.jpg     dr-srilatha.jpg       dr-george.jpg
  //   dr-parvathi.jpg      dr-beesanna.jpg       dr-sushmitha.jpg
  //   dr-sreeja.jpg        dr-eswar.jpg          dr-sravan.jpg
  //   dr-madhavi-pt.jpg
  //
  // Website auto-shows photos when they exist. Missing = initials shown.

  function initDoctorPhotos() {
    document.querySelectorAll('.dc-photo, .poster-image img').forEach(img => {
      // Remove any inline onerror to avoid conflicts
      img.removeAttribute('onerror');

      function check() {
        const container = img.closest('.dc-avatar, .poster-image');
        if (!container) return;
        const fallback = container.querySelector('.dc-initials, .poster-placeholder');
        if (img.naturalWidth > 0 && img.complete) {
          img.style.display = '';
          if (fallback) fallback.style.display = 'none';
        } else {
          img.style.display = 'none';
          if (fallback) fallback.style.display = 'flex';
        }
      }

      if (img.complete) {
        check();
      } else {
        img.addEventListener('load', check);
        img.addEventListener('error', check);
      }
    });
  }

  // Run on DOM ready and also after a short delay for slow loads
  initDoctorPhotos();
  setTimeout(initDoctorPhotos, 1500);

  // ══ EMERGENCY BUTTON ══
  window.handleEmergency = function() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      window.location.href = 'tel:08518222107';
    } else {
      document.getElementById('emergencyPopup').classList.add('active');
    }
  };
  window.closeEmergency = function() {
    document.getElementById('emergencyPopup').classList.remove('active');
  };

  // ══ SHOW MORE: FACILITIES ══
  window.toggleFacilities = function() {
    const grid = document.querySelector('.fac-grid');
    const btn = document.querySelector('#facShowMore .show-more-btn');
    if (!grid || !btn) return;
    grid.classList.toggle('expanded');
    btn.classList.toggle('expanded');
    btn.querySelector('.sm-text').textContent = grid.classList.contains('expanded') ? 'Show Less' : 'Show All Facilities';
  };

  // ══ SHOW MORE: DEPARTMENTS ══
  window.toggleDepts = function() {
    const grid = document.querySelector('.dept-grid');
    const btn = document.querySelector('#deptShowMore .show-more-btn');
    if (!grid || !btn) return;
    grid.classList.toggle('expanded');
    btn.classList.toggle('expanded');
    btn.querySelector('.sm-text').textContent = grid.classList.contains('expanded') ? 'Show Less' : 'Show All Specialities';
  };

  // ══ SHOW MORE: DOCTORS ══
  window.toggleDoctors = function() {
    const grid = document.getElementById('doctorsGrid');
    const btn = document.getElementById('doctorsShowMoreBtn');
    if (!grid || !btn) return;
    grid.classList.toggle('expanded');
    btn.classList.toggle('expanded');
    btn.querySelector('.sm-text').textContent = grid.classList.contains('expanded') ? 'Show Less' : 'Show All Doctors';
  };

})();
