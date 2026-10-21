import {
  Color,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { FRAG, VERT, makeNoise, rng, smooth } from "./cloudShader";

export type SkyOptions = { lite: boolean; reducedMotion: boolean; onLost: () => void };

/**
 * Site-wide sky: layered cloud banks at different depths, a camera that flies through them as the page scrolls,
 * State lives outside React; rendering pauses when hidden.
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
        uFog: { value: 1 },
        uMask: { value: [1, 1.55] },
        uDim: { value: 0 },
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
