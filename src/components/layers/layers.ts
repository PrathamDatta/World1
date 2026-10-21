import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from "three";
import { FRAG, VERT, makeNoise, rng, smooth } from "../sky/cloudShader";

export type LayersState = {
  /** 0 = layers compressed into one bank, 1 = fully separated */
  sep: number;
  selected: number;
  /** set by the scene so the component can request a redraw after changing state */
  poke: () => void;
};
export type LayersOptions = { lite: boolean; reducedMotion: boolean; count: number; onLost: () => void };

/** Vertical position (up = +) of layer i from the stack centre. Shared with the CSS so rows and clouds line up. */
export const layerOffset = (i: number, count: number, row: number, sep: number) =>
  (i - (count - 1) / 2) * row * (1 - 0.55 * (1 - sep));

/**
 * Seven real cloud decks, one per service. An orthographic camera maps 1 world unit to 1 CSS pixel, so each
 * cloud sits exactly behind its DOM row. Separation, lift and dimming are eased here, outside React.
 */
export function createLayers(canvas: HTMLCanvasElement, root: HTMLElement, state: LayersState, opts: LayersOptions) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  const lite = opts.lite || software;
  let animated = !opts.reducedMotion && !software;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 5;
  const noise = makeNoise();
  const rand = rng(41);
  const geo = new PlaneGeometry(1, 1);
  const N = opts.count;

  const layers = Array.from({ length: N }, (_, i) => {
    const mat = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uNoise: { value: noise },
        uTime: { value: 0 },
        uSpeed: { value: 0.004 + rand() * 0.004 },
        uScale: { value: 0.3 + rand() * 0.15 },
        uCover: { value: 0.36 + rand() * 0.04 },
        uOpacity: { value: 0 },
        uAspect: { value: 5 },
        uCalm: { value: 0 },
        uNear: { value: 0 },
        uFog: { value: 0 },
        uMask: { value: [0.82, 1.15] },
        uDim: { value: 0 },
        uSeed: { value: [rand() * 4, rand() * 4] },
        uTint: { value: new Color("#ffffff") },
        uShade: { value: new Color("#8fb4e0") },
        uHaze: { value: new Color("#cfe6ff") },
      },
    });
    const mesh = new Mesh(geo, mat);
    mesh.renderOrder = i;
    scene.add(mesh);
    return { mesh, mat, lift: 0, dim: 0, vis: 0, drift: (rand() - 0.5) * 60 };
  });

  const pointer = { x: 0, tx: 0 };
  let cw = 1, ch = 1, row = 90, visible = true, raf = 0, lost = false;
  let last = performance.now();
  const t0 = performance.now();
  let intro = opts.reducedMotion || software ? 1 : 0;
  let slow = 0.016, frames = 0;
  let sepNow = state.sep;
  const maxDpr = lite ? 0.8 : 1.25;

  function resize() {
    const r = canvas.getBoundingClientRect();
    cw = Math.max(1, Math.round(r.width));
    ch = Math.max(1, Math.round(r.height));
    row = parseFloat(getComputedStyle(root).getPropertyValue("--row")) || 90;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(cw, ch, false);
    camera.left = -cw / 2; camera.right = cw / 2; camera.top = ch / 2; camera.bottom = -ch / 2;
    camera.updateProjectionMatrix();
    layers.forEach((l) => {
      const w = cw * 0.94, h = row * 2;
      l.mesh.scale.set(w, h, 1);
      l.mat.uniforms.uAspect.value = w / h;
    });
    draw();
  }

  function update(dt: number, snap: boolean) {
    const t = (performance.now() - t0) / 1000;
    if (!snap && intro < 1) intro = Math.min(1, intro + dt / 1.8);
    const k = snap ? 1 : 1 - Math.exp(-dt * 6);
    sepNow += (state.sep - sepNow) * (snap ? 1 : 1 - Math.exp(-dt * 7));
    pointer.x += (pointer.tx - pointer.x) * (snap ? 1 : 1 - Math.exp(-dt * 3));
    layers.forEach((l, i) => {
      const sel = i === state.selected;
      l.lift += ((sel ? 1 : 0) - l.lift) * k;
      l.dim += ((sel ? 0 : 1) - l.dim) * k;
      l.vis += (smooth(intro * 1.8 - i * 0.12) - l.vis) * (snap ? 1 : 0.2);
      const y = layerOffset(i, N, row, sepNow) + l.lift * 12 + (1 - l.vis) * -30;
      l.mesh.position.set(l.drift * 0.3 + pointer.x * (8 + i * 3), y, 0);
      l.mesh.scale.y = row * 2 * (1 + l.lift * 0.08);
      const u = l.mat.uniforms;
      u.uTime.value = animated ? t : 0;
      u.uDim.value = l.dim * 0.3;
      u.uOpacity.value = (0.88 + l.lift * 0.12) * l.vis;
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
    if (++frames > 60 && slow > 0.045) { animated = false; draw(); return; }
    update(dt, false);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (!animated || raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  state.poke = () => (animated ? start() : draw());

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  };
  const onVis = () => (document.hidden ? undefined : start());
  const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); opts.onLost(); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { start(); if (!animated) draw(); } });
  const ro = new ResizeObserver(resize);
  io.observe(root);
  ro.observe(root);
  if (animated) window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVis);
  canvas.addEventListener("webglcontextlost", onLost);
  resize();
  start();

  return function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVis);
    canvas.removeEventListener("webglcontextlost", onLost);
    state.poke = () => {};
    geo.dispose();
    noise.dispose();
    layers.forEach((l) => l.mat.dispose());
    renderer.dispose();
  };
}
