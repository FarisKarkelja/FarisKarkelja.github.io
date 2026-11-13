/* Realistic 3D laptop and phone for the project screenshots, drawn with three.js.

   The models are built in code at real-world proportions (1 unit = 10 cm):
   - laptop: a 13" class notebook with a 16:10 screen, so a 1440x900 screenshot fits exactly
   - phone: a 6.1" class phone with a 19.5:9 screen, so a 390x844 screenshot fits exactly
   Materials are physically based and lit by a studio environment map, so the aluminium,
   the glass and the keys reflect light like the real thing.

   One WebGL context serves every device on the page: each [data-devices] element owns a plain
   2D canvas, and the shared renderer draws its scene and copies the frame into that canvas.
   That keeps a page with a dozen project cards inside the browser's WebGL limits. */

import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CircleGeometry,
  Color,
  DataTexture,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  CylinderGeometry,
  } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type Shot = { d?: string; m?: string; m2?: string };
type Layout = 'both' | 'laptop' | 'phone' | 'phones';

type Mount = {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layout: Layout;
  shots: Shot[];
  index: number;
  nextIndex: number;
  fade: number; // 1 = screens fully on
  fading: boolean;
  spin: number;
  spinTarget: number;
  tilt: { x: number; y: number; tx: number; ty: number };
  visible: boolean;
  dirty: boolean;
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ------------------------------------------------------------------ geometry helpers */

function roundedRect(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** A flat rounded rectangle whose UVs run 0..1 over its width and height (for screenshots). */
function panel(w: number, h: number, r: number) {
  const g = new ShapeGeometry(roundedRect(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  return g;
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.85)');
  grad.addColorStop(0.45, 'rgba(0,0,0,0.45)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/* ------------------------------------------------------------------ the shared world */

let renderer: WebGLRenderer;
let scene: Scene;
let camera: PerspectiveCamera;
let root: Group;
let laptop: Group;
let phoneA: Group;
let phoneB: Group;
let laptopScreen: MeshStandardMaterial;
let phoneScreenA: MeshStandardMaterial;
let phoneScreenB: MeshStandardMaterial;
let blank: Texture;
const loader = new TextureLoader();
const textures = new Map<string, Texture>();
const mounts: Mount[] = [];

const screenMaterial = () =>
  new MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xffffff,
    roughness: 0.16,
    metalness: 0,
    envMapIntensity: 0.45,
    toneMapped: false, // keep the screenshot's real colours
  });

function buildLaptop(alu: MeshStandardMaterial, shadow: Texture) {
  const g = new Group();
  const W = 3.04; // 304 mm wide
  const D = 2.124; // 212 mm deep
  const BH = 0.11; // base 11 mm
  const LH = 2.06; // lid height
  const LT = 0.045; // lid 4.5 mm
  const SW = 2.865; // 16:10 display, 286.5 x 179 mm
  const SH = 1.79;

  const base = new Mesh(new RoundedBoxGeometry(W, BH, D, 5, 0.045), alu);
  base.position.y = BH / 2;
  g.add(base);

  // keyboard: black well with real key rows (14.5 key units wide)
  const top = BH + 0.0006;
  const well = new Mesh(new ShapeGeometry(roundedRect(2.74, 1.03, 0.03)), new MeshStandardMaterial({ color: 0x050506, roughness: 0.9 }));
  well.rotation.x = -Math.PI / 2;
  well.position.set(0, top, -0.41);
  g.add(well);

  const u = 0.185;
  const gap = 0.028;
  const rows: { depth: number; keys: number[] }[] = [
    { depth: 0.085, keys: [1.5, ...Array(12).fill(1), 1] },
    { depth: 0.155, keys: [...Array(13).fill(1), 1.5] },
    { depth: 0.155, keys: [1.5, ...Array(13).fill(1)] },
    { depth: 0.155, keys: [1.8, ...Array(11).fill(1), 1.7] },
    { depth: 0.155, keys: [2.3, ...Array(10).fill(1), 2.2] },
    { depth: 0.155, keys: [1, 1, 1, 1.25, 5, 1.25, 1, 3] },
  ];
  const keyCount = rows.reduce((n, r) => n + r.keys.length, 0);
  const keys = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.12), new MeshStandardMaterial({ color: 0x060607, roughness: 0.72, envMapIntensity: 0.6 }), keyCount);
  const dummy = new Object3D();
  let k = 0;
  let z = -0.9;
  for (const row of rows) {
    const total = row.keys.reduce((a, b) => a + b, 0) * u;
    let x = -total / 2;
    for (const w of row.keys) {
      dummy.position.set(x + (w * u) / 2, top + 0.006, z + row.depth / 2);
      dummy.scale.set(w * u - gap, 0.012, row.depth);
      dummy.updateMatrix();
      keys.setMatrixAt(k++, dummy.matrix);
      x += w * u;
    }
    z += row.depth + gap;
  }
  g.add(keys);

  // trackpad: glass, a touch smoother than the aluminium around it
  const padRim = new Mesh(new ShapeGeometry(roundedRect(1.31, 0.81, 0.04)), new MeshStandardMaterial({ color: 0x1d1e21, roughness: 0.5 }));
  padRim.rotation.x = -Math.PI / 2;
  padRim.position.set(0, top, 0.58);
  const pad = new Mesh(new ShapeGeometry(roundedRect(1.3, 0.8, 0.035)), new MeshStandardMaterial({ color: alu.color.clone().multiplyScalar(0.92), metalness: 1, roughness: 0.3 }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, top + 0.0004, 0.58);
  g.add(padRim, pad);

  // hinge
  const hinge = new Mesh(new CylinderGeometry(0.034, 0.034, W - 0.5, 20), new MeshStandardMaterial({ color: 0x16171a, metalness: 0.7, roughness: 0.4 }));
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, BH + 0.01, -D / 2 + 0.03);
  g.add(hinge);

  // lid: pivots on the hinge, opened to about 108 degrees
  const lid = new Group();
  lid.position.set(0, BH, -D / 2 + 0.03);
  lid.rotation.x = -0.29;
  const shell = new Mesh(new RoundedBoxGeometry(W, LH, LT, 5, 0.02), alu);
  shell.position.set(0, LH / 2, -LT / 2);
  const bezel = new Mesh(
    new ShapeGeometry(roundedRect(W - 0.03, LH - 0.03, 0.04), 10),
    new MeshPhysicalMaterial({ color: 0x050506, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04 }),
  );
  bezel.position.set(0, LH / 2, 0.0008);
  laptopScreen = screenMaterial();
  const screen = new Mesh(panel(SW, SH, 0.012), laptopScreen);
  screen.position.set(0, LH - 0.095 - SH / 2, 0.0016);
  const cam = new Mesh(new CircleGeometry(0.012, 16), new MeshStandardMaterial({ color: 0x1a1c22, roughness: 0.2 }));
  cam.position.set(0, LH - 0.05, 0.0016);
  lid.add(shell, bezel, screen, cam);
  g.add(lid);

  const sh = new Mesh(new PlaneGeometry(W * 1.35, D * 1.45), new MeshBasicMaterial({ map: shadow, transparent: true, depthWrite: false, opacity: 0.75 }));
  sh.rotation.x = -Math.PI / 2;
  sh.position.set(0, 0.001, -0.1);
  sh.userData.shadow = true;
  g.add(sh);
  return g;
}

function buildPhone(frame: MeshStandardMaterial, shadow: Texture, screenMat: MeshStandardMaterial) {
  const g = new Group();
  const W = 0.706; // 70.6 x 146.6 x 8.25 mm
  const H = 1.466;
  const T = 0.0825;
  const b = 0.014; // rounded edge
  const body = new ExtrudeGeometry(roundedRect(W - 2 * b, H - 2 * b, 0.1 - b), {
    depth: T - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 4,
    curveSegments: 14,
  });
  body.translate(0, 0, -(T - 2 * b) / 2);
  const phone = new Group();
  phone.add(new Mesh(body, frame));

  const glass = new Mesh(
    new ShapeGeometry(roundedRect(W - 0.012, H - 0.012, 0.094), 14),
    new MeshPhysicalMaterial({ color: 0x030304, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03 }),
  );
  glass.position.z = T / 2 + 0.0006;
  const screen = new Mesh(panel(0.652, 1.41, 0.086), screenMat);
  screen.position.z = T / 2 + 0.0012;
  const island = new Mesh(new ShapeGeometry(roundedRect(0.124, 0.036, 0.018), 10), new MeshBasicMaterial({ color: 0x000000 }));
  island.position.set(0, 1.41 / 2 - 0.05, T / 2 + 0.0018);
  phone.add(glass, screen, island);

  // side buttons
  const btn = (len: number, y: number, side: number) => {
    const m = new Mesh(new RoundedBoxGeometry(0.012, len, 0.03, 2, 0.005), frame);
    m.position.set(side * (W / 2 + 0.003), y, 0);
    phone.add(m);
  };
  btn(0.07, 0.42, -1);
  btn(0.12, 0.27, -1);
  btn(0.12, 0.12, -1);
  btn(0.17, 0.28, 1);

  phone.position.y = H / 2;
  g.add(phone);

  const sh = new Mesh(new PlaneGeometry(W * 1.6, 0.42), new MeshBasicMaterial({ map: shadow, transparent: true, depthWrite: false, opacity: 0.8 }));
  sh.rotation.x = -Math.PI / 2;
  sh.position.set(0, 0.001, -0.04);
  sh.userData.shadow = true;
  g.add(sh);
  return g;
}

function buildWorld() {
  renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const key = new DirectionalLight(0xffffff, 1.1);
  key.position.set(-3, 6, 4);
  scene.add(key);

  camera = new PerspectiveCamera(26, 1, 0.1, 100);

  blank = new DataTexture(new Uint8Array([16, 15, 18, 255]), 1, 1);
  blank.colorSpace = SRGBColorSpace;
  blank.needsUpdate = true;

  const shadow = shadowTexture();
  // space grey aluminium and a dark titanium frame
  const alu = new MeshStandardMaterial({ color: new Color('#4b4d52'), metalness: 1, roughness: 0.42 });
  const titanium = new MeshStandardMaterial({ color: new Color('#3a3b40'), metalness: 1, roughness: 0.32 });

  root = new Group();
  laptop = buildLaptop(alu, shadow);
  phoneScreenA = screenMaterial();
  phoneScreenB = screenMaterial();
  phoneA = buildPhone(titanium, shadow, phoneScreenA);
  phoneB = buildPhone(titanium, shadow, phoneScreenB);
  for (const m of [laptopScreen, phoneScreenA, phoneScreenB]) m.emissiveMap = blank;
  root.add(laptop, phoneA, phoneB);
  scene.add(root);
}

/* ------------------------------------------------------------------ layouts and camera */

const VIEW = new Vector3(0.0, 0.36, 1).normalize(); // camera looks from the front, a little above
const FILL = 0.9; // how much of the canvas the devices may take
const frames = new Map<Layout, Vector3[]>();
const v = new Vector3();
const target = new Vector3();
const right = new Vector3();
const up = new Vector3();

function arrange(layout: Layout) {
  laptop.visible = layout === 'both' || layout === 'laptop';
  phoneA.visible = layout !== 'laptop';
  phoneB.visible = layout === 'phones';
  laptop.position.set(0, 0, 0);
  laptop.rotation.set(0, 0.38, 0);
  if (layout === 'both') {
    phoneA.position.set(1.5, 0, 0.95);
    phoneA.rotation.set(-0.07, -0.22, 0);
  } else if (layout === 'phone') {
    phoneA.position.set(0, 0, 0);
    phoneA.rotation.set(-0.05, -0.3, 0);
  } else if (layout === 'phones') {
    phoneA.position.set(-0.44, 0, 0.18);
    phoneA.rotation.set(-0.05, 0.3, 0);
    phoneB.position.set(0.44, 0, -0.18);
    phoneB.rotation.set(-0.05, -0.3, 0);
  }
}

/** the corners of every part of a layout (oriented boxes), measured once without any tilt */
function pointsOf(layout: Layout) {
  let pts = frames.get(layout);
  if (!pts) {
    pts = [];
    arrange(layout);
    root.rotation.set(0, 0, 0);
    root.updateMatrixWorld(true);
    root.traverseVisible((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh || o.userData.shadow || (o as InstancedMesh).isInstancedMesh) return;
      mesh.geometry.computeBoundingBox();
      const bb = mesh.geometry.boundingBox!;
      for (let i = 0; i < 8; i++) {
        pts!.push(new Vector3(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(mesh.matrixWorld));
      }
    });
    frames.set(layout, pts);
  }
  return pts;
}

/** aim the camera so the devices fill the canvas, centred */
function place(layout: Layout, aspect: number) {
  const pts = pointsOf(layout);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  const tanV = Math.tan((camera.fov * Math.PI) / 360);
  target.set(0, 0, 0);
  pts.forEach((p) => target.add(p));
  target.divideScalar(pts.length);
  let dist = 12;
  for (let i = 0; i < 4; i++) {
    camera.position.copy(target).addScaledVector(VIEW, dist);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) {
      v.copy(p).project(camera);
      x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x);
      y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
    }
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);
    target.addScaledVector(right, ((x0 + x1) / 2) * tanV * aspect * dist).addScaledVector(up, ((y0 + y1) / 2) * tanV * dist);
    dist *= Math.max((x1 - x0) / 2, (y1 - y0) / 2) / FILL;
  }
  camera.position.copy(target).addScaledVector(VIEW, dist);
  camera.lookAt(target);
}

