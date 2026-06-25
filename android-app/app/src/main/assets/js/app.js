/* =============================================
   FOOD ZONE — Main JavaScript
   ============================================= */

// ── URL-based Database Reset Helper ──
(function checkResetParam() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === 'true') {
    // Clear EVERYTHING including the initialized flag so we get a truly blank slate
    localStorage.clear();
    // Mark as 'reset' so seedDatabase() knows NOT to re-seed mock cooks
    localStorage.setItem('fz_db_initialized', 'reset');
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    window.location.reload();
  }
})();

// ── Database Seeding Logic ──
(function seedDatabase() {
  const initState = localStorage.getItem('fz_db_initialized');
  // 'reset' = user explicitly cleared DB → stay empty
  // 'true'  = already seeded on first run → skip
  if (initState) return;

  const DB_KEY = 'fz_users';
  let users = [];
  try { users = JSON.parse(localStorage.getItem(DB_KEY)) || []; } catch(e) {}

  // Hash password function matching login.html hashPassword
  function hashPassword(pw) {
    let hash = 0;
    for (let i = 0; i < pw.length; i++) {
      hash = ((hash << 5) - hash) + pw.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }

  // Seed Demo User
  const demoExists = users.some(u => u.email === 'demo@foodzone.eu');
  if (!demoExists) {
    users.push({
      id: 'demo_001',
      name: 'Demo User',
      email: 'demo@foodzone.eu',
      password: hashPassword('demo1234'),
      avatar: 'DU',
      type: 'buyer',
      createdAt: new Date().toISOString()
    });
  }

  // Seed Mock Cooks
  const INITIAL_COOKS = [
    {
      id: 'ms', name: 'Maria Sanchez', email: 'maria@foodzone.eu', avatar: 'MS',
      city: 'Madrid', country: 'ES', type: 'seller', cookType: 'business',
      rating: 4.9, reviews: 287, dish: 'Paella Valenciana', price: '€14', prep: '45 min',
      open: true, color: '#FF6B35', color2: '#FF3366',
      bio: "Hi! I'm Maria, born and raised in Madrid, Spain. Cooking has been my passion since I was a child watching my grandmother prepare traditional Spanish dishes in her tiny kitchen. I specialize in authentic Iberian cuisine.",
      cuisines: ['Spanish', 'Mediterranean'], latOff: 0.008, lngOff: -0.012
    },
    {
      id: 'yt', name: 'Yuki Tanaka', email: 'yuki@foodzone.eu', avatar: 'YT',
      city: 'Amsterdam', country: 'NL', type: 'seller', cookType: 'hobby',
      rating: 4.8, reviews: 143, dish: 'Ramen Bowl', price: '€11', prep: '30 min',
      open: true, color: '#00b4d8', color2: '#0077b6',
      bio: "Hi! I'm Yuki, from Tokyo and now living in Amsterdam. I bring the authentic tastes of Japanese home cooking to your table, from slow-simmered tonkotsu ramen to hand-rolled sushi.",
      cuisines: ['Japanese'], latOff: -0.014, lngOff: 0.018
    },
    {
      id: 'fa', name: 'Fatima Al-Hassan', email: 'fatima@foodzone.eu', avatar: 'FA',
      city: 'Paris', country: 'FR', type: 'seller', cookType: 'business',
      rating: 4.9, reviews: 412, dish: 'Lamb Tagine', price: '€16', prep: '55 min',
      open: false, color: '#c77dff', color2: '#7b2d8b',
      bio: "Passionate cook specializing in Lebanese and Moroccan traditional cuisine. I prepare authentic tagines, couscous, hummuses, and fresh baklavas using family recipes passed down through generations.",
      cuisines: ['Middle Eastern'], latOff: 0.022, lngOff: 0.009
    },
    {
      id: 'km', name: 'Klaus Mueller', email: 'klaus@foodzone.eu', avatar: 'KM',
      city: 'Berlin', country: 'DE', type: 'seller', cookType: 'hobby',
      rating: 4.7, reviews: 98, dish: 'Schnitzel & Spätzle', price: '€13', prep: '60 min',
      open: true, color: '#e63946', color2: '#8b0000',
      bio: "Servus! I prepare hearty German and Bavarian dishes right here in Berlin. Try my fresh handmade spaetzle, crispy schnitzel, and traditional red cabbage.",
      cuisines: ['German', 'Bavarian'], latOff: -0.005, lngOff: -0.025
    },
    {
      id: 'sr', name: 'Sofia Romano', email: 'sofia@foodzone.eu', avatar: 'SR',
      city: 'Rome', country: 'IT', type: 'seller', cookType: 'business',
      rating: 4.9, reviews: 356, dish: 'Tagliatelle Ragù', price: '€12', prep: '35 min',
      open: true, color: '#06d6a0', color2: '#1b4332',
      bio: "Benvenuti! I am a Roman cook sharing the simple, fresh, and delicious tastes of Italian pasta and homemade sauces. Everything is freshly made from high-quality durum wheat semolina.",
      cuisines: ['Italian'], latOff: 0.017, lngOff: -0.006
    },
    {
      id: 'ak', name: 'Anna Kowalski', email: 'anna@foodzone.eu', avatar: 'AK',
      city: 'Warsaw', country: 'PL', type: 'seller', cookType: 'hobby',
      rating: 4.8, reviews: 201, dish: 'Pierogi Mix', price: '€10', prep: '30 min',
      open: true, color: '#f4d03f', color2: '#e67e22',
      bio: "Witamy! Try my handmade Polish pierogi, filled with traditional ingredients like potato and cheese, meat, or wild mushrooms. Cooked fresh every day.",
      cuisines: ['Polish'], latOff: -0.019, lngOff: 0.028
    }
  ];

  INITIAL_COOKS.forEach(cook => {
    if (!users.some(u => u.id === cook.id || u.email === cook.email)) {
      users.push(cook);
    }
  });

  localStorage.setItem(DB_KEY, JSON.stringify(users));
  localStorage.setItem('fz_db_initialized', 'true');
})();

// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar, nav');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10,10,15,0.97)';
      navbar.style.backdropFilter = 'blur(24px)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
      navbar.style.background = 'rgba(10,10,15,0.8)';
      navbar.style.backdropFilter = 'blur(20px)';
      navbar.style.boxShadow = 'none';
    }
  });
}

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
  });
}

