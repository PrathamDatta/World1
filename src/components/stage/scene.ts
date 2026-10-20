import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MathUtils,
  Object3D,
  OctahedronGeometry,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { stage, subscribeStage } from "@/lib/stage";

const N = 7; // layers, matches src/data/layers.ts
const SPACING = 0.95;
const SIZE = 4.4;
const THICK = 0.1;
const LIME = new Color("#c9ff2f");
const WHITE = new Color("#f4ffd0");

export type SceneOptions = {
  lite: boolean;
  reducedMotion: boolean;
  onLost: () => void;
};

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const layerY = (i: number) => (i - (N - 1) / 2) * SPACING;
const smooth = (x: number) => {
  const t = MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

export function createStage(canvas: HTMLCanvasElement, opts: SceneOptions) {
  const { reducedMotion } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: !opts.lite, alpha: true, powerPreference: "high-performance" });
  // Software rasterisers (SwiftShader, llvmpipe, VMs without a GPU) cannot sustain a continuous loop: render on demand instead.
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  const lite = opts.lite || software;
  let animated = !reducedMotion && !software;
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 80);
  const root = new Group();
  scene.add(root);

  scene.add(new AmbientLight(0xffffff, 0.55));
  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 8, 5);
  scene.add(key);
  const glow = new PointLight(LIME, 14, 9, 1.6);
  scene.add(glow);

  // ---- plates ----------------------------------------------------------
  const plateGeo = new BoxGeometry(SIZE, THICK, SIZE);
  const edgeGeo = new EdgesGeometry(plateGeo);
  const gridPts: number[] = [];
  const cells = 10;
  for (let i = 0; i <= cells; i++) {
    const p = -SIZE / 2 + (SIZE / cells) * i;
    gridPts.push(p, THICK / 2 + 0.002, -SIZE / 2, p, THICK / 2 + 0.002, SIZE / 2);
    gridPts.push(-SIZE / 2, THICK / 2 + 0.002, p, SIZE / 2, THICK / 2 + 0.002, p);
  }
  const gridGeo = new BufferGeometry();
  gridGeo.setAttribute("position", new Float32BufferAttribute(gridPts, 3));

  type Plate = { group: Group; mat: MeshStandardMaterial; edge: LineBasicMaterial; grid: LineBasicMaterial; lift: number; vis: number };
  const plates: Plate[] = [];
  for (let i = 0; i < N; i++) {
    const group = new Group();
    const mat = new MeshStandardMaterial({ color: "#1b1e20", metalness: 0.7, roughness: 0.42, transparent: true, opacity: 0.9 });
    const edge = new LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.6 });
    const grid = new LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.12 });
    group.add(new Mesh(plateGeo, mat), new LineSegments(edgeGeo, edge), new LineSegments(gridGeo, grid));
    root.add(group);
    plates.push({ group, mat, edge, grid, lift: 0, vis: 0 });
  }

  // ---- nodes, beams, pulses -------------------------------------------
  const rand = rng(7);
  const perLayer = lite ? 6 : 11;
  const nodePos: { x: number; z: number; layer: number }[] = [];
  for (let l = 0; l < N; l++) {
    for (let k = 0; k < perLayer; k++) {
      nodePos.push({ x: (rand() - 0.5) * (SIZE - 0.9), z: (rand() - 0.5) * (SIZE - 0.9), layer: l });
    }
  }
  const nodeGeo = new OctahedronGeometry(0.052);
  const nodeMat = new MeshBasicMaterial({ color: LIME });
  const nodes = new InstancedMesh(nodeGeo, nodeMat, nodePos.length);
  root.add(nodes);

  const beamPts: number[] = [];
  const beams: { a: [number, number, number]; b: [number, number, number] }[] = [];
  for (let l = 0; l < N - 1; l++) {
    const here = nodePos.filter((n) => n.layer === l);
    const above = nodePos.filter((n) => n.layer === l + 1);
    here.forEach((n) => {
      let best = above[0];
      let d = Infinity;
      above.forEach((m) => {
        const dd = (m.x - n.x) ** 2 + (m.z - n.z) ** 2;
        if (dd < d) { d = dd; best = m; }
      });
      const a: [number, number, number] = [n.x, layerY(l) + THICK, n.z];
      const b: [number, number, number] = [best.x, layerY(l + 1) + THICK, best.z];
      beams.push({ a, b });
      beamPts.push(...a, ...b);
    });
  }
  const beamGeo = new BufferGeometry();
  beamGeo.setAttribute("position", new Float32BufferAttribute(beamPts, 3));
  const beamMat = new LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.22 });
  root.add(new LineSegments(beamGeo, beamMat));

  const pulseCount = lite ? 14 : 34;
  const pulseGeo = new BufferGeometry();
  const pulsePos = new Float32Array(pulseCount * 3);
  pulseGeo.setAttribute("position", new Float32BufferAttribute(pulsePos, 3));
  const pulseState = Array.from({ length: pulseCount }, () => ({ beam: Math.floor(rand() * beams.length), t: rand(), v: 0.18 + rand() * 0.3 }));
  const pulseMat = new PointsMaterial({ color: WHITE, size: 0.11, sizeAttenuation: true, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false });
  root.add(new Points(pulseGeo, pulseMat));

  // ---- camera / interaction state -------------------------------------
  const dummy = new Object3D();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const cam = { radius: 15, elev: 0.42, yaw: 0.72, ty: 0.3, shift: 0 };
  let width = 1;
  let height = 1;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  const t0 = performance.now();
  let intro = reducedMotion || software ? 1 : 0;
  let lost = false;
  let slow = 0.016;
  let frames = 0;

  const maxDpr = lite ? 1 : 1.75;
  function resize() {
    const r = canvas.parentElement?.getBoundingClientRect();
    width = Math.max(1, Math.round(r?.width ?? window.innerWidth));
    height = Math.max(1, Math.round(r?.height ?? window.innerHeight));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? Math.min(maxDpr, 1.5) : maxDpr));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw();
  }

  function pose(dt: number, snap: boolean) {
    const active = stage.hover >= 0 ? stage.hover : stage.focus;
    const sy = window.scrollY / Math.max(1, window.innerHeight);
    const b = smooth((sy - 0.12) / 0.8); // 0 = hero pose, 1 = story pose
    const wide = width / height > 1.15;
    const target = {
      radius: MathUtils.lerp(wide ? 19 : 29, wide ? 11.6 : 16.5, b),
      elev: MathUtils.lerp(0.42, 0.3, b),
      yaw: 0.72 + (active >= 0 ? active * 0.16 : 0) + (stage.focus >= 0 ? 0 : 0),
      ty: active >= 0 && stage.focus >= 0 ? layerY(stage.focus) : stage.hover >= 0 ? layerY(stage.hover) * 0.6 : 0.3,
      shift: wide ? width * 0.1 : 0,
    };
    const k = snap ? 1 : 1 - Math.exp(-dt * 3.2);
    cam.radius += (target.radius - cam.radius) * k;
    cam.elev += (target.elev - cam.elev) * k;
    cam.yaw += (target.yaw - cam.yaw) * k;
    cam.ty += (target.ty - cam.ty) * k;
    cam.shift += (target.shift - cam.shift) * k;
    const pk = snap ? 1 : 1 - Math.exp(-dt * 4);
    pointer.x += (pointer.tx - pointer.x) * pk;
    pointer.y += (pointer.ty - pointer.y) * pk;
    const drift = !animated ? 0 : Math.sin((performance.now() - t0) / 9000) * 0.06;
    const yaw = cam.yaw + pointer.x * 0.22 + drift;
    const elev = cam.elev + pointer.y * 0.07;
    camera.position.set(
      Math.sin(yaw) * Math.cos(elev) * cam.radius,
      cam.ty + Math.sin(elev) * cam.radius,
      Math.cos(yaw) * Math.cos(elev) * cam.radius,
    );
    camera.lookAt(0, cam.ty, 0);
    camera.setViewOffset(width, height, -cam.shift, 0, width, height);
    return active;
  }

  function update(dt: number, snap: boolean) {
    const active = pose(dt, snap);
    const t = (performance.now() - t0) / 1000;
    if (!snap && intro < 1) intro = Math.min(1, intro + dt / 1.8);
    for (let i = 0; i < N; i++) {
      const p = plates[i];
      const isActive = i === active;
      const dim = active >= 0 && !isActive;
      const stagger = smooth((intro * (1 + 0.55 * N) - i * 0.55) / 1);
      p.vis += ((1 - 0) * stagger - p.vis) * (snap ? 1 : 0.2);
      p.lift += ((isActive ? 0.22 : 0) - p.lift) * (snap ? 1 : 1 - Math.exp(-dt * 6));
      p.group.position.y = layerY(i) + p.lift + (1 - p.vis) * 3.2;
      p.mat.opacity = 0.9 * p.vis * (dim ? 0.55 : 1);
      p.edge.opacity = p.vis * (isActive ? 1 : dim ? 0.28 : 0.6);
      p.edge.color.copy(isActive ? WHITE : LIME);
      p.grid.opacity = p.vis * (isActive ? 0.32 : 0.12);
    }
    if (active >= 0) {
      glow.position.set(0, layerY(active) + 0.9, 0);
      glow.intensity = 14;
    } else {
      glow.position.set(0, 2.6, 0);
      glow.intensity = 6;
    }
    // nodes
    for (let i = 0; i < nodePos.length; i++) {
      const n = nodePos[i];
      const pl = plates[n.layer];
      const pulse = !animated ? 1 : 1 + Math.sin(t * 1.6 + i * 1.7) * 0.28;
      dummy.position.set(n.x, pl.group.position.y + THICK + 0.05, n.z);
      dummy.scale.setScalar(pulse * Math.max(0.001, pl.vis) * (n.layer === active ? 1.5 : 1));
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;
    // pulses travel upward along beams
    if (animated) {
      for (let i = 0; i < pulseCount; i++) {
        const s = pulseState[i];
        s.t += dt * s.v;
        if (s.t > 1) { s.t = 0; s.beam = Math.floor(Math.random() * beams.length); }
        const bm = beams[s.beam];
        pulsePos[i * 3] = MathUtils.lerp(bm.a[0], bm.b[0], s.t);
        pulsePos[i * 3 + 1] = MathUtils.lerp(bm.a[1], bm.b[1], s.t);
        pulsePos[i * 3 + 2] = MathUtils.lerp(bm.a[2], bm.b[2], s.t);
      }
      (pulseGeo.getAttribute("position") as Float32BufferAttribute).needsUpdate = true;
    } else {
      pulseMat.opacity = 0;
    }
    beamMat.opacity = 0.22 * intro;
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
    // Frame-time governor: if the device cannot hold ~25fps, fall back to the static on-demand mode.
    slow = slow * 0.9 + raw * 0.1;
    if (++frames > 45 && slow > 0.045) {
      animated = false;
      renderer.setPixelRatio(1);
      renderer.setSize(width, height, false);
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

  // ---- listeners -------------------------------------------------------
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onVis = () => (document.hidden ? undefined : start());
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    opts.onLost();
  };
  const unsub = subscribeStage(() => (animated ? start() : draw()));
  const onScroll = () => (animated ? start() : draw());
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
  });
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) {
    io.observe(canvas.parentElement);
    ro.observe(canvas.parentElement);
  }
  if (animated) window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVis);
  canvas.addEventListener("webglcontextlost", onLost);

  resize();
  start();

  return function dispose() {
    cancelAnimationFrame(raf);
    unsub();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVis);
    canvas.removeEventListener("webglcontextlost", onLost);
    plateGeo.dispose();
    edgeGeo.dispose();
    gridGeo.dispose();
    nodeGeo.dispose();
    beamGeo.dispose();
    pulseGeo.dispose();
    nodeMat.dispose();
    beamMat.dispose();
    pulseMat.dispose();
    nodes.dispose();
    plates.forEach((p) => { p.mat.dispose(); p.edge.dispose(); p.grid.dispose(); });
    renderer.dispose();
  };
}
