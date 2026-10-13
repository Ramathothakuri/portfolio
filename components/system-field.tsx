"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export default function SystemField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b0c, 0.042);
    const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 80);
    camera.position.set(0, 0.35, 13.5);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.88, 0.76, 0.18));
    composer.addPass(new OutputPass());

    scene.add(new THREE.HemisphereLight(0xc8f7f5, 0x25150f, 1.2));
    const cyanLight = new THREE.PointLight(0x69edf3, 24, 18, 2);
    cyanLight.position.set(3.8, 2.4, 3);
    scene.add(cyanLight);
    const emberLight = new THREE.PointLight(0xff8654, 20, 16, 2);
    emberLight.position.set(-4, -2.5, 2);
    scene.add(emberLight);

    const field = new THREE.Group();
    field.position.set(3.9, -0.25, -2.7);
    scene.add(field);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, 6),
      new THREE.MeshPhysicalMaterial({
        color: 0x7cecf0, roughness: 0.12, metalness: 0.08, transmission: 0.74, thickness: 1.8,
        ior: 1.44, clearcoat: 1, clearcoatRoughness: 0.13, iridescence: 0.75,
        iridescenceIOR: 1.35, transparent: true, opacity: 0.78, emissive: 0x0a6870,
        emissiveIntensity: 0.2, depthWrite: false,
      }),
    );
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
          gl_FragColor = vec4(color, 0.09 + fresnel * 0.44 + pulse * 0.035);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const pulseCore = new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 64), coreShader);
    field.add(pulseCore);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.92, 0.028, 320, 12, 2, 5),
      new THREE.MeshBasicMaterial({ color: 0x9df8f4, transparent: true, opacity: 0.54, blending: THREE.AdditiveBlending }),
    );
    knot.rotation.set(0.45, 0.18, 0.25);
    field.add(knot);

    const cyanFlow = new THREE.MeshStandardMaterial({ color: 0x58e4eb, emissive: 0x16818b, emissiveIntensity: 2.2, roughness: 0.22, metalness: 0.1, transparent: true, opacity: 0.66 });
    const emberFlow = new THREE.MeshStandardMaterial({ color: 0xff9a68, emissive: 0xa13d20, emissiveIntensity: 1.8, roughness: 0.26, transparent: true, opacity: 0.63 });
    const movers: THREE.Mesh[] = [];

    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      const sway = i % 2 ? 1 : -1;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 1.25, Math.sin(angle) * 1.05, Math.sin(angle * 2) * 0.5),
        new THREE.Vector3(Math.cos(angle) * 2.6, Math.sin(angle) * 2.1, sway * 0.85),
        new THREE.Vector3(Math.cos(angle + 0.5) * 4.2, Math.sin(angle + 0.35) * 3.3, sway * 1.35),
        new THREE.Vector3(Math.cos(angle + 0.75) * 6.2, Math.sin(angle + 0.55) * 4.2, -1.4 + sway * 0.7),
      ], false, "catmullrom", 0.6);
      field.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 96, i % 2 ? 0.018 : 0.026, 6, false), i % 3 === 0 ? emberFlow : cyanFlow));

      for (let j = 0; j < 3; j += 1) {
        const mover = new THREE.Mesh(
          new THREE.SphereGeometry(j === 0 ? 0.075 : 0.045, 12, 12),
          new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff9a68 : 0xa7fbff, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.95 }),
        );
        mover.userData = { curve, offset: (j / 3 + seededRandom(i * 7 + j)) % 1, speed: 0.025 + seededRandom(i * 11 + j) * 0.026 };
        field.add(mover);
        movers.push(mover);
      }
    }

    const nodeCount = innerWidth < 700 ? 34 : 72;
    const nodes = new THREE.InstancedMesh(
      new THREE.OctahedronGeometry(0.07, 0),
      new THREE.MeshStandardMaterial({ color: 0x9eeff2, emissive: 0x186e75, emissiveIntensity: 1.3, roughness: 0.2, metalness: 0.45, transparent: true, opacity: 0.76 }),
      nodeCount,
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < nodeCount; i += 1) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.6 + seededRandom(i) * 4.1;
      dummy.position.set(Math.cos(theta) * Math.sin(phi) * radius, Math.cos(phi) * radius * 0.72, Math.sin(theta) * Math.sin(phi) * radius * 0.65);
      dummy.scale.setScalar(0.7 + seededRandom(i + 4) * 2.2);
      dummy.rotation.set(theta, phi, theta * 0.4);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;
    field.add(nodes);

    const particleCount = innerWidth < 700 ? 420 : 1100;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3;
      positions[index] = (seededRandom(i * 3) - 0.5) * 20;
      positions[index + 1] = (seededRandom(i * 3 + 1) - 0.5) * 14;
      positions[index + 2] = (seededRandom(i * 3 + 2) - 0.5) * 10;
      sizes[i] = 0.5 + seededRandom(i + 99) * 1.7;
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
          vec3 color = mix(vec3(.36,.86,.9), vec3(1.0,.48,.25), step(1.78,vGlow));
          gl_FragColor = vec4(color,alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    field.add(particles);

    const pointer = new THREE.Vector2();
    let scrollY = window.scrollY;
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / innerWidth - 0.5;
      pointer.y = event.clientY / innerHeight - 0.5;
    };
    const onScroll = () => { scrollY = window.scrollY; };

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const time = clock.getElapsedTime();
      const pageProgress = scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      coreShader.uniforms.uTime.value = time;
      particleMaterial.uniforms.uTime.value = time;
      knot.rotation.x = 0.45 + Math.sin(time * 0.22) * 0.14;
      knot.rotation.y = 0.18 + time * 0.08;
      core.rotation.y = time * 0.055;
      core.rotation.x = Math.sin(time * 0.17) * 0.16;
      pulseCore.scale.setScalar(1 + Math.sin(time * 1.25) * 0.025);
      nodes.rotation.y = -time * 0.018;
      particles.rotation.y = time * 0.006;

      movers.forEach((mover) => {
        const curve = mover.userData.curve as THREE.CatmullRomCurve3;
        const progress = (mover.userData.offset + time * mover.userData.speed) % 1;
        mover.position.copy(curve.getPointAt(progress));
        mover.scale.setScalar(1 + Math.sin((progress + time) * 12) * 0.2);
      });

      field.rotation.y += (pointer.x * 0.18 + pageProgress * 0.48 - field.rotation.y) * 0.022;
      field.rotation.x += (-pointer.y * 0.11 + pageProgress * 0.18 - field.rotation.x) * 0.02;
      field.position.y += (-0.25 - pageProgress * 2.1 - field.position.y) * 0.025;
      field.position.x += ((innerWidth < 760 ? 1.3 : 3.9) + pointer.x * 0.55 - field.position.x) * 0.02;
      camera.position.x += (pointer.x * 0.32 - camera.position.x) * 0.024;
      camera.position.y += (0.35 - pointer.y * 0.24 - camera.position.y) * 0.024;
      cyanLight.position.x = 3.8 + Math.sin(time * 0.36) * 1.2;
      emberLight.position.y = -2.5 + Math.cos(time * 0.31) * 0.8;
      composer.render();
      frame = requestAnimationFrame(render);
    };

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
      renderer.setSize(innerWidth, innerHeight);
      composer.setSize(innerWidth, innerHeight);
      particleMaterial.uniforms.uPixelRatio.value = Math.min(devicePixelRatio, 1.55);
    };

    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    render();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onPointer);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh | THREE.Points;
        if (renderable.geometry) renderable.geometry.dispose();
        const material = renderable.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="world" aria-hidden="true" />;
}
