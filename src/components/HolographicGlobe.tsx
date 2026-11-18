import React, { useEffect, useRef, useState } from 'react';
import {
  GLOBE_CONNECTIONS,
  GlobeArcConnection,
  CountryInvestmentStat,
  AcquisitionRecord,
} from '../data/medicalTestingData';

interface HolographicGlobeProps {
  countries: CountryInvestmentStat[];
  selectedCountryCode: string | null;
  selectedSector: string | null;
  selectedDeal: AcquisitionRecord | null;
  onSelectCountry: (code: string | null) => void;
}

// Convert lat/lng (degrees) to 3D sphere coordinates (x, y, z) on unit sphere
function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

// Rotate point around Y axis (yaw) and X axis (pitch)
function rotatePoint(
  p: { x: number; y: number; z: number },
  rotY: number,
  rotX: number
) {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.z * cosY + p.x * sinY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = z1 * cosX + p.y * sinX;

  return { x: x1, y: y2, z: z2 };
}

// Detailed continent polygon approximation
function isLandCoordinate(lat: number, lng: number): boolean {
  if (lat >= 36 && lat <= 70 && lng >= -9 && lng <= 40) return true;
  if (lat >= 46 && lat <= 73 && lng > 40 && lng <= 165) return true;
  if (lat >= 13 && lat < 38 && lng >= 34 && lng <= 60) return true;
  if (lat >= 8 && lat <= 35 && lng > 67 && lng <= 92) {
    if (lat < 16 && (lng < 73 || lng > 84)) return false;
    return true;
  }
  if (lat >= 18 && lat <= 46 && lng > 92 && lng <= 123) return true;
  if (lat >= 1 && lat < 18 && lng >= 98 && lng <= 109) return true;
  if (lat >= 31 && lat <= 45 && lng >= 126 && lng <= 145) return true;
  if (lat >= 4 && lat <= 36 && lng >= -16 && lng <= 50) return true;
  if (lat >= -34 && lat < 4 && lng >= 10 && lng <= 42) return true;
  if (lat >= -25 && lat <= -12 && lng >= 43 && lng <= 50) return true;
  if (lat >= -38 && lat <= -12 && lng >= 114 && lng <= 153) return true;
  if (lat >= 24 && lat <= 68 && lng >= -160 && lng <= -58) return true;
  if (lat >= 10 && lat < 24 && lng >= -105 && lng <= -80) return true;
  if (lat >= -54 && lat <= 11 && lng >= -80 && lng <= -35) {
    if (lat < -25 && lng > -52) return false;
    return true;
  }
  return false;
}

interface GlobeDot {
  lat: number;
  lng: number;
  isLand: boolean;
  isConstellationNode: boolean;
  brightness: number;
}

interface ScreenHotspot {
  arc: GlobeArcConnection;
  x: number;
  y: number;
  z: number;
  radius: number;
}

