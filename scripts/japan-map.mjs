// Builds the geography for the Japan field-notes map from OpenStreetMap data.
//
// 1. Download raw Overpass JSON into a folder (see the queries below).
// 2. node scripts/japan-map.mjs <that folder>
// 3. Writes src/components/japan-map-geo.json (simplified lon/lat, ~10 m precision).
//
// Overpass queries (bbox 35.28,139.58,36.27,140.33), each saved as JSON:
//   coast.json  way[natural=coastline](bbox);out skel geom;
//   rivers.json way[waterway=river][name~"^(利根川|荒川|隅田川|江戸川|多摩川|鬼怒川|小貝川|小櫃川)$"](bbox);out body geom;
//   lakes.json  (relation[natural=water][name~"霞ヶ浦|西浦|手賀沼|印旛沼|牛久沼"](bbox);way[natural=water][name~"..."](bbox););out body geom;
//   places.json (way[highway=motorway][name~"アクアライン"](bbox););out body geom;
//
// Map data © OpenStreetMap contributors, available under the Open Database Licence.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("Usage: node scripts/japan-map.mjs <folder with Overpass JSON>");
const load = (name) => JSON.parse(readFileSync(join(dir, name), "utf8")).elements;

// The map frame. Keep in sync with `region` in JapanMap.astro.
const box = { lonMin: 139.58, lonMax: 140.32, latMin: 35.3, latMax: 36.26 };
const COS = Math.cos((35.78 * Math.PI) / 180);

const key = (p) => `${p[0].toFixed(7)},${p[1].toFixed(7)}`;
const geom = (way) => way.geometry.map((g) => [g.lon, g.lat]);

// Douglas–Peucker, measured with longitude shrunk to true distance at this latitude.
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = [points[a][0] * COS, points[a][1]];
    const [bx, by] = [points[b][0] * COS, points[b][1]];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-12;
    let worst = -1, index = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((points[i][0] * COS - ax) * dy - (points[i][1] - ay) * dx) / len;
      if (d > worst) { worst = d; index = i; }
    }
    if (worst > tolerance) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

// Join ways that share end points into longer lines (or closed rings).
function joinLines(lines) {
  const pool = lines.map((l) => [...l]);
  const out = [];
  while (pool.length) {
    let line = pool.pop();
    let grew = true;
    while (grew) {
      grew = false;
      for (let i = 0; i < pool.length; i++) {
        const other = pool[i];
        const [s, e, os, oe] = [key(line[0]), key(line.at(-1)), key(other[0]), key(other.at(-1))];
        if (s === e) break;
        if (e === os) line = [...line, ...other.slice(1)];
        else if (oe === s) line = [...other, ...line.slice(1)];
        else if (e === oe) line = [...line, ...[...other].reverse().slice(1)];
        else if (s === os) line = [...[...other].reverse(), ...line.slice(1)];
        else continue;
        pool.splice(i, 1);
        grew = true;
        break;
      }
    }
    out.push(line);
  }
  return out;
}

// --- Land: coastline ways have land on their left. Clip them to the frame and close them along its edge.
const inside = ([x, y]) => x >= box.lonMin && x <= box.lonMax && y >= box.latMin && y <= box.latMax;

// Liang–Barsky: the part of segment p→q inside the frame, as [t0, t1], or null.
function clipSegment(p, q) {
  let t0 = 0, t1 = 1;
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const checks = [[-dx, p[0] - box.lonMin], [dx, box.lonMax - p[0]], [-dy, p[1] - box.latMin], [dy, box.latMax - p[1]]];
  for (const [pp, qq] of checks) {
    if (pp === 0) { if (qq < 0) return null; continue; }
    const r = qq / pp;
    if (pp < 0) { if (r > t1) return null; if (r > t0) t0 = r; }
    else { if (r < t0) return null; if (r < t1) t1 = r; }
  }
  return [t0, t1];
}
const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

// Split a line into the pieces that run inside the frame, each from an edge to an edge.
function piecesInside(line) {
  const pieces = [];
  let current = null;
  for (let i = 0; i < line.length - 1; i++) {
    const clip = clipSegment(line[i], line[i + 1]);
    if (!clip) { if (current) { pieces.push(current); current = null; } continue; }
    const a = lerp(line[i], line[i + 1], clip[0]);
    const b = lerp(line[i], line[i + 1], clip[1]);
    if (!current) current = [a];
    current.push(b);
    if (clip[1] < 1) { pieces.push(current); current = null; }
  }
  if (current) pieces.push(current);
  return pieces;
}

// Position along the frame's edge, counter-clockwise from the bottom-left corner.
const W = box.lonMax - box.lonMin, H = box.latMax - box.latMin;
function edgePosition([x, y]) {
  const e = 1e-9;
  if (Math.abs(y - box.latMin) < e) return x - box.lonMin;
  if (Math.abs(x - box.lonMax) < e) return W + (y - box.latMin);
  if (Math.abs(y - box.latMax) < e) return W + H + (box.lonMax - x);
  return 2 * W + H + (box.latMax - y);
}
const corners = [[W, [box.lonMax, box.latMin]], [W + H, [box.lonMax, box.latMax]], [2 * W + H, [box.lonMin, box.latMax]], [2 * W + 2 * H, [box.lonMin, box.latMin]]];
const PERIMETER = 2 * W + 2 * H;

