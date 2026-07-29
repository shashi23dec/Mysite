document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.style.padding = window.scrollY > 40 ? '18px 6vw' : '28px 6vw';
  });

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:0.12});
  revealEls.forEach(el=>io.observe(el));

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if(toggle){
    toggle.addEventListener('click', () => {
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'fixed';
      nav.style.top = '70px';
      nav.style.right = '6vw';
      nav.style.background = '#15181d';
      nav.style.padding = '20px';
      nav.style.gap = '18px';
    });
  }
});
