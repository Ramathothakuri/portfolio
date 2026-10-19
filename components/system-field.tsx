"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type PaperPanel = THREE.Group & { userData: { phase?: number; drift?: number } };

export default function SystemField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const host = canvas.parentElement ?? canvas;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0.1, 11);

    scene.add(new THREE.HemisphereLight(0xfff9e9, 0x685c4d, 2.15));
    const keyLight = new THREE.DirectionalLight(0xfff3d5, 4.6);
    keyLight.position.set(4.5, 6.5, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x2c61b8, 14, 18, 2);
    blueLight.position.set(-4, 1.5, 4);
    scene.add(blueLight);
    const redLight = new THREE.PointLight(0xd85a3a, 10, 14, 2);
    redLight.position.set(4, -2.5, 3);
    scene.add(redLight);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 13),
      new THREE.ShadowMaterial({ color: 0x382f25, opacity: 0.16 }),
    );
    shadowPlane.position.z = -2.75;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const sculpture = new THREE.Group();
    sculpture.rotation.set(-0.12, -0.24, -0.04);
    scene.add(sculpture);

    const cream = new THREE.MeshStandardMaterial({ color: 0xf0e8d5, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
    const warm = new THREE.MeshStandardMaterial({ color: 0xdacdb5, roughness: 0.96, metalness: 0, side: THREE.DoubleSide });
    const blue = new THREE.MeshStandardMaterial({ color: 0x2457a6, roughness: 0.76, metalness: 0.02, side: THREE.DoubleSide });
    const red = new THREE.MeshStandardMaterial({ color: 0xcf5438, roughness: 0.82, metalness: 0, side: THREE.DoubleSide });
    const ink = new THREE.LineBasicMaterial({ color: 0x26251f, transparent: true, opacity: 0.62 });
    const faintInk = new THREE.LineBasicMaterial({ color: 0x26251f, transparent: true, opacity: 0.25 });

    const panels: PaperPanel[] = [];
    const makePanel = (
      width: number,
      height: number,
      material: THREE.Material,
      position: [number, number, number],
      rotation: [number, number, number],
      phase = 0,
    ) => {
      const panel = new THREE.Group() as PaperPanel;
      const geometry = new THREE.BoxGeometry(width, height, 0.055, 1, 1, 1);
      const sheet = new THREE.Mesh(geometry, material);
      sheet.castShadow = true;
      sheet.receiveShadow = true;
      panel.add(sheet);
      panel.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 28), ink));
      panel.position.set(...position);
      panel.rotation.set(...rotation);
      panel.userData = { phase, drift: 0.018 + phase * 0.002 };
      sculpture.add(panel);
      panels.push(panel);
      return panel;
    };

    makePanel(4.9, 3.25, cream, [0.25, 0.05, -0.9], [0.04, -0.42, -0.08], 0.2);
    makePanel(3.35, 4.55, warm, [-0.85, 0.25, -0.1], [-0.12, 0.46, 0.12], 0.8);
    makePanel(4.15, 1.02, blue, [0.55, 0.72, 0.5], [0.35, -0.22, -0.38], 1.4);
    makePanel(2.85, 1.3, red, [1.45, -1.2, 1.02], [-0.38, 0.38, 0.2], 2.1);

    const fold = new THREE.Group();
    fold.position.set(-0.15, -0.2, 1.35);
    sculpture.add(fold);
    for (let index = 0; index < 7; index += 1) {
      const geometry = new THREE.BoxGeometry(0.92, 2.7, 0.045);
      const material = index === 3 ? blue : index === 5 ? red : index % 2 ? warm : cream;
      const face = new THREE.Mesh(geometry, material);
      face.castShadow = true;
      face.receiveShadow = true;
      const section = new THREE.Group();
      section.add(face);
      section.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), index === 3 || index === 5 ? faintInk : ink));
      section.position.x = (index - 3) * 0.62;
      section.position.z = Math.abs(index - 3) * -0.22;
      section.rotation.y = (index % 2 ? -1 : 1) * 0.48;
      fold.add(section);
    }
    fold.rotation.set(0.16, -0.08, -0.16);

    const coreGeometry = new THREE.OctahedronGeometry(1.22, 0);
    const core = new THREE.Mesh(coreGeometry, cream);
    core.scale.set(1.08, 0.78, 0.82);
    core.position.set(0.15, 0.05, 2.3);
    core.rotation.set(0.55, 0.45, -0.2);
    core.castShadow = true;
    sculpture.add(core);
    const coreEdges = new THREE.LineSegments(new THREE.EdgesGeometry(coreGeometry), ink);
    coreEdges.scale.copy(core.scale);
    coreEdges.position.copy(core.position);
    coreEdges.rotation.copy(core.rotation);
    sculpture.add(coreEdges);

    const orbit = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.TorusGeometry(3.25, 0.018, 5, 128)),
      faintInk,
    );
    orbit.rotation.set(1.15, 0.18, 0.28);
    sculpture.add(orbit);

    const notes = new THREE.Group();
    sculpture.add(notes);
    for (let index = 0; index < 6; index += 1) {
      const material = index === 1 ? red : index === 4 ? blue : index % 2 ? warm : cream;
      const note = new THREE.Mesh(new THREE.BoxGeometry(0.48 + index * 0.045, 0.7, 0.04), material);
      const angle = (index / 6) * Math.PI * 2;
      note.position.set(Math.cos(angle) * (3.2 + index * 0.12), Math.sin(angle) * 2.5, 0.25 + Math.sin(angle * 2));
      note.rotation.set(angle * 0.18, -angle * 0.24, angle + 0.2);
      note.userData = { angle, radius: 3.2 + index * 0.12 };
      note.castShadow = true;
      notes.add(note);
    }

    const pointer = new THREE.Vector2();
    let scrollPosition = window.scrollY;
    let isVisible = true;
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };
    const onScroll = () => { scrollPosition = window.scrollY; };

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const scale = width < 520 ? 0.7 : width < 760 ? 0.82 : 1;
      sculpture.scale.setScalar(scale);
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { rootMargin: "120px" });
    visibilityObserver.observe(host);
    addEventListener("pointermove", onPointerMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const time = clock.getElapsedTime();
      if (isVisible) {
        const scrollInfluence = Math.min(scrollPosition / Math.max(innerHeight, 1), 1);
        sculpture.rotation.y = THREE.MathUtils.lerp(sculpture.rotation.y, -0.24 + pointer.x * 0.1 + scrollInfluence * 0.18, 0.035);
        sculpture.rotation.x = THREE.MathUtils.lerp(sculpture.rotation.x, -0.12 - pointer.y * 0.07, 0.035);
        sculpture.position.y = Math.sin(time * 0.42) * 0.08 - scrollInfluence * 0.18;
        fold.rotation.y = -0.08 + Math.sin(time * 0.34) * 0.08;
        core.rotation.y += 0.003;
        coreEdges.rotation.copy(core.rotation);
        orbit.rotation.z = 0.28 + time * 0.025;

        panels.forEach((panel) => {
          const phase = panel.userData.phase ?? 0;
          panel.position.y += Math.sin(time * 0.46 + phase) * 0.0008;
        });
        notes.children.forEach((child, index) => {
          const note = child as THREE.Mesh;
          const angle = (note.userData.angle as number) + time * (0.035 + index * 0.002);
          const radius = note.userData.radius as number;
          note.position.x = Math.cos(angle) * radius;
          note.position.y = Math.sin(angle) * 2.5;
          note.rotation.z += 0.0018 + index * 0.0001;
        });
        blueLight.position.y = 1.5 + Math.sin(time * 0.5) * 0.5;
        redLight.position.x = 4 + Math.cos(time * 0.42) * 0.6;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(animate);
    };

    if (reducedMotion) renderer.render(scene, camera);
    else animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("scroll", onScroll);
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh | THREE.LineSegments;
        renderable.geometry?.dispose();
        const material = renderable.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="paper-sculpture" aria-hidden="true" />;
}
