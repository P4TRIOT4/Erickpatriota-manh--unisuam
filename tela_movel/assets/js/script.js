// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'linear-gradient(135deg, #CC5500 0%, #FF6A00 50%, #CC4400 100%)';
    navbar.style.boxShadow = '0 4px 30px rgba(255, 106, 0, 0.5)';
  } else {
    navbar.style.background = 'linear-gradient(135deg, #FF6A00 0%, #FF8C3A 50%, #E55A00 100%)';
    navbar.style.boxShadow = '0 2px 20px rgba(255, 106, 0, 0.4)';
  }
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '68px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'linear-gradient(135deg, #FF6A00, #E55A00)';
    navLinks.style.padding = '16px 24px';
    navLinks.style.zIndex = '999';
  });
}

// Hero dots animation
const dots = document.querySelectorAll('.dot');
let currentDot = 0;
setInterval(() => {
  dots[currentDot].classList.remove('active');
  currentDot = (currentDot + 1) % dots.length;
  dots[currentDot].classList.add('active');
}, 3000);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in to cards and sections
document.querySelectorAll('.plano-card, .dif-item, .streaming-badge').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});


// menu responsivo 


// Seleciona o botão hambúrguer e o menu
const btnHamburguer = document.getElementById('hamburguer');
const menu = document.querySelector('.menu');

// Abre e fecha o menu principal
btnHamburguer.addEventListener('click', () => {
    menu.classList.toggle('ativo');
});

// Para os submenus no celular
const itensComSubmenu = document.querySelectorAll('.tem-submenu');

itensComSubmenu.forEach(item => {
    item.addEventListener('click', (e) => {
        // Se estiver no celular, abre o submenu ao clicar
        if (window.innerWidth <= 900) {
            item.classList.toggle('aberto');
        }
    });
});

