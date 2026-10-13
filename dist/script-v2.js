import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

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

document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .1, rootMargin: "0px 0px -6% 0px" });

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

// The technology board is intentionally fixed: no cards can be dragged or dropped.
document.querySelectorAll(".tech-card").forEach((card) => {
  card.draggable = false;
  card.removeAttribute("draggable");
  card.addEventListener("dragstart", (event) => event.preventDefault());
});

const board = document.getElementById("kanban");
board.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  board.scrollLeft += event.deltaY;
}, { passive: false });

let scrollY = window.scrollY;
let ticking = false;

function updateScrollEffects() {
  scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? scrollY / maxScroll : 0})`;
  header.classList.toggle("scrolled", scrollY > 36);

  if (!reducedMotion) {
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -240 || rect.top > innerHeight + 240) return;
      const image = el.querySelector("img");
      if (!image) return;
      const speed = Number(el.dataset.speed || .07);
      const distance = rect.top + rect.height / 2 - innerHeight / 2;
      image.style.transform = `translate3d(0, ${-distance * speed}px, 0) scale(1.035)`;
    });
  }
  ticking = false;
}

addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollEffects);
}, { passive: true });
updateScrollEffects();

function seededRandom(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function buildSystemField() {
  const canvas = document.getElementById("world");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080b0c, .042);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .1, 80);
  camera.position.set(0, .35, 13.5);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .88, .76, .18);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  scene.add(new THREE.HemisphereLight(0xc8f7f5, 0x25150f, 1.2));
  const cyanLight = new THREE.PointLight(0x69edf3, 24, 18, 2);
  cyanLight.position.set(3.8, 2.4, 3);
  scene.add(cyanLight);
  const emberLight = new THREE.PointLight(0xff8654, 20, 16, 2);
  emberLight.position.set(-4, -2.5, 2);
  scene.add(emberLight);

  const field = new THREE.Group();
  field.position.set(3.9, -.25, -2.7);
  scene.add(field);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x7cecf0,
    roughness: .12,
    metalness: .08,
    transmission: .74,
    thickness: 1.8,
    ior: 1.44,
    clearcoat: 1,
    clearcoatRoughness: .13,
    iridescence: .75,
    iridescenceIOR: 1.35,
    transparent: true,
    opacity: .78,
    emissive: 0x0a6870,
    emissiveIntensity: .2,
    depthWrite: false
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.42, 6), glass);
  field.add(core);

  const coreShader = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCyan: { value: new THREE.Color(0x8de9ef) }, uEmber: { value: new THREE.Color(0xf48a54) } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 p = position * (1.0 + sin(position.y * 7.0 + uTime * 1.4) * 0.022);
        vPosition = p;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3 uCyan;
      uniform vec3 uEmber;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 3.2);
        float pulse = 0.5 + 0.5 * sin(uTime * 1.8 + vPosition.y * 9.0);
        vec3 color = mix(uEmber, uCyan, pulse * 0.58 + 0.22);
        float alpha = 0.09 + fresnel * 0.44 + pulse * 0.035;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const pulseCore = new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 64), coreShader);
  field.add(pulseCore);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.92, .028, 320, 12, 2, 5),
    new THREE.MeshBasicMaterial({ color: 0x9df8f4, transparent: true, opacity: .54, blending: THREE.AdditiveBlending })
  );
  knot.rotation.set(.45, .18, .25);
  field.add(knot);

  const flowMaterialCyan = new THREE.MeshStandardMaterial({ color: 0x58e4eb, emissive: 0x16818b, emissiveIntensity: 2.2, roughness: .22, metalness: .1, transparent: true, opacity: .66 });
  const flowMaterialEmber = new THREE.MeshStandardMaterial({ color: 0xff9a68, emissive: 0xa13d20, emissiveIntensity: 1.8, roughness: .26, transparent: true, opacity: .63 });
  const curves = [];
  const movers = [];

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const sway = i % 2 ? 1 : -1;
    const start = new THREE.Vector3(Math.cos(angle) * 1.25, Math.sin(angle) * 1.05, Math.sin(angle * 2) * .5);
    const curve = new THREE.CatmullRomCurve3([
      start,
      new THREE.Vector3(Math.cos(angle) * 2.6, Math.sin(angle) * 2.1, sway * .85),
      new THREE.Vector3(Math.cos(angle + .5) * 4.2, Math.sin(angle + .35) * 3.3, sway * 1.35),
      new THREE.Vector3(Math.cos(angle + .75) * 6.2, Math.sin(angle + .55) * 4.2, -1.4 + sway * .7)
    ], false, "catmullrom", .6);
    curves.push(curve);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 96, i % 2 ? .018 : .026, 6, false), i % 3 === 0 ? flowMaterialEmber : flowMaterialCyan);
    field.add(tube);

    for (let j = 0; j < 3; j += 1) {
      const mover = new THREE.Mesh(
        new THREE.SphereGeometry(j === 0 ? .075 : .045, 12, 12),
        new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff9a68 : 0xa7fbff, blending: THREE.AdditiveBlending, transparent: true, opacity: .95 })
      );
      mover.userData = { curve, offset: (j / 3 + seededRandom(i * 7 + j)) % 1, speed: .025 + seededRandom(i * 11 + j) * .026 };
      field.add(mover);
      movers.push(mover);
    }
  }

  const nodeGeometry = new THREE.OctahedronGeometry(.07, 0);
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x9eeff2, emissive: 0x186e75, emissiveIntensity: 1.3, roughness: .2, metalness: .45, transparent: true, opacity: .76 });
  const nodeCount = innerWidth < 700 ? 34 : 72;
  const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodeCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < nodeCount; i += 1) {
    const phi = Math.acos(1 - 2 * (i + .5) / nodeCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 2.6 + seededRandom(i) * 4.1;
    dummy.position.set(Math.cos(theta) * Math.sin(phi) * radius, Math.cos(phi) * radius * .72, Math.sin(theta) * Math.sin(phi) * radius * .65);
    const scale = .7 + seededRandom(i + 4) * 2.2;
    dummy.scale.setScalar(scale);
    dummy.rotation.set(theta, phi, theta * .4);
    dummy.updateMatrix();
    nodes.setMatrixAt(i, dummy.matrix);
  }
  field.add(nodes);

  const particleCount = innerWidth < 700 ? 420 : 1100;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    positions[i3] = (seededRandom(i * 3) - .5) * 20;
    positions[i3 + 1] = (seededRandom(i * 3 + 1) - .5) * 14;
    positions[i3 + 2] = (seededRandom(i * 3 + 2) - .5) * 10;
    sizes[i] = .5 + seededRandom(i + 99) * 1.7;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio, 1.55) } },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vGlow;
      void main() {
        vec3 p = position;
        p.y += sin(p.x * .55 + uTime * .28) * .16;
        p.x += cos(p.y * .48 + uTime * .22) * .10;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = aSize * uPixelRatio * (13.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
        vGlow = aSize;
      }
    `,
    fragmentShader: `
      varying float vGlow;
      void main() {
        float d = distance(gl_PointCoord, vec2(.5));
        float alpha = smoothstep(.5, .02, d) * (.22 + vGlow * .15);
        vec3 c = mix(vec3(.36,.86,.9), vec3(1.0,.48,.25), step(1.78,vGlow));
        gl_FragColor = vec4(c,alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  field.add(particles);

  const pointer = new THREE.Vector2();
  addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / innerWidth - .5;
    pointer.y = event.clientY / innerHeight - .5;
  }, { passive: true });

  const clock = new THREE.Clock();
  function render() {
    const t = clock.getElapsedTime();
    const pageProgress = scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    coreShader.uniforms.uTime.value = t;
    particleMaterial.uniforms.uTime.value = t;
    knot.rotation.x = .45 + Math.sin(t * .22) * .14;
    knot.rotation.y = .18 + t * .08;
    core.rotation.y = t * .055;
    core.rotation.x = Math.sin(t * .17) * .16;
    pulseCore.scale.setScalar(1 + Math.sin(t * 1.25) * .025);
    nodes.rotation.y = -t * .018;
    particles.rotation.y = t * .006;

    movers.forEach((mover) => {
      const u = (mover.userData.offset + t * mover.userData.speed) % 1;
      mover.position.copy(mover.userData.curve.getPointAt(u));
      const pulse = 1 + Math.sin((u + t) * 12) * .2;
      mover.scale.setScalar(pulse);
    });

    field.rotation.y += ((pointer.x * .18 + pageProgress * .48) - field.rotation.y) * .022;
    field.rotation.x += ((-pointer.y * .11 + pageProgress * .18) - field.rotation.x) * .02;
    field.position.y += ((-.25 - pageProgress * 2.1) - field.position.y) * .025;
    field.position.x += (((innerWidth < 760 ? 1.3 : 3.9) + pointer.x * .55) - field.position.x) * .02;
    camera.position.x += (pointer.x * .32 - camera.position.x) * .024;
    camera.position.y += ((.35 - pointer.y * .24) - camera.position.y) * .024;
    cyanLight.position.x = 3.8 + Math.sin(t * .36) * 1.2;
    emberLight.position.y = -2.5 + Math.cos(t * .31) * .8;
    composer.render();
    requestAnimationFrame(render);
  }
  render();

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    particleMaterial.uniforms.uPixelRatio.value = Math.min(devicePixelRatio, 1.55);
  });
}

if (!reducedMotion) {
  try {
    buildSystemField();
  } catch (error) {
    console.warn("Three.js system field unavailable; the high-resolution image layer remains active.", error);
  }
}