/* ------------------------------------------------------------------ textures */

function tex(url: string | undefined) {
  if (!url) return blank;
  let t = textures.get(url);
  if (!t) {
    t = loader.load(url, () => mounts.forEach((m) => m.shots.some((s) => s.d === url || s.m === url || s.m2 === url) && dirty(m)));
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.set(url, t);
  }
  return t.image ? t : blank;
}

/* ------------------------------------------------------------------ drawing */

let raf = 0;

function dirty(m: Mount) {
  m.dirty = true;
  if (!raf) raf = requestAnimationFrame(loop);
}

function draw(m: Mount) {
  const { width: w, height: h } = m.canvas;
  if (!w || !h) return;
  arrange(m.layout);
  const shot = m.shots[m.index] ?? {};
  laptopScreen.emissiveMap = tex(shot.d);
  phoneScreenA.emissiveMap = tex(shot.m);
  phoneScreenB.emissiveMap = tex(shot.m2 ?? shot.m);
  for (const s of [laptopScreen, phoneScreenA, phoneScreenB]) s.emissiveIntensity = m.fade;
  root.rotation.set(m.tilt.x, m.spin + m.tilt.y, 0);
  renderer.setSize(w, h, false);
  place(m.layout, w / h);
  renderer.render(scene, camera);
  m.ctx.clearRect(0, 0, w, h);
  m.ctx.drawImage(renderer.domElement, 0, 0);
}

