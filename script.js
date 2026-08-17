/* ========================================
   🎂 Birthday Angel - Script
   All logic, games, animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════
  // FLOATING HEARTS BACKGROUND
  // ═══════════════════════════════════
  const heartsContainer = document.getElementById('floatingHearts');
  const heartEmojis = ['💕', '💗', '💖', '🩷', '💘', '🤍', '✨', '🌸'];
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.setProperty('--left', Math.random() * 100 + '%');
    heart.style.setProperty('--duration', (6 + Math.random() * 8) + 's');
    heart.style.setProperty('--delay', (Math.random() * 10) + 's');
    heart.style.fontSize = (12 + Math.random() * 14) + 'px';
    heartsContainer.appendChild(heart);
  }

  // ═══════════════════════════════════
  // PROGRESS BAR
  // ═══════════════════════════════════
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // ═══════════════════════════════════
  // MUSIC TOGGLE & AUTOPLAY LOGIC
  // ═══════════════════════════════════
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 1.0;
  let musicPlaying = false;

  function tryPlayMusic() {
    if (musicPlaying) return;
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.textContent = '🎵';
      musicToggle.classList.add('playing');
    }).catch((err) => {
      console.log("Autoplay blocked by browser. Waiting for user interaction.", err);
    });
  }

  // Attempt to play immediately on load
  tryPlayMusic();

  // Also try on first touch/click anywhere on the screen (workaround for autoplay policies)
  document.body.addEventListener('click', tryPlayMusic, { once: true });
  document.body.addEventListener('touchstart', tryPlayMusic, { once: true });

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent triggering body click
    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.textContent = '🔇';
      musicToggle.classList.remove('playing');
    } else {
      bgMusic.play().catch(() => {});
      musicToggle.textContent = '🎵';
      musicToggle.classList.add('playing');
    }
    musicPlaying = !musicPlaying;
  });

  // ═══════════════════════════════════
  // ENVELOPE ANIMATION
  // ═══════════════════════════════════
  const envelope = document.getElementById('envelope');
  const landingText = document.getElementById('landingText');
  const envelopeContainer = document.getElementById('envelopeContainer');
  let envelopeOpened = false;

  envelopeContainer.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('opened');

    setTimeout(() => {
      landingText.classList.add('visible');
      launchConfetti();
      // Try to start music
      if (!musicPlaying) {
        bgMusic.play().then(() => {
          musicPlaying = true;
          musicToggle.textContent = '🎵';
          musicToggle.classList.add('playing');
        }).catch(() => {});
      }
    }, 800);
  });

  // ═══════════════════════════════════
  // OPEN GIFT BUTTON — Scroll Down & Unlock Letter
  // ═══════════════════════════════════
  const openGiftBtn = document.getElementById('openGiftBtn');
  openGiftBtn.addEventListener('click', () => {
    const secLetter = document.getElementById('sec-letter');
    secLetter.classList.remove('section-locked');
    secLetter.classList.add('section-unlocking');
    
    // Show nav item
    const navItem = document.querySelector('.nav-item[data-target="sec-letter"]');
    if (navItem) navItem.classList.add('nav-unlocked');

    setTimeout(() => {
      secLetter.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });

  // ═══════════════════════════════════
  // NEXT SECTION BUTTONS
  // ═══════════════════════════════════
  document.querySelectorAll('.next-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.unlock;
      const targetSec = document.getElementById(targetId);
      
      if (targetSec) {
        targetSec.classList.remove('section-locked');
        targetSec.classList.add('section-unlocking');
        btn.style.display = 'none'; // hide the button after clicking
        
        // Show nav item
        const navItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (navItem) navItem.classList.add('nav-unlocked');

        setTimeout(() => {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  });

  // ═══════════════════════════════════
  // SCROLL REVEAL (Intersection Observer)
  // ═══════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger letter typewriter on love letter section
        if (entry.target.closest('#sec-letter') && entry.target.classList.contains('letter-paper')) {
          startLetterTypewriter();
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════════
  // LETTER TYPEWRITER EFFECT
  // ═══════════════════════════════════
  let letterTyped = false;
  function startLetterTypewriter() {
    if (letterTyped) return;
    letterTyped = true;
    const paragraphs = document.querySelectorAll('#letterContent p');
    paragraphs.forEach((p, i) => {
      setTimeout(() => {
        p.classList.add('typed');
      }, i * 500);
    });
  }

  // ═══════════════════════════════════
  // BOTTOM NAVIGATION
  // ═══════════════════════════════════
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.target;
      document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Update active nav on scroll
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.target === id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => navObserver.observe(sec));

  // ═══════════════════════════════════
  // PHOTO VIEWER
  // ═══════════════════════════════════
  const photoViewer = document.getElementById('photoViewer');
  const viewerImg = document.getElementById('viewerImg');
  const viewerCaption = document.getElementById('viewerCaption');
  const closeViewer = document.getElementById('closeViewer');

  document.querySelectorAll('.polaroid').forEach(polaroid => {
    polaroid.addEventListener('click', () => {
      const img = polaroid.querySelector('img');
      const caption = polaroid.dataset.caption;
      viewerImg.src = img.src;
      viewerImg.alt = caption;
      viewerCaption.textContent = caption;
      photoViewer.classList.add('active');
    });
  });

  closeViewer.addEventListener('click', () => {
    photoViewer.classList.remove('active');
  });

  photoViewer.addEventListener('click', (e) => {
    if (e.target === photoViewer) {
      photoViewer.classList.remove('active');
    }
  });

  // ═══════════════════════════════════
  // VIDEO PLAYER (POPUP MODAL)
  // ═══════════════════════════════════
  const videoViewerModal = document.getElementById('videoViewerModal');
  const modalVideo = document.getElementById('modalVideo');
  const videoViewerCaption = document.getElementById('videoViewerCaption');
  const closeVideoViewer = document.getElementById('closeVideoViewer');

  document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const overlay = card.querySelector('.video-play-overlay');
    const caption = card.querySelector('.video-caption').textContent;
    // Get the actual source URL from the <source> tag inside <video>
    const sourceEl = video.querySelector('source');
    const videoSrc = sourceEl ? sourceEl.getAttribute('src') : video.getAttribute('src');

    overlay.addEventListener('click', () => {
      // Set src directly on the video element
      modalVideo.setAttribute('src', videoSrc);
      videoViewerCaption.textContent = caption;
      videoViewerModal.classList.add('active');
      
      modalVideo.play().catch(e => console.log('Video play failed', e));
      
      // Pause background music while watching video
      if (musicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.remove('playing');
        musicPlaying = false;
      }
    });
  });

  function closeVideoModal() {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load(); // Reset the video element
    videoViewerModal.classList.remove('active');
  }

  closeVideoViewer.addEventListener('click', closeVideoModal);

  videoViewerModal.addEventListener('click', (e) => {
    if (e.target === videoViewerModal) {
      closeVideoModal();
    }
  });

  // ═══════════════════════════════════
  // VOICE NOTE / AUDIO PLAYER
  // ═══════════════════════════════════
  let currentAudio = null;
  let currentBtn = null;
  let currentWaveformBars = null;
  let waveformInterval = null;

  // Generate waveform bars for all waveform containers
  document.querySelectorAll('.vn-waveform, .waveform-mini').forEach(container => {
    const barCount = 30;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.classList.add('bar');
      bar.style.height = (4 + Math.random() * 20) + 'px';
      container.appendChild(bar);
    }
  });

  function playAudio(src, btn, waveformContainer) {
    // Stop current
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentBtn) currentBtn.textContent = '▶';
      stopWaveformAnimation();
    }

    if (currentBtn === btn) {
      currentBtn = null;
      currentAudio = null;
      return;
    }

    const audio = new Audio(src);
    currentAudio = audio;
    currentBtn = btn;

    // Find waveform bars
    let waveformEl = null;
    if (waveformContainer) {
      waveformEl = waveformContainer;
    } else {
      waveformEl = btn.closest('.voice-player, .timeline-voice-note')?.querySelector('.vn-waveform, .waveform-mini');
    }

    audio.play().catch(e => console.log('Audio play failed:', e));
    btn.textContent = '⏸';

    if (waveformEl) {
      currentWaveformBars = waveformEl.querySelectorAll('.bar');
      startWaveformAnimation();
    }

    audio.addEventListener('ended', () => {
      btn.textContent = '▶';
      stopWaveformAnimation();
      currentAudio = null;
      currentBtn = null;
    });
  }

  function startWaveformAnimation() {
    if (!currentWaveformBars) return;
    let idx = 0;
    waveformInterval = setInterval(() => {
      currentWaveformBars.forEach((bar, i) => {
        bar.classList.toggle('active', i <= idx);
      });
      idx++;
      if (idx >= currentWaveformBars.length) idx = 0;
    }, 150);
  }

  function stopWaveformAnimation() {
    clearInterval(waveformInterval);
    if (currentWaveformBars) {
      currentWaveformBars.forEach(bar => bar.classList.remove('active'));
    }
    currentWaveformBars = null;
  }

  // Attach to all play buttons
  document.querySelectorAll('.vn-play-btn, .vn-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.dataset.audio;
      playAudio(src, btn);
    });
  });

  // ═══════════════════════════════════
  // QUIZ GAME
  // ═══════════════════════════════════
  const quizQuestions = [
    {
      question: "Kapan Kevin pertama kali nembak Angel di gereja? 💒",
      options: ["30 Agustus 2025", "31 Agustus 2025", "25 Desember 2025", "7 Agustus 2025"],
      correct: 0
    },
    {
      question: "Apa jawaban pertama Angel pas ditembak? 😂",
      options: ["iyaa mauu", "okee tidur dlu, jawabny besok", "mau ga ya mau ga ya", "ha?"],
      correct: 1
    },
    {
      question: "Berapa lama Kevin kasih clue sebelum Angel tau? 🕵️",
      options: ["1 hari", "2 hari", "1 minggu", "3 jam"],
      correct: 1
    },
    {
      question: "Siapa yang bilang 'yaudah ayo pacaran lg'? 💕",
      options: ["Kevin", "Angel", "Mami Kevin", "Excel"],
      correct: 1
    },
    {
      question: "Apa alasan putus pertama kali? 💔",
      options: ["Beda jurusan", "Belum move on", "Kebanyakan tidur", "LDR"],
      correct: 1
    },
    {
      question: "Angel jadi pilihan ke berapa waktu tebak-tebakan? 🤔",
      options: ["Pilihan pertama", "Pilihan kedua", "Pilihan terakhir, tapi pertama di hatiku", "Pilihan random"],
      correct: 2
    },
    {
      question: "Apa yang Kevin bilang setelah Angel jawab 'iyaa mauu'? 😆",
      options: ["makasih sayang!", "jadi apa?", "hah?", "Asoksowkwowk"],
      correct: 0  // trick: Kevin asked 'jadi apa?' BEFORE she answered, the answer was actually before
    },
    {
      question: "Tanggal berapa anniversary Kevin & Angel? 🎉",
      options: ["6 Oktober", "31 Agustus", "7 Agustus", "25 Desember"],
      correct: 1
    },
    {
      question: "Angel bilang apa waktu samain clue? 🔍",
      options: ["nama angel, prnh badmin, gereja brg", "nama kevin, prnh basket", "nama angel, prnh renang", "cih"],
      correct: 0
    },
    {
      question: "Kevin nembak Angel di mana? 💒",
      options: ["Di mall", "Di kampus", "Di gereja", "Di KRL"],
      correct: 2
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let quizAnswered = false;

  function renderQuizProgress() {
    const progressContainer = document.getElementById('quizProgress');
    progressContainer.innerHTML = '';
    quizQuestions.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i < currentQuestion) dot.classList.add('answered');
      if (i === currentQuestion) dot.classList.add('current');
      progressContainer.appendChild(dot);
    });
  }

  function renderQuestion() {
    const card = document.getElementById('quizCard');
    if (currentQuestion >= quizQuestions.length) {
      renderResult();
      return;
    }

    const q = quizQuestions[currentQuestion];
    quizAnswered = false;

    card.innerHTML = `
      <div class="question-number">Pertanyaan ${currentQuestion + 1} / ${quizQuestions.length}</div>
      <div class="question-text">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">${opt}</button>
        `).join('')}
      </div>
    `;

    card.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn, parseInt(btn.dataset.index)));
    });

    renderQuizProgress();
  }

  function handleAnswer(btn, index) {
    if (quizAnswered) return;
    quizAnswered = true;

    const q = quizQuestions[currentQuestion];
    const allBtns = document.querySelectorAll('.quiz-option');

    allBtns.forEach(b => b.classList.add('disabled'));

    if (index === q.correct) {
      btn.classList.add('correct');
      score++;
    } else {
      btn.classList.add('wrong');
      allBtns[q.correct].classList.add('correct');
    }

    setTimeout(() => {
      currentQuestion++;
      renderQuestion();
    }, 1200);
  }

  function renderResult() {
    const card = document.getElementById('quizCard');
    let message = '';
    let emoji = '';

    if (score === 10) {
      message = 'Wah kamu Angel sendiri ya? 😂';
      emoji = '🏆';
      launchConfetti();
    } else if (score >= 7) {
      message = 'Hmm stalker nih~ 👀';
      emoji = '🌟';
    } else if (score >= 4) {
      message = 'Yaaa lumayan lah, belajar lagi ya 📖';
      emoji = '😅';
    } else {
      message = 'Kamu pasti Excel 😤';
      emoji = '💀';
    }

    card.innerHTML = `
      <div class="quiz-result">
        <div class="score-emoji">${emoji}</div>
        <div class="score-circle">
          <div class="score-number">${score}</div>
          <div class="score-label">/ ${quizQuestions.length}</div>
        </div>
        <div class="score-message">${message}</div>
        <button class="quiz-restart-btn" id="quizRestart">Main Lagi! 🔄</button>
      </div>
    `;

    document.getElementById('quizRestart').addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      renderQuestion();
      // Hide the Lanjut button again when replaying
      document.getElementById('quizNextBtn').style.display = 'none';
    });

    // Show the "Lanjut" button now that quiz is complete
    const quizNextBtn = document.getElementById('quizNextBtn');
    if (quizNextBtn) quizNextBtn.style.display = '';
  }

  renderQuestion();

  // ═══════════════════════════════════
  // SCRATCH CARDS
  // ═══════════════════════════════════
  document.querySelectorAll('.scratch-card').forEach(card => {
    const canvas = card.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let scratchedPixels = 0;

    function initScratchCard() {
      const rect = card.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw scratch cover
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FFB6C1');
      gradient.addColorStop(0.5, '#FF69B4');
      gradient.addColorStop(1, '#FFB6C1');
      ctx.fillStyle = gradient;

      // Rounded rect
      const r = 16;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(canvas.width - r, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
      ctx.lineTo(canvas.width, canvas.height - r);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
      ctx.lineTo(r, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.fill();

      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Quicksand, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎁 Gosok di sini! 🎁', canvas.width / 2, canvas.height / 2 - 5);
      ctx.font = '14px Nunito, sans-serif';
      ctx.fillText('✨ Ada kejutan di baliknya~ ✨', canvas.width / 2, canvas.height / 2 + 20);
    }

    // Resize observer to reinit on size change
    const resizeObs = new ResizeObserver(() => {
      initScratchCard();
    });
    resizeObs.observe(card);

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixels++;
      // Check if enough scratched
      if (scratchedPixels > 50) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] === 0) transparent++;
        }
        const percent = transparent / (imageData.data.length / 4);
        if (percent > 0.5) {
          // Reveal fully
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.pointerEvents = 'none';
        }
      }
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; const p = getPos(e); scratch(p.x, p.y); });
    canvas.addEventListener('mousemove', (e) => { if (!isDrawing) return; const p = getPos(e); scratch(p.x, p.y); });
    canvas.addEventListener('mouseup', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; const p = getPos(e); scratch(p.x, p.y); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (!isDrawing) return; const p = getPos(e); scratch(p.x, p.y); }, { passive: false });
    canvas.addEventListener('touchend', () => isDrawing = false);

    // Init
    setTimeout(() => initScratchCard(), 100);
  });

  // ═══════════════════════════════════
  // BIRTHDAY CAKE — CANDLES
  // ═══════════════════════════════════
  const candlesContainer = document.getElementById('candlesContainer');
  const tapInstruction = document.getElementById('tapInstruction');
  const cakeContainer = document.getElementById('cakeContainer');
  let candlesBlown = 0;
  const totalCandles = 20;

  // Create 20 candles
  for (let i = 0; i < totalCandles; i++) {
    const candle = document.createElement('div');
    candle.classList.add('candle');
    candle.innerHTML = `
      <div class="flame"></div>
      <div class="candle-body"></div>
    `;
    candlesContainer.appendChild(candle);
  }

  cakeContainer.addEventListener('click', () => {
    const candles = candlesContainer.querySelectorAll('.candle:not(.blown)');
    if (candles.length === 0) return;

    // Blow 3-5 candles at a time
    const blowCount = Math.min(candles.length, 3 + Math.floor(Math.random() * 3));
    for (let i = 0; i < blowCount; i++) {
      setTimeout(() => {
        candles[i].classList.add('blown');
        // Add smoke
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        candles[i].querySelector('.flame').appendChild(smoke);
        candlesBlown++;

        if (candlesBlown >= totalCandles) {
          tapInstruction.classList.add('hidden');
          setTimeout(() => {
            launchFireworks();
            launchConfetti();
          }, 500);
        }
      }, i * 200);
    }
  });

  // ═══════════════════════════════════
  // ANNIVERSARY COUNTER
  // ═══════════════════════════════════
  const anniversaryDate = new Date('2025-08-31T00:00:00+07:00');

  function updateCounter() {
    const now = new Date();
    const diff = now - anniversaryDate;

    if (diff < 0) {
      // Before anniversary
      document.getElementById('anniDays').textContent = '—';
      document.getElementById('anniHours').textContent = '—';
      document.getElementById('anniMinutes').textContent = '—';
      document.getElementById('anniSeconds').textContent = '—';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('anniDays').textContent = days;
    document.getElementById('anniHours').textContent = hours;
    document.getElementById('anniMinutes').textContent = minutes;
    document.getElementById('anniSeconds').textContent = seconds;
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  // ═══════════════════════════════════
  // I LOVE YOU BUTTON — Heart Explosion
  // ═══════════════════════════════════
  const loveBtn = document.getElementById('loveBtn');
  loveBtn.addEventListener('click', () => {
    launchHearts();
    launchConfetti();
  });

  // ═══════════════════════════════════
  // CONFETTI ANIMATION
  // ═══════════════════════════════════
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FF69B4', '#FFB6C1', '#FFD700', '#FF85C8', '#E91E63', '#FFC0CB', '#FF4081', '#FFFFFF'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let confettiFrame;
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.003;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (alive) {
        confettiFrame = requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(confettiFrame);
      }
    }

    animateConfetti();
  }

  // ═══════════════════════════════════
  // HEARTS EXPLOSION
  // ═══════════════════════════════════
  function launchHearts() {
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hearts = [];
    const heartTexts = ['💕', '💗', '💖', '🩷', '💘', '❤️', '💝', '🤍'];

    for (let i = 0; i < 60; i++) {
      hearts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.8,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 10 + 5),
        text: heartTexts[Math.floor(Math.random() * heartTexts.length)],
        size: 16 + Math.random() * 24,
        opacity: 1,
        rotation: (Math.random() - 0.5) * 30
      });
    }

    let heartFrame;
    function animateHearts() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      hearts.forEach(h => {
        if (h.opacity <= 0) return;
        alive = true;

        h.x += h.vx;
        h.y += h.vy;
        h.vy += 0.15;
        h.opacity -= 0.008;

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, h.opacity);
        ctx.font = h.size + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText(h.text, 0, 0);
        ctx.restore();
      });

      if (alive) {
        heartFrame = requestAnimationFrame(animateHearts);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(heartFrame);
      }
    }

    animateHearts();
  }

  // ═══════════════════════════════════
  // FIREWORKS
  // ═══════════════════════════════════
  function launchFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF69B4', '#FFD700', '#FF4081', '#FFB6C1', '#E91E63', '#FFC107', '#FF80AB'];
    const fireworks = [];

    // Launch several fireworks
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const cx = canvas.width * (0.2 + Math.random() * 0.6);
        const cy = canvas.height * (0.2 + Math.random() * 0.3);
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 40; i++) {
          const angle = (Math.PI * 2 / 40) * i;
          const speed = 2 + Math.random() * 3;
          fireworks.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            life: 1,
            size: 2 + Math.random() * 2
          });
        }
      }, f * 400);
    }

    let fwFrame;
    function animateFireworks() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      fireworks.forEach(p => {
        if (p.life <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.99;
        p.life -= 0.012;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (alive) {
        fwFrame = requestAnimationFrame(animateFireworks);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(fwFrame);
      }
    }

    animateFireworks();
  }

});
