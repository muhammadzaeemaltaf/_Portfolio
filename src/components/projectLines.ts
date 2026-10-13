import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// TRIONN /work "page lines": three thin threads leave the intro, fan out across the page between cards and
// knot together on each thumbnail's top-centre dot. They draw down to the middle of the viewport as you scroll,
// and a card fades in once the threads reach its dot. Their WebGL lightning sparks + click sound are left out.

type Pt = { x: number; y: number; nx: number; ny: number }

const SAMPLES = 48 // per waypoint segment
const LINE_SEEDS = [1, 2.3, 3.7] // phase offset of each thread's wiggle

// Barry–Goldman Catmull-Rom through the waypoints with arc-length knots, then normals for the wiggle
function spline(pts: { x: number; y: number }[]): Pt[] {
  const k = [0]
  for (let i = 1; i < pts.length; i++) k.push(k[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, ta: number, tb: number, t: number) => {
    const u = Math.abs(tb - ta) < 1e-10 ? 0 : (t - ta) / (tb - ta)
    return { x: a.x + u * (b.x - a.x), y: a.y + u * (b.y - a.y) }
  }
  const out: Pt[] = []
  const last = pts.length - 1
  for (let i = 0; i < last; i++) {
    const i0 = Math.max(0, i - 1), i3 = Math.min(last, i + 2)
    for (let s = i ? 1 : 0; s <= SAMPLES; s++) {
      const t = k[i] + (s / SAMPLES) * (k[i + 1] - k[i])
      const a1 = lerp(pts[i0], pts[i], k[i0], k[i], t)
      const a2 = lerp(pts[i], pts[i + 1], k[i], k[i + 1], t)
      const a3 = lerp(pts[i + 1], pts[i3], k[i + 1], k[i3], t)
      const p = lerp(lerp(a1, a2, k[i0], k[i + 1], t), lerp(a2, a3, k[i], k[i3], t), k[i], k[i + 1], t)
      out.push({ ...p, nx: 0, ny: 1 })
    }
  }
  out.forEach((p, i) => {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)]
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    p.nx = -(b.y - a.y) / len
    p.ny = (b.x - a.x) / len
  })
  return out
}

// where each thread swings out to between two dots: three sorted page-width fractions, at least .12 apart
function fan(spread: number) {
  const r = (a: number, b: number) => a + Math.random() * (b - a)
  const base = r(0.25, 0.7)
  let [a, b, c] = [0, 0, 0].map(() => Math.max(0.05, Math.min(0.9, base + r(-spread, spread)))).sort((x, y) => x - y)
  if (b - a < 0.12) b = a + 0.12
  if (c - b < 0.12) c = b + 0.12
  if (c > 0.92) {
    c = 0.92
    b = Math.min(b, c - 0.12)
    a = Math.min(a, b - 0.12)
  }
  return [a, b, c]
}

