import {
  Color,
  DataTexture,
  LinearFilter,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RGBAFormat,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

export type SkyOptions = { lite: boolean; reducedMotion: boolean; onLost: () => void };

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const smooth = (x: number) => {
  const t = MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

/** One small tileable fractal-noise texture shared by every cloud layer (generated once, no network request). */
function makeNoise(size = 512) {
  const rand = rng(5);
  const octaves = [{ f: 4, a: 1 }, { f: 8, a: 0.6 }, { f: 16, a: 0.38 }, { f: 32, a: 0.24 }, { f: 64, a: 0.14 }];
  const grids = octaves.map((o) => Float32Array.from({ length: o.f * o.f }, () => rand()));
  const data = new Uint8Array(size * size * 4);
  const sum = octaves.reduce((s, o) => s + o.a, 0);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      octaves.forEach((o, k) => {
        const u = (x / size) * o.f, w = (y / size) * o.f;
        const x0 = Math.floor(u), y0 = Math.floor(w);
        const fx = u - x0, fy = w - y0;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const x1 = (x0 + 1) % o.f, y1 = (y0 + 1) % o.f;
        const g = grids[k];
        const a = g[y0 * o.f + x0], b = g[y0 * o.f + x1], c = g[y1 * o.f + x0], d = g[y1 * o.f + x1];
        v += o.a * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy);
      });
      v = MathUtils.clamp((v / sum - 0.5) * 2.1 + 0.5, 0, 1);
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = v * 255;
      data[i + 3] = 255;
    }
  }
  const tex = new DataTexture(data, size, size, RGBAFormat);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.minFilter = tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

const VERT = /* glsl */ `
varying vec2 vUv; varying float vDist;
void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv; }`;

// Pseudo-volumetric cloud bank: layered texture taps give density; a second tap offset toward the sun gives
// self-shadowing (bright sunlit edges, blue-grey bellies); distance blends toward a light haze for atmospheric depth.
const FRAG = /* glsl */ `
uniform sampler2D uNoise;
uniform float uTime, uSpeed, uScale, uCover, uOpacity, uAspect, uCalm, uNear;
uniform vec2 uSeed; uniform vec3 uTint, uShade, uHaze;
varying vec2 vUv; varying float vDist;
float tex(vec2 q){ return texture2D(uNoise, q).r; }
float body(vec2 q){ return tex(q) * 0.72 + tex(q * 2.1 + 0.31) * 0.28; }
void main(){
  vec2 m = (vUv - 0.5) * 2.0;
  float mask = 1.0 - smoothstep(0.25, 1.0, length(m * vec2(1.0, 1.55)));
  // cumulus: broad billows with a flatter base
  mask *= mix(0.55, 1.0, smoothstep(0.06, 0.4, vUv.y));
  if (mask <= 0.002) discard;
  vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0) * uScale + uSeed + vec2(uTime * uSpeed, uTime * uSpeed * 0.1);
  float cover = uCover + uCalm * 0.1;
  float shape = body(q) * mask * 1.7;
  // fine billows erode the edge so outlines are crisp and cauliflower-like, not blurry blobs
  float detail = tex(q * 5.3 + 0.5) * 0.6 + tex(q * 11.0 + 0.2) * 0.4;
  float s = shape + (detail - 0.5) * 0.34;
  float d = smoothstep(cover, cover + 0.15, s);
  if (d <= 0.003) discard;
  // march toward the sun (up and to the right): the more cloud in the way, the darker the pixel
  vec2 sun = vec2(0.5, 0.86);
  float occ = 0.0;
  for (int i = 1; i <= 3; i++) {
    vec2 o = sun * (0.012 * float(i));
    float si = body(q + o) * mask * 1.7 + (tex((q + o) * 5.3 + 0.5) - 0.5) * 0.34;
    occ += smoothstep(cover, cover + 0.15, si);
  }
  occ /= 3.0;
  float lit = clamp(1.55 - occ * 0.8 + (detail - 0.5) * 0.7, 0.0, 1.0);
  float belly = smoothstep(0.0, 0.7, vUv.y);
  float k = clamp(lit * 0.78 + belly * 0.3, 0.0, 1.0);
  vec3 col = mix(uShade, uTint, k);
  float rim = (1.0 - smoothstep(0.0, 0.5, d)) * lit;
  col += vec3(0.1, 0.09, 0.05) * rim; // faint warm silver lining on sunlit edges
  col = mix(col, uHaze, smoothstep(10.0, 80.0, vDist) * 0.6);
  float a = d * uOpacity * smoothstep(uNear, uNear + 8.0, vDist) * (1.0 - uCalm * 0.35);
  gl_FragColor = vec4(col, a);
}`;

/**
 * Site-wide sky: layered cloud banks at different depths, a camera that flies through them as the page scrolls,
 * and State lives outside React; rendering pauses when hidden.
 */
