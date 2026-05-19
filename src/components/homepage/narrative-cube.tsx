'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const YELLOW    = 0xFEC944;
const BLACK     = 0x1E1E1E;
const CUBE_SIZE = 0.58;
const GAP       = 0.04;
const TOTAL     = CUBE_SIZE + GAP;

const PALETTES = [
  new THREE.Color(0xFEC944),
  new THREE.Color(0x7C6FFF),
  new THREE.Color(0x4CAAFF),
  new THREE.Color(0x10B981),
  new THREE.Color(0xE94560),
  new THREE.Color(0x7B2FBE),
];

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
interface Props {
  heroRef: RefObject<HTMLElement | null>;
  section2Ref: RefObject<HTMLElement | null>;
  section3Ref: RefObject<HTMLElement | null>;
  section4Ref: RefObject<HTMLElement | null>;
  section5Ref: RefObject<HTMLElement | null>;
  footerRef: RefObject<HTMLElement | null>;
}

export function NarrativeCube({ heroRef, section2Ref, section3Ref, section4Ref, section5Ref, footerRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer + camera ─────────────────────────────────────────────────────
    const w = window.innerWidth, h = window.innerHeight;
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
    const ambient = new THREE.AmbientLight(0xffffff, 0.22);
    scene.add(ambient);

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
        stickers.push({ mat, blend: Math.random() > 0.5 ? 0 : 1, fromBlend: 0, targetBlend: 0, on: false, progress: 0, nextChange: 0.5 + Math.random() * 2.5 });
      }
    }

    // ── Hero scatter — pieces start in frozen-explosion arrangement ───────────
    interface HeroCubie {
      group: THREE.Group;
      gridPos: THREE.Vector3;    // canonical grid position
      scatterPos: THREE.Vector3; // hero display position (radially spread)
    }
    const heroCubies: HeroCubie[] = (rubik.children as THREE.Group[]).map((group) => {
      const gridPos = group.position.clone();
      const dir = gridPos.clone();
      if (dir.lengthSq() < 0.001) dir.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
      dir.normalize();
      const dist = 1.0 + Math.random() * 1.4;
      const scatterPos = new THREE.Vector3(
        gridPos.x + dir.x * dist + (Math.random()-0.5) * 0.35,
        gridPos.y + dir.y * dist + (Math.random()-0.5) * 0.35,
        gridPos.z + dir.z * dist + (Math.random()-0.5) * 0.35,
      );
      group.position.copy(scatterPos); // start in scattered state
      return { group, gridPos, scatterPos };
    });
    type HeroPhase = 'scattered' | 'scattering';
    let heroPhase: HeroPhase = 'scattered';

    // ── Per-KF camera positions ───────────────────────────────────────────────
    // KF 0-2 share the diagonal hero view; KF 3 moves to front-face + floor view.
    const CAM_POSITIONS = [
      new THREE.Vector3(3.2, 2.8, 3.2),  // KF0 — diagonal
      new THREE.Vector3(3.2, 2.8, 3.2),  // KF1 — diagonal
      new THREE.Vector3(3.2, 2.8, 3.2),  // KF2 — diagonal
      new THREE.Vector3(0.0, 1.2, 5.5),  // KF3 — front face, slight elevation
      new THREE.Vector3(3.2, 2.8, 3.2),  // KF4 — diagonal (Care Network: cube off-screen)
      new THREE.Vector3(3.2, 2.8, 3.2),  // KF5 — footer: back to diagonal, cube left side
    ];

    // ── Screen → world (focal-plane raycaster) ────────────────────────────────
    camera.updateMatrixWorld();
    const focalPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()),
      new THREE.Vector3(0, 0, 0),
    );
    const raycaster = new THREE.Raycaster();
    const _camDir = new THREE.Vector3(); // scratch — recomputed each frame

    function s2w(sx: number, sy: number) {
      raycaster.setFromCamera(new THREE.Vector2(sx * 2 - 1, -(sy * 2 - 1)), camera);
      const pt = new THREE.Vector3();
      raycaster.ray.intersectPlane(focalPlane, pt);
      return pt;
    }

    // Write screen→world into existing vector (no allocation, works with out-of-[0,1] fracs)
    function s2wInto(sx: number, sy: number, out: THREE.Vector3) {
      raycaster.setFromCamera(new THREE.Vector2(sx * 2 - 1, -(sy * 2 - 1)), camera);
      raycaster.ray.intersectPlane(focalPlane, out);
    }

    // ── Keyframes ─────────────────────────────────────────────────────────────
    // Each keyframe defines the cube's target state for a scroll zone.
    // Crossing a threshold triggers a smooth lerp to the next keyframe.
    // No per-frame position tracking — positions are fixed world points.
    interface KF {
      pos: THREE.Vector3;
      sc: number; ambI: number; glI: number;
      ry: number; rx: number; rc: boolean;
    }

    const KFS: KF[] = [
      // 0 — Hero: large, top-center, warm glow, sticker blip
      { pos: s2w(0.50, 0.05), sc: 1.44, ambI: 0.22, glI: 4.5, ry: 0.14, rx: 0.04, rc: false },
      // 1 — Orbital: small, right side, full ambient, sticker blip
      { pos: s2w(0.73, 0.50), sc: 0.47, ambI: 1.0,  glI: 0,   ry: 0.30, rx: 0.08, rc: false },
      // 2 — White Label: small, right column next to title, palette cycle
      { pos: s2w(0.74, 0.30), sc: 0.50, ambI: 1.0,  glI: 0,   ry: 0.28, rx: 0.07, rc: true  },
      // 3 — Testimonials: far left, explode animation, warm glow
      { pos: s2w(0.22, 0.76), sc: 0.52, ambI: 0.22, glI: 4.5, ry: 0.00, rx: 0.00, rc: false },
      // 4 — Care Network: cube off-screen
      { pos: s2w(0.50, 1.6),  sc: 0.50, ambI: 0.0,  glI: 0,   ry: 0.00, rx: 0.00, rc: false },
      // 5 — Footer: left side, gentle rotation, warm glow, sticker blip
      { pos: s2w(0.22, 0.58), sc: 0.75, ambI: 0.22, glI: 4.5, ry: 0.18, rx: 0.05, rc: false },
    ];

    rubik.position.copy(KFS[0]!.pos);
    rubik.scale.setScalar(KFS[0]!.sc);

    // Pre-allocated scratch vectors
    const _ts     = new THREE.Vector3();
    const _dynPos = new THREE.Vector3(); // scroll-relative position for KF 2

    // ── Scroll helpers ────────────────────────────────────────────────────────
    function docBottom(el: HTMLElement) { return el.getBoundingClientRect().bottom + window.scrollY; }
    function docTop(el: HTMLElement)    { return el.getBoundingClientRect().top    + window.scrollY; }

    // ── Keyframe index — pure threshold logic, no interpolation ───────────────
    function getKFIndex(): number {
      const sy   = window.scrollY;
      const hBot = heroRef.current
        ? docBottom(heroRef.current) - window.innerHeight * 0.70
        : window.innerHeight * 0.30;
      const s2T  = section2Ref.current ? docTop(section2Ref.current)  : hBot + 600;
      const s3T  = section3Ref.current ? docTop(section3Ref.current)  : s2T + 900;
      // KF 2 (White Label) is the last narrative beat.
      // Cube hides once White Label has scrolled 50% past the fold.
      const s3Bot = s3T + (section3Ref.current?.offsetHeight ?? 1200);
      const s3End = s3Bot - window.innerHeight * 0.5;

      if (sy < hBot)                            return 0;
      if (sy < s3T - window.innerHeight * 0.6) return 1;
      if (sy < s3End)                           return 2;  // White Label — last beat
      return 4;  // cube off-screen for remainder of page
    }

    // ── Face-rotation animation (KF 1 — orbital section) ─────────────────────
    // Randomly picks a face slice, rotates its 9 cubies 90° via a temp pivot,
    // then snaps positions back to the grid. Loops continuously in KF 1.
    const SLICES: Array<{ axis: 'x' | 'y' | 'z'; slice: -1 | 0 | 1 }> = [
      { axis: 'x', slice:  1 }, { axis: 'x', slice: 0 }, { axis: 'x', slice: -1 },
      { axis: 'y', slice:  1 }, { axis: 'y', slice: 0 }, { axis: 'y', slice: -1 },
      { axis: 'z', slice:  1 }, { axis: 'z', slice: 0 }, { axis: 'z', slice: -1 },
    ];

    let movePivot:    THREE.Group | null = null;
    let moveAxis:     'x' | 'y' | 'z'   = 'y';
    let moveDir:      1 | -1             = 1;
    let moveElapsed:  number             = 0;
    let moveIdle:     number             = 0.4; // initial pause before first move
    const MOVE_DUR  = 0.45; // seconds per 90° turn
    const MOVE_IDLE = 0.20; // pause between moves

    function startFaceMove() {
      const face = SLICES[Math.floor(Math.random() * SLICES.length)]!;
      const dir  = (Math.random() > 0.5 ? 1 : -1) as 1 | -1;
      const pivot = new THREE.Group();
      rubik.add(pivot);
      for (const child of [...rubik.children]) {
        if (child === pivot) continue;
        const v = face.axis === 'x' ? child.position.x
                : face.axis === 'y' ? child.position.y : child.position.z;
        if (Math.abs(v - face.slice * TOTAL) < TOTAL * 0.5) pivot.attach(child);
      }
      movePivot = pivot; moveAxis = face.axis; moveDir = dir; moveElapsed = 0;
    }

    function finalizeFaceMove() {
      if (!movePivot) return;
      for (const child of [...movePivot.children]) {
        rubik.attach(child); // preserves world transform → converts to rubik-local
        child.position.set(                              // snap to grid, kill float drift
          Math.round(child.position.x / TOTAL) * TOTAL,
          Math.round(child.position.y / TOTAL) * TOTAL,
          Math.round(child.position.z / TOTAL) * TOTAL,
        );
      }
      rubik.remove(movePivot);
      movePivot = null;
    }


    // ── Recolor state ─────────────────────────────────────────────────────────
    let rcPal = 0, rcT = 0, rcOn = false;
    const rcFrom = new THREE.Color(PALETTES[0]!);
    const rcTo   = new THREE.Color();
    const RC_HOLD = 2.0, RC_DUR = 1.2;
    const eio = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    let prevKI = -1;
    const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
    // ── Explode animation (KF 3 — Testimonials) ──────────────────────────────
    // Cube settles → trembles → explodes outward → fades out. Plays once per entry.
    interface ExplodeCubie {
      group: THREE.Group;
      restPos: THREE.Vector3;
      scatterPos: THREE.Vector3;
      delay: number;
      dur: number;
    }
    let explodeCubies: ExplodeCubie[] = [];
    type ExplodePhase = 'idle' | 'settling' | 'assembled' | 'trembling' | 'exploding' | 'fading' | 'done';
    const SETTLE_DIST    = 0.25;
    const ASSEMBLED_HOLD = 2.2;  // seconds cube sits still before trembling
    const TREMBLE_DUR    = 1.6;  // seconds of trembling
    const EXPLODE_DUR    = 0.5;
    const FADE_DUR       = 0.35;
    let explodePhase: ExplodePhase = 'idle';
    let explodeLockPos: THREE.Vector3 | null = null;
    let assembledTimer = 0;
    let trembleElapsed = 0;
    let explodeElapsed = 0;
    let fadeElapsed    = 0;

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const ki = getKFIndex();
      const kf = KFS[ki]!;

      // Past Testimonials — hide canvas entirely, nothing to render
      if (ki === 4) {
        if (renderer.domElement.style.display !== 'none') renderer.domElement.style.display = 'none';
        return;
      }
      if (renderer.domElement.style.display === 'none') renderer.domElement.style.display = '';

      // ── Camera per-KF lerp ────────────────────────────────────────────────────
      // Move camera toward KF target, then recompute lookAt + focal plane so
      // s2wInto remains accurate with the new camera direction.
      camera.position.lerp(CAM_POSITIONS[ki]!, 0.04);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      camera.getWorldDirection(_camDir);
      focalPlane.setFromNormalAndCoplanarPoint(_camDir, new THREE.Vector3(0, 0, 0));

      // Option B scroll-relative targeting for KF 1 + KF 2:
      // target Y = (sectionTop + offset) / viewportHeight each frame.
      // Cube enters from below as section scrolls in, sticks at content center,
      // exits upward naturally when section scrolls past. Fixed pos for KF 0 + 3.
      let targetPos = kf.pos;
      if (ki === 1 && section2Ref.current) {
        const s2Top = section2Ref.current.getBoundingClientRect().top;
        const ih    = window.innerHeight;
        const yFrac = (s2Top + 450) / ih;
        s2wInto(0.73, yFrac, _dynPos);
        targetPos = _dynPos;
      } else if (ki === 2 && section3Ref.current) {
        const s3Top = section3Ref.current.getBoundingClientRect().top;
        const ih    = window.innerHeight;
        const yFrac = (s3Top + 310) / ih;
        s2wInto(0.60, yFrac, _dynPos);
        targetPos = _dynPos;
      } else if (ki === 3) {
        // Only lerp during settling; all other phases control position directly
        if (explodeLockPos && explodePhase === 'settling') targetPos = explodeLockPos;
        else targetPos = rubik.position;
      }

      // Smooth lerp toward target (position settles fast; scale/light slower)
      rubik.position.lerp(targetPos, 0.12);
      _ts.set(kf.sc, kf.sc, kf.sc);
      rubik.scale.lerp(_ts, 0.06);
      ambient.intensity += (kf.ambI - ambient.intensity) * 0.06;

      // Glow — pulse only in hero
      const glowTarget = kf.glI > 0.5
        ? kf.glI + Math.sin(clock.elapsedTime * 1.1) * 0.5
        : kf.glI;
      glow.intensity += (glowTarget - glow.intensity) * 0.06;

      // Rotation
      rubik.rotation.y += delta * kf.ry;
      rubik.rotation.x += delta * kf.rx;

      // ── Face-rotation (orbital zone only) ───────────────────────────────────
      if (ki === 1) {
        if (movePivot) {
          moveElapsed += delta;
          const t = Math.min(moveElapsed / MOVE_DUR, 1);
          const angle = eio(t) * (Math.PI / 2) * moveDir;
          if (moveAxis === 'x') movePivot.rotation.x = angle;
          else if (moveAxis === 'y') movePivot.rotation.y = angle;
          else movePivot.rotation.z = angle;
          if (t >= 1) { finalizeFaceMove(); moveIdle = 0; }
        } else {
          moveIdle += delta;
          if (moveIdle >= MOVE_IDLE) startFaceMove();
        }
      } else if (movePivot) {
        // Left orbital zone mid-move — snap immediately to final angle and finalize
        const finalAngle = (Math.PI / 2) * moveDir;
        if (moveAxis === 'x') movePivot.rotation.x = finalAngle;
        else if (moveAxis === 'y') movePivot.rotation.y = finalAngle;
        else movePivot.rotation.z = finalAngle;
        finalizeFaceMove();
        moveIdle = 0;
      }

      // ── KF transition detection ───────────────────────────────────────────────
      // IMPORTANT: exits must run before entries — entries snapshot rubik child
      // positions as restPos, so they must see the assembled state, not scattered.
      const kiChanged = ki !== prevKI;
      if (kiChanged) {

        // ── Exits ────────────────────────────────────────────────────────────────
        if (prevKI === 0 && ki !== 0) {
          // Snap immediately to grid + reset rotations from any face turns
          for (const hc of heroCubies) {
            hc.group.position.copy(hc.gridPos);
            hc.group.rotation.set(0, 0, 0);
          }
          heroPhase = 'scattered';
        }
        if (prevKI === 3 && ki !== 3) {
          // Restore canvas + snap pieces back to grid for clean re-entry
          renderer.domElement.style.opacity = '1';
          for (const ec of explodeCubies) ec.group.position.copy(ec.restPos);
          explodeCubies  = [];
          explodePhase   = 'idle';
          explodeLockPos = null;
          assembledTimer = 0;
          trembleElapsed = 0;
          explodeElapsed = 0;
          fadeElapsed    = 0;
        }

        // ── Entries ──────────────────────────────────────────────────────────────
        if (ki === 0 && prevKI !== 0) {
          // Returning to hero — recompute scatter from current positions and scatter out
          for (const hc of heroCubies) {
            const cur = hc.group.position.clone();
            const dir = cur.clone();
            if (dir.lengthSq() < 0.001) dir.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
            dir.normalize();
            const dist = 1.0 + Math.random() * 1.4;
            hc.scatterPos.set(
              cur.x + dir.x * dist + (Math.random()-0.5) * 0.35,
              cur.y + dir.y * dist + (Math.random()-0.5) * 0.35,
              cur.z + dir.z * dist + (Math.random()-0.5) * 0.35,
            );
          }
          heroPhase = 'scattering';
        }
        if (ki === 3 && explodePhase === 'idle') {
          rubik.rotation.set(0.15, 0, 0);
          // Canonical reset — face rotations from KF1 leave group.rotation non-zero
          for (const hc of heroCubies) {
            hc.group.position.copy(hc.gridPos);
            hc.group.rotation.set(0, 0, 0);
          }
          // Lock position using KF3 front-face camera
          {
            const savedCam = camera.position.clone();
            camera.position.copy(CAM_POSITIONS[3]!);
            camera.lookAt(0, 0, 0);
            camera.updateMatrixWorld();
            camera.getWorldDirection(_camDir);
            focalPlane.setFromNormalAndCoplanarPoint(_camDir, new THREE.Vector3(0, 0, 0));
            s2wInto(0.22, 0.76, _dynPos);
            explodeLockPos = _dynPos.clone();
            rubik.position.copy(explodeLockPos); // teleport — no lerp journey
            camera.position.copy(savedCam);
            camera.lookAt(0, 0, 0);
            camera.updateMatrixWorld();
            camera.getWorldDirection(_camDir);
            focalPlane.setFromNormalAndCoplanarPoint(_camDir, new THREE.Vector3(0, 0, 0));
          }
          // Build explode cubies — radial scatter targets
          explodeCubies = (rubik.children as THREE.Group[]).map((group) => {
            const restPos = group.position.clone();
            const dir = restPos.clone();
            if (dir.lengthSq() < 0.001) dir.set((Math.random()-0.5),(Math.random()-0.5),(Math.random()-0.5));
            dir.normalize();
            const dist = 3.0 + Math.random() * 3.0;
            const scatterPos = new THREE.Vector3(
              restPos.x + dir.x * dist + (Math.random()-0.5) * 0.8,
              restPos.y + dir.y * dist + (Math.random()-0.5) * 0.8,
              restPos.z + dir.z * dist * 0.5,
            );
            return { group, restPos, scatterPos, delay: Math.random()*0.12, dur: 0.35+Math.random()*0.2 };
          });
          explodePhase   = 'settling';
          assembledTimer = 0;
          trembleElapsed = 0;
          explodeElapsed = 0;
          fadeElapsed    = 0;
        }

        prevKI = ki;
      }

      // ── Hero scatter tick — only runs in KF0 ─────────────────────────────────
      if (ki === 0 && heroPhase === 'scattering') {
        let done = true;
        for (const hc of heroCubies) {
          hc.group.position.lerp(hc.scatterPos, 0.07);
          if (hc.group.position.distanceTo(hc.scatterPos) > 0.008) done = false;
        }
        if (done) { for (const hc of heroCubies) hc.group.position.copy(hc.scatterPos); heroPhase = 'scattered'; }
      }

      // ── Explode tick (KF 3 — Testimonials) ───────────────────────────────────
      if (ki === 3) {
        if (explodePhase === 'settling') {
          if (explodeLockPos && rubik.position.distanceTo(explodeLockPos) < SETTLE_DIST) {
            explodePhase = 'assembled'; assembledTimer = 0;
          }
        } else if (explodePhase === 'assembled') {
          assembledTimer += delta;
          if (assembledTimer >= ASSEMBLED_HOLD) {
            explodePhase = 'trembling'; trembleElapsed = 0;
          }
        } else if (explodePhase === 'trembling') {
          trembleElapsed += delta;
          const t = trembleElapsed / TREMBLE_DUR;
          const intensity = t * t * 0.18; // quadratic ramp-up
          if (explodeLockPos) {
            rubik.position.set(
              explodeLockPos.x + (Math.random() - 0.5) * intensity,
              explodeLockPos.y + (Math.random() - 0.5) * intensity,
              explodeLockPos.z + (Math.random() - 0.5) * intensity * 0.4,
            );
          }
          if (trembleElapsed >= TREMBLE_DUR) {
            if (explodeLockPos) rubik.position.copy(explodeLockPos);
            explodePhase = 'exploding'; explodeElapsed = 0;
          }
        } else if (explodePhase === 'exploding') {
          explodeElapsed += delta;
          let allDone = true;
          for (const ec of explodeCubies) {
            const t = (explodeElapsed - ec.delay) / ec.dur;
            if (t < 1) allDone = false;
            if (t <= 0) continue;
            ec.group.position.lerpVectors(ec.restPos, ec.scatterPos, easeOut(Math.min(t, 1)));
          }
          if (allDone) { explodePhase = 'fading'; fadeElapsed = 0; }
        } else if (explodePhase === 'fading') {
          fadeElapsed += delta;
          const t = Math.min(fadeElapsed / FADE_DUR, 1);
          renderer.domElement.style.opacity = String(1 - t);
          if (t >= 1) explodePhase = 'done';
        }
        // 'done': canvas is transparent, nothing further to update
      }

      if (!kf.rc) {
        // Sticker blip (hero + orbital)
        for (const s of stickers) {
          s.nextChange -= delta;
          if (!s.on && s.nextChange <= 0) {
            s.on = true; s.progress = 0;
            s.fromBlend = s.blend;
            s.targetBlend = Math.random() > 0.5 ? 0 : 1;
            s.nextChange = 1.2 + Math.random() * 3.5;
          }
          if (s.on) {
            s.progress += delta * 1.1;
            if (s.progress >= 1) { s.progress = 1; s.on = false; }
            s.blend = s.fromBlend + (s.targetBlend - s.fromBlend) * eio(s.progress);
          }
          tempColor.lerpColors(colorY, colorB, s.blend);
          s.mat.color.copy(tempColor);
        }
      } else {
        // Palette cycling (white label + section 4)
        rcT += delta;
        if (!rcOn && rcT >= RC_HOLD) {
          rcOn = true; rcT = 0;
          rcFrom.copy(PALETTES[rcPal]!);
          rcPal = (rcPal + 1) % PALETTES.length;
          rcTo.copy(PALETTES[rcPal]!);
        }
        if (rcOn) {
          const t = Math.min(rcT / RC_DUR, 1);
          tempColor.lerpColors(rcFrom, rcTo, eio(t));
          for (const s of stickers) s.mat.color.copy(tempColor);
          if (t >= 1) { rcOn = false; rcT = 0; }
        }
      }

      renderer.render(scene, camera);
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const nw = window.innerWidth, nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      camera.updateMatrixWorld();
      KFS[0]!.pos.copy(s2w(0.50, 0.05));
      KFS[1]!.pos.copy(s2w(0.73, 0.50));
      KFS[2]!.pos.copy(s2w(0.74, 0.30));
      KFS[3]!.pos.copy(s2w(0.22, 0.76));
      KFS[4]!.pos.copy(s2w(0.50, 1.6));
      KFS[5]!.pos.copy(s2w(0.22, 0.58));
    };
    window.addEventListener('resize', onResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []); // refs are stable — no deps needed

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}
    />
  );
}