function step(m: Mount) {
  let moving = false;
  const t = m.tilt;
  const ease = 0.12;
  if (Math.abs(t.tx - t.x) > 0.0005 || Math.abs(t.ty - t.y) > 0.0005) {
    t.x += (t.tx - t.x) * ease;
    t.y += (t.ty - t.y) * ease;
    moving = true;
  }
  if (Math.abs(m.spinTarget - m.spin) > 0.0005) {
    m.spin += (m.spinTarget - m.spin) * 0.08;
    moving = true;
  }
  if (m.fading) {
    // screens dim, the next project's screenshots go in, screens light up again
    if (m.index !== m.nextIndex) {
      m.fade = Math.max(0, m.fade - 0.14);
      if (m.fade === 0) m.index = m.nextIndex;
    } else {
      m.fade = Math.min(1, m.fade + 0.08);
      if (m.fade === 1) m.fading = false;
    }
    moving = true;
  }
  return moving;
}

function loop() {
  raf = 0;
  let again = false;
  for (const m of mounts) {
    if (!m.visible) continue;
    const moving = step(m);
    if (moving || m.dirty) {
      m.dirty = false;
      draw(m);
    }
    again ||= moving;
  }
  if (again) raf = requestAnimationFrame(loop);
}

/* ------------------------------------------------------------------ mounting */

