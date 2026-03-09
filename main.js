/* ============================================================
   GeneRisk AI — main.js
   Three.js DNA Helix + Particle System + GSAP Animations
   ============================================================ */

// ─── GSAP Plugins ─────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── PARTICLE SYSTEM ──────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const TEAL = '#00B4D8';
  const TEAL_DIM = 'rgba(0,180,216,';

  const particles = [];
  const PARTICLE_COUNT = Math.min(Math.floor(W * H / 14000), 100);

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 2.5 + 0.8;
      this.alpha = Math.random() * 0.6 + 0.15;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      this.currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(t * this.pulseSpeed + this.pulseOffset));
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grd.addColorStop(0, TEAL_DIM + this.currentAlpha + ')');
      grd.addColorStop(1, 'rgba(0,180,216,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = TEAL_DIM + (this.currentAlpha * 1.5) + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  let t = 0;

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = TEAL_DIM + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    t += 1;
    drawConnections();
    particles.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();


// ─── THREE.JS DNA DOUBLE HELIX ─────────────────────────────────
(function initDNA() {
  const canvas = document.getElementById('dna-canvas');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 22);

  // Colors
  const TEAL_HEX = 0x00B4D8;
  const TEAL_DIM_HEX = 0x0096C7;
  const WHITE_HEX = 0xFFFFFF;
  const ACCENT_HEX = 0x48CAE4;
  const ORANGE_HEX = 0xFF6B9D; // second strand accent

  // DNA parameters
  const TURNS = 5;            // number of full helix turns
  const POINTS_PER_TURN = 30;
  const TOTAL_POINTS = TURNS * POINTS_PER_TURN;
  const RADIUS = 3.2;          // helix radius
  const HEIGHT = 16;           // total height

  const dnaGroup = new THREE.Group();
  scene.add(dnaGroup);

  // ── Strand spheres + backbone ──────────────────────────────────
  const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);

  const matA = new THREE.MeshStandardMaterial({
    color: TEAL_HEX,
    emissive: TEAL_HEX,
    emissiveIntensity: 0.7,
    roughness: 0.2,
    metalness: 0.3,
  });

  const matB = new THREE.MeshStandardMaterial({
    color: ORANGE_HEX,
    emissive: ORANGE_HEX,
    emissiveIntensity: 0.7,
    roughness: 0.2,
    metalness: 0.3,
  });

  const backboneMatA = new THREE.MeshStandardMaterial({
    color: TEAL_HEX,
    emissive: TEAL_HEX,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.6,
  });

  const backboneMatB = new THREE.MeshStandardMaterial({
    color: ORANGE_HEX,
    emissive: ORANGE_HEX,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.6,
  });

  const yCylinderGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 8);

  const posA = [];
  const posB = [];

  for (let i = 0; i < TOTAL_POINTS; i++) {
    const t = i / (TOTAL_POINTS - 1);
    const angle = t * TURNS * Math.PI * 2;
    const y = (t - 0.5) * HEIGHT;

    const xA = Math.cos(angle) * RADIUS;
    const zA = Math.sin(angle) * RADIUS;
    const xB = Math.cos(angle + Math.PI) * RADIUS;
    const zB = Math.sin(angle + Math.PI) * RADIUS;

    posA.push(new THREE.Vector3(xA, y, zA));
    posB.push(new THREE.Vector3(xB, y, zB));

    // Nucleotide spheres
    const sA = new THREE.Mesh(sphereGeo, matA);
    sA.position.set(xA, y, zA);
    dnaGroup.add(sA);

    const sB = new THREE.Mesh(sphereGeo, matB);
    sB.position.set(xB, y, zB);
    dnaGroup.add(sB);

    // Backbone cylinders between consecutive points
    if (i > 0) {
      const pA0 = posA[i - 1];
      const pA1 = posA[i];
      const cylA = makeCylinder(pA0, pA1, 0.06, backboneMatA);
      dnaGroup.add(cylA);

      const pB0 = posB[i - 1];
      const pB1 = posB[i];
      const cylB = makeCylinder(pB0, pB1, 0.06, backboneMatB);
      dnaGroup.add(cylB);
    }
  }

  // ── Base pair rungs ────────────────────────────────────────────
  const rungMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: WHITE_HEX,
    emissiveIntensity: 0.25,
    transparent: true,
    opacity: 0.35,
  });

  for (let i = 0; i < TOTAL_POINTS; i += 3) {
    const rung = makeCylinder(posA[i], posB[i], 0.04, rungMat);
    dnaGroup.add(rung);
  }

  function makeCylinder(pA, pB, radius, mat) {
    const dir = new THREE.Vector3().subVectors(pB, pA);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
    const geo = new THREE.CylinderGeometry(radius, radius, len, 8);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return mesh;
  }

  // ── Lighting ───────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const tealLight = new THREE.PointLight(TEAL_HEX, 3, 40);
  tealLight.position.set(5, 5, 5);
  scene.add(tealLight);

  const pinkLight = new THREE.PointLight(ORANGE_HEX, 2, 40);
  pinkLight.position.set(-5, -5, 5);
  scene.add(pinkLight);

  const whiteLight = new THREE.DirectionalLight(0xffffff, 0.5);
  whiteLight.position.set(0, 10, 15);
  scene.add(whiteLight);

  // ── Floating particles ─────────────────────────────────────────
  const floatGeo = new THREE.BufferGeometry();
  const floatCount = 180;
  const floatPos = new Float32Array(floatCount * 3);

  for (let i = 0; i < floatCount; i++) {
    floatPos[i * 3] = (Math.random() - 0.5) * 30;
    floatPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    floatPos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 6;
  }

  floatGeo.setAttribute('position', new THREE.BufferAttribute(floatPos, 3));

  const floatMat = new THREE.PointsMaterial({
    color: TEAL_HEX,
    size: 0.12,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const floatPoints = new THREE.Points(floatGeo, floatMat);
  scene.add(floatPoints);

  // ── Mouse interaction ──────────────────────────────────────────
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ─────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ─────────────────────────────────────────────
  let frame = 0;
  let isRendering = false;
  let rafId = null;

  function animate() {
    if (!isRendering) return;
    rafId = requestAnimationFrame(animate);
    frame++;

    // Rotate DNA
    dnaGroup.rotation.y += 0.004;
    dnaGroup.rotation.x += 0.001;

    // Subtle mouse tilt
    dnaGroup.rotation.x += (mouseY * 0.3 - dnaGroup.rotation.x) * 0.02;
    dnaGroup.rotation.y += (mouseX * 0.5 + frame * 0.004 - dnaGroup.rotation.y) * 0.02;

    // Animate lights
    tealLight.position.x = Math.sin(frame * 0.012) * 8;
    tealLight.position.y = Math.cos(frame * 0.009) * 5;
    pinkLight.position.x = Math.cos(frame * 0.010) * 8;
    pinkLight.position.y = Math.sin(frame * 0.013) * 5;

    // Float particles rotate slowly
    floatPoints.rotation.y += 0.001;
    floatPoints.rotation.x += 0.0005;

    renderer.render(scene, camera);
  }

  // Lazy load using Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    let anyVisible = false;
    entries.forEach(entry => {
      if (entry.isIntersecting) anyVisible = true;
    });
    if (anyVisible) {
      if (!isRendering) {
        isRendering = true;
        animate();
      }
    } else {
      isRendering = false;
      if (rafId) cancelAnimationFrame(rafId);
    }
  }, { threshold: 0 });

  const homeSec = document.getElementById('home');
  const howSec = document.getElementById('how-it-works');
  if (homeSec) observer.observe(homeSec);
  if (howSec) observer.observe(howSec);
  if (!homeSec && !howSec) {
    isRendering = true;
    animate();
  }
})();


// ─── NAVBAR ────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link
    const sections = ['home', 'how-it-works', 'analyze', 'results'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();


// ─── GSAP HERO ANIMATIONS ──────────────────────────────────────
(function initGSAP() {
  const items = document.querySelectorAll('.gsap-fade');

  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.15,
    delay: 0.3,
  });

  // Scroll-triggered cards (legacy + new hiw-card)
  gsap.utils.toArray('.step-card, .hiw-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 60,
      duration: 0.85,
      delay: i * 0.15,
      ease: 'power3.out',
    });
  });

  // Animate the How It Works section header
  gsap.from('.hiw-header', {
    scrollTrigger: {
      trigger: '.how-it-works',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
  });

  // Animate connecting arrows with a slight delay
  gsap.utils.toArray('.step-arrow').forEach((arrow, i) => {
    gsap.from(arrow, {
      scrollTrigger: {
        trigger: arrow,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.6,
      delay: 0.3 + i * 0.15,
      ease: 'power2.out',
    });
  });

  gsap.utils.toArray('.result-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          const bar = card.querySelector('.result-bar');
          if (bar) {
            const targetW = getComputedStyle(bar).getPropertyValue('--target-width').trim();
            bar.style.width = targetW;
          }
        },
      },
      opacity: 0,
      x: -30,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });

  gsap.from('.analyze-info', {
    scrollTrigger: {
      trigger: '.analyze-section',
      start: 'top 80%',
    },
    opacity: 0,
    x: -60,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.analyze-card', {
    scrollTrigger: {
      trigger: '.analyze-section',
      start: 'top 80%',
    },
    opacity: 0,
    x: 60,
    duration: 1,
    ease: 'power3.out',
    delay: 0.15,
  });
})();


