/* ══════════════════════════════════════════════
   app.js v3 — Tanziya Birthday
   Shrek reveal · Fireworks · Special note · Cat
══════════════════════════════════════════════ */

(function () {

  const TEST_MODE = new URLSearchParams(window.location.search).has('test');
  let candlesOut  = false;

  /* ══════════════════════════════════════════
     SPECIAL NOTE (edited message)
  ══════════════════════════════════════════ */
  const NOTE_LINES = [
    `HAPPY BIRTHDAY TANZIYA MAHREEN SHAIK MASOOD AKA BABYGAL 🎉💕`,
    `We've been together for almost 1 year... DYAMM, time flew so fast! 🥹`,
    `Yesterday we were playing Grow a Garden and now it's been 8 months — we didn't even check our garden. Maybe our plants are still growing... just like our relationship did. 🌱`,
    `{AHHHHHHHHHHHHHH} 😭😭`,
    `Okay look, I forget things super fast, and yeah — you totally take advantage of that 😤 but listen... I never forget the sweet memories we've made together.`,
    `Whether it's playing Roblox with you at 3am, or you getting mad at me for absolutely tiny reasons (like babe it was nothing 😭) — I love every single second of it.`,
    `I love you. I love you a lot. Like, words genuinely cannot explain it. 🥺`,
    `You're pretty AF and I hope nobody ever admires you the way I do — that's mine only. 🔒`,
    `{Okay this paragraph might be cringe but who cares, it's your birthday} 🎂`,
    `BABYGAL — I literally don't know what else to write, I'M OHMYGOD 😭💀`,
    `But all I want to say is... I want you in my present and my future. That's it. That's all. 🤍`,
    `Happy 18th. Go crazy. You deserve it. 🎊✨`
  ];

  /* ══════════════════════════════════════════
     TEST BADGE
  ══════════════════════════════════════════ */
  if (TEST_MODE) {
    const b = document.createElement('div');
    b.textContent = '🧪 TEST MODE · 10s';
    b.style.cssText = `position:fixed;top:12px;right:12px;z-index:9999;background:rgba(255,80,120,.18);border:1px solid rgba(255,80,120,.4);color:rgba(255,180,200,.95);font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;padding:5px 12px;border-radius:20px;pointer-events:none;`;
    document.body.appendChild(b);
  }

  /* ══════════════════════════════════════════
     AUDIO
  ══════════════════════════════════════════ */
  // Countdown intro song: "I Will Never Fall In Love Again" (Dionne Warwick)
  // Birthday song: "What a Fool Believes" (Doobie Brothers)
  // We embed via YouTube iframe audio trick — fully client-side, no backend needed
  // Using Web Audio / YouTube embed approach

  let introAudio   = null;
  let birthdayAudio = null;

  function createAudioPlayer(youtubeId, volume) {
    // Create hidden iframe for YouTube audio
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;';
    container.innerHTML = `<iframe 
      width="1" height="1"
      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&disablekb=1&fs=0&modestbranding=1"
      frameborder="0" allow="autoplay"
      style="width:1px;height:1px;">
    </iframe>`;
    document.body.appendChild(container);
    return container;
  }

  function startIntroMusic() {
    // "I Will Never Fall In Love Again" — Dionne Warwick
    introAudio = createAudioPlayer('BbBSWvQKoI0', 0.5);
  }

  function switchToBirthdayMusic() {
    // Fade out intro
    if (introAudio) {
      gsap.to(introAudio.querySelector('iframe'), {
        opacity: 0, duration: 2,
        onComplete: () => { introAudio.remove(); introAudio = null; }
      });
    }
    // Start birthday song: "What a Fool Believes" — Doobie Brothers
    setTimeout(() => {
      birthdayAudio = createAudioPlayer('dHBiQqKlBIg', 0.5);
    }, 2000);
  }

  /* ══════════════════════════════════════════
     FIREWORKS
  ══════════════════════════════════════════ */
  let fwCanvas, fwCtx, fwParticles = [], fwActive = false, fwRaf = null;

  function initFireworks() {
    fwCanvas = document.getElementById('fireworks-canvas');
    if (!fwCanvas) return;
    fwCtx = fwCanvas.getContext('2d');
    fwCanvas.width  = window.innerWidth;
    fwCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      fwCanvas.width  = window.innerWidth;
      fwCanvas.height = window.innerHeight;
    });
  }

  function launchFirework() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.55;
    const hue = Math.random() * 60 + 300; // pink/purple range
    const count = 55 + Math.floor(Math.random() * 25);

    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 / count) * i;
      const speed  = Math.random() * 4 + 2;
      const size   = Math.random() * 3 + 1;
      fwParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        size,
        color: `hsla(${hue + Math.random()*30 - 15}, 90%, 70%, 1)`,
        gravity: 0.08
      });
    }
  }

  function fireworkLoop() {
    if (!fwCtx) return;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    // Random new bursts
    if (fwActive && Math.random() < 0.04) launchFirework();

    fwParticles = fwParticles.filter(p => p.alpha > 0.02);
    fwParticles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.97;
      p.alpha -= 0.018;

      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fillStyle = p.color.replace('1)', `${p.alpha})`);
      fwCtx.fill();
    });

    fwRaf = requestAnimationFrame(fireworkLoop);
  }

  function startFireworks() {
    fwActive = true;
    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(launchFirework, i * 300);
    }
    fireworkLoop();
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {

    const realTarget = (() => {
      const t = new Date(new Date().getFullYear(), 2, 14, 0, 0, 0);
      if (Date.now() >= t) t.setFullYear(t.getFullYear() + 1);
      return t;
    })();

    const alreadyBirthday = !TEST_MODE && Date.now() >= realTarget;

    initFireworks();

    if (alreadyBirthday) {
      launchBirthdayDirectly();
    } else {
      launchCountdown();
    }
  });

  /* ══════════════════════════════════════════
     COUNTDOWN
  ══════════════════════════════════════════ */
  function launchCountdown() {
    document.getElementById('countdown-scene').classList.add('active');

    // Start intro music
    startIntroMusic();

    // Staggered messages
    gsap.to('.msg', {
      opacity: 1, y: 0, duration: 1.4, ease: 'power2.out',
      stagger: 0.55, delay: 0.5
    });
    gsap.to('#cd-photo',  { opacity: 1, duration: 1.5, ease: 'power1.out', delay: 2.2 });
    gsap.to('.cd-timer',  { opacity: 1, duration: 1.5, ease: 'power1.out', delay: 2.5 });

    Timer.start(() => showShrekThenBirthday());
  }

  /* ══════════════════════════════════════════
     SHREK REVEAL → then birthday
  ══════════════════════════════════════════ */
  function showShrekThenBirthday() {
    Timer.stop();
    const veil = document.getElementById('veil');

    gsap.timeline()
      // Fade to black
      .to(veil, { opacity: 1, duration: 1, ease: 'power2.inOut' })
      // Switch to shrek scene
      .add(() => {
        document.getElementById('countdown-scene').classList.remove('active');
        document.getElementById('shrek-scene').classList.add('active');
        gsap.set('#shrek-scene', { opacity: 1 });
      })
      // Reveal
      .to(veil, { opacity: 0, duration: 1.2, ease: 'power2.out', delay: 0.1 })
      // Shrek pops in
      .to('#shrek-img', {
        opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.7)', delay: 0.2
      })
      .to('#shrek-text', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
      }, '-=0.3')
      // Hold for 3.5 seconds
      .to({}, { duration: 3.5 })
      // Fade shrek out
      .to(veil, { opacity: 1, duration: 0.9, ease: 'power2.inOut' })
      .add(() => {
        // Switch music
        switchToBirthdayMusic();
        document.getElementById('shrek-scene').classList.remove('active');
        document.getElementById('birthday-scene').classList.add('active');
        gsap.set('#birthday-scene', { opacity: 1 });
      })
      .to(veil, { opacity: 0, duration: 1.6, ease: 'power2.out', delay: 0.2 })
      .add(() => animateBirthdayEntrance(), '-=0.8');
  }

  function launchBirthdayDirectly() {
    const bd = document.getElementById('birthday-scene');
    bd.classList.add('active');
    gsap.set(bd, { opacity: 1 });
    switchToBirthdayMusic();
    animateBirthdayEntrance();
  }

  /* ══════════════════════════════════════════
     BIRTHDAY ENTRANCE
  ══════════════════════════════════════════ */
  function animateBirthdayEntrance() {
    const tl = gsap.timeline();

    tl.to('.table-scene', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 })
      .fromTo('#bouquet-left',  { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.6)' }, '-=0.8')
      .fromTo('#bouquet-right', { x: 40,  opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.6)' }, '-=1.1')
      .to('#fp1', { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, '-=0.6')
      .to('#fp2', { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, '-=0.85')
      // Note slides in
      .to('#bench-note', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '-=0.4')
      .add(() => {
        typeNote();
        startIdleAnimations();
        startFireworks();
      });

    setupCake();
    setupMic();
  }

  /* ══════════════════════════════════════════
     TYPE NOTE TEXT
  ══════════════════════════════════════════ */
  function typeNote() {
    const container = document.getElementById('note-text');
    if (!container) return;
    container.innerHTML = '';
    NOTE_LINES.forEach((line, i) => {
      const p = document.createElement('p');
      p.style.opacity = '0';
      p.style.transform = 'translateY(6px)';
      p.textContent = line;
      container.appendChild(p);
      gsap.to(p, {
        opacity: 1, y: 0, duration: 0.7,
        ease: 'power2.out',
        delay: 0.4 + i * 0.28
      });
    });
  }

  /* ══════════════════════════════════════════
     IDLE ANIMATIONS
  ══════════════════════════════════════════ */
  function startIdleAnimations() {
    gsap.to('#bouquet-left',  { y: -7, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#bouquet-right', { y: -9, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
    gsap.to('#fp1', { y: -5, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
    gsap.to('#fp2', { y: -6, duration: 2.9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.7 });
  }

  /* ══════════════════════════════════════════
     PARALLAX
  ══════════════════════════════════════════ */
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  (function parallaxLoop() {
    cx += (mx - cx) * 0.055;
    cy += (my - cy) * 0.055;
    const sw = document.getElementById('scene-wrap');
    if (sw) gsap.set(sw, { x: cx * 14, y: cy * 8 });
    requestAnimationFrame(parallaxLoop);
  })();

  /* ══════════════════════════════════════════
     CAKE INTERACTION
  ══════════════════════════════════════════ */
  function setupCake() {
    const cake = document.getElementById('cake-wrap');
    if (!cake) return;
    cake.addEventListener('click', blowCandles);
    cake.addEventListener('touchend', e => { e.preventDefault(); blowCandles(); }, { passive: false });
  }

  function blowCandles() {
    if (candlesOut) return;
    candlesOut = true;

    gsap.to('#click-hint', { opacity: 0, duration: 0.3 });

    [1,2,3,4,5].forEach((n, i) => {
      const candle = document.getElementById(`c${n}`);
      if (!candle) return;
      const flames = candle.querySelectorAll('.flame-outer,.flame-mid,.flame-inner');

      gsap.timeline({ delay: i * 0.12 })
        .to(flames, { scaleY: 1.7, scaleX: 0.35, duration: 0.12, transformOrigin: 'center bottom' })
        .to(flames, { scaleY: 0, scaleX: 0, opacity: 0, duration: 0.2, ease: 'power2.in', transformOrigin: 'center bottom' })
        .add(() => showSmoke(candle, n));
    });

    gsap.to('#glow-halo', { opacity: 0, duration: 1.2, delay: 0.5 });

    gsap.delayedCall(1.5, () => {
      burstSparkles();
      gsap.delayedCall(0.5, showBirthdayMessage);
      gsap.delayedCall(2.5, showCatMeme);
    });
  }

  function showSmoke(candle, n) {
    const sg = candle.querySelector('.smoke-g');
    if (!sg) return;
    const xs = { 1:113, 2:133, 3:156, 4:179, 5:199 };
    const ys = { 1:38,  2:30,  3:22,  4:30,  5:38 };
    const x = xs[n], y = ys[n];
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const d = `M${x} ${y} Q${x+6} ${y-14} ${x} ${y-28} Q${x-6} ${y-42} ${x} ${y-56}`;
    path.setAttribute('d', d);
    path.setAttribute('stroke','rgba(200,200,200,0.55)');
    path.setAttribute('stroke-width','2.5');
    path.setAttribute('fill','none');
    path.setAttribute('stroke-linecap','round');
    const len = 90;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    sg.appendChild(path);
    gsap.timeline()
      .to(path, { strokeDashoffset: 0, duration: 1.0, ease: 'power1.out' })
      .to(path, { opacity: 0, duration: 0.7, ease: 'power1.in' });
  }

  /* ══════════════════════════════════════════
     SPARKLES
  ══════════════════════════════════════════ */
  function burstSparkles() {
    const container = document.getElementById('sparkles');
    for (let i = 0; i < 60; i++) {
      const sp = document.createElement('div');
      sp.className = 'sp';
      const size = Math.random() * 7 + 2;
      sp.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*75}%;width:${size}px;height:${size}px;--d:${(Math.random()*2+1.4).toFixed(2)}s;--dl:${(Math.random()*3).toFixed(2)}s;`;
      container.appendChild(sp);
    }
  }

  /* ══════════════════════════════════════════
     BIRTHDAY MESSAGE
  ══════════════════════════════════════════ */
  function showBirthdayMessage() {
    const msg = document.getElementById('bday-msg');
    msg.classList.add('show');
    gsap.to(msg, { opacity: 1, duration: 1.6, ease: 'power3.out' });
    gsap.to('.bday-name', {
      textShadow: '0 0 60px rgba(249,176,200,.95), 0 0 100px rgba(249,176,200,.4)',
      duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2
    });
  }

  /* ══════════════════════════════════════════
     CAT MEME — slides up from bottom
  ══════════════════════════════════════════ */
  function showCatMeme() {
    const cat = document.getElementById('cat-wrap');
    gsap.timeline()
      // Fade in + slide up
      .to(cat, {
        opacity: 1, bottom: '8%',
        duration: 1.4, ease: 'back.out(1.4)'
      })
      // Hold for 5 seconds then gently fade out
      .to({}, { duration: 5 })
      .to(cat, { opacity: 0, bottom: '-10%', duration: 1.2, ease: 'power2.in' });
  }

  /* ══════════════════════════════════════════
     MIC
  ══════════════════════════════════════════ */
  async function setupMic() {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx      = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 256;
      const data = new Uint8Array(analyser.frequencyBinCount);
      (function detect() {
        if (candlesOut) return;
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < 40; i++) sum += data[i];
        if (sum / 40 > 62) { blowCandles(); return; }
        requestAnimationFrame(detect);
      })();
    } catch (e) { /* mic not available */ }
  }

})();
