const cursor = document.querySelector('.custom-cursor.site-wide');
const img = document.querySelector('.cursor-img');

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.2;

function playBgMusic() {
  bgMusic.play().catch((e) => {
      console.log("Autoplay prevented" + e);
    });
}

playBgMusic();

document.addEventListener('mouseenter', e => {
  cursor.style.display = 'block';
});

document.addEventListener('mouseleave', e => {
  cursor.style.display = 'none';
});

document.addEventListener('mousemove', trackCursor);

document.addEventListener('mousedown', () => cursor.classList.add('active') );
document.addEventListener('mouseup', () => cursor.classList.remove('active') );

function trackCursor(e) {
  cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
}

if (img) {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    cursor.classList.add('cursor-missing');
  });
}


(function(){
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const ease = 0.12;
  const maxOffset = 40;

  function onPointerMove(e) {
    const nx = (e.clientX / window.innerWidth - 0.6) * 2;
    const ny = (e.clientY / window.innerHeight - 0.6) * 2;

    targetX = -nx * maxOffset;
    targetY = -ny * maxOffset;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  function step() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    document.documentElement.style.setProperty('--x', `${currentX}px`);
    document.documentElement.style.setProperty('--y', `${currentY}px`);
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

['click', 'keydown', 'touchstart'].forEach(evt =>
  document.addEventListener(evt, function onceToStartBg() {
    playBgMusic();
    document.removeEventListener(evt, onceToStartBg);
  }, { once: true, passive: true })
);

(function initWordFloat(){
  const paragraphs = document.querySelectorAll('p.text');
  if (!paragraphs.length) return;

  paragraphs.forEach(p => {
    const tokens = p.textContent.split(/(\s+)/);
    p.innerHTML = '';

    tokens.forEach(tok => {
      if (/\s+/.test(tok)) {
        p.appendChild(document.createTextNode(tok));
        return;
      }

      const span = document.createElement('span');
      span.className = 'text';
      span.textContent = tok;

      const dx = (Math.random() * 16 - 8).toFixed(2);
      const dy = (Math.random() * 14 - 7).toFixed(2);
      const rot = (Math.random() * 6 - 3).toFixed(2);
      const dur = (3 + Math.random() * 3).toFixed(2) + 's';
      const delay = (Math.random() * 2).toFixed(2) + 's';

      span.style.setProperty('--dx', dx + 'px');
      span.style.setProperty('--dy', dy + 'px');
      span.style.setProperty('--rot', rot + 'deg');
      span.style.animationDuration = dur;
      span.style.animationDelay = delay;

      p.appendChild(span);
    });
  });
})();

(function(){
  const openBtn = document.getElementById('openVideoBtn');
  const modal = document.getElementById('videoModal');
  const backdrop = document.getElementById('videoBackdrop');
  const video = document.getElementById('modalVideo');
  const playBtn = document.getElementById('playPauseBtn');
  const fsBtn = document.getElementById('fullscreenBtn');
  const closeBtn = document.getElementById('closeVideoBtn');
  const info = document.getElementById('videoInfo');

  if (!openBtn || !modal || !video) return;

  function openModal(e){
    e && e.preventDefault();
    const src = openBtn.dataset.videoSrc || '';
    if (src) {
      video.src = src;
      info.hidden = true;
      playBtn.disabled = false;
    } else {
      video.removeAttribute('src');
      info.hidden = false;
      info.textContent = 'Stay Tuned!';
      playBtn.disabled = true;
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    playBtn.focus();
    document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === "ArrowUp") {
        e.preventDefault();
        video.volume = Math.min(video.volume + 0.05, 1);
    }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        video.volume = Math.max(video.volume - 0.05, 0);
    }
    });
    video.volume = 0.5;
    if (!bgMusic.paused) bgMusic.pause();
    video.play();
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    try { video.pause(); } catch(e){}
    video.removeAttribute('src');
    video.load();
    
  }

  function togglePlay(){
    if (!video.src) return;
    if (video.paused) {
      if (!bgMusic.paused) bgMusic.pause();
      video.play();
      playBtn.textContent = 'Pause';
    } else {
      video.pause();
      playBtn.textContent = 'Play';
    }
  }

  function goFullscreen(){
    const elem = video;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(()=>{});
      return;
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(()=>{});
      video.style.cursor = "auto";
    }
  }

  openBtn.addEventListener('click', openModal);
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click',    () => {
    bgMusic.play().catch(() => {});
    closeModal();
  });
  playBtn.addEventListener('click', togglePlay);
  fsBtn.addEventListener('click', goFullscreen);

  document.addEventListener('keydown', (ev) => {
    if (!modal.classList.contains('open')) return;
    if (ev.key === 'Escape') closeModal();
    if (ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); togglePlay(); }
  });

  video.addEventListener('play', () => playBtn.textContent = 'Pause');
  video.addEventListener('pause', () => playBtn.textContent = 'Play');

  

  modal.addEventListener('transitionend', () => {
    if (!modal.classList.contains('open')) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  });

})();

