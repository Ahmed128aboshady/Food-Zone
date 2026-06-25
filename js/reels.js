/* =============================================
   FOOD ZONE — Reels JavaScript
   ============================================= */

// ── Snap scroll between reels ──
const container = document.getElementById('reelsContainer');
const reels = container ? container.querySelectorAll('.reel') : [];
let currentIdx = 0;

if (container) {
  container.addEventListener('scroll', () => {
    const newIdx = Math.round(container.scrollTop / window.innerHeight);
    if (newIdx !== currentIdx) {
      currentIdx = newIdx;
      updateDots(currentIdx);
    }
  }, { passive: true });
}

function updateDots(idx) {
  document.querySelectorAll('.progress-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ── Keyboard navigation ──
document.addEventListener('keydown', (e) => {
  if (!container) return;
  if (e.key === 'ArrowDown' || e.key === 'j') {
    if (currentIdx < reels.length - 1) scrollToReel(currentIdx + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'k') {
    if (currentIdx > 0) scrollToReel(currentIdx - 1);
  }
});

function scrollToReel(idx) {
  if (!container) return;
  container.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });
}

// ── Like button with heart burst animation ──
function toggleLike(el) {
  const btn = el.querySelector ? el.querySelector('.like-btn') : el;
  const isLiked = btn.classList.toggle('liked');
  const countEl = el.querySelector ? el.querySelector('.reel-action-count') : null;

  // Create burst
  const rect = btn.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.textContent = '❤️';
  burst.style.cssText = `
    position:fixed;
    left:${rect.left - 10}px;
    top:${rect.top - 10}px;
    font-size:3rem;
    pointer-events:none;
    z-index:9999;
    animation:burstAnim 0.8s ease forwards;
  `;
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 800);

  // Update count
  if (countEl) {
    const num = parseFloat(countEl.textContent.replace('K','')) * (countEl.textContent.includes('K') ? 1000 : 1);
    const newNum = isLiked ? num + 1 : num - 1;
    countEl.textContent = newNum >= 1000 ? (newNum/1000).toFixed(1) + 'K' : newNum;
    countEl.style.color = isLiked ? '#FF3366' : '';
  }
}

// ── Double-tap to like ──
let lastTap = 0;
let lastTapTarget = null;

if (container) {
  container.addEventListener('touchend', (e) => {
    const now = Date.now();
    const reel = e.target.closest('.reel');
    if (!reel) return;

    if (now - lastTap < 350 && lastTapTarget === reel) {
      const likeAction = reel.querySelector('.reel-action');
      if (likeAction) {
        toggleLike(likeAction);
        // Show big heart in center of screen
        const bigHeart = document.createElement('div');
        bigHeart.textContent = '❤️';
        bigHeart.style.cssText = `
          position:fixed;top:50%;left:50%;
          transform:translate(-50%,-50%) scale(0);
          font-size:6rem;pointer-events:none;z-index:9999;
          animation:doubleTapHeart 0.6s ease forwards;
        `;
        document.body.appendChild(bigHeart);
        setTimeout(() => bigHeart.remove(), 600);
      }
    }
    lastTap = now;
    lastTapTarget = reel;
  });
}

// ── Mouse double-click to like (desktop) ──
if (container) {
  container.addEventListener('dblclick', (e) => {
    const reel = e.target.closest('.reel');
    if (!reel) return;
    const likeAction = reel.querySelector('.reel-action');
    if (likeAction) {
      toggleLike(likeAction);
      const bigHeart = document.createElement('div');
      bigHeart.textContent = '❤️';
      bigHeart.style.cssText = `
        position:fixed;top:${e.clientY - 40}px;left:${e.clientX - 40}px;
        font-size:5rem;pointer-events:none;z-index:9999;
        animation:doubleTapHeart 0.6s ease forwards;
      `;
      document.body.appendChild(bigHeart);
      setTimeout(() => bigHeart.remove(), 600);
    }
  });
}

// ── CSS animation for double tap ──
const style = document.createElement('style');
style.textContent = `
  @keyframes burstAnim {
    0% { opacity:1; transform:scale(0.5); }
    60% { opacity:1; transform:scale(1.5); }
    100% { opacity:0; transform:scale(2.5); }
  }
  @keyframes doubleTapHeart {
    0% { opacity:1; transform:scale(0); }
    50% { opacity:1; transform:scale(1.2); }
    100% { opacity:0; transform:scale(1); }
  }
  .like-btn.liked { filter: drop-shadow(0 0 6px rgba(255,51,102,0.6)); }
`;
document.head.appendChild(style);

// ── Sound toggle ──
let isMuted = false;
const muteBtn = document.getElementById('muteBtn');
if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    muteBtn.title = isMuted ? 'Unmute' : 'Mute';
  });
}

// ── Share modal ──
function shareReel() {
  if (navigator.share) {
    navigator.share({
      title: 'Food Zone Reel',
      text: 'Check out this amazing home cook on Food Zone!',
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}

// ── Comment modal open/close ──
function openComment() {
  const m = document.getElementById('commentModal');
  if (m) m.style.display = 'flex';
}
function closeComment() {
  const m = document.getElementById('commentModal');
  if (m) m.style.display = 'none';
}

// ── Simulate infinite scroll (load more) ──
let isLoading = false;
if (container) {
  container.addEventListener('scroll', () => {
    const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - window.innerHeight;
    if (nearBottom && !isLoading) {
      isLoading = true;
      setTimeout(() => {
        isLoading = false;
      }, 1000);
    }
  }, { passive: true });
}

// ── Progress dots auto-init ──
const dotsContainer = document.getElementById('progressDots');
if (dotsContainer && reels.length > 0) {
  dotsContainer.innerHTML = '';
  reels.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => scrollToReel(i));
    dotsContainer.appendChild(dot);
  });
}

console.log('%c🎬 Food Zone Reels — Ready', 'color:#FF6B35;font-weight:bold;');