export function projectLines(
  list: HTMLElement,
  canvas: HTMLCanvasElement,
  cards: HTMLElement[],
  thumbs: HTMLElement[],
  intro: HTMLElement,
  origin: HTMLElement,
  finish: HTMLElement
) {
  const ctx = canvas.getContext("2d")!
  let lines: Pt[][] = []
  let dots: { x: number; y: number }[] = []
  let lastDot = { x: 0, y: 0 }
  let start = 0, end = 1, head = 0, running = false
  const opacity = cards.map(() => 0)

  const target = () => Math.min(end, Math.max(start, scrollY + innerHeight / 2))

  function build() {
    const sy = scrollY
    const w = innerWidth
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const box = list.getBoundingClientRect()
    // threads leave from the dot under the heading. The intro may be pinned (fixed) right now, so place the
    // dot by its offset inside the intro, measured from where the intro sits once unpinned: right above the list
    const o = origin.getBoundingClientRect()
    const from = { x: o.left + o.width / 2, y: box.top + sy - intro.offsetHeight + (o.top - intro.getBoundingClientRect().top) + o.height / 2 }
    start = from.y
    dots = thumbs.map((t) => {
      const r = t.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + sy }
    })
    // threads fan out again after the last card and knot together on the closing dot, where the section ends
    const f = finish.getBoundingClientRect()
    const last = { x: f.left + f.width / 2, y: f.top + sy + f.height / 2 }
    end = last.y
    lastDot = last
    const stops = [...dots, last]
    const spread = 0.15 + Math.random() * 0.13
    const fans = stops.map(() => fan(spread))
    lines = LINE_SEEDS.map((_, l) => {
      const pts = [from]
      let prev = start
      stops.forEach((s, i) => {
        const fx = w * fans[i][l]
        pts.push({ x: fx + (s.x - fx) * 0.3, y: prev + (s.y - prev) * 0.5 }, s)
        prev = s.y
      })
      return spline(pts)
    })
    head = target()
  }

  // cards follow the threads: reached → fade in, scrolled back above → fade out
  function syncCards(snap: boolean) {
    cards.forEach((card, i) => {
      const goal = head >= dots[i].y ? 1 : 0
      if (opacity[i] === goal && !snap) return
      const eased = opacity[i] + (goal - opacity[i]) * 0.09
      const next = snap || Math.abs(goal - eased) < 0.01 ? goal : eased
      opacity[i] = next
      card.style.opacity = next.toFixed(3)
    })
  }

  function draw() {
    // ease towards the scroll position, but land on it exactly: the last card's dot is the end, and an
    // asymptotic ease would stop a hair short and never reveal that card
    const goal = target()
    head = Math.abs(goal - head) < 0.5 ? goal : head + (goal - head) * 0.14
    syncCards(false)

    const sy = scrollY
    const h = canvas.clientHeight
    const amp = 0.022 * innerWidth
    const len = end - start
    const time = gsap.ticker.time
    ctx.clearRect(0, 0, canvas.clientWidth, h)

    ctx.strokeStyle = "rgb(48,54,64)"
    ctx.lineWidth = 1
    ctx.lineCap = ctx.lineJoin = "round"
    const heads: { x: number; y: number }[] = []
    lines.forEach((pts, l) => {
      ctx.beginPath()
      let last: { x: number; y: number } | null = null
      for (const p of pts) {
        if (p.y > head || p.y - sy > h + 40) break
        if (p.y - sy < -40) continue
        // wiggle travels along the thread, calming to nothing at the heading dot, each card dot and the end
        let damp = Math.min(1, (p.y - start) / (0.03 * len), (end - p.y) / (0.03 * len))
        for (const d of dots) damp = Math.min(damp, Math.abs(p.y - d.y) / (0.03 * len))
        const n = ((p.y - start) / len) * Math.PI * 32 + 0.5 * time + 2.1 * LINE_SEEDS[l]
        const i = Math.cos(n) * amp * damp, j = Math.sin(n) * amp * 0.35 * damp
        const x = p.x + p.nx * i - p.ny * j, y = p.y + p.ny * i + p.nx * j - sy
        if (last) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
        last = { x, y }
      }
      ctx.stroke()
      if (last && head > start + 1) heads.push(last)
    })

    ctx.fillStyle = "rgb(215,215,205)"
    ctx.globalAlpha = 0.55
    dots.forEach((d) => dot(d.x, d.y - sy))
    dot(lastDot.x, lastDot.y - sy)
    ctx.fillStyle = "rgb(200,200,200)"
    ctx.globalAlpha = 0.85
    heads.forEach((d) => dot(d.x, d.y))
    ctx.globalAlpha = 1
  }

  function dot(x: number, y: number) {
    ctx.beginPath()
    ctx.arc(x, y, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  function toggle(on: boolean) {
    if (on === running) return
    running = on
    if (on) {
      gsap.ticker.add(draw)
      return
    }
    gsap.ticker.remove(draw)
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    head = target()
    syncCards(true)
  }

  build()
  syncCards(true)
  ScrollTrigger.addEventListener("refresh", build)
  // only tick while the stream (plus the half-viewport lead-in) is on screen
  const st = ScrollTrigger.create({ trigger: list, start: "top bottom", end: "bottom top", onToggle: (s) => toggle(s.isActive) })
  toggle(st.isActive)

  return () => {
    ScrollTrigger.removeEventListener("refresh", build)
    st.kill()
    gsap.ticker.remove(draw)
  }
}
