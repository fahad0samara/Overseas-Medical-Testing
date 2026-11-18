import React from 'react';

interface TopBannerHeaderProps {
  title: string;
  liveApiStatus: 'loading' | 'live' | 'verified';
  useLiveTimeRange: boolean;
  onToggleTimeRange: () => void;
  selectedCountryCode: string | null;
  onClearFilter: () => void;
}

/**
 * Exact replication of the top cybernetic hexagonal canopy frame with left/right glowing green horizon lines
 * and 4 slanted parallelogram accent stripes (Orange, Red-Orange, Cyan, Cyan) on both sides.
 */
export const TopBannerHeader: React.FC<TopBannerHeaderProps> = ({
  title,
  liveApiStatus,
  useLiveTimeRange,
  onToggleTimeRange,
  selectedCountryCode,
  onClearFilter,
}) => {
  return (
    <header className="relative w-full pt-3 pb-2 px-3 md:px-6 select-none">
      {/* Main Canopy Row (dir="ltr" so the geometric frame and left/right slanted stripes match the exact visual symmetry of the reference image) */}
      <div
        dir="ltr"
        className="max-w-[1560px] mx-auto flex items-center justify-center"
      >
        {/* Left Horizon Line + 4 Slanted Stripes (Orange, Red, Cyan, Cyan) */}
        <div className="hidden sm:flex flex-1 items-center">
          <div className="w-full h-[2px] bg-gradient-to-r from-[#00ff66]/20 via-[#00ff66] to-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.55)]" />
          <div className="flex items-center gap-1.5 mx-2.5 shrink-0" aria-hidden="true">
            <span className="w-2 h-3 bg-[#ff7b00] -skew-x-[35deg] shadow-[0_0_6px_rgba(255,123,0,0.8)]" />
            <span className="w-2 h-3 bg-[#ff2a00] -skew-x-[35deg] shadow-[0_0_6px_rgba(255,42,0,0.8)]" />
            <span className="w-2 h-3 bg-[#00e5ff] -skew-x-[35deg] shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
            <span className="w-2 h-3 bg-[#00e5ff] -skew-x-[35deg] shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
          </div>
        </div>

        {/* Center Geometric Hexagonal Canopy Frame */}
        <div className="relative px-8 sm:px-14 py-2.5 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 460 58"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Outer Main Hexagonal Frame */}
            <polygon
              points="16,4 444,4 456,22 426,48 34,48 4,22"
              fill="rgba(3, 16, 15, 0.78)"
              stroke="#00ff66"
              strokeWidth="1.75"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,102,0.45))' }}
            />
            {/* Bottom Left & Right Notched Bracket Underscores */}
            <polyline
              points="26,48 34,54 96,54 106,48"
              fill="none"
              stroke="#00ff66"
              strokeWidth="1.8"
            />
            <polyline
              points="434,48 426,54 364,54 354,48"
              fill="none"
              stroke="#00ff66"
              strokeWidth="1.8"
            />
          </svg>

          <h1
            dir="rtl"
            className="relative z-10 text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          >
            {title}
          </h1>
        </div>

        {/* Right 4 Slanted Stripes (Cyan, Cyan, Red, Orange) + Right Horizon Line */}
        <div className="hidden sm:flex flex-1 items-center">
          <div className="flex items-center gap-1.5 mx-2.5 shrink-0" aria-hidden="true">
            <span className="w-2 h-3 bg-[#00e5ff] skew-x-[35deg] shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
            <span className="w-2 h-3 bg-[#00e5ff] skew-x-[35deg] shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
            <span className="w-2 h-3 bg-[#ff2a00] skew-x-[35deg] shadow-[0_0_6px_rgba(255,42,0,0.8)]" />
            <span className="w-2 h-3 bg-[#ff7b00] skew-x-[35deg] shadow-[0_0_6px_rgba(255,123,0,0.8)]" />
          </div>
          <div className="w-full h-[2px] bg-gradient-to-l from-[#00ff66]/20 via-[#00ff66] to-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.55)]" />
        </div>
      </div>

      {/* Ultra-compact interactive control bar in Arabic RTL */}
      <div
        dir="rtl"
        className="max-w-[1560px] mx-auto mt-1 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#6fb390] px-1"
      >
        <div className="flex items-center gap-3">
          <span>
            {liveApiStatus === 'live'
              ? 'مؤشرات البنك الدولي الحية متصلة (World Bank API)'
              : 'قاعدة بيانات الفحوصات الطبية والصفقات الدولية الموثقة'}
          </span>
          {selectedCountryCode && (
            <button
              type="button"
              onClick={onClearFilter}
              className="text-[#00e5ff] hover:underline cursor-pointer font-semibold"
            >
              إلغاء فلتر الدولة ({selectedCountryCode}) ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTimeRange}
            className="px-2 py-0.5 rounded border border-[#00ff66]/35 bg-[#041812] text-[#00ff66] hover:bg-[#00ff66]/15 transition-colors cursor-pointer"
          >
            {useLiveTimeRange
              ? 'الفترة الزمنية: 2022–2025 (تبديل إلى المرجعية 2015–2018)'
              : 'الفترة الزمنية: 2015–2018 المطابقة للصورة (تبديل إلى 2022–2025)'}
          </button>
        </div>
      </div>
    </header>
  );
};
