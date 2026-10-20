import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  WebGLRenderer,
} from "three";

export type CloudOptions = {
  lite: boolean;
  reducedMotion: boolean;
  onLost: () => void;
};

const SKY = new Color("#75c9ff");
const ICE = new Color("#e6f5ff");
const BLUE = new Color("#1469df");

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

/**
 * A conceptual brand visual (not a diagram of any real infrastructure): a cloud-shaped lattice of connected
 * nodes floating above three translucent tiers (compute, network, storage). Data pulses travel along a
 * subset of the links. Pointer and scroll only nudge the camera; all state lives outside React.
 */
export function createCloud(canvas: HTMLCanvasElement, opts: CloudOptions) {
  const { reducedMotion } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: !opts.lite, alpha: true, powerPreference: "high-performance" });
  // Software rasterisers cannot sustain a continuous loop: render on demand (static pose) instead.
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  const lite = opts.lite || software;
  let animated = !reducedMotion && !software;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 80);
  const root = new Group();
  scene.add(root);
  scene.add(new AmbientLight(0xb4d4ff, 0.7));
  const key = new DirectionalLight(0xd6e9ff, 1.2);
  key.position.set(3, 6, 5);
  scene.add(key);
  const glow = new PointLight(SKY, 16, 12, 1.6);
  glow.position.set(0, 0.6, 1.2);
  scene.add(glow);

  const rand = rng(11);

  // ---- cloud lattice: nodes sampled inside overlapping ellipsoids with a flattened base ----------------
  const lobes = [
    { c: [0, 0.35, 0], r: [1.9, 1.15, 1.5] },
    { c: [-1.6, -0.05, 0.1], r: [1.25, 0.85, 1.1] },
    { c: [1.65, 0.0, -0.1], r: [1.3, 0.9, 1.1] },
    { c: [-0.7, 0.9, -0.2], r: [1.0, 0.75, 0.95] },
    { c: [0.8, 0.85, 0.2], r: [0.95, 0.7, 0.9] },
  ];
  const target = lite ? 46 : 78;
  const pts: { p: [number, number, number]; s: number }[] = [];
  let guard = 0;
  while (pts.length < target && guard++ < 6000) {
    const l = lobes[Math.floor(rand() * lobes.length)];
    const u = rand() * 2 - 1, v = rand() * 2 - 1, w = rand() * 2 - 1;
    if (u * u + v * v + w * w > 1) continue;
    const p: [number, number, number] = [l.c[0] + u * l.r[0], Math.max(l.c[1] + v * l.r[1], -0.75), l.c[2] + w * l.r[2]];
    if (pts.some((q) => (q.p[0] - p[0]) ** 2 + (q.p[1] - p[1]) ** 2 + (q.p[2] - p[2]) ** 2 < 0.22)) continue;
    pts.push({ p, s: 0.45 + Math.pow(rand(), 2.2) * 1.6 });
  }

  // links: each node to its two nearest neighbours (deduplicated)
  const linkSet = new Set<string>();
  const links: [number, number][] = [];
  pts.forEach((a, i) => {
    const near = pts
      .map((b, j) => ({ j, d: (a.p[0] - b.p[0]) ** 2 + (a.p[1] - b.p[1]) ** 2 + (a.p[2] - b.p[2]) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3);
    near.forEach((o) => {
      const k = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
      if (!linkSet.has(k) && o.d < 1.7) { linkSet.add(k); links.push([i, o.j]); }
    });
  });
  const linkPts: number[] = [];
  links.forEach(([a, b]) => linkPts.push(...pts[a].p, ...pts[b].p));
  const linkGeo = new BufferGeometry();
  linkGeo.setAttribute("position", new Float32BufferAttribute(linkPts, 3));
  const linkMat = new LineBasicMaterial({ color: SKY, transparent: true, opacity: 0.0 });
  const lattice = new Group();
  lattice.add(new LineSegments(linkGeo, linkMat));

  const nodeGeo = new OctahedronGeometry(0.06);
  const nodeMat = new MeshBasicMaterial({ color: ICE });
  const nodes = new InstancedMesh(nodeGeo, nodeMat, pts.length);
  const dummy = new Object3D();
  lattice.add(nodes);
  root.add(lattice);

  // ---- translucent core shell echoing the cloud (one focal point) ---------------------------------------
  const coreGeo = new IcosahedronGeometry(0.62, 1);
  const coreEdges = new EdgesGeometry(coreGeo);
  const coreMat = new MeshStandardMaterial({ color: "#0d2a56", metalness: 0.6, roughness: 0.35, transparent: true, opacity: 0, emissive: BLUE, emissiveIntensity: 0.55 });
  const coreLine = new LineBasicMaterial({ color: ICE, transparent: true, opacity: 0 });
  const core = new Group();
  core.position.set(0, 0.3, 0);
  core.add(new Mesh(coreGeo, coreMat), new LineSegments(coreEdges, coreLine));
  root.add(core);

  // ---- three tiers beneath the cloud: compute / network / storage ---------------------------------------
  const tierGeo = new CircleGeometry(2.9, 6);
  const tierEdgeGeo = new RingGeometry(2.86, 2.9, 6);
  const tiers: { g: Group; fill: MeshBasicMaterial; edge: MeshBasicMaterial; y: number }[] = [];
  [-1.3, -1.85, -2.4].forEach((y, i) => {
    const g = new Group();
    const fill = new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, depthWrite: false });
    const edge = new MeshBasicMaterial({ color: SKY, transparent: true, opacity: 0, depthWrite: false });
    const m = new Mesh(tierGeo, fill);
    const r = new Mesh(tierEdgeGeo, edge);
    g.rotation.x = -Math.PI / 2;
    g.rotation.z = i * 0.18;
    g.add(m, r);
    g.position.y = y;
    root.add(g);
    tiers.push({ g, fill, edge, y });
  });
  // vertical "drops" from the cloud down through the tiers
  const dropPts: number[] = [];
  const drops = lite ? 5 : 9;
  const dropX: { x: number; z: number }[] = [];
  for (let i = 0; i < drops; i++) {
    const a = (i / drops) * Math.PI * 2 + 0.4;
    const r = 0.6 + rand() * 1.6;
    const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.8;
    dropX.push({ x, z });
    dropPts.push(x, -0.7, z, x, -2.4, z);
  }
  const dropGeo = new BufferGeometry();
  dropGeo.setAttribute("position", new Float32BufferAttribute(dropPts, 3));
  const dropMat = new LineBasicMaterial({ color: SKY, transparent: true, opacity: 0 });
  root.add(new LineSegments(dropGeo, dropMat));

  // ---- travelling data pulses -------------------------------------------------------------------------------
  const pulseCount = lite ? 14 : 30;
  const pulsePos = new Float32Array(pulseCount * 3);
  const pulseGeo = new BufferGeometry();
  pulseGeo.setAttribute("position", new Float32BufferAttribute(pulsePos, 3));
  const pulseMat = new PointsMaterial({ color: ICE, size: 0.1, sizeAttenuation: true, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  root.add(new Points(pulseGeo, pulseMat));
  const pulseState = Array.from({ length: pulseCount }, (_, i) => ({
    kind: i % 4 === 0 ? 1 : 0, // 1 = drop through the tiers, 0 = lattice link
    id: Math.floor(rand() * 1000),
    t: rand(),
    v: 0.16 + rand() * 0.28,
  }));

  // ---- state ---------------------------------------------------------------------------------------------------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let width = 1, height = 1, visible = true, raf = 0, lost = false;
  let last = performance.now();
  const t0 = performance.now();
  let intro = reducedMotion || software ? 1 : 0;
  let slow = 0.016, frames = 0;
  const maxDpr = lite ? 1 : 1.75;

  function resize() {
    const r = canvas.parentElement?.getBoundingClientRect();
    width = Math.max(1, Math.round(r?.width ?? window.innerWidth));
    height = Math.max(1, Math.round(r?.height ?? window.innerHeight));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 700 ? Math.min(maxDpr, 1.5) : maxDpr));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw();
  }

  function update(dt: number, snap: boolean) {
    const t = (performance.now() - t0) / 1000;
    if (!snap && intro < 1) intro = Math.min(1, intro + dt / 2.2);
    const pk = snap ? 1 : 1 - Math.exp(-dt * 3.5);
    pointer.x += (pointer.tx - pointer.x) * pk;
    pointer.y += (pointer.ty - pointer.y) * pk;

    // scroll: hero is `height` tall; b = 0 at top, 1 once it has scrolled away
    const b = smooth(window.scrollY / Math.max(1, height));
    const wide = width / height > 1.1;
    const radius = MathUtils.lerp(wide ? 17 : 25, wide ? 21 : 28, b);
    const elev = MathUtils.lerp(0.2, 0.62, b) + pointer.y * 0.05;
    const yaw = 0.5 + b * 0.7 + pointer.x * 0.16 + (animated ? Math.sin(t / 11) * 0.07 : 0);
    camera.position.set(Math.sin(yaw) * Math.cos(elev) * radius, Math.sin(elev) * radius, Math.cos(yaw) * Math.cos(elev) * radius);
    camera.lookAt(0, -0.35, 0);
    camera.setViewOffset(width, height, wide ? -width * 0.2 : 0, wide ? 0 : height * 0.27, width, height);

    const ease = smooth(intro);
    root.rotation.y = animated ? t * 0.035 : 0;
    root.position.y = animated ? Math.sin(t * 0.5) * 0.05 : 0;
    lattice.position.y = (1 - ease) * 1.4;
    lattice.scale.setScalar(0.85 + 0.15 * ease);
    linkMat.opacity = 0.34 * ease * (1 - b * 0.5);
    nodeMat.opacity = 1;
    core.scale.setScalar(ease * (1 + (animated ? Math.sin(t * 1.2) * 0.03 : 0)));
    core.rotation.y = animated ? t * 0.25 : 0.4;
    coreMat.opacity = 0.55 * ease;
    coreLine.opacity = 0.85 * ease;
    tiers.forEach((tr, i) => {
      const s = smooth(intro * 1.6 - i * 0.25);
      tr.g.position.y = tr.y - (1 - s) * 0.8;
      tr.fill.opacity = 0.07 * s;
      tr.edge.opacity = (0.55 - i * 0.12) * s;
    });
    dropMat.opacity = 0.2 * ease;
    glow.intensity = 14 + pointer.x * 3;
    glow.position.x = pointer.x * 2.5;

    for (let i = 0; i < pts.length; i++) {
      const n = pts[i];
      const pulse = animated ? 1 + Math.sin(t * 1.5 + i * 1.7) * 0.22 : 1;
      dummy.position.set(n.p[0], n.p[1], n.p[2]);
      dummy.scale.setScalar(n.s * pulse * ease);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;

    if (animated) {
      for (let i = 0; i < pulseCount; i++) {
        const s = pulseState[i];
        s.t += dt * s.v;
        if (s.t > 1) { s.t = 0; s.id = Math.floor(Math.random() * 1000); }
        if (s.kind === 1) {
          const d = dropX[s.id % dropX.length];
          pulsePos[i * 3] = d.x;
          pulsePos[i * 3 + 1] = MathUtils.lerp(-0.7, -2.4, s.t);
          pulsePos[i * 3 + 2] = d.z;
        } else {
          const [a, c] = links[s.id % links.length];
          pulsePos[i * 3] = MathUtils.lerp(pts[a].p[0], pts[c].p[0], s.t);
          pulsePos[i * 3 + 1] = MathUtils.lerp(pts[a].p[1], pts[c].p[1], s.t) + lattice.position.y;
          pulsePos[i * 3 + 2] = MathUtils.lerp(pts[a].p[2], pts[c].p[2], s.t);
        }
      }
      (pulseGeo.getAttribute("position") as Float32BufferAttribute).needsUpdate = true;
      pulseMat.opacity = 0.95 * ease;
    } else {
      pulseMat.opacity = 0;
    }
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
    // Frame-time governor: drop to on-demand rendering if the device cannot hold ~25fps.
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

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onScroll = () => (animated ? start() : draw());
  const onVis = () => (document.hidden ? undefined : start());
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    opts.onLost();
  };
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
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVis);
    canvas.removeEventListener("webglcontextlost", onLost);
    [linkGeo, nodeGeo, coreGeo, coreEdges, tierGeo, tierEdgeGeo, dropGeo, pulseGeo].forEach((g) => g.dispose());
    [linkMat, nodeMat, coreMat, coreLine, dropMat, pulseMat].forEach((m) => m.dispose());
    tiers.forEach((t) => { t.fill.dispose(); t.edge.dispose(); });
    nodes.dispose();
    renderer.dispose();
  };
}