export const HolographicGlobe: React.FC<HolographicGlobeProps> = ({
  countries,
  selectedCountryCode,
  selectedSector,
  selectedDeal,
  onSelectCountry,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredArc, setHoveredArc] = useState<GlobeArcConnection | null>(null);
  const hotspotsRef = useRef<ScreenHotspot[]>([]);

  // Exact rotation math so that when a country is selected, that country's (lat, lng) rotates directly to the front-center of the 3D sphere!
  // Derivation: For theta = (lng + 180) * pi/180, z1 = 0 & x1 = 0 occurs when rotY = -(lng * pi / 180) - pi/2.
  const rotationRef = useRef({
    rotY: -1.92,
    rotX: 0.24,
    targetRotY: -1.92,
    targetRotX: 0.24,
    hasTarget: false,
    isDragging: false,
    dragDistance: 0,
    lastX: 0,
    lastY: 0,
    pulsePhase: 0,
  });

  // Pre-generate high-density dot-matrix sphere points once
  const dotsRef = useRef<GlobeDot[]>([]);
  if (dotsRef.current.length === 0) {
    const dots: GlobeDot[] = [];
    const latStep = 2.4;
    for (let lat = -80; lat <= 80; lat += latStep) {
      const cosLat = Math.cos((lat * Math.PI) / 180);
      const lngStep = Math.max(2.4, 2.7 / Math.max(0.18, cosLat));
      for (let lng = -180; lng < 180; lng += lngStep) {
        const land = isLandCoordinate(lat, lng);
        const hash =
          Math.abs(Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453) % 1;
        const isConstellationNode = land && hash > 0.935;
        dots.push({
          lat,
          lng,
          isLand: land,
          isConstellationNode,
          brightness: 0.55 + hash * 0.45,
        });
      }
    }
    dotsRef.current = dots;
  }

  // Exact mathematical camera alignment to face the selected country or deal's coordinates
  useEffect(() => {
    const code = selectedDeal?.countryCode || selectedCountryCode;
    if (!code) {
      rotationRef.current.targetRotY = -1.92;
      rotationRef.current.targetRotX = 0.24;
      rotationRef.current.hasTarget = true;
      return;
    }

    const arcNode = GLOBE_CONNECTIONS.find((a) => a.countryCode === code);
    if (arcNode) {
      const targetRotY = -((arcNode.toLng * Math.PI) / 180) - Math.PI / 2;
      const targetRotX = Math.max(
        -0.65,
        Math.min(0.65, ((arcNode.toLat - 12) * Math.PI) / 180)
      );
      rotationRef.current.targetRotY = targetRotY;
      rotationRef.current.targetRotX = targetRotX;
      rotationRef.current.hasTarget = true;
    }
  }, [selectedCountryCode, selectedDeal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (
        canvas.width !== Math.floor(rect.width * dpr) ||
        canvas.height !== Math.floor(rect.height * dpr)
      ) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.41;

      ctx.clearRect(0, 0, width, height);

      // Smooth shortest-angle interpolation toward target country rotation
      const rot = rotationRef.current;
      if (!rot.isDragging) {
        if (rot.hasTarget) {
          // Shortest angular distance around Y
          let diffY =
            ((rot.targetRotY - rot.rotY + Math.PI) % (Math.PI * 2)) - Math.PI;
          if (diffY < -Math.PI) diffY += Math.PI * 2;
          const diffX = rot.targetRotX - rot.rotX;
          rot.rotY += diffY * 0.09;
          rot.rotX += diffX * 0.09;
          if (Math.abs(diffY) < 0.002 && Math.abs(diffX) < 0.002) {
            rot.hasTarget = false;
          }
        } else if (!selectedCountryCode && !selectedDeal) {
          rot.rotY += 0.0012;
        }
      }
      rot.pulsePhase += 0.035;
      const { rotY, rotX, pulsePhase } = rot;

      // 1. Deep blue/cyan bottom-left nebula glow behind the globe
      const nebulaGlow = ctx.createRadialGradient(
        cx - radius * 0.55,
        cy + radius * 0.65,
        radius * 0.05,
        cx - radius * 0.35,
        cy + radius * 0.45,
        radius * 0.9
      );
      nebulaGlow.addColorStop(0, 'rgba(0, 145, 255, 0.24)');
      nebulaGlow.addColorStop(0.5, 'rgba(0, 210, 255, 0.08)');
      nebulaGlow.addColorStop(1, 'rgba(3, 9, 10, 0)');
      ctx.fillStyle = nebulaGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Dark 3D Sphere Body
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.28,
        cy - radius * 0.25,
        radius * 0.08,
        cx + radius * 0.1,
        cy + radius * 0.1,
        radius
      );
      sphereGrad.addColorStop(0, 'rgba(11, 44, 42, 0.94)');
      sphereGrad.addColorStop(0.55, 'rgba(4, 18, 20, 0.96)');
      sphereGrad.addColorStop(0.92, 'rgba(1, 6, 8, 0.98)');
      sphereGrad.addColorStop(1, 'rgba(0, 255, 115, 0.18)');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw dot-matrix continents and constellation nodes
      const visibleConstellationNodes: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        const v = latLngToVec3(dot.lat, dot.lng, radius);
        const r = rotatePoint(v, rotY, rotX);

        if (r.z > -radius * 0.08) {
          const depthAlpha = Math.max(
            0.08,
            (r.z + radius * 0.08) / (radius * 1.08)
          );
          const sx = cx + r.x;
          const sy = cy - r.y;

          if (dot.isLand) {
            const alpha = depthAlpha * dot.brightness * 0.88;
            ctx.fillStyle = `rgba(45, 255, 165, ${alpha})`;
            const dotSize = r.z > radius * 0.25 ? 1.35 : 1.0;
            ctx.fillRect(sx - dotSize / 2, sy - dotSize / 2, dotSize, dotSize);

            if (dot.isConstellationNode && r.z > radius * 0.05) {
              visibleConstellationNodes.push({ x: sx, y: sy, z: r.z });
            }
          } else {
            ctx.fillStyle = `rgba(0, 195, 255, ${depthAlpha * 0.09})`;
            ctx.fillRect(sx, sy, 0.75, 0.75);
          }
        }
      }

      // 4. Draw glowing constellation mesh lines
      ctx.strokeStyle = 'rgba(40, 255, 160, 0.22)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < visibleConstellationNodes.length; i++) {
        const a = visibleConstellationNodes[i];
        ctx.fillStyle = 'rgba(130, 255, 200, 0.75)';
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.3, 0, Math.PI * 2);
        ctx.fill();

        let connections = 0;
        for (
          let j = i + 1;
          j < visibleConstellationNodes.length && connections < 2;
          j++
        ) {
          const b = visibleConstellationNodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1900 && distSq > 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // 5. Draw Interactive 3D Glowing Arcs, 3D Data Spikes, & Target Rings
      const currentHotspots: ScreenHotspot[] = [];

      GLOBE_CONNECTIONS.forEach((arc, idx) => {
        const matchesCountry =
          !selectedCountryCode || selectedCountryCode === arc.countryCode;
        const matchesSector =
          !selectedSector || selectedSector === arc.primarySector;
        const isActiveFilter =
          selectedCountryCode === arc.countryCode ||
          hoveredArc?.id === arc.id ||
          selectedDeal?.countryCode === arc.countryCode;

        const start3D = rotatePoint(
          latLngToVec3(arc.fromLat, arc.fromLng, radius),
          rotY,
          rotX
        );
        const end3D = rotatePoint(
          latLngToVec3(arc.toLat, arc.toLng, radius),
          rotY,
          rotX
        );

        // 3D Elevation Data Spike tip extending radially outward proportional to investmentMillion!
        const spikeHeight = 1 + (arc.investmentMillion / 12) * 0.18;
        const spikeTip3D = rotatePoint(
          latLngToVec3(arc.toLat, arc.toLng, radius * spikeHeight),
          rotY,
          rotX
        );

        const midLat = (arc.fromLat + arc.toLat) / 2 + 12;
        const midLng = (arc.fromLng + arc.toLng) / 2;
        const mid3D = rotatePoint(
          latLngToVec3(midLat, midLng, radius * 1.32),
          rotY,
          rotX
        );

        if (start3D.z > -radius * 0.35 || end3D.z > -radius * 0.35) {
          const sx = cx + start3D.x;
          const sy = cy - start3D.y;
          const mx = cx + mid3D.x;
          const my = cy - mid3D.y;
          const ex = cx + end3D.x;
          const ey = cy - end3D.y;
          const tx = cx + spikeTip3D.x;
          const ty = cy - spikeTip3D.y;

          const baseAlpha =
            matchesCountry && matchesSector ? (isActiveFilter ? 1.0 : 0.88) : 0.22;

          // Glowing Arc Curve
          ctx.save();
          ctx.strokeStyle = isActiveFilter ? '#00e5ff' : arc.color;
          ctx.shadowColor = isActiveFilter ? '#00e5ff' : arc.color;
          ctx.shadowBlur = isActiveFilter ? 14 : 7;
          ctx.lineWidth = isActiveFilter ? 2.4 : 1.4;
          ctx.globalAlpha = baseAlpha;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(mx, my, ex, ey);
          ctx.stroke();

          // Moving telemetry packet along the arc
          if (matchesCountry && matchesSector) {
            const speed = isActiveFilter ? 0.55 : 0.32;
            const t = ((pulsePhase * speed + idx * 0.19) % 1 + 1) % 1;
            const px =
              (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * ex;
            const py =
              (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * ey;

            ctx.fillStyle = isActiveFilter ? '#00e5ff' : '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, isActiveFilter ? 2.8 : 1.9, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Destination Concentric Target Ring, 3D Radial Investment Spike & Interactive Label
          if (end3D.z > -radius * 0.15) {
            ctx.save();
            ctx.globalAlpha = baseAlpha;
            const ringColor = isActiveFilter ? '#00e5ff' : arc.color;
            ctx.strokeStyle = ringColor;
            ctx.fillStyle = ringColor;
            ctx.shadowColor = ringColor;
            ctx.shadowBlur = isActiveFilter ? 16 : 10;

            // 3D Radial Investment Pillar from surface (ex, ey) to elevated tip (tx, ty)
            ctx.lineWidth = isActiveFilter ? 2.8 : 1.8;
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(tx, ty);
            ctx.stroke();

            // Glowing tip cap on the 3D pillar
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(tx, ty, isActiveFilter ? 2.5 : 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Surface core dot
            ctx.fillStyle = ringColor;
            ctx.beginPath();
            ctx.arc(
              ex,
              ey,
              (isActiveFilter ? 3.2 : 2.3) * arc.ringScale,
              0,
              Math.PI * 2
            );
            ctx.fill();

            // Primary bright ring
            const r1 =
              (7.2 + Math.sin(pulsePhase * 1.3 + idx) * 1.4) *
              arc.ringScale *
              (isActiveFilter ? 1.25 : 1);
            ctx.lineWidth = isActiveFilter ? 2.2 : 1.6;
            ctx.beginPath();
            ctx.arc(ex, ey, r1, 0, Math.PI * 2);
            ctx.stroke();

            // Outer radar pulse ring
            ctx.globalAlpha = baseAlpha * 0.5;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(ex, ey, r1 + 4.5, 0, Math.PI * 2);
            ctx.stroke();

            // Draw HUD city & investment badge next to front-hemisphere nodes
            if (end3D.z > 0 && matchesCountry && matchesSector) {
              ctx.shadowBlur = 0;
              ctx.globalAlpha = isActiveFilter ? 1 : 0.88;
              ctx.font = isActiveFilter
                ? 'bold 10.5px Cairo, sans-serif'
                : '600 9.5px Cairo, sans-serif';
              ctx.fillStyle = isActiveFilter ? '#00e5ff' : '#d6f8e3';
              ctx.textAlign = 'center';
              ctx.fillText(
                `${arc.hubCityAr} (${arc.investmentMillion}M$)`,
                tx,
                ty - 8
              );
            }

            ctx.restore();

            currentHotspots.push({
              arc,
              x: ex,
              y: ey,
              z: end3D.z,
              radius: 24,
            });
          }

          // Central Cyan Primary Hub Ring (Munich / Central Europe Hub)
          if (idx === 0 && start3D.z > -radius * 0.1) {
            ctx.save();
            ctx.strokeStyle = '#00e5ff';
            ctx.fillStyle = '#00e5ff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 15;

            ctx.beginPath();
            ctx.arc(sx, sy, 3.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(sx, sy, 8.8, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(sx, sy, 13.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      hotspotsRef.current = currentHotspots;
      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedCountryCode, selectedSector, selectedDeal, hoveredArc]);

  // Pointer drag & click-to-select-node handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    rotationRef.current.isDragging = true;
    rotationRef.current.hasTarget = false;
    rotationRef.current.dragDistance = 0;
    rotationRef.current.lastX = e.clientX;
    rotationRef.current.lastY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (rotationRef.current.isDragging) {
      const dx = e.clientX - rotationRef.current.lastX;
      const dy = e.clientY - rotationRef.current.lastY;
      rotationRef.current.dragDistance += Math.abs(dx) + Math.abs(dy);
      rotationRef.current.rotY += dx * 0.006;
      rotationRef.current.rotX = Math.max(
        -1.1,
        Math.min(1.1, rotationRef.current.rotX + dy * 0.006)
      );
      rotationRef.current.lastX = e.clientX;
      rotationRef.current.lastY = e.clientY;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = hotspotsRef.current.find((h) => {
      const dx = h.x - mx;
      const dy = h.y - my;
      return dx * dx + dy * dy <= h.radius * h.radius;
    });
    setHoveredArc(hit ? hit.arc : null);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasClick = rotationRef.current.dragDistance < 7;
    rotationRef.current.isDragging = false;

    if (wasClick && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = hotspotsRef.current.find((h) => {
        const dx = h.x - mx;
        const dy = h.y - my;
        return dx * dx + dy * dy <= h.radius * h.radius;
      });
      if (hit) {
        onSelectCountry(
          selectedCountryCode === hit.arc.countryCode
            ? null
            : hit.arc.countryCode
        );
      }
    }
  };

  const activeCode = hoveredArc?.countryCode || selectedCountryCode;
  const inspectedCountry = countries.find((c) => c.code === activeCode) || null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none">
      {/* Interactive 3D Globe Stage */}
      <div className="relative w-full aspect-square max-w-[390px] max-h-[390px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            rotationRef.current.isDragging = false;
            setHoveredArc(null);
          }}
          className={`w-full h-full touch-none ${
            hoveredArc ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
          }`}
          aria-label="خريطة الكرة الأرضية التفاعلية لشبكة الفحوصات الطبية العالمية"
        />

        {/* Live Telemetry Overlay HUD Card when hovering or selecting a node on the globe */}
        {inspectedCountry && (
          <div
            dir="rtl"
            className="absolute top-1 right-1 left-1 sm:left-auto sm:w-64 bg-[#031417]/95 border border-[#00e5ff]/70 p-2.5 rounded shadow-[0_0_16px_rgba(0,229,255,0.28)] pointer-events-none"
          >
            <div className="flex items-center justify-between border-b border-[#00e5ff]/30 pb-1 mb-1.5">
              <span className="text-xs font-bold text-[#00ff66]">
                {inspectedCountry.nameAr} · {inspectedCountry.cityHubAr}
              </span>
              <span className="text-[10px] font-mono-tabular text-[#00e5ff]">
                نمو +{inspectedCountry.yoyGrowthPct}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
              <div>
                <span className="text-[#78b896] block">الاستثمار التشخيصي:</span>
                <span className="font-mono-tabular font-bold text-white">
                  ${inspectedCountry.totalInvestmentMillion}M ({inspectedCountry.companyCount} شركات)
                </span>
              </div>
              <div>
                <span className="text-[#78b896] block">الإنفاق الصحي (GDP):</span>
                <span className="font-mono-tabular font-bold text-[#00ff66]">
                  {inspectedCountry.healthExpenditurePctGdp}% (البنك الدولي)
                </span>
              </div>
              <div>
                <span className="text-[#78b896] block">حصة الفرد الصحية:</span>
                <span className="font-mono-tabular font-bold text-[#00e5ff]">
                  ${inspectedCountry.healthPerCapitaUsd.toLocaleString()} / سنة
                </span>
              </div>
              <div>
                <span className="text-[#78b896] block">العمر المتوقع:</span>
                <span className="font-mono-tabular font-bold text-white">
                  {inspectedCountry.lifeExpectancyYears} سنة
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Node Selector Strip directly under the globe */}
      <div
        dir="rtl"
        className="w-full flex flex-wrap items-center justify-center gap-1.5 px-2 pt-1"
      >
        <button
          type="button"
          onClick={() => onSelectCountry(null)}
          className={`px-2.5 py-1 text-[10.5px] rounded border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCountryCode === null
              ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_8px_rgba(0,255,102,0.35)]'
              : 'bg-[#041416] border-[#0d3b2a] text-[#88c4a6] hover:border-[#00ff66]/50 hover:text-white'
          }`}
        >
          الشبكة العالمية (42.6M$)
        </button>
        {countries.map((c) => {
          const isSelected = selectedCountryCode === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCountry(isSelected ? null : c.code)}
              className={`px-2.5 py-1 text-[10.5px] rounded border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] font-bold shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  : 'bg-[#041416] border-[#0d3b2a] text-[#98d5b3] hover:border-[#00e5ff]/50 hover:text-white'
              }`}
            >
              <span>{c.nameAr}</span>
              <span className="font-mono-tabular text-[10px] opacity-80">
                ({c.totalInvestmentMillion}M)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