// ── Category tag filter ──
document.querySelectorAll('.category-tag, .tag').forEach(tag => {
  tag.addEventListener('click', function() {
    document.querySelectorAll('.category-tag, .tag').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    // Trigger custom category change callback if defined
    if (typeof window.onCategoryChanged === 'function') {
      window.onCategoryChanged(this.dataset.category || this.textContent.trim());
    }
  });
});

// ── Toast notification system ──
function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.fz-toast');
  if (existing) existing.remove();

  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  const toast = document.createElement('div');
  toast.className = 'fz-toast';
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;
    background:#1A1A24;border:1px solid rgba(255,255,255,0.1);
    border-radius:14px;padding:14px 18px;
    display:flex;align-items:center;gap:10px;
    z-index:9999;box-shadow:0 8px 40px rgba(0,0,0,0.5);
    transform:translateY(80px);opacity:0;
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    max-width:320px;font-size:0.9rem;font-family:'Inter',sans-serif;color:#fff;
  `;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Modal system ──
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ── Tab switching ──
function switchTab(tabName, clickedEl) {
  document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
  const target = document.querySelector('[data-tab="' + tabName + '"]');
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (clickedEl) clickedEl.classList.add('active');
}

// ── Cart state (localStorage) ──
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem('fz_cart') || '{"items":[],"cook":null}'); } catch(e) { return {items:[],cook:null}; } },
  save(cart) { localStorage.setItem('fz_cart', JSON.stringify(cart)); },
  addItem(item) {
    const cart = this.get();
    if (cart.cook && cart.cook !== item.cookId) {
      if (!confirm('You have items from another cook. Clear cart and start new order?')) return false;
      cart.items = [];
    }
    cart.cook = item.cookId;
    const existing = cart.items.find(i => i.id === item.id);
    if (existing) { existing.qty += 1; }
    else { cart.items.push({...item, qty: 1}); }
    this.save(cart);
    this.updateBadge();
    return true;
  },
  removeItem(id) {
    const cart = this.get();
    cart.items = cart.items.filter(i => i.id !== id);
    if (cart.items.length === 0) cart.cook = null;
    this.save(cart);
    this.updateBadge();
  },
  getCount() { return this.get().items.reduce((s, i) => s + i.qty, 0); },
  getTotal() { return this.get().items.reduce((s, i) => s + i.price * i.qty, 0); },
  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.cart-badge, #cartBadge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
    const stickyBar = document.getElementById('stickyCartBar');
    if (stickyBar) {
      stickyBar.style.display = count > 0 ? 'flex' : 'none';
      const totalEl = document.getElementById('cartTotal');
      if (totalEl) totalEl.textContent = '€' + this.getTotal().toFixed(2);
      const countEl = document.getElementById('cartCount');
      if (countEl) countEl.textContent = count + ' item' + (count > 1 ? 's' : '');
    }
  },
  clear() { this.save({items:[],cook:null}); this.updateBadge(); }
};

// Init badge on load
Cart.updateBadge();

// ── Add to cart button handler ──
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('[data-product]') || this.closest('.product-card');
    if (!card) return;
    const item = {
      id: card.dataset.productId || Math.random().toString(36).slice(2),
      name: card.dataset.productName || card.querySelector('.product-name')?.textContent || 'Item',
      price: parseFloat(card.dataset.productPrice) || 0,
      cookId: card.dataset.cookId || 'ms',
      emoji: card.dataset.productEmoji || '🍽️'
    };
    if (Cart.addItem(item)) {
      this.textContent = '✓ Added!';
      this.style.background = 'linear-gradient(135deg,#00D68F,#00A36C)';
      setTimeout(() => {
        this.textContent = '+ Add to Cart';
        this.style.background = '';
      }, 1500);
      showToast(item.name + ' added to cart!', 'success');
    }
  });
});

// ── Heart/Wishlist ──
document.querySelectorAll('.heart-btn, .wishlist-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const isLiked = this.dataset.liked === 'true';
    this.dataset.liked = !isLiked;
    this.textContent = isLiked ? '🤍' : '❤️';
    this.style.transform = 'scale(1.3)';
    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
    showToast(isLiked ? 'Removed from favorites' : 'Added to favorites!', isLiked ? 'info' : 'success', 2000);
  });
});

// ── Ad carousel auto-slide ──
const carousel = document.getElementById('adCarousel');
const carouselDots = document.querySelectorAll('.carousel-dot');
if (carousel) {
  let currentSlide = 0;
  const slides = carousel.querySelectorAll('.ad-slide');
  function goToSlide(n) {
    slides.forEach((s, i) => {
      s.style.display = i === n ? 'flex' : 'none';
    });
    carouselDots.forEach((d, i) => {
      d.classList.toggle('active', i === n);
    });
    currentSlide = n;
  }
  if (slides.length > 0) {
    goToSlide(0);
    setInterval(() => goToSlide((currentSlide + 1) % slides.length), 3500);
    carouselDots.forEach((dot, i) => { dot.addEventListener('click', () => goToSlide(i)); });
  }
}

// ── Animate on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ── Registration multi-step form ──
const regForm = document.getElementById('regForm');
if (regForm) {
  let currentStep = 1;
  let userType = null;
  let cookType = null;

  function updateProgress() {
    const total = document.querySelectorAll('.step').length;
    const progress = document.getElementById('regProgress');
    const progressText = document.getElementById('progressText');
    if (progress) progress.style.width = ((currentStep / total) * 100) + '%';
    if (progressText) progressText.textContent = 'Step ' + currentStep + ' of ' + total;
    document.querySelectorAll('.step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === currentStep);
    });
  }

  function nextStep() {
    const steps = document.querySelectorAll('.step');
    if (currentStep < steps.length) {
      currentStep++;
      updateProgress();
    }
  }
  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateProgress();
    }
  }

  window.nextStep = nextStep;
  window.prevStep = prevStep;

  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      userType = this.dataset.type;
    });
  });

  updateProgress();
}

// ── Form validation helper ──
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#FF3366';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return valid;
}

// ── Map pin popup ──
document.querySelectorAll('.cook-pin').forEach(pin => {
  pin.addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelectorAll('.pin-popup').forEach(p => p.classList.remove('show'));
    const popupId = this.dataset.popup;
    if (popupId) {
      const popup = document.getElementById(popupId);
      if (popup) popup.classList.add('show');
    }
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.pin-popup').forEach(p => p.classList.remove('show'));
});

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
    document.querySelectorAll('.pin-popup').forEach(p => p.classList.remove('show'));
  }
});

// ── Smooth hover card lift ──
document.querySelectorAll('.cook-card-home, .card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease';
  });
});

// ── Global Auth Header State Manager ──
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hook events for login / signup elements if they are static buttons
  document.querySelectorAll('button, a').forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    const id = el.id ? el.id.toLowerCase() : '';
    const className = el.className ? el.className.toLowerCase() : '';

    if (text === 'login' || text === 'log in' || id === 'navloginbtn' || id === 'mobileloginbtn' || className.includes('btn-login') || className.includes('btn-nav-login')) {
      if (el.tagName === 'A') {
        el.setAttribute('href', 'login.html');
      } else {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'login.html';
        });
      }
    }

    if (text === 'sign up' || text === 'sign up free' || id === 'navsignupbtn' || id === 'mobilesignupbtn' || className.includes('btn-signup') || className.includes('btn-nav-signup')) {
      if (el.tagName === 'A') {
        // Only override if not already pointing to a registration URL with params
        if (!el.getAttribute('href') || !el.getAttribute('href').includes('register.html?')) {
          el.setAttribute('href', 'register.html');
        }
      } else {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'register.html';
        });
      }
    }
  });

  // 2. Dynamic header check for active session
  const session = JSON.parse(localStorage.getItem('fz_session'));
  if (session) {
    const authContainers = [
      document.querySelector('.navbar-right'),
      document.querySelector('.nav-actions'),
      document.querySelector('.nav-right'),
    ];

    authContainers.forEach(container => {
      if (!container) return;

      container.querySelectorAll('button, a').forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        const id = el.id ? el.id.toLowerCase() : '';
        const className = el.className ? el.className.toLowerCase() : '';
        if (
          text === 'login' || text === 'log in' || text === 'sign up' || text === 'sign up free' ||
          id.includes('login') || id.includes('signup') ||
          className.includes('login') || className.includes('signup') || className.includes('nav-btn')
        ) {
          el.remove();
        }
      });

      const profileLink = document.createElement('a');
      profileLink.href = 'profile.html?my_profile=true&t=' + Date.now();
      profileLink.className = 'btn btn-primary btn-sm';
      profileLink.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;background:linear-gradient(135deg, #FF6B35, #FF3366);color:#fff;font-weight:600;font-size:0.85rem;margin-right:8px;text-decoration:none;';
      profileLink.innerHTML = `<span style="width:20px;height:20px;background:#fff;color:#FF6B35;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:bold">${session.avatar}</span> ${session.name}`;

      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-ghost btn-sm';
      logoutBtn.style.cssText = 'padding:8px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.8);font-weight:600;font-size:0.85rem;cursor:pointer;';
      logoutBtn.textContent = 'Logout';
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('fz_session');
        window.location.reload();
      });

      const hamburger = container.querySelector('.hamburger, #hamburgerBtn');
      if (hamburger) {
        container.insertBefore(profileLink, hamburger);
        container.insertBefore(logoutBtn, hamburger);
      } else {
        container.appendChild(profileLink);
        container.appendChild(logoutBtn);
      }
    });

    const mobileMenuBtns = document.querySelector('.mobile-menu-btns, .mobile-menu-actions');
    if (mobileMenuBtns) {
      mobileMenuBtns.innerHTML = '';
      
      const profileLink = document.createElement('a');
      profileLink.href = 'profile.html?my_profile=true&t=' + Date.now();
      profileLink.className = 'btn btn-primary btn-sm';
      profileLink.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:10px;background:linear-gradient(135deg, #FF6B35, #FF3366);color:#fff;font-weight:600;width:100%;margin-bottom:10px;text-decoration:none;';
      profileLink.innerHTML = `<span style="width:20px;height:20px;background:#fff;color:#FF6B35;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:bold">${session.avatar}</span> ${session.name}`;

      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-ghost btn-sm';
      logoutBtn.style.cssText = 'padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.8);font-weight:600;width:100%;cursor:pointer;';
      logoutBtn.textContent = 'Logout';
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('fz_session');
        window.location.reload();
      });

      mobileMenuBtns.appendChild(profileLink);
      mobileMenuBtns.appendChild(logoutBtn);
    }
  }
});

console.log('%c🔥 Food Zone — Pan-European Home Food Marketplace', 'font-size:14px;font-weight:bold;color:#FF6B35;background:#0A0A0F;padding:8px 12px;border-radius:6px;');
console.log('%cAll systems operational ✓', 'color:#00D68F;font-size:11px;');