// ─── STAT COUNTER ANIMATION ────────────────────────────────────
(function initStats() {
  const statNums = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isDecimal = target % 1 !== 0;
      const decimals = isDecimal ? 1 : 0;
      const duration = 1800;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * easedProgress).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();


// ─── FILE UPLOAD INTERACTION ───────────────────────────────────
(function initUpload() {
  const area = document.getElementById('upload-area');
  const btn = document.getElementById('upload-btn');
  const input = document.getElementById('file-input');

  if (!area || !btn || !input) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    input.click();
  });

  area.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      const name = input.files[0].name;
      area.innerHTML = `
        <div class="upload-icon">✅</div>
        <p class="upload-title">${name}</p>
        <p class="upload-sub">File selected — ready for analysis</p>
        <button class="upload-btn" id="analyze-now-btn">Analyze Now →</button>
      `;
      const analyzeBtn = document.getElementById('analyze-now-btn');
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          gsap.to(area, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
          setTimeout(() => {
            area.innerHTML = `
              <div class="upload-icon">🔬</div>
              <p class="upload-title">Analyzing your DNA...</p>
              <p class="upload-sub">This is a demo — in production, results appear in &lt;24h</p>
            `;
          }, 500);
        });
      }
    }
  });

  // Drag & Drop
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('drag-over');
  });

  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));

  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      area.innerHTML = `
        <div class="upload-icon">✅</div>
        <p class="upload-title">${file.name}</p>
        <p class="upload-sub">File dropped — ready for analysis</p>
        <button class="upload-btn">Analyze Now →</button>
      `;
    }
  });
})();


