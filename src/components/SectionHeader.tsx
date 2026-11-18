import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

/**
 * Exact replication of the cybernetic green section header from the reference image:
 * Title in bright emerald green + 4 slanted parallelogram ticks (////) + extending horizontal green line.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightElement,
}) => {
  return (
    <div className="mb-3 select-none">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-3">
          <h2 className="text-[#00ff66] font-bold text-base md:text-lg tracking-wide whitespace-nowrap drop-shadow-[0_0_8px_rgba(0,255,102,0.35)]">
            {title}
          </h2>
          {/* 4 Slanted Parallelogram Ticks matching reference image */}
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="inline-block w-1.5 h-2.5 bg-[#00ff66] -skew-x-[28deg] shadow-[0_0_6px_rgba(0,255,102,0.6)]" />
            <span className="inline-block w-1.5 h-2.5 bg-[#00ff66] -skew-x-[28deg] shadow-[0_0_6px_rgba(0,255,102,0.6)]" />
            <span className="inline-block w-1.5 h-2.5 bg-[#00ff66]/80 -skew-x-[28deg]" />
            <span className="inline-block w-1.5 h-2.5 bg-[#00ff66]/60 -skew-x-[28deg]" />
          </div>
        </div>
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>

      {/* Glowing green horizontal baseline with thicker accent segment */}
      <div className="relative w-full h-[2px] bg-gradient-to-l from-[#00ff66] via-[#00ff66]/60 to-[#00ff66]/10 shadow-[0_0_8px_rgba(0,255,102,0.4)]">
        <div className="absolute right-0 -top-[1px] w-16 h-[3px] bg-[#00ff66]" />
      </div>

      {subtitle && (
        <p className="text-[11px] text-[#78b896] mt-1">{subtitle}</p>
      )}
    </div>
  );
};
