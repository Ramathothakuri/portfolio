import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress span");
const parallaxEls = [...document.querySelectorAll(".parallax")];
const menuButton = document.querySelector(".menu-button");

document.getElementById("year").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
  revealObserver.observe(el);
});

let scrollY = window.scrollY;
let ticking = false;

function updateScrollEffects() {
  scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? scrollY / maxScroll : 0;
  progress.style.transform = `scaleX(${ratio})`;
  header.classList.toggle("scrolled", scrollY > 40);

  if (!reducedMotion) {
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        const speed = Number(el.dataset.speed || 0.08);
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const image = el.querySelector("img");
        if (image) image.style.transform = `translate3d(0, ${-centerOffset * speed}px, 0) scale(1.03)`;
      }
    });
  }
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

// Technology board: cards can be re-prioritized between columns without losing the source taxonomy.
const board = document.getElementById("kanban");
const columns = [...board.querySelectorAll(".kanban-column")];
const initialBoard = columns.map((column) => column.querySelector(".kanban-list").innerHTML);
let draggedCard = null;

function updateCounts() {
  columns.forEach((column) => {
    column.querySelector("header b").textContent = column.querySelectorAll(".tech-card").length;
  });
}

function bindCards() {
  board.querySelectorAll(".tech-card").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedCard = card;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      columns.forEach((column) => column.classList.remove("drag-over"));
      draggedCard = null;
      updateCounts();
    });
  });
}

columns.forEach((column) => {
  const list = column.querySelector(".kanban-list");
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    column.classList.add("drag-over");
    if (!draggedCard) return;
    const cards = [...list.querySelectorAll(".tech-card:not(.dragging)")];
    const next = cards.find((card) => event.clientY <= card.getBoundingClientRect().top + card.offsetHeight / 2);
    list.insertBefore(draggedCard, next || null);
  });
  column.addEventListener("dragleave", (event) => {
    if (!column.contains(event.relatedTarget)) column.classList.remove("drag-over");
  });
  column.addEventListener("drop", () => column.classList.remove("drag-over"));
});

document.getElementById("reset-board").addEventListener("click", () => {
  columns.forEach((column, index) => {
    column.querySelector(".kanban-list").innerHTML = initialBoard[index];
  });
  bindCards();
  updateCounts();
});

board.addEventListener("wheel", (event) => {
  if (event.shiftKey || Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
    event.preventDefault();
    board.scrollLeft += event.deltaY || event.deltaX;
  }
}, { passive: false });

bindCards();
updateCounts();

if (!reducedMotion) {
  try {
    const canvas = document.getElementById("world");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a0c, 0.075);
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.3, 9.5);

    const root = new THREE.Group();
    scene.add(root);

    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const core = new THREE.Mesh(coreGeometry, new THREE.MeshBasicMaterial({ color: 0x66d9e8, wireframe: true, transparent: true, opacity: 0.12 }));
    core.position.set(3.6, -.2, -2.5);
    root.add(core);

    const innerCore = new THREE.Mesh(new THREE.IcosahedronGeometry(.72, 1), new THREE.MeshBasicMaterial({ color: 0xffad5a, wireframe: true, transparent: true, opacity: .18 }));
    core.add(innerCore);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x66d9e8, wireframe: true, transparent: true, opacity: .08 });
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1 + i * .48, .012, 4, 128), ringMaterial.clone());
      ring.rotation.set(Math.PI * (.25 + i * .17), Math.PI * (.1 + i * .22), 0);
      ring.position.copy(core.position);
      root.add(ring);
    }

    const particleCount = window.innerWidth < 700 ? 420 : 900;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const cyan = new THREE.Color(0x66d9e8);
    const amber = new THREE.Color(0xffad5a);
    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - .5) * 22;
      positions[i3 + 1] = (Math.random() - .5) * 16;
      positions[i3 + 2] = (Math.random() - .5) * 13 - 1;
      const color = Math.random() > .84 ? amber : cyan;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: .018, vertexColors: true, transparent: true, opacity: .55 }));
    root.add(particles);

    const grid = new THREE.GridHelper(28, 36, 0x66d9e8, 0x31505a);
    grid.position.set(0, -4.5, -4);
    grid.material.transparent = true;
    grid.material.opacity = .045;
    root.add(grid);

    const pointer = { x: 0, y: 0 };
    window.addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / window.innerWidth - .5) * 2;
      pointer.y = (event.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();
    function render() {
      const elapsed = clock.getElapsedTime();
      const targetX = pointer.x * .16;
      const targetY = -pointer.y * .1;
      root.rotation.y += (targetX + elapsed * .018 - root.rotation.y) * .012;
      root.rotation.x += (targetY - root.rotation.x) * .02;
      core.rotation.x = elapsed * .13;
      core.rotation.y = elapsed * .19;
      innerCore.rotation.x = -elapsed * .35;
      particles.rotation.y = elapsed * .008;
      camera.position.y += ((scrollY / Math.max(document.body.scrollHeight, 1)) * -2.3 - camera.position.y + .3) * .035;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (error) {
    console.warn("Three.js enhancement unavailable; continuing with the static experience.", error);
  }
}
