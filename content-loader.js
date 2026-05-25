/**
 * Content Loader
 * Fetches all JSON content files and renders them into the page.
 * This is what makes the site dynamic — change a JSON file, the site updates.
 */

const SITE = { settings: null, slides: null, products: null, about: null };
window.SITE = SITE;

async function loadJSON(path) {
  try {
    const res = await fetch(path + '?v=' + Date.now()); // cache-bust
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  } catch (err) {
    console.error('JSON load error:', err);
    return null;
  }
}

async function loadAllContent() {
  const [settings, slides, products, about] = await Promise.all([
    loadJSON('/data/settings.json'),
    loadJSON('/data/slides.json'),
    loadJSON('/data/products.json'),
    loadJSON('/data/about.json')
  ]);

  SITE.settings = settings;
  SITE.slides = slides;
  SITE.products = products;
  SITE.about = about;

  renderSettings();
  renderSlides();
  renderAbout();
  renderProducts();

  // After slides render, initialize the slideshow
  if (window.initSlideshow) window.initSlideshow();
}

function renderSettings() {
  if (!SITE.settings) return;
  const s = SITE.settings;

  // Contact info
  document.querySelectorAll('[data-phone]').forEach(el => {
    el.textContent = s.phone_display;
    if (el.tagName === 'A') el.href = `tel:${s.phone_link}`;
  });

  document.querySelectorAll('[data-email]').forEach(el => {
    el.textContent = s.email;
    if (el.tagName === 'A') el.href = `mailto:${s.email}`;
  });

  document.querySelectorAll('[data-address]').forEach(el => {
    el.textContent = s.address;
  });

  document.querySelectorAll('[data-hours]').forEach(el => {
    el.textContent = s.hours;
  });

  // WhatsApp float button
  const waFloat = document.getElementById('whatsappFloat');
  if (waFloat) {
    const msg = encodeURIComponent(s.whatsapp_default_message);
    waFloat.href = `https://wa.me/${s.whatsapp_number}?text=${msg}`;
  }

  // Stats
  const statsContainer = document.getElementById('heroStats');
  if (statsContainer && s.stats) {
    statsContainer.innerHTML = s.stats.map(stat => `
      <div>
        <div class="stat-num">${stat.number}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');
  }
}

function renderSlides() {
  if (!SITE.slides || !SITE.slides.slides.length) return;

  const container = document.getElementById('slideshow');
  const dotsContainer = document.getElementById('slideDots');
  if (!container) return;

  container.innerHTML = SITE.slides.slides.map((slide, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
      <div class="slide-fallback"></div>
      ${slide.image ? `<div class="slide-image" style="background-image: url('${slide.image}')"></div>` : ''}
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <div class="slide-inner">
          <div class="slide-eyebrow">Graphics ADD · Est. since 2010</div>
          <h1 class="slide-title">${slide.title}</h1>
          <p class="slide-subtitle">${slide.subtitle}</p>
          <div class="slide-cta-row">
            <a href="${slide.cta_link}" class="btn btn-primary">
              ${slide.cta_text}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <a href="#products" class="btn btn-secondary">View Products</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Handle image load errors — hide broken image, show gradient fallback
  container.querySelectorAll('.slide-image').forEach(div => {
    const url = div.style.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (url) {
      const img = new Image();
      img.onerror = () => { div.style.display = 'none'; };
      img.src = url[1];
    }
  });

  if (dotsContainer) {
    dotsContainer.innerHTML = SITE.slides.slides.map((_, i) => `
      <button class="slide-dot ${i === 0 ? 'active' : ''}" data-dot="${i}" aria-label="Slide ${i + 1}"></button>
    `).join('');
  }
}

function renderAbout() {
  if (!SITE.about) return;
  const a = SITE.about;

  const eyebrow = document.querySelector('[data-about-eyebrow]');
  const heading = document.querySelector('[data-about-heading]');
  const p1 = document.querySelector('[data-about-p1]');
  const p2 = document.querySelector('[data-about-p2]');
  const pointsContainer = document.querySelector('[data-about-points]');
  const quote = document.querySelector('[data-about-quote]');

  if (eyebrow) eyebrow.textContent = a.eyebrow;
  if (heading) heading.innerHTML = a.heading;
  if (p1) p1.textContent = a.paragraph_1;
  if (p2) p2.textContent = a.paragraph_2;
  if (quote) quote.textContent = a.quote;

  if (pointsContainer && a.points) {
    pointsContainer.innerHTML = a.points.map(point => {
      // Split on first em-dash for bold + description format
      const parts = point.split(' — ');
      const bold = parts[0];
      const rest = parts.slice(1).join(' — ');
      return `<li><span class="check">✓</span> <span>${rest ? `<strong>${bold}</strong> — ${rest}` : bold}</span></li>`;
    }).join('');
  }
}

function renderProducts() {
  if (!SITE.products || !SITE.products.products) return;

  const container = document.getElementById('productsGrid');
  if (!container) return;

  const sorted = [...SITE.products.products].sort((a, b) => (a.order || 999) - (b.order || 999));

  container.innerHTML = sorted.map(product => {
    const initial = product.name.charAt(0).toLowerCase();
    return `
      <div class="product-card">
        <div class="product-image" style="${product.image ? `background-image: url('${product.image}')` : ''}">
          ${!product.image ? `<div class="product-image-placeholder">${initial}</div>` : ''}
        </div>
        <div class="product-body">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Handle broken images — fall back to initial placeholder
  container.querySelectorAll('.product-image').forEach(div => {
    const bg = div.style.backgroundImage;
    if (!bg) return;
    const url = bg.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (url) {
      const img = new Image();
      img.onerror = () => {
        div.style.backgroundImage = 'none';
        if (!div.querySelector('.product-image-placeholder')) {
          const card = div.closest('.product-card');
          const name = card.querySelector('h3').textContent;
          div.innerHTML = `<div class="product-image-placeholder">${name.charAt(0).toLowerCase()}</div>`;
        }
      };
      img.src = url[1];
    }
  });
}

// Boot
document.addEventListener('DOMContentLoaded', loadAllContent);
