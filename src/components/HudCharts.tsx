import React, { useState } from 'react';
import {
  InvestmentTimeSeriesPoint,
  SalesVolumePoint,
  CountryInvestmentStat,
  AcquisitionComparisonItem,
  IndustrySectorShare,
} from '../data/medicalTestingData';

// 1. Multi-Series Smooth Spline Area/Line Chart (Development, Produce, Sales, Software)
interface MultiLineInvestmentChartProps {
  series: InvestmentTimeSeriesPoint[];
  activeCategories: Record<string, boolean>;
  selectedYear: string | null;
  onToggleCategory: (cat: string) => void;
  onSelectYear: (year: string | null) => void;
}

export const MultiLineInvestmentChart: React.FC<MultiLineInvestmentChartProps> = ({
  series,
  activeCategories,
  selectedYear,
  onToggleCategory,
  onSelectYear,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const categories = [
    { key: 'development', label: 'التطوير', color: '#1aff4d' },
    { key: 'produce', label: 'الإنتاج', color: '#22e5ff' },
    { key: 'sales', label: 'المبيعات', color: '#ffb800' },
    { key: 'software', label: 'البرمجيات', color: '#0088ff' },
  ];

  const width = 340;
  const height = 132;
  const padLeft = 24;
  const padRight = 12;
  const padTop = 18;
  const padBottom = 22;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const maxVal = 12;

  const getX = (index: number) =>
    padLeft + 18 + (index / Math.max(1, series.length - 1)) * (plotW - 36);
  const getY = (val: number) =>
    padTop + plotH - (Math.min(maxVal, val) / maxVal) * plotH;

  const buildSmoothPath = (
    key: 'development' | 'produce' | 'sales' | 'software'
  ) => {
    const pts = series.map((d, i) => ({
      x: getX(i),
      y: getY(d[key]),
    }));
    if (pts.length === 0) return '';
    const startY = Math.min(padTop + plotH - 4, pts[0].y + 8);
    let d = `M ${padLeft} ${startY} C ${padLeft + 8} ${pts[0].y}, ${
      pts[0].x - 8
    } ${pts[0].y}, ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpx1 = p0.x + (p1.x - p0.x) * 0.48;
      const cpy1 = p0.y;
      const cpx2 = p0.x + (p1.x - p0.x) * 0.52;
      const cpy2 = p1.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  return (
    <div className="w-full">
      {/* 4 Square Color Legend Boxes (Click to toggle line visibility) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 px-1">
        <div className="flex flex-wrap items-center gap-3.5">
          {categories.map((cat) => {
            const isActive = activeCategories[cat.key] !== false;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onToggleCategory(cat.key)}
                className={`flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive ? 'opacity-100' : 'opacity-35'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 inline-block"
                  style={{
                    backgroundColor: cat.color,
                    boxShadow: isActive ? `0 0 6px ${cat.color}` : 'none',
                  }}
                />
                <span className="text-[#d6f5e3] text-[11px] font-medium">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Spline Chart */}
      <div className="relative w-full" dir="ltr">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {categories.map((cat) => (
              <linearGradient
                key={cat.key}
                id={`grad-inv-${cat.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={cat.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={cat.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          <text
            x={padLeft - 4}
            y={10}
            textAnchor="start"
            className="fill-[#74b091] text-[8.5px]"
          >
            مليون دولار / سنة
          </text>

          {[0, 4, 8, 12].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#0b3022"
                  strokeWidth="0.75"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[#88c4a6] text-[9px] font-mono-tabular"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={height - padBottom}
            stroke="#144d34"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={height - padBottom}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="#144d34"
            strokeWidth="1"
          />

          {categories.map((cat) => {
            if (activeCategories[cat.key] === false) return null;
            const pathD = buildSmoothPath(
              cat.key as 'development' | 'produce' | 'sales' | 'software'
            );
            const lastX = getX(series.length - 1);
            const areaD = `${pathD} L ${lastX} ${
              height - padBottom
            } L ${padLeft} ${height - padBottom} Z`;

            return (
              <g key={cat.key}>
                <path d={areaD} fill={`url(#grad-inv-${cat.key})`} />
                <path
                  d={pathD}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth="1.6"
                  style={{
                    filter: `drop-shadow(0 0 3px ${cat.color}80)`,
                  }}
                />
              </g>
            );
          })}

          {/* X-axis years & interactive click-to-filter targets */}
          {series.map((pt, i) => {
            const x = getX(i);
            const isYearSelected = selectedYear === pt.year;
            return (
              <g
                key={pt.year}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() =>
                  onSelectYear(isYearSelected ? null : pt.year)
                }
                className="cursor-pointer"
              >
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[9.5px] font-mono-tabular ${
                    isYearSelected
                      ? 'fill-[#00e5ff] font-bold'
                      : 'fill-[#99cbb0]'
                  }`}
                >
                  {pt.year}
                </text>
                {(hoverIdx === i || isYearSelected) && (
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={height - padBottom}
                    stroke={isYearSelected ? '#00e5ff' : '#00ff66'}
                    strokeDasharray="2 2"
                    strokeWidth="1.2"
                  />
                )}
                <rect
                  x={x - 22}
                  y={padTop}
                  width={44}
                  height={plotH}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Hover Readout */}
        {hoverIdx !== null && series[hoverIdx] && (
          <div
            dir="rtl"
            className="mt-1 flex items-center justify-between text-[10.5px] bg-[#061e17] border border-[#00ff66]/40 px-2.5 py-1 rounded font-mono-tabular"
          >
            <span className="text-[#00ff66] font-bold">
              عام {series[hoverIdx].year}:
            </span>
            <span className="text-[#e2f8ec]">
              تطوير {series[hoverIdx].development}M · إنتاج{' '}
              {series[hoverIdx].produce}M · مبيعات {series[hoverIdx].sales}M ·
              برمجيات {series[hoverIdx].software}M
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Sales Volume Glowing Green Area Line Chart (Bottom Left)
interface SalesVolumeChartProps {
  series: SalesVolumePoint[];
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
}

export const SalesVolumeChart: React.FC<SalesVolumeChartProps> = ({
  series,
  selectedYear,
  onSelectYear,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 340;
  const height = 108;
  const padLeft = 24;
  const padRight = 12;
  const padTop = 18;
  const padBottom = 20;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const maxVal = 12;

  const getX = (i: number) =>
    padLeft + 22 + (i / Math.max(1, series.length - 1)) * (plotW - 38);
  const getY = (v: number) =>
    padTop + plotH - (Math.min(maxVal, v) / maxVal) * plotH;

  const originY = getY(5.0);
  const allPoints = [
    `${padLeft},${originY}`,
    ...series.map((d, i) => `${getX(i)},${getY(d.volume)}`),
  ].join(' ');

  const areaPath = `M ${padLeft} ${originY} ${series
    .map((d, i) => `L ${getX(i)} ${getY(d.volume)}`)
    .join(' ')} L ${getX(series.length - 1)} ${
    height - padBottom
  } L ${padLeft} ${height - padBottom} Z`;

  return (
    <div className="w-full" dir="ltr">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="salesVolGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff66" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <text
          x={padLeft - 4}
          y={10}
          textAnchor="start"
          className="fill-[#74b091] text-[8.5px]"
        >
          مليون وحدة فحص
        </text>

        {[0, 4, 8, 12].map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#0b3022"
                strokeWidth="0.75"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-[#88c4a6] text-[9px] font-mono-tabular"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <line
          x1={padLeft}
          y1={padTop}
          x2={padLeft}
          y2={height - padBottom}
          stroke="#144d34"
          strokeWidth="1"
        />
        <line
          x1={padLeft}
          y1={height - padBottom}
          x2={width - padRight}
          y2={height - padBottom}
          stroke="#144d34"
          strokeWidth="1"
        />

        <path d={areaPath} fill="url(#salesVolGrad)" />
        <polyline
          fill="none"
          stroke="#1aff55"
          strokeWidth="1.5"
          points={allPoints}
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,102,0.55))' }}
        />

        {series.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.volume);
          const isSelected = selectedYear === d.year;
          const isHovered = hoverIdx === i;
          return (
            <g
              key={d.year}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => onSelectYear(isSelected ? null : d.year)}
              className="cursor-pointer"
            >
              <circle
                cx={cx}
                cy={cy}
                r={isSelected || isHovered ? '3.5' : '2.3'}
                fill={isSelected ? '#00e5ff' : '#ffffff'}
                stroke={isSelected ? '#00e5ff' : '#00ff66'}
                strokeWidth="1.4"
              />
              {(isHovered || isSelected) && (
                <text
                  x={cx}
                  y={cy - 6}
                  textAnchor="middle"
                  className="fill-[#00ff66] text-[8.5px] font-mono-tabular font-bold"
                >
                  {d.volume}M
                </text>
              )}
              <text
                x={cx}
                y={height - 5}
                textAnchor="middle"
                className={`text-[9.5px] font-mono-tabular ${
                  isSelected ? 'fill-[#00e5ff] font-bold' : 'fill-[#99cbb0]'
                }`}
              >
                {d.year}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. Country Investment Vertical Neon Green Bar Chart (Right Middle)
interface CountryBarChartProps {
  countries: CountryInvestmentStat[];
  selectedCountryCode: string | null;
  metricMode: 'investment' | 'healthGdp';
  onSelectCountry: (code: string | null) => void;
}

export const CountryInvestmentBarChart: React.FC<CountryBarChartProps> = ({
  countries,
  selectedCountryCode,
  metricMode,
  onSelectCountry,
}) => {
  const width = 320;
  const height = 134;
  const padLeft = 24;
  const padRight = 10;
  const padTop = 18;
  const padBottom = 22;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const maxVal = 20;

  const getY = (v: number) =>
    padTop + plotH - (Math.min(maxVal, v) / maxVal) * plotH;

  return (
    <div className="w-full" dir="ltr">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <text
          x={padLeft - 4}
          y={10}
          textAnchor="start"
          className="fill-[#74b091] text-[8.5px]"
        >
          {metricMode === 'healthGdp'
            ? 'الإنفاق الصحي (% GDP - البنك الدولي)'
            : 'مؤشر التدفق الاستثماري'}
        </text>

        {[0, 4, 8, 12, 16, 20].map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#0b3022"
                strokeWidth="0.7"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-[#88c4a6] text-[9px] font-mono-tabular"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <line
          x1={padLeft}
          y1={padTop}
          x2={padLeft}
          y2={height - padBottom}
          stroke="#144d34"
          strokeWidth="1"
        />
        <line
          x1={padLeft}
          y1={height - padBottom}
          x2={width - padRight}
          y2={height - padBottom}
          stroke="#144d34"
          strokeWidth="1"
        />

        {countries.map((c, idx) => {
          const slotW = plotW / countries.length;
          const barW = 13;
          const x = padLeft + idx * slotW + (slotW - barW) / 2;
          const rawVal =
            metricMode === 'healthGdp'
              ? c.healthExpenditurePctGdp
              : c.barValue;
          const y = getY(rawVal);
          const barH = height - padBottom - y;
          const isSelected = selectedCountryCode === c.code;

          return (
            <g
              key={c.code}
              onClick={() =>
                onSelectCountry(selectedCountryCode === c.code ? null : c.code)
              }
              className="cursor-pointer group"
            >
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={isSelected ? '#00e5ff' : '#14ff44'}
                className="transition-all duration-200 group-hover:opacity-90"
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 0 8px rgba(0,229,255,0.8))'
                    : 'drop-shadow(0 0 5px rgba(20,255,68,0.45))',
                }}
              />
              <text
                x={x + barW / 2}
                y={y - 3}
                textAnchor="middle"
                className="fill-[#98d5b3] text-[8px] font-mono-tabular opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {metricMode === 'healthGdp'
                  ? `${c.healthExpenditurePctGdp}%`
                  : `${c.totalInvestmentMillion}M`}
              </text>
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                className={`text-[10px] ${
                  isSelected ? 'fill-[#00e5ff] font-bold' : 'fill-[#c8f0d8]'
                }`}
              >
                {c.nameAr}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 4. Opposing Horizontal Butterfly Bar Chart (Investment vs Acquisition - Bottom Center-Left)
interface ButterflyChartProps {
  items: AcquisitionComparisonItem[];
}

export const InvestmentAcquisitionButterfly: React.FC<ButterflyChartProps> = ({
  items,
}) => {
  const maxBar = 16;

  return (
    <div className="w-full pt-1" dir="ltr">
      <div className="grid grid-cols-[1fr_58px_1fr] text-xs font-semibold text-[#e2f8ec] mb-3 text-center">
        <span className="text-right pr-2">الاستثمار</span>
        <span />
        <span className="text-left pl-2">الاستحواذ</span>
      </div>

      <div className="space-y-3">
        {items.map((row) => {
          const invWidthPct = Math.min(100, (row.investmentCount / maxBar) * 100);
          const acqWidthPct = Math.min(100, (row.acquisitionCount / maxBar) * 100);

          return (
            <div
              key={row.categoryAr}
              className="grid grid-cols-[1fr_58px_1fr] items-center gap-2 text-xs"
            >
              {/* Left side: Green bar growing leftward from center */}
              <div className="flex items-center justify-end">
                <div
                  className="h-3.5 bg-gradient-to-r from-[#88ff22] to-[#22ff22] flex items-center justify-start pl-1.5 text-[9.5px] font-mono-tabular font-bold text-[#031808] shadow-[0_0_6px_rgba(50,255,50,0.45)] transition-all duration-300"
                  style={{ width: `${invWidthPct}%` }}
                >
                  {row.investmentCount}
                </div>
              </div>

              {/* Center category label */}
              <span className="text-[11px] text-[#e2f8ec] text-center font-medium">
                {row.categoryAr}
              </span>

              {/* Right side: Cyan bar growing rightward from center */}
              <div className="flex items-center justify-start">
                <div
                  className="h-3.5 bg-gradient-to-r from-[#00d8ff] to-[#33ffff] flex items-center justify-end pr-1.5 text-[9.5px] font-mono-tabular font-bold text-[#02141a] shadow-[0_0_6px_rgba(0,229,255,0.45)] transition-all duration-300"
                  style={{ width: `${acqWidthPct}%` }}
                >
                  {row.acquisitionCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Industry Sector Variable-Radius Nightingale / Rose Donut Chart (Reactive to selected country!)
interface IndustryDonutChartProps {
  shares: IndustrySectorShare[];
  selectedSector: string | null;
  onSelectSector: (sector: string | null) => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function createAnnularSectorPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, endAngle);
  const endInner = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    startOuter.x,
    startOuter.y,
    'A',
    outerR,
    outerR,
    0,
    largeArcFlag,
    0,
    endOuter.x,
    endOuter.y,
    'L',
    endInner.x,
    endInner.y,
    'A',
    innerR,
    innerR,
    0,
    largeArcFlag,
    1,
    startInner.x,
    startInner.y,
    'Z',
  ].join(' ');
}

export const IndustryDonutChart: React.FC<IndustryDonutChartProps> = ({
  shares,
  selectedSector,
  onSelectSector,
}) => {
  const cx = 165;
  const cy = 68;
  const innerR = 14;
  const totalPct = shares.reduce((acc, s) => acc + s.percentage, 0);

  let currentAngle = -20;

  const devShare = shares.find((s) => s.id === 'Development') || shares[0];
  const prodShare = shares.find((s) => s.id === 'Produce') || shares[1];
  const softShare = shares.find((s) => s.id === 'Software') || shares[2];
  const salesShare = shares.find((s) => s.id === 'Sales') || shares[3];

  return (
    <div className="w-full flex flex-col items-center" dir="ltr">
      <svg viewBox="0 0 330 138" className="w-full h-auto overflow-visible">
        {/* Outer thin cyan protective ring */}
        <circle
          cx={cx}
          cy={cy}
          r={46}
          fill="none"
          stroke="#00e5ff"
          strokeWidth="1.25"
          strokeOpacity="0.9"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.45))' }}
        />

        {/* Variable-Radius Nightingale / Rose Donut segments */}
        {shares.map((sector) => {
          const sweep = (sector.percentage / totalPct) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sweep;
          currentAngle = endAngle;
          const isSelected = selectedSector === sector.id;
          const outerR = isSelected ? sector.outerRadius + 3 : sector.outerRadius;

          const pathD = createAnnularSectorPath(
            cx,
            cy,
            innerR,
            outerR,
            startAngle,
            endAngle
          );

          return (
            <path
              key={sector.id}
              d={pathD}
              fill={sector.color}
              onClick={() =>
                onSelectSector(selectedSector === sector.id ? null : sector.id)
              }
              className="cursor-pointer transition-all duration-200 hover:opacity-90"
              style={{
                filter: isSelected
                  ? `drop-shadow(0 0 8px ${sector.color})`
                  : 'none',
              }}
            />
          );
        })}

        {/* Top Left Callout: R&D */}
        <polyline
          points="142,45 112,24 10,24"
          fill="none"
          stroke="#16704e"
          strokeWidth="0.9"
        />
        <text
          x="10"
          y="19"
          textAnchor="start"
          onClick={() =>
            onSelectSector(
              selectedSector === 'Development' ? null : 'Development'
            )
          }
          className="fill-[#d8f8e5] text-[9.5px] cursor-pointer hover:fill-[#00ff66]"
        >
          {devShare.nameAr} ({devShare.amountMillion} مليون)
        </text>
        <text
          x="10"
          y="35"
          textAnchor="start"
          className="fill-[#a8e0c0] text-[9.5px] font-mono-tabular"
        >
          {devShare.percentage.toFixed(2)}%
        </text>

        {/* Top Right Callout: Produce */}
        <polyline
          points="192,48 218,28 320,28"
          fill="none"
          stroke="#16704e"
          strokeWidth="0.9"
        />
        <text
          x="320"
          y="22"
          textAnchor="end"
          onClick={() =>
            onSelectSector(selectedSector === 'Produce' ? null : 'Produce')
          }
          className="fill-[#d8f8e5] text-[9.5px] cursor-pointer hover:fill-[#00e5ff]"
        >
          {prodShare.nameAr} ({prodShare.amountMillion} مليون)
        </text>
        <text
          x="320"
          y="39"
          textAnchor="end"
          className="fill-[#a8e0c0] text-[9.5px] font-mono-tabular"
        >
          {prodShare.percentage.toFixed(2)}%
        </text>

        {/* Bottom Left Callout: Sales */}
        <polyline
          points="142,84 114,106 10,106"
          fill="none"
          stroke="#8c4820"
          strokeWidth="0.9"
        />
        <text
          x="10"
          y="101"
          textAnchor="start"
          onClick={() =>
            onSelectSector(selectedSector === 'Sales' ? null : 'Sales')
          }
          className="fill-[#d8f8e5] text-[9.5px] cursor-pointer hover:fill-[#ff6600]"
        >
          {salesShare.nameAr} ({salesShare.amountMillion} مليون)
        </text>
        <text
          x="10"
          y="117"
          textAnchor="start"
          className="fill-[#a8e0c0] text-[9.5px] font-mono-tabular"
        >
          {salesShare.percentage.toFixed(2)}%
        </text>

        {/* Bottom Right Callout: Software */}
        <polyline
          points="186,92 214,116 320,116"
          fill="none"
          stroke="#12687e"
          strokeWidth="0.9"
        />
        <text
          x="320"
          y="110"
          textAnchor="end"
          onClick={() =>
            onSelectSector(selectedSector === 'Software' ? null : 'Software')
          }
          className="fill-[#d8f8e5] text-[9.5px] cursor-pointer hover:fill-[#0077ff]"
        >
          {softShare.nameAr} ({softShare.amountMillion} مليون)
        </text>
        <text
          x="320"
          y="127"
          textAnchor="end"
          className="fill-[#a8e0c0] text-[9.5px] font-mono-tabular"
        >
          {softShare.percentage.toFixed(2)}%
        </text>
      </svg>
    </div>
  );
};
