import { DataTexture, LinearFilter, MathUtils, RGBAFormat, RepeatWrapping } from "three";

export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const smooth = (x: number) => {
  const t = MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

/** One small tileable fractal-noise texture shared by every cloud layer (generated once, no network request). */
export function makeNoise(size = 512) {
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

export const VERT = /* glsl */ `
varying vec2 vUv; varying float vDist;
void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv; }`;

// Pseudo-volumetric cloud bank: layered texture taps give density; a second tap offset toward the sun gives
// self-shadowing (bright sunlit edges, blue-grey bellies); distance blends toward a light haze for atmospheric depth.
export const FRAG = /* glsl */ `
uniform sampler2D uNoise;
uniform float uTime, uSpeed, uScale, uCover, uOpacity, uAspect, uCalm, uNear, uFog, uDim;
uniform vec2 uSeed, uMask; uniform vec3 uTint, uShade, uHaze;
varying vec2 vUv; varying float vDist;
float tex(vec2 q){ return texture2D(uNoise, q).r; }
float body(vec2 q){ return tex(q) * 0.72 + tex(q * 2.1 + 0.31) * 0.28; }
void main(){
  vec2 m = (vUv - 0.5) * 2.0;
  float mask = 1.0 - smoothstep(0.25, 1.0, length(m * uMask));
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
  col = mix(col, uHaze, smoothstep(10.0, 80.0, vDist) * 0.6 * uFog);
  col = mix(col, uShade * 0.92, uDim);
  float a = d * uOpacity * smoothstep(uNear, uNear + 8.0, vDist) * (1.0 - uCalm * 0.35);
  gl_FragColor = vec4(col, a);
}`;

