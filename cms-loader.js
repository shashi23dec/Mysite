// cms-loader.js — reads /content/*.json (edited via the /admin CMS) and
// swaps the placeholder gradients / text for real uploaded media.
// If a field is empty, the existing placeholder is left untouched.
(function () {
  const scriptTag = document.currentScript;
  const page = scriptTag ? scriptTag.getAttribute('data-page') : null;
  if (!page) return;

  function setBg(el, url) {
    if (!el || !url) return;
    el.style.backgroundImage = `url('${url}')`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
  }

  function sizeClass(size) {
    return { wide: 'g-wide', sq: 'g-sq', tall: 'g-tall', full: 'g-full' }[size] || 'g-sq';
  }

  function buildGalleryTile(item) {
    const tile = document.createElement('div');
    tile.className = `g-tile ${sizeClass(item.size)}`;
    if (item.image) setBg(tile, item.image);
    const cap = document.createElement('div');
    cap.className = 'cap';
    cap.textContent = item.caption || '';
    tile.appendChild(cap);
    return tile;
  }

  function buildVideoCard(item) {
    const card = document.createElement('div');
    card.className = 'video-card';
    const bg = document.createElement('div');
    bg.className = 'bg-layer';
    if (item.youtubeId) setBg(bg, `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`);
    card.appendChild(bg);
    const play = document.createElement('div');
    play.className = 'play-btn';
    card.appendChild(play);
    const title = document.createElement('div');
    title.className = 'video-title';
    title.textContent = item.title || '';
    card.appendChild(title);
    if (item.youtubeId) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        card.innerHTML = `<iframe width="100%" height="100%" style="position:absolute;inset:0;border:0;" src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      });
    }
    return card;
  }

  fetch(`content/${page}.json`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data) return;

      if (page === 'home') {
        setBg(document.getElementById('heroBg'), data.hero_image);
        setBg(document.getElementById('cms-home-work-bg'), data.work_bg);
        setBg(document.getElementById('cms-home-life-bg'), data.life_bg);
        setBg(document.getElementById('cms-home-words-bg'), data.words_bg);
        setBg(document.getElementById('cms-home-photo-bg'), data.photo_bg);
        setBg(document.getElementById('cms-home-drone-bg'), data.drone_bg);
        setBg(document.getElementById('cms-home-moto-bg'), data.moto_bg);
        setBg(document.getElementById('cms-home-travel-bg'), data.travel_bg);
      }

      if (['photography', 'travel', 'workshop'].includes(page)) {
        const grid = document.getElementById('cms-gallery');
        if (grid && Array.isArray(data.items) && data.items.length) {
          grid.innerHTML = '';
          data.items.forEach((item) => grid.appendChild(buildGalleryTile(item)));
        }
      }

      if (page === 'droneacharya') {
        const grid = document.getElementById('cms-video-grid');
        if (grid && Array.isArray(data.items) && data.items.length) {
          grid.innerHTML = '';
          data.items.forEach((item) => grid.appendChild(buildVideoCard(item)));
        }
      }

      if (page === 'poetry') {
        if (Array.isArray(data.poems) && data.poems.length) {
          const texts = document.querySelectorAll('.poem-hindi');
          data.poems.forEach((p, i) => {
            if (texts[i]) texts[i].innerHTML = (p.text || '').replace(/\n/g, '<br>');
          });
        }
        if (Array.isArray(data.media) && data.media.length) {
          const mediaEls = document.querySelectorAll('.poem-card.img .bg-layer, .poem-card.video .bg-layer');
          data.media.forEach((m, i) => {
            if (mediaEls[i]) setBg(mediaEls[i], m.image || (m.youtubeId ? `https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg` : ''));
          });
        }
        setBg(document.getElementById('cms-book-one-cover'), data.book_one_cover);
        setBg(document.getElementById('cms-book-two-cover'), data.book_two_cover);
      }
    })
    .catch(() => { /* placeholder content stays as-is if content file isn't reachable yet */ });
})();
