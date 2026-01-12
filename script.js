// slider amélioré : pause au hover, reset timer, nav clavier, Enter ouvre lien
let index = 0;
const slides = Array.from(document.querySelectorAll('.slide'));
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const container = document.querySelector('.slider-container');

// sécurité
if (!slides.length) throw new Error("Aucune slide trouvée.");
if (!nextBtn || !prevBtn) console.warn("Boutons next/prev non trouvés.");

// rendre les slides focusables et ajouter aria
slides.forEach((s, i) => {
  s.setAttribute('tabindex', '0');              // focusable
  s.setAttribute('role', 'link');               // indique que c'est cliquable
  s.setAttribute('aria-label', `Slide ${i + 1}`); 
});

// affiche la slide i
function showSlide(i) {
  slides.forEach((s, idx) => {
    s.classList.toggle('active', idx === i);
  });
  index = i;
}

// suivant / précédent
function nextSlide() {
  showSlide((index + 1) % slides.length);
}

function prevSlide() {
  showSlide((index - 1 + slides.length) % slides.length);
}

// timers auto + helpers
let autoId = null;
const AUTO_DELAY = 3000;

function startAuto() {
  stopAuto();
  autoId = setInterval(nextSlide, AUTO_DELAY);
}

function stopAuto() {
  if (autoId) {
    clearInterval(autoId);
    autoId = null;
  }
}

function resetAuto() {
  startAuto();
}

// events boutons (protège si manquant)
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAuto(); });

// clic sur la slide : ouvre le lien si c'est un <a> ou data-link
slides.forEach((slide, i) => {
  slide.addEventListener('click', (e) => {
    // si la slide est un <a>, laisse le navigateur gérer le href
    if (slide.tagName.toLowerCase() === 'a') return;
    // sinon, regarde data-link
    const link = slide.dataset.link;
    if (link) window.open(link, '_blank');
  });

  // clavier : Entrée ouvre le lien / flèches naviguent
  slide.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (slide.tagName.toLowerCase() === 'a') {
        // simuler le click pour suivre href
        slide.click();
      } else if (slide.dataset.link) {
        window.open(slide.dataset.link, '_blank');
      }
    }
    if (e.key === 'ArrowRight') { nextSlide(); resetAuto(); }
    if (e.key === 'ArrowLeft')  { prevSlide(); resetAuto(); }
  });
});

// pause au survol du container
if (container) {
  container.addEventListener('mouseenter', stopAuto);
  container.addEventListener('mouseleave', startAuto);
}

// démarrage
showSlide(0);
startAuto();
