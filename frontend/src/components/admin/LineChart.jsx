import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

function niceMax(max) {
  if (max <= 0) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const normalized = max / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

function formatValue(v, isCurrency) {
  if (isCurrency) return `${Math.round(v).toLocaleString("fr-FR")} €`;
  return Math.round(v).toLocaleString("fr-FR");
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export default function LineChart({ title, data, color, isCurrency = false }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const maxValue = useMemo(() => niceMax(Math.max(...data.map((d) => d.value), 0)), [data]);

  const points = useMemo(
    () =>
      data.map((d, i) => {
        const x = PAD_LEFT + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
        const y = PAD_TOP + plotHeight - (d.value / maxValue) * plotHeight;
        return { ...d, x, y };
      }),
    [data, maxValue, plotWidth, plotHeight]
  );

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD_TOP + plotHeight} L ${points[0].x} ${
    PAD_TOP + plotHeight
  } Z`;

  const yTicks = [0, 0.5, 1].map((f) => Math.round(maxValue * f));
  const labelEvery = Math.ceil(data.length / 6);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoverIndex(closest);
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        <span className="text-lg font-semibold text-slate-900 dark:text-white">
          {formatValue(total, isCurrency)}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full overflow-visible"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Gridlines */}
        {yTicks.map((tick, i) => {
          const y = PAD_TOP + plotHeight - (tick / maxValue || 0) * plotHeight;
          return (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={y}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="1"
              />
              <text x={PAD_LEFT - 8} y={y + 3} textAnchor="end" className="fill-slate-400 text-[10px] dark:fill-slate-500">
                {formatValue(tick, isCurrency)}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text
              key={i}
              x={p.x}
              y={HEIGHT - 6}
              textAnchor="middle"
              className="fill-slate-400 text-[10px] dark:fill-slate-500"
            >
              {formatDateShort(p.date)}
            </text>
          ) : null
        )}

        {/* Area fill */}
        <path d={areaPath} fill={color} opacity="0.1" stroke="none" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Hover crosshair */}
        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD_TOP}
              y2={PAD_TOP + plotHeight}
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="1"
            />
            <circle cx={hovered.x} cy={hovered.y} r="4" fill={color} stroke="white" strokeWidth="2" />
          </>
        )}
      </svg>

      {hovered && (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-200">{formatDateShort(hovered.date)}</span>
          {" — "}
          {formatValue(hovered.value, isCurrency)}
        </div>
      )}
    </div>
  );
}
