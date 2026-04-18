/**
 * Мастерская Вадима Дубинина — Landing Scripts
 * Анимации при скролле, мобильное меню, формы
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initConsultationForm();
  initAboutTimeline();
  initPortfolioViewer();
  initPortfolio();
});

/**
 * Анимации при скролле (Intersection Observer)
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Header: добавляет класс при скролле
 */
function initHeader() {
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // начальное состояние
}

/**
 * Мобильное меню
 */
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav .nav__link');

  const openMenu = () => {
    burger.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    burger.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Плавная прокрутка для якорных ссылок
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Обработка формы консультации (заглушка)
 */
function initConsultationForm() {
  const form = document.querySelector('.consultation__form');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Заглушка — в реальном проекте отправка на сервер
    console.log('Form submitted:', data);
    alert('Спасибо за заявку! Мы свяжемся с вами в течение дня.');
    form.reset();
  });
}

/**
 * About: вертикальная линия с точками и фото
 */
function initAboutTimeline() {
  const timeline = document.querySelector('.about__timeline[data-about-timeline]');
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll('.about__timeline-item'));
  if (!items.length) return;

  const mediaImg = timeline.querySelector('.about__timeline-img');
  const sources = {
    1: 'images/img-01.jpg',
    2: 'images/img-02.jpg',
    3: 'images/img-03.jpg',
    4: 'images/img-04.jpg'
  };

  const TRANSITION_MS = 500;
  let pendingSwap = null;

  const setActive = (step) => {
    items.forEach(btn => btn.classList.toggle('is-active', btn.dataset.aboutStep === String(step)));

    if (mediaImg) {
      const nextSrc = sources[step] || sources[1];
      mediaImg.classList.remove('is-visible');

      if (pendingSwap) {
        window.clearTimeout(pendingSwap);
        pendingSwap = null;
      }

      pendingSwap = window.setTimeout(() => {
        if (mediaImg.getAttribute('src') !== nextSrc) {
          mediaImg.setAttribute('src', nextSrc);
        }
        window.requestAnimationFrame(() => mediaImg.classList.add('is-visible'));
        pendingSwap = null;
      }, TRANSITION_MS);
    }
  };

  items.forEach(btn => {
    const step = Number(btn.dataset.aboutStep);

    btn.addEventListener('click', () => {
      setActive(step);
    });
  });

  setActive(1);
  if (mediaImg) mediaImg.classList.add('is-visible');
}

function initPortfolioViewer() {
  const covers = document.querySelectorAll('.portfolio__cover');
  const groups = document.querySelectorAll('.portfolio-viewer__group');
  const viewer = document.querySelector('#portfolio-viewer');

  if (!covers.length || !groups.length || !viewer) return;

  const scrollToViewerTop = () => {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const topGutter = 20;
    const y =
      viewer.getBoundingClientRect().top + window.scrollY - headerHeight - topGutter;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  };

  const setActiveGroup = (category) => {
    covers.forEach((cover) => {
      const isActive = cover.dataset.portfolioCategory === category;
      cover.classList.toggle('is-active', isActive);
      cover.setAttribute('aria-pressed', String(isActive));
    });

    groups.forEach((group) => {
      const isActive = group.dataset.portfolioGroup === category;
      group.classList.toggle('is-active', isActive);
      group.style.opacity = isActive ? '1' : '0';
    });
  };

  covers.forEach((cover) => {
    cover.addEventListener('click', () => {
      const category = cover.dataset.portfolioCategory;
      setActiveGroup(category);
      scrollToViewerTop();
    });
  });
}

/**
 * Портфолио: lightbox по карточкам проектов
 */
function initPortfolio() {
  const viewer = document.getElementById('portfolio-viewer');
  const items = viewer
    ? viewer.querySelectorAll('.portfolio__item[data-image]')
    : document.querySelectorAll('.portfolio-viewer .portfolio__item[data-image]');
  const lightbox = document.getElementById('portfolio-lightbox');
  const lbImg = document.getElementById('portfolio-lightbox-img');
  const lbTitle = lightbox?.querySelector('.portfolio__lightbox-title');
  const lbCity = lightbox?.querySelector('.portfolio__lightbox-city');
  const lbLead = lightbox?.querySelector('.portfolio__lightbox-lead');

  if (!lightbox || !lbImg || !lbTitle || !lbCity || !lbLead) return;

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const openLightbox = (item) => {
    const src = item.getAttribute('data-image');
    if (!src) return;

    const meta = item.querySelector('.portfolio__meta');
    const titleEl = meta?.querySelector('h4') || item.querySelector('.portfolio__meta-title');
    const cityEl = meta?.querySelector('p') || item.querySelector('.portfolio__meta-city');
    const leadEl = meta?.querySelector('span') || item.querySelector('.portfolio__meta-lead');

    lbImg.src = src;
    lbImg.alt = titleEl ? titleEl.textContent.trim() : '';
    lbTitle.textContent = titleEl ? titleEl.textContent.trim() : '';
    lbCity.textContent = cityEl ? cityEl.textContent.trim() : '';
    lbLead.textContent = leadEl ? leadEl.textContent.trim() : '';

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      openLightbox(item);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  lightbox.querySelectorAll('[data-portfolio-lightbox-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