function mount(el: HTMLElement) {
  const canvas = el.querySelector<HTMLCanvasElement>('canvas.devices__gl');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  let shots: Shot[] = [];
  try {
    shots = JSON.parse(el.dataset.tex || '[]');
  } catch {
    /* no screenshots */
  }
  const start = Number(el.dataset.index || 0);
  const m: Mount = {
    el,
    canvas,
    ctx,
    layout: (el.dataset.layout as Layout) || 'both',
    shots,
    index: start,
    nextIndex: start,
    fade: 1,
    fading: false,
    spin: 0,
    spinTarget: 0,
    tilt: { x: 0, y: 0, tx: 0, ty: 0 },
    visible: false,
    dirty: true,
  };
  mounts.push(m);
  shots.forEach((s) => [s.d, s.m, s.m2].forEach((u) => u && tex(u)));

  const dpr = Math.min(devicePixelRatio || 1, 2);
  new ResizeObserver(() => {
    canvas.width = Math.round(el.clientWidth * dpr);
    canvas.height = Math.round(el.clientHeight * dpr);
    dirty(m);
  }).observe(el);

  new IntersectionObserver(
    ([e]) => {
      m.visible = e.isIntersecting;
      if (m.visible) dirty(m);
    },
    { rootMargin: '200px' },
  ).observe(el);

  if (fine && !reduce) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      m.tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.36;
      m.tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.12;
      dirty(m);
    });
    el.addEventListener('pointerleave', () => {
      m.tilt.tx = m.tilt.ty = 0;
      dirty(m);
    });
  }

  // the home page rig switches projects: <el>.dispatchEvent(new CustomEvent('devices:show', { detail: { index, spin } }))
  el.addEventListener('devices:show', (e) => {
    const { index, spin = 0 } = (e as CustomEvent<{ index: number; spin?: number }>).detail;
    if (index === m.nextIndex) return;
    m.nextIndex = index;
    m.spinTarget = spin;
    if (reduce) {
      m.index = index;
      m.spin = spin;
    } else m.fading = true;
    dirty(m);
  });

  el.classList.add('is-3d');
}

export function init(els: Iterable<HTMLElement>) {
  try {
    buildWorld();
  } catch {
    for (const el of els) el.classList.add('no-gl');
    return;
  }
  for (const el of els) mount(el);
}

