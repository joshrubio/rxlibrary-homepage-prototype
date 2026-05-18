'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const YELLOW    = 0xFEC944;
const BLACK     = 0x1E1E1E;
const CUBE_SIZE = 0.58;
const GAP       = 0.04;
const TOTAL     = CUBE_SIZE + GAP;

// ─── Geometry helpers ─────────────────────────────────────────────────────────
function createRoundedBox(w: number, h: number, d: number, r: number, seg: number) {
  const shape = new THREE.Shape();
  const hw = w / 2 - r, hh = h / 2 - r;
  shape.moveTo(-hw, -h / 2);
  shape.lineTo(hw, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh);
  shape.lineTo(w / 2, hh);
  shape.quadraticCurveTo(w / 2, h / 2, hw, h / 2);
  shape.lineTo(-hw, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh);
  shape.lineTo(-w / 2, -hh);
  shape.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d - 2 * r, bevelEnabled: true,
    bevelThickness: r, bevelSize: r, bevelSegments: seg,
  });
  geo.translate(0, 0, -(d - 2 * r) / 2);
  return geo;
}

function createCubie(x: number, y: number, z: number, colorY: THREE.Color, colorB: THREE.Color) {
  const group = new THREE.Group();
  const baseGeo = createRoundedBox(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 0.04, 2);
  const baseMat = new THREE.MeshStandardMaterial({ color: colorB, roughness: 0.4, metalness: 0.1 });
  group.add(new THREE.Mesh(baseGeo, baseMat));

  const ss = CUBE_SIZE * 0.82, sd = 0.02;
  const zo = CUBE_SIZE / 2 + 0.005, xyo = CUBE_SIZE / 2 + 0.055;

  function addSticker(pos: THREE.Vector3, rot: THREE.Euler) {
    const geo = new THREE.BoxGeometry(ss, ss, sd);
    const mat = new THREE.MeshStandardMaterial({
      color: colorY.clone(), roughness: 0.3, metalness: 0.05,
      emissive: new THREE.Color(0x000000), emissiveIntensity: 0,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.rotation.set(rot.x, rot.y, rot.z);
    group.add(mesh);
  }

  if (x ===  1) addSticker(new THREE.Vector3( xyo, 0, 0), new THREE.Euler(0,  Math.PI / 2, 0));
  if (x === -1) addSticker(new THREE.Vector3(-xyo, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));
  if (y ===  1) addSticker(new THREE.Vector3(0,  xyo, 0), new THREE.Euler(-Math.PI / 2, 0, 0));
  if (y === -1) addSticker(new THREE.Vector3(0, -xyo, 0), new THREE.Euler( Math.PI / 2, 0, 0));
  if (z ===  1) addSticker(new THREE.Vector3(0, 0,  zo),  new THREE.Euler(0, 0, 0));
  if (z === -1) addSticker(new THREE.Vector3(0, 0, -zo),  new THREE.Euler(0, Math.PI, 0));

  group.position.set(x * TOTAL, y * TOTAL, z * TOTAL);
  return group;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FooterCube() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth  || 500;
    const h = container.clientHeight || 500;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(3.2, 2.8, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const glow = new THREE.PointLight(0xD4A017, 4.5, 18);
    glow.position.set(0, 3, 2);
    scene.add(glow);

    const fillA = new THREE.DirectionalLight(0xffffff, 0.8);
    fillA.position.set(5, 8, 6);
    scene.add(fillA);

    const fillB = new THREE.DirectionalLight(0xffffff, 0.35);
    fillB.position.set(-5, 2, -3);
    scene.add(fillB);

    const rim = new THREE.DirectionalLight(0xD4A017, 0.4);
    rim.position.set(5, -3, -5);
    scene.add(rim);

    // ── Cube ──────────────────────────────────────────────────────────────────
    const colorY = new THREE.Color(YELLOW);
    const colorB = new THREE.Color(BLACK);
    const rubik  = new THREE.Group();
    rubik.scale.setScalar(0.75);
    scene.add(rubik);

    interface Sticker {
      mat: THREE.MeshStandardMaterial;
      blend: number; fromBlend: number; targetBlend: number;
      on: boolean; progress: number; nextChange: number;
    }
    const stickers: Sticker[] = [];
    const tempColor = new THREE.Color();

    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      const cubie = createCubie(x, y, z, colorY, colorB);
      rubik.add(cubie);
      for (let i = 1; i < cubie.children.length; i++) {
        const mat = ((cubie.children[i] as THREE.Mesh).material as THREE.MeshStandardMaterial).clone();
        (cubie.children[i] as THREE.Mesh).material = mat;
        stickers.push({
          mat, blend: Math.random() > 0.5 ? 0 : 1,
          fromBlend: 0, targetBlend: 0,
          on: false, progress: 0,
          nextChange: 0.5 + Math.random() * 2.5,
        });
      }
    }

    // ── Animation loop ────────────────────────────────────────────────────────
    const eio = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta   = clock.getDelta();
      const elapsed = clock.elapsedTime;

      // Levitation
      rubik.position.y = Math.sin(elapsed * 0.7) * 0.08;

      // Rotation
      rubik.rotation.y += delta * 0.18;
      rubik.rotation.x += delta * 0.05;

      // Glow pulse
      glow.intensity = 4.5 + Math.sin(elapsed * 1.1) * 0.5;

      // Sticker blip
      for (const s of stickers) {
        s.nextChange -= delta;
        if (!s.on && s.nextChange <= 0) {
          s.on = true; s.progress = 0;
          s.fromBlend    = s.blend;
          s.targetBlend  = Math.random() > 0.5 ? 0 : 1;
          s.nextChange   = 1.2 + Math.random() * 3.5;
        }
        if (s.on) {
          s.progress += delta * 1.1;
          if (s.progress >= 1) { s.progress = 1; s.on = false; }
          s.blend = s.fromBlend + (s.targetBlend - s.fromBlend) * eio(s.progress);
        }
        tempColor.lerpColors(colorY, colorB, s.blend);
        s.mat.color.copy(tempColor);
      }

      renderer.render(scene, camera);
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}