export function createSky(canvas: HTMLCanvasElement, root: HTMLElement, opts: SkyOptions) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  const lite = opts.lite || software;
  let animated = !opts.reducedMotion && !software;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 140);
  const noise = makeNoise();
  const rand = rng(23);

  // ---- cloud banks ----------------------------------------------------------------------------------------
  const N = lite ? 9 : 15;
  const geo = new PlaneGeometry(1, 1);
  const layers: { mesh: Mesh; mat: ShaderMaterial; base: number; i: number }[] = [];
  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    const z = MathUtils.lerp(9, -58, f) + (rand() - 0.5) * 2.5;
    const w = 46 + rand() * 40 + (1 - f) * 8;
    const h = w * (0.34 + rand() * 0.14);
    const mat = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uNoise: { value: noise },
        uTime: { value: 0 },
        uSpeed: { value: 0.0035 + rand() * 0.004 },
        uScale: { value: 0.8 + rand() * 0.45 },
        uCover: { value: 0.5 + rand() * 0.05 },
        uOpacity: { value: 0 },
        uAspect: { value: w / h },
        uCalm: { value: 0 },
        uNear: { value: 3.5 },
        uSeed: { value: [rand() * 4, rand() * 4] },
        uTint: { value: new Color("#ffffff") },
        uShade: { value: new Color("#a9c8ec") },
        uHaze: { value: new Color("#cfe6ff") },
      },
    });
    const mesh = new Mesh(geo, mat);
    // alternate banks left/right and low/high so the frame always has open sky and big overlapping masses
    const side = i % 2 ? 1 : -1;
    mesh.position.set(side * (4 + rand() * 12), (rand() - 0.45) * 11 - (i % 3 === 0 ? 4 : 0), z);
    mesh.scale.set(w, h, 1);
    scene.add(mesh);
    layers.push({ mesh, mat, base: 0.9 - f * 0.12, i });
  }

  // ---- state ------------------------------------------------------------------------------------------------------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let width = 1, height = 1, visible = true, raf = 0, lost = false;
  let last = performance.now();
  const t0 = performance.now();
  let intro = opts.reducedMotion || software ? 1 : 0;
  let slow = 0.016, frames = 0;
  const cam = { p: 0 };
  const maxDpr = lite ? 0.7 : 1; // clouds are soft: low resolution is invisible and much cheaper

  function resize() {
    width = Math.max(1, root.clientWidth);
    height = Math.max(1, root.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw();
  }

  function update(dt: number, snap: boolean) {
    const t = (performance.now() - t0) / 1000;
    if (!snap && intro < 1) intro = Math.min(1, intro + dt / 2.4);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const target = MathUtils.clamp(window.scrollY / max, 0, 1);
    cam.p += (target - cam.p) * (snap ? 1 : 1 - Math.exp(-dt * 3.2));
    if (snap) cam.p = target;
    const pk = snap ? 1 : 1 - Math.exp(-dt * 3);
    pointer.x += (pointer.tx - pointer.x) * pk;
    pointer.y += (pointer.ty - pointer.y) * pk;

    const ease = smooth(intro);
    const p = cam.p;
    const calm = smooth((p - 0.72) / 0.25);
    // fly forward through the layers; the hero starts a little behind and settles in
    camera.position.set(pointer.x * 1.2, 0.6 - p * 2.5 + pointer.y * -0.5 + (1 - ease) * 0.8, 15 - p * 56 + (1 - ease) * 5);
    camera.lookAt(pointer.x * 0.9 + Math.sin(p * 5) * 1.2, -0.2 - p * 1.5, camera.position.z - 20);
    root.style.setProperty("--sky-p", p.toFixed(3));
    root.style.setProperty("--sky-calm", calm.toFixed(3));

    layers.forEach((l) => {
      const u = l.mat.uniforms;
      u.uTime.value = animated ? t : 0;
      u.uCalm.value = calm;
      // far banks fade in first, near banks last: the formations "emerge" in depth order
      const reveal = smooth(intro * 1.7 - (1 - l.i / (N - 1)) * 0.7);
      u.uOpacity.value = l.base * reveal;
    });
  }

  function draw() {
    if (lost) return;
    update(0.016, true);
    renderer.render(scene, camera);
  }
  function frame(now: number) {
    raf = 0;
    if (!visible || document.hidden || lost) return;
    const raw = (now - last) / 1000;
    const dt = Math.min(0.05, raw);
    last = now;
    slow = slow * 0.9 + raw * 0.1;
    if (++frames > 60 && slow > 0.045) { // cannot hold ~22fps: freeze to on-demand rendering
      animated = false;
      draw();
      return;
    }
    update(dt, false);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (!animated || raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onScroll = () => (animated ? start() : draw());
  const onVis = () => (document.hidden ? undefined : start());
  const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); opts.onLost(); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  const ro = new ResizeObserver(resize);
  io.observe(root);
  ro.observe(root);
  if (animated) window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVis);
  canvas.addEventListener("webglcontextlost", onLost);
  resize();
  start();

  return function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVis);
    canvas.removeEventListener("webglcontextlost", onLost);
    geo.dispose();
    noise.dispose();
    layers.forEach((l) => l.mat.dispose());
    renderer.dispose();
  };
}
