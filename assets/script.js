const menuButton = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuButton && navList) {
  menuButton.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach(item => observer.observe(item));
