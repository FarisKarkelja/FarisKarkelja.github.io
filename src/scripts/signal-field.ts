/* Hero "signal field": a perspective plane of points moving like a sound wave.
   A nod to the voice/TTS work - the accent colour in the troughs, the signal colour on the crests.
   The cursor sends ripples through it. Pauses when off-screen or in a hidden tab. */
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  AdditiveBlending,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { token } from './theme';

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vHeight;
  varying float vFade;

  // compact 2D simplex noise (Ashima / Stefan Gustavson)
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec3 p = position;
    float t = uTime;

    // speech-like envelope travelling across the field
    float envelope = 0.55 + 0.45 * sin(p.x * 0.11 - t * 0.55) * sin(p.x * 0.031 + t * 0.21);
    float wave = sin(p.x * 0.42 + t * 1.1) * 0.55 + sin(p.x * 0.9 - t * 1.7 + p.z * 0.15) * 0.22;
    float n = snoise(vec2(p.x * 0.07 + t * 0.08, p.z * 0.12 - t * 0.05));
    float h = (wave * envelope * 1.5 + n * 1.1) * smoothstep(-30.0, -2.0, p.z);

    // cursor ripple
    float d = distance(p.xz, uMouse);
    h += uMouseStrength * 1.25 * exp(-d * d * 0.045) * sin(d * 1.15 - t * 5.0);

    p.y += h;
    vHeight = h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = uSize * uPixelRatio * (0.7 + aSeed * 0.8) * (16.0 / depth);
    // fade towards the horizon and the side edges
    vFade = smoothstep(44.0, 8.0, depth) * smoothstep(34.0, 18.0, abs(p.x));
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  varying float vHeight;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    float crest = smoothstep(0.35, 1.5, vHeight);
    vec3 col = mix(uLow, uHigh, crest);
    float alpha = soft * vFade * (0.55 + crest * 0.75);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function initSignalField(canvas: HTMLCanvasElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;
  const lowPower = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 2;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 3.4, 11);
  camera.lookAt(0, 0.9, -8);

  const cols = small || lowPower ? 150 : 260;
  const rows = small || lowPower ? 70 : 120;
  const width = 64;
  const depth = 44;
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions[i * 3] = (c / (cols - 1) - 0.5) * width;
      positions[i * 3 + 1] = -1.6;
      positions[i * 3 + 2] = 6 - (r / (rows - 1)) * depth;
      seeds[i] = Math.random();
      i++;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: small ? 3.0 : 2.8 },
    uMouse: { value: new Vector2(0, -2) },
    uMouseStrength: { value: 0 },
    uPixelRatio: { value: dpr },
    uLow: { value: new Color(token('--accent') || '#c8a061') },
    uHigh: { value: new Color(token('--signal') || '#7fe0e4') },
  };
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  scene.add(new Points(geometry, material));

  window.addEventListener('themechange', () => {
    uniforms.uLow.value.set(token('--accent'));
    uniforms.uHigh.value.set(token('--signal'));
    if (reduce) renderer.render(scene, camera);
  });

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  // cursor -> point on the field
  const ray = new Raycaster();
  const plane = new Plane(new Vector3(0, 1, 0), 1.6);
  const ndc = new Vector2();
  const target = new Vector2(0, -2);
  const hit = new Vector3();
  let mouseActive = 0;
  if (!reduce) {
    window.addEventListener(
      'pointermove',
      (e) => {
        const rect = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(plane, hit)) {
          target.set(hit.x, hit.z);
          mouseActive = 1;
        }
      },
      { passive: true },
    );
  }

  let last = performance.now();
  let visible = true;
  let running = false;
  let raf = 0;

  const frame = () => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.lerp(target, 0.08);
    uniforms.uMouseStrength.value += (mouseActive - uniforms.uMouseStrength.value) * 0.04;
    mouseActive *= 0.995;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const play = () => {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  if (reduce) {
    uniforms.uTime.value = 6.0;
    renderer.render(scene, camera);
  } else {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible && !document.hidden ? play() : stop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden || !visible ? stop() : play()));
    play();
  }

  requestAnimationFrame(() => canvas.classList.add('is-ready'));
}