const coastWays = load("coast.json").filter((e) => e.type === "way").map(geom);
const coastLines = joinLines(coastWays);
const land = [];
const pieces = [];
for (const line of coastLines) {
  const closed = key(line[0]) === key(line.at(-1));
  if (closed && line.every(inside)) { land.push(line); continue; }
  let path = line;
  if (closed) {
    // Start the ring outside the frame so every piece runs edge to edge.
    const start = line.findIndex((p) => !inside(p));
    if (start < 0) continue;
    path = [...line.slice(start), ...line.slice(1, start + 1)];
  }
  for (const piece of piecesInside(path)) if (piece.length > 1) pieces.push(piece);
}

// Walk each piece, then the frame edge counter-clockwise to the next piece that enters.
const used = new Set();
for (let i = 0; i < pieces.length; i++) {
  if (used.has(i)) continue;
  const ring = [];
  let current = i;
  let guard = 0;
  while (!used.has(current) && guard++ < 1000) {
    used.add(current);
    ring.push(...pieces[current]);
    const exit = edgePosition(pieces[current].at(-1));
    // The next entry point counter-clockwise from here.
    let best = -1, bestGap = Infinity;
    pieces.forEach((piece, j) => {
      const gap = (edgePosition(piece[0]) - exit + PERIMETER) % PERIMETER;
      if (gap < bestGap) { bestGap = gap; best = j; }
    });
    for (const [pos, corner] of corners) {
      for (const p of [pos, pos + PERIMETER]) {
        const gap = p - exit;
        if (gap > 0 && gap < bestGap) ring.push({ gap, corner });
      }
    }
    // Sort any corners we passed into order, then move on.
    const tail = ring.filter((p) => !Array.isArray(p)).sort((a, b) => a.gap - b.gap).map((p) => p.corner);
    for (let k = ring.length - 1; k >= 0; k--) if (!Array.isArray(ring[k])) ring.splice(k, 1);
    ring.push(...tail);
    current = best;
  }
  land.push(ring);
}

// Shoelace area in km², to drop specks (piers, tiny islands).
const areaKm2 = (ring) => {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[(i + 1) % ring.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2) * 111.32 * 111.32 * COS;
};

const round = (line) => line.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]);
const TOLERANCE = 0.0006; // about 60 m
const landRings = land.filter((r) => areaKm2(r) > 0.15).map((r) => round(simplify(r, TOLERANCE)));

// --- Lakes: outer rings of the lake polygons.
const lakes = [];
for (const element of load("lakes.json")) {
  if (element.type === "way") lakes.push(geom(element));
  if (element.type === "relation") {
    const outers = element.members.filter((m) => m.type === "way" && m.role !== "inner" && m.geometry).map((m) => m.geometry.map((g) => [g.lon, g.lat]));
    lakes.push(...joinLines(outers));
  }
}
const lakeRings = lakes.filter((r) => areaKm2(r) > 1).map((r) => round(simplify(r, TOLERANCE)));

// --- Rivers, one joined set of lines per river.
const riverNames = { "利根川": "Tone", "荒川": "Arakawa", "隅田川": "Sumida", "江戸川": "Edogawa", "多摩川": "Tama", "鬼怒川": "Kinu", "小貝川": "Kokai", "小櫃川": "Obitsu" };
const riverWays = new Map();
for (const way of load("rivers.json")) {
  const name = riverNames[way.tags?.name];
  if (!name) continue;
  riverWays.set(name, [...(riverWays.get(name) ?? []), geom(way)]);
}
const rivers = Object.fromEntries([...riverWays].map(([name, ways]) => [name, joinLines(ways).map((l) => round(simplify(l, TOLERANCE * 1.5))).filter((l) => l.length > 1)]));

// --- The Tokyo Bay Aqua-Line (one carriageway is enough).
const aqua = load("places.json").filter((e) => e.type === "way" && e.tags?.highway === "motorway");
const aquaLine = joinLines(aqua.map(geom)).sort((a, b) => b.length - a.length).slice(0, 2).map((l) => round(simplify(l, TOLERANCE)));

const out = { attribution: "© OpenStreetMap contributors", box, land: landRings, lakes: lakeRings, rivers, aquaLine };
const target = new URL("../src/components/japan-map-geo.json", import.meta.url);
writeFileSync(target, JSON.stringify(out));
console.log(`land rings: ${landRings.length}, points: ${landRings.flat().length}; lakes: ${lakeRings.length}; rivers: ${Object.keys(rivers).join(", ")}; aqua lines: ${aquaLine.length}`);
console.log(`wrote ${target.pathname} (${(JSON.stringify(out).length / 1024).toFixed(1)} kB)`);