// ─── DNA INPUT SECTION ─────────────────────────────────────────
(function initDNAInput() {

  /* ─── Element refs ─── */
  const tabSequence = document.getElementById('tab-sequence');
  const tabMutations = document.getElementById('tab-mutations');
  const panelSequence = document.getElementById('panel-sequence');
  const panelMutations = document.getElementById('panel-mutations');
  const tabSlider = document.getElementById('tab-slider');
  const textarea = document.getElementById('dna-textarea');
  const charCounter = document.getElementById('char-counter');
  const dnaError = document.getElementById('dna-error');
  const mutationsHint = document.getElementById('mutations-hint');
  const submitBtn = document.getElementById('dna-submit-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const allTabs = [tabSequence, tabMutations];
  const allPanels = [panelSequence, panelMutations];

  if (!tabSequence || !textarea || !submitBtn) return;

  /* ─── State ─── */
  let activeTab = 'sequence'; // 'sequence' | 'mutations'
  let sequenceValid = false;
  let selectedGenes = new Set();
  let validationTimer = null;

  const MAX_CHARS = 5000;
  const DNA_REGEX = /^[ATGCatgc\n\r\s>A-Za-z:|\-]*$/; // allow FASTA header lines
  const PURE_REGEX = /[^ATGCatgc\s\n\r>A-Za-z0-9:|\-]/;

  /* ─── Tab slider position ─── */
  function positionSlider(tabEl) {
    if (!tabEl || !tabSlider) return;
    const tabRect = tabEl.getBoundingClientRect();
    const wrapRect = tabEl.closest('.dna-tabs').getBoundingClientRect();
    tabSlider.style.left = (tabRect.left - wrapRect.left) + 'px';
    tabSlider.style.width = tabRect.width + 'px';
  }

  function switchTab(target) {
    activeTab = target;
    allTabs.forEach(t => {
      const isActive = t.id === 'tab-' + target;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive);
    });
    allPanels.forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + target);
    });
    positionSlider(document.getElementById('tab-' + target));
    refreshSubmitState();
  }

  tabSequence.addEventListener('click', () => switchTab('sequence'));
  tabMutations.addEventListener('click', () => switchTab('mutations'));

  // Init slider position after layout
  requestAnimationFrame(() => positionSlider(tabSequence));
  window.addEventListener('resize', () => {
    positionSlider(document.getElementById('tab-' + activeTab));
  });

  /* ─── Sequence Validation ─── */
  function validateSequence(value) {
    // Strip FASTA header lines (start with >) and whitespace before checking
    const stripped = value.replace(/^>.*$/gm, '').replace(/\s/g, '');
    if (stripped.length === 0) return { ok: false, msg: '' };
    if (PURE_REGEX.test(stripped)) {
      return { ok: false, msg: '⚠ Invalid DNA sequence. Only A, T, G, C characters allowed.' };
    }
    return { ok: true, msg: '' };
  }

  function showError(msg) {
    if (msg) {
      dnaError.textContent = msg;
      dnaError.classList.add('visible');
      textarea.classList.add('error');
    } else {
      dnaError.classList.remove('visible');
      textarea.classList.remove('error');
      dnaError.textContent = '';
    }
  }

  /* ─── Char Counter ─── */
  function updateCounter(val) {
    const len = val.length;
    charCounter.textContent = len + ' / ' + MAX_CHARS;
    charCounter.classList.remove('warn', 'max');
    if (len >= MAX_CHARS) {
      charCounter.classList.add('max');
    } else if (len >= MAX_CHARS * 0.8) {
      charCounter.classList.add('warn');
    }
  }

  textarea.addEventListener('input', () => {
    const val = textarea.value;
    updateCounter(val);

    // Debounced validation
    clearTimeout(validationTimer);
    validationTimer = setTimeout(() => {
      const result = validateSequence(val);
      sequenceValid = result.ok;
      showError(result.msg);
      refreshSubmitState();
    }, 400);

    // Immediate refresh for submit state (use last known valid)
    refreshSubmitState();
  });

  /* ─── Mutation Toggles ─── */
  const mutationBtns = document.querySelectorAll('.mutation-btn');
  mutationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const gene = btn.dataset.gene;
      if (selectedGenes.has(gene)) {
        selectedGenes.delete(gene);
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        selectedGenes.add(gene);
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }
      // Show/hide hint
      if (mutationsHint) {
        mutationsHint.classList.toggle('hidden', selectedGenes.size > 0);
      }
      refreshSubmitState();
    });
    btn.setAttribute('aria-pressed', 'false');
  });

  /* ─── Submit gate ─── */
  function refreshSubmitState() {
    let enabled = false;
    if (activeTab === 'sequence') {
      // Re-run lightweight check (the heavy one is debounced)
      const val = textarea.value;
      const stripped = val.replace(/^>.*$/gm, '').replace(/\s/g, '');
      enabled = stripped.length >= 1 && !PURE_REGEX.test(stripped);
    } else {
      enabled = selectedGenes.size > 0;
    }
    submitBtn.disabled = !enabled;
  }

  /* ─── Loading Overlay ─── */
  const TOTAL_DURATION = 4000; // 4 seconds total
  const STEP_INTERVAL = 800;  // one step every 0.8s
  const NUM_STEPS = 5;
  let loadingTimers = [];
  let loadingRafId = null;

  function showLoading() {
    // Capture current input data for results page
    window.generiskAnalysisData = {
      mode: activeTab,
      sequence: activeTab === 'sequence' ? textarea.value.trim() : null,
      mutations: activeTab === 'mutations' ? [...selectedGenes] : []
    };

    // Reset overlay state
    const stepEls = [0, 1, 2, 3, 4].map(i => document.getElementById('ls-step-' + i));
    stepEls.forEach(el => { if (el) el.classList.remove('visible'); });
    loadingBarFill.style.width = '0%';
    const pctEl = document.getElementById('loading-bar-pct');
    if (pctEl) pctEl.textContent = '0%';

    // Show overlay
    loadingOverlay.classList.add('visible');
    loadingOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Clear any previous timers
    loadingTimers.forEach(t => clearTimeout(t));
    loadingTimers = [];
    if (loadingRafId) cancelAnimationFrame(loadingRafId);

    // Schedule each step at 0.8s intervals
    stepEls.forEach((el, i) => {
      if (!el) return;
      const t = setTimeout(() => {
        el.classList.add('visible');
      }, 200 + i * STEP_INTERVAL);
      loadingTimers.push(t);
    });

    // Animate progress bar via RAF over 4 seconds
    const startTime = performance.now();
    function animateBar(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);
      // Slightly accelerating ease
      const eased = progress < 1 ? (1 - Math.pow(1 - progress, 1.5)) : 1;
      const pct = Math.round(eased * 100);
      loadingBarFill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
      if (progress < 1) {
        loadingRafId = requestAnimationFrame(animateBar);
      } else {
        // All done — fade out and go to results
        setTimeout(hideLoading, 300);
      }
    }
    loadingRafId = requestAnimationFrame(animateBar);
  }

  function hideLoading() {
    const inputSection = document.getElementById('analyze');
    const resultsSection = document.getElementById('results');

    if (typeof window.updateDashboard === 'function') {
      window.updateDashboard();
    }

    // Page transition: fade out -> fade in between Input and Results via GSAP (0.4s)
    if (inputSection && resultsSection) {
      loadingOverlay.classList.remove('visible', 'fade-out');
      loadingOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      gsap.to(inputSection, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          resultsSection.style.opacity = '0';
          resultsSection.scrollIntoView({ behavior: 'auto' });
          gsap.set(inputSection, { opacity: 1 });
          gsap.to(resultsSection, { opacity: 1, duration: 0.4 });
        }
      });
    } else {
      // Fallback
      loadingOverlay.classList.add('fade-out');
      setTimeout(() => {
        loadingOverlay.classList.remove('visible', 'fade-out');
        loadingOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }

  /* ─── Submit ─── */
  submitBtn.addEventListener('click', () => {
    if (submitBtn.disabled) return;

    // Final validation
    if (activeTab === 'sequence') {
      const result = validateSequence(textarea.value);
      if (!result.ok) {
        showError(result.msg);
        textarea.focus();
        return;
      }
    }

    // Animate button briefly before overlay
    gsap.to(submitBtn, {
      scale: 0.96,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      onComplete: () => { showLoading(); }
    });
  });

  /* ─── GSAP scroll-in for card ─── */
  gsap.from('#dna-card', {
    scrollTrigger: {
      trigger: '#dna-card',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.dna-section-header', {
    scrollTrigger: {
      trigger: '.dna-input-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
  });

})();




// ═══════════════════════════════════════════════════════════
//  CANCER RISK DASHBOARD — with Gemini AI Integration
// ═══════════════════════════════════════════════════════════
(function initDashboard() {

  /* ─── Baseline fallback scores (no mutations) ─────────── */
  var FALLBACK_SCORES = [
    { name: 'Breast', pct: 12 },
    { name: 'Lung', pct: 11 },
    { name: 'Colon', pct: 10 },
    { name: 'Ovarian', pct: 13 },
    { name: 'Blood', pct: 10 },
  ];

  /* ─── Gene rule definitions ─────────────────────────── */
  var GENE_RULES = {
    BRCA1: { rules: { Breast: 75, Ovarian: 60 }, type: 'Loss of Function', cancer: 'Breast, Ovarian' },
    BRCA2: { rules: { Breast: 65, Ovarian: 55 }, type: 'Loss of Function', cancer: 'Breast, Ovarian' },
    TP53: { rules: { Lung: 65, Colon: 55, Blood: 50 }, type: 'Missense Variant', cancer: 'Lung, Blood, Colon' },
    KRAS: { rules: { Lung: 70, Colon: 65 }, type: 'Activating Mutation', cancer: 'Lung, Colon' },
    MLH1: { rules: { Colon: 80 }, type: 'Frameshift Deletion', cancer: 'Colon' },
    EGFR: { rules: { Lung: 60 }, type: 'Exon 19 Deletion', cancer: 'Lung' },
    APC: { rules: { Colon: 70 }, type: 'Nonsense Mutation', cancer: 'Colon' },
    PTEN: { rules: { Breast: 50, Ovarian: 40 }, type: 'Loss of Function', cancer: 'Breast, Ovarian' },
    RB1: { rules: { Blood: 45 }, type: 'Loss of Function', cancer: 'Blood' },
    CDKN2A: { rules: { Lung: 45, Blood: 40 }, type: 'Splice Site Variant', cancer: 'Lung, Blood' },
  };

  /* ─── Step 1: Mutation Detection ────────────────────── */
  function detectMutations() {
    var data = window.generiskAnalysisData || {};
    var mode = data.mode || 'mutations';
    var rawSequence = ((data.sequence) || '').replace(/^>.*$/gm, '').toUpperCase();
    var selectedGenes = data.mutations || [];

    var activeGenes = [];

    if (mode === 'mutations') {
      activeGenes = selectedGenes.filter(function (g) { return GENE_RULES[g]; });
    } else {
      // Exact marker matching
      var markers = {
        BRCA1: "ATGGATTTATCTGCT",
        TP53: "ATGTTCAAGACAGAT",
        KRAS: "ATGACTGAATATAAAC"
      };

      Object.keys(markers).forEach(function (gene) {
        if (rawSequence.indexOf(markers[gene]) !== -1) {
          activeGenes.push(gene);
        }
      });

      // Fallback to previous behavior for genes without exact markers
      Object.keys(GENE_RULES).forEach(function (gene) {
        if (!markers[gene] && rawSequence.indexOf(gene) !== -1) {
          activeGenes.push(gene);
        }
      });
    }

    // Compute risk scores — start with baseline, apply gene boosts
    var riskMap = { Breast: 12, Lung: 11, Colon: 10, Ovarian: 13, Blood: 10 };
    activeGenes.forEach(function (gene) {
      if (GENE_RULES[gene]) {
        var geneRules = GENE_RULES[gene].rules;
        Object.keys(geneRules).forEach(function (cancer) {
          // If multiple mutations affect the same cancer type, take HIGHER value (Math.max)
          riskMap[cancer] = Math.max(riskMap[cancer] || 10, geneRules[cancer]);
        });
      }
    });

    var riskScores = Object.keys(riskMap).map(function (name) {
      // Cap at 95% maximum
      return { name: name, pct: Math.min(Math.round(riskMap[name]), 95) };
    });

    var maxPct = Math.max.apply(null, riskScores.map(function (r) { return r.pct; }));
    var overallRisk = maxPct > 60 ? 'HIGH' : maxPct > 30 ? 'MEDIUM' : 'LOW';

    var mutationDetails = activeGenes.map(function (gene) {
      var def = GENE_RULES[gene];
      var maxG = Math.max.apply(null, Object.keys(def.rules).map(function (k) { return def.rules[k]; }));
      return { gene: gene, type: def.type, risk: maxG > 60 ? 'HIGH' : maxG > 30 ? 'MEDIUM' : 'LOW', cancer: def.cancer };
    });

    return { mutations: activeGenes, overallRisk: overallRisk, riskScores: riskScores, mutationDetails: mutationDetails };
  }

  /* ─── 5. Orchestrate Data Fetch ────────────────────────── */
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/predict' 
    : null;

  async function fetchPredictAPI(mutations) {
    if (API_URL) {
      try {
        var response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mutations: mutations })
        });
        if (!response.ok) throw new Error('API_ERROR');
        return await response.json();
      } catch (err) {
        console.warn("Local ML API fetch failed, falling back to mock data.", err);
        return getFallbackData(mutations);
      }
    } else {
      console.log('Running on remote host, using fallback ML data.');
      return getFallbackData(mutations);
    }
  }

  function getFallbackData(mutations) {
    // Mimic the exact structure returned by the python API
    if (mutations.includes('BRCA1') || mutations.includes('BRCA2') || mutations.includes('PTEN')) {
      return {
        scores: { breast: 75, lung: 20, colon: 15, ovarian: 60, blood: 15 },
        risk_level: 'HIGH',
        explanation: getFallbackExplanation(mutations),
        confidence: 94.2
      };
    } else if (mutations.includes('TP53')) {
      return {
        scores: { breast: 30, lung: 65, colon: 55, ovarian: 25, blood: 50 },
        risk_level: 'HIGH',
        explanation: getFallbackExplanation(mutations),
        confidence: 91.5
      };
    } else if (mutations.includes('KRAS') || mutations.includes('EGFR') || mutations.includes('CDKN2A')) {
      return {
        scores: { breast: 20, lung: 70, colon: 65, ovarian: 15, blood: 20 },
        risk_level: 'HIGH',
        explanation: getFallbackExplanation(mutations),
        confidence: 92.8
      };
    } else if (mutations.length > 0) {
      return {
        scores: { breast: 25, lung: 25, colon: 45, ovarian: 20, blood: 35 },
        risk_level: 'MEDIUM',
        explanation: getFallbackExplanation(mutations),
        confidence: 88.0
      };
    }
    
    return {
      scores: { breast: 12, lung: 11, colon: 10, ovarian: 13, blood: 10 },
      risk_level: 'LOW',
      explanation: getFallbackExplanation([]),
      confidence: 98.1
    };
  }

  function getFallbackExplanation(mutations) {
    if (mutations.includes('BRCA1')) {
      return "The BRCA1 mutation is a tumor suppressor gene mutation that significantly increases the risk of breast and ovarian cancer. Individuals with this mutation have up to a 75% lifetime risk of developing breast cancer. However, early detection through regular screenings dramatically improves outcomes. We recommend scheduling a consultation with a genetic counselor as a positive first step.";
    } else if (mutations.includes('TP53')) {
      return "The TP53 mutation affects the body's primary tumor suppressor gene, increasing risk across multiple cancer types including lung, colon, and blood cancers. Regular screening and a healthy lifestyle can significantly reduce your overall risk. Consult an oncologist for a personalized surveillance plan.";
    } else if (mutations.includes('KRAS')) {
      return "The KRAS mutation is commonly associated with lung and colon cancer development. While this mutation raises your risk profile, modern targeted therapies have made KRAS-related cancers increasingly treatable. Early screening is your best defense.";
    } else if (mutations.length === 0) {
      return "No high-risk mutations were detected in your sample. Your baseline cancer risk profile is within normal ranges. Continue maintaining a healthy lifestyle with regular checkups as prevention is always the best medicine.";
    } else {
      return "Genetic markers associated with increased cancer risk were detected. Early detection and regular screening are your best tools for prevention. We recommend consulting with a healthcare professional or genetic counselor for a personalized surveillance plan.";
    }
  }

  /* ─── PDF Download ────────────────────────────────── */
  function setupPDFDownload() {
    var btn = document.getElementById('download-pdf-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        alert('PDF libraries not yet loaded. Please try again in a moment.'); return;
      }
      btn.disabled = true;
      btn.querySelector('.download-text').textContent = 'Generating\u2026';
      var section = document.getElementById('results');
      html2canvas(section, {
        backgroundColor: '#0A1628', scale: 2, useCORS: true, logging: false,
        ignoreElements: function (el) { return el.id === 'particle-canvas' || el.id === 'dna-canvas'; }
      }).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');
        var jsPDF = window.jspdf.jsPDF;
        var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        var pageW = pdf.internal.pageSize.getWidth(); var pageH = pdf.internal.pageSize.getHeight();
        var pdfImgW = pageW; var pdfImgH = pdfImgW / (canvas.width / canvas.height);
        var y = 0;
        while (y < pdfImgH) { if (y > 0) pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, -y, pdfImgW, pdfImgH); y += pageH; }
        pdf.save('GeneRisk-AI-Report.pdf');
      }).catch(function (err) {
        console.error('PDF error:', err); alert('PDF generation failed. Please try again.');
      }).finally(function () {
        btn.disabled = false; btn.querySelector('.download-text').textContent = 'Download Report';
      });
    });
  }

  /* ─── GSAP Scroll Animations ─────────────────────── */
  function mountGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.from('#dashboard-summary', {
      scrollTrigger: { trigger: '#dashboard-summary', start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    });
    gsap.utils.toArray('.dash-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0, y: 50, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
      });
    });
    gsap.utils.toArray('.rec-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, scale: 0.97, duration: 0.75, delay: i * 0.12, ease: 'power3.out',
      });
    });
  }

  /* ─── AI card states ─────────────────────────────────── */
  function showAILoading() {
    var el = document.getElementById('ai-typewriter');
    var retryBtn = document.getElementById('ai-retry-btn');
    if (!el) return;
    el.classList.remove('ai-error-msg', 'done');
    el.classList.add('ai-loading-pulse');
    el.textContent = '\uD83E\uDD16 Generating AI analysis\u2026';
    if (retryBtn) retryBtn.classList.add('hidden');
  }

  function showAIError(code) {
    var el = document.getElementById('ai-typewriter');
    var retryBtn = document.getElementById('ai-retry-btn');
    if (!el) return;
    el.classList.remove('ai-loading-pulse', 'done');
    el.classList.add('ai-error-msg');
    el.textContent = 'Unable to connect to ML Model. Please try again.';
    if (retryBtn) retryBtn.classList.remove('hidden');
  }

  /* ─── Dashboard Orchestrator ─────────────────────────── */
  async function runDashboardUpdate() {
    var analysisData = detectMutations();
    showAILoading();
    var mutations = analysisData.mutations;

    try {
      var result = await fetchPredictAPI(mutations);
      console.log('ML API Result:', result);
      
      analysisData.overallRisk = result.risk_level;
      analysisData.explanation = result.explanation;
      analysisData.riskScores = [
        { name: 'Breast', pct: parseInt(result.scores.breast) || 0 },
        { name: 'Lung', pct: parseInt(result.scores.lung) || 0 },
        { name: 'Colon', pct: parseInt(result.scores.colon) || 0 },
        { name: 'Ovarian', pct: parseInt(result.scores.ovarian) || 0 },
        { name: 'Blood', pct: parseInt(result.scores.blood) || 0 }
      ];

      updateSummaryCard(analysisData);
      mountRings(analysisData);
      mountMutationsTable(analysisData);
      runTypewriter(analysisData.explanation);

      setTimeout(function () {
        var scoresObj = { breast: 0, lung: 0, colon: 0, ovarian: 0, blood: 0 };
        if (analysisData && analysisData.riskScores) {
          analysisData.riskScores.forEach(function (s) {
            scoresObj[s.name.toLowerCase()] = s.pct;
          });
        }
        if (typeof drawRadar === 'function') drawRadar(scoresObj);

        // Map progress rings and force animation
        document.querySelectorAll('.ring-fill').forEach(function (circle) {
          var target = parseFloat(circle.dataset.offset);
          requestAnimationFrame(function () { circle.style.strokeDashoffset = target; });
        });
      }, 300);

    } catch (err) {
      console.error("Dashboard update failed:", err);
      showAIError('UNKNOWN');
    }
  }

  /* ─── Boot ───────────────────────────────────────────── */
  function boot() {
    runDashboardUpdate().then(() => {
      setupPDFDownload();
      mountGSAPAnimations();
    });

    var retryBtn = document.getElementById('ai-retry-btn');
    if (retryBtn && !retryBtn.hasAttribute('data-bound')) {
      retryBtn.addEventListener('click', function () {
        runDashboardUpdate();
      });
      retryBtn.setAttribute('data-bound', 'true');
    }
  }

  window.updateDashboard = function () {
    runDashboardUpdate();
  };

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }

})();

// ─── VISUAL POLISH: Cursor Glow & Back To Top ─────────────────
(function initVisualPolish() {
  // Cursor Glow
  const cursor = document.getElementById('custom-cursor');
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
        cursor.style.opacity = '1';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) cursor.style.opacity = '0';
    });
  }

  // Back To Top
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
