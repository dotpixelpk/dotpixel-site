/**
 * Form handler — supports both email (Formspree) and WhatsApp delivery
 *
 * SETUP:
 * 1. Sign up at formspree.io, create a form, copy the endpoint URL
 * 2. Paste it into data/settings.json under "formspree_endpoint"
 * 3. Make sure data/settings.json "whatsapp_number" is your real number (international format, no +)
 */

function buildFormPayload() {
  const form = document.getElementById('contactForm');
  if (!form) return null;
  const data = new FormData(form);
  return {
    name: data.get('name')?.trim() || '',
    company: data.get('company')?.trim() || '',
    email: data.get('email')?.trim() || '',
    phone: data.get('phone')?.trim() || '',
    product: data.get('product') || '',
    quantity: data.get('quantity')?.trim() || '',
    message: data.get('message')?.trim() || ''
  };
}

function validatePayload(p) {
  if (!p.name) return 'Please enter your name.';
  if (!p.email) return 'Please enter your email.';
  if (!p.product) return 'Please select a product type.';
  if (!p.message) return 'Please add some project details.';
  // Basic email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return 'Please enter a valid email address.';
  return null;
}

function showStatus(message, type) {
  const status = document.getElementById('formStatus');
  if (!status) return;
  status.className = 'form-status ' + type;
  status.textContent = message;
}

function formatWhatsAppMessage(p) {
  return (
    `*New Inquiry from Website*\n\n` +
    `*Name:* ${p.name}\n` +
    (p.company ? `*Company:* ${p.company}\n` : '') +
    `*Email:* ${p.email}\n` +
    (p.phone ? `*Phone:* ${p.phone}\n` : '') +
    `*Product:* ${p.product}\n` +
    (p.quantity ? `*Quantity:* ${p.quantity}\n` : '') +
    `\n*Project Details:*\n${p.message}`
  );
}

// ─── EMAIL HANDLER (via Formspree) ────────────────────────────
async function sendEmail(e) {
  e.preventDefault();
  const payload = buildFormPayload();
  if (!payload) return;

  const err = validatePayload(payload);
  if (err) { showStatus(err, 'error'); return; }

  const endpoint = window.SITE?.settings?.formspree_endpoint;

  // Fallback to mailto: if Formspree not configured yet
  if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
    const email = window.SITE?.settings?.email || 'info@dotpixel.pk';
    const subject = encodeURIComponent(`Inquiry: ${payload.product}`);
    const body = encodeURIComponent(
      `Name: ${payload.name}\n` +
      `Company: ${payload.company || '-'}\n` +
      `Email: ${payload.email}\n` +
      `Phone: ${payload.phone || '-'}\n` +
      `Product: ${payload.product}\n` +
      `Quantity: ${payload.quantity || '-'}\n\n` +
      `Details:\n${payload.message}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    showStatus('Opening your email app... If nothing happens, please email us directly.', 'success');
    return;
  }

  showStatus('Sending...', 'success');

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      document.getElementById('contactForm').reset();
      showStatus('✓ Thanks! We\'ll get back to you within one business day.', 'success');
    } else {
      throw new Error('Submission failed');
    }
  } catch {
    showStatus('Something went wrong. Please try WhatsApp or email us directly.', 'error');
  }
}

// ─── WHATSAPP HANDLER ────────────────────────────────────────
function sendWhatsApp(e) {
  e.preventDefault();
  const payload = buildFormPayload();
  if (!payload) return;

  const err = validatePayload(payload);
  if (err) { showStatus(err, 'error'); return; }

  const number = window.SITE?.settings?.whatsapp_number;
  if (!number || number.includes('XXX')) {
    showStatus('WhatsApp not configured yet. Please use email instead.', 'error');
    return;
  }

  const text = encodeURIComponent(formatWhatsAppMessage(payload));
  const url = `https://wa.me/${number}?text=${text}`;

  // Expose SITE on window for the form to access
  window.open(url, '_blank');
  showStatus('Opening WhatsApp... Send the pre-filled message to complete your inquiry.', 'success');
}

// ─── ATTACH HANDLERS ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Expose SITE config to window once content loader finishes
  const checkSite = setInterval(() => {
    if (window.SITE !== undefined) {
      clearInterval(checkSite);
    }
  }, 100);

  document.getElementById('btnSendEmail')?.addEventListener('click', sendEmail);
  document.getElementById('btnSendWhatsApp')?.addEventListener('click', sendWhatsApp);

  // Submit on Enter goes to email by default
  document.getElementById('contactForm')?.addEventListener('submit', sendEmail);
});

// SITE is set on window.SITE by content-loader.js
