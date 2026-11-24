import { useState } from 'react'

const W = 560
const H = 180
const PAD = { top: 12, right: 8, bottom: 24, left: 28 }
const GAP = 2 // surface gap between adjacent bars
const RADIUS = 4 // rounded data-end, square at the baseline

function shortDate(key) {
  const [, m, d] = key.split('-').map(Number)
  return new Date(2000, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Bar path with only the top corners rounded, anchored to the baseline.
function barPath(x, y, w, h) {
  const r = Math.min(RADIUS, w / 2, h)
  if (h <= 0) return ''
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

// Single-series daily bar chart: one hue, no legend (the title names it), hover tooltip, table fallback.
function DailyBarChart({ title, series, unit }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(1, ...series.map((d) => d.count))
  const niceMax = max <= 5 ? max : Math.ceil(max / 5) * 5
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const slot = plotW / series.length
  const barW = Math.max(2, slot - GAP)
  const y = (v) => PAD.top + plotH - (v / niceMax) * plotH
  const total = series.reduce((a, d) => a + d.count, 0)
  const labelEvery = Math.ceil(series.length / 7)

  return (
    <figure className="bg-white/90 rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-2">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-extrabold text-slate-900">{title}</span>
        <span className="text-xs text-slate-500">
          {total.toLocaleString('en-IN')} in {series.length} days
        </span>
      </figcaption>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${title}: ${total} ${unit} over ${series.length} days`}>
          {/* recessive grid: baseline, mid, top */}
          {[0, niceMax / 2, niceMax].map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#E2E8F0" strokeWidth={v === 0 ? 1.5 : 1} />
              <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#64748B">
                {Number.isInteger(v) ? v : v.toFixed(1)}
              </text>
            </g>
          ))}

          {series.map((d, i) => {
            const x = PAD.left + i * slot + GAP / 2
            const top = y(d.count)
            return (
              <g key={d.date}>
                <path d={barPath(x, top, barW, PAD.top + plotH - top)} fill="#0F5257" opacity={hover === null || hover === i ? 1 : 0.45} />
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748B">
                    {shortDate(d.date)}
                  </text>
                )}
                {/* full-height hit target, bigger than the bar */}
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${shortDate(d.date)}: ${d.count} ${unit}`}
                />
              </g>
            )
          })}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold shadow-lg whitespace-nowrap"
            style={{
              left: `${((PAD.left + hover * slot + slot / 2) / W) * 100}%`,
              top: `${(y(series[hover].count) / H) * 100}%`,
            }}
          >
            {shortDate(series[hover].date)} · {series[hover].count} {unit}
          </div>
        )}
      </div>

      <details className="text-xs text-slate-600">
        <summary className="cursor-pointer font-semibold">View as table</summary>
        <table className="mt-2 w-full">
          <tbody>
            {series.map((d) => (
              <tr key={d.date} className="border-t border-slate-100">
                <td className="py-1">{shortDate(d.date)}</td>
                <td className="py-1 text-right font-semibold text-slate-800">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

export default DailyBarChart
