const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  mainNav.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  mainNav.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('select[name="service"]');
    const wanted = link.dataset.service;
    if (!select) return;
    const option = [...select.options].find(item => item.value === wanted || item.textContent.trim() === wanted);
    if (option) select.value = option.value;
    else if (wanted === 'Haircut & Styling') select.value = 'Haircut & Styling';
    else if (wanted === 'Skin Care & Facials') select.value = 'Skin Care & Facials';
    else if (wanted === 'Bridal & Makeup') select.value = 'Bridal & Makeup';
    else if (wanted === 'Nails & Manicure') select.value = 'Nails & Manicure';
    else if (wanted === 'Waxing & Threading') select.value = 'Waxing & Threading';
    else if (wanted === 'Shaving & Grooming') select.value = 'Shaving & Grooming';
    else if (wanted === 'Hair & Scalp Care') select.value = 'Hair & Scalp Care';
  });
});

// The enquiry is handed to WhatsApp; this static website does not store or submit bookings.
const bookingForm = document.querySelector('#booking-form');
const statusMessage = document.querySelector('#form-status');
const salonWhatsApp = '919598080090';

bookingForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const data = new FormData(bookingForm);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const service = String(data.get('service') || '').trim();
  const date = String(data.get('date') || '').trim();
  const message = String(data.get('message') || '').trim();
  const formattedDate = date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not specified';
  const text = [
    'Hello Glamz Studio Unisex Salon! I would like to enquire about an appointment.',
    '',
    `Name: ${name}`,
    `My phone: ${phone}`,
    `Service: ${service}`,
    `Preferred date: ${formattedDate}`,
    `Additional details: ${message || 'None'}`,
    '',
    'Please let me know the available time and price. Thank you!'
  ].join('\n');
  const url = `https://wa.me/${salonWhatsApp}?text=${encodeURIComponent(text)}`;
  statusMessage.textContent = 'Opening WhatsApp with your enquiry. Please send the message there to contact the salon.';
  window.open(url, '_blank', 'noopener,noreferrer');
});

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const lightbox = document.querySelector('#lightbox');
    const image = lightbox.querySelector('img');
    image.src = item.dataset.full;
    image.alt = item.querySelector('img')?.alt || 'Salon gallery image';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  });
});

const lightbox = document.querySelector('#lightbox');
function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.hidden = true;
  lightbox.querySelector('img').src = '';
  document.body.style.overflow = '';
}
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeLightbox(); closeMenu(); } });

const backTop = document.querySelector('#back-top');
window.addEventListener('scroll', () => backTop?.classList.toggle('visible', window.scrollY > 500), { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelector('#year').textContent = new Date().getFullYear();

// Prevent choosing a past date in the appointment enquiry form.
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateInput.min = localToday;
}
