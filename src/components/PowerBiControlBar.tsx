import React from 'react';
import {
  CountryInvestmentStat,
  AcquisitionRecord,
} from '../data/medicalTestingData';

interface PowerBiControlBarProps {
  countries: CountryInvestmentStat[];
  selectedCountryCode: string | null;
  selectedSector: string | null;
  selectedYear: string | null;
  useLiveTimeRange: boolean;
  liveApiStatus: 'loading' | 'live' | 'verified';
  lastSyncTime: string;
  filteredDeals: AcquisitionRecord[];
  onSelectCountry: (code: string | null) => void;
  onSelectSector: (sector: string | null) => void;
  onSelectYear: (year: string | null) => void;
  onToggleTimeRange: () => void;
  onRefreshApi: () => void;
  onOpenApiInspector: () => void;
  onClearAll: () => void;
}

/**
 * Power BI / Tableau style interactive Slicer & API Proof Ribbon
 * Allows instant cross-filtering by Country, Sector, Time Horizon, CSV Export, and Live API JSON Proof inspection.
 */
export const PowerBiControlBar: React.FC<PowerBiControlBarProps> = ({
  countries,
  selectedCountryCode,
  selectedSector,
  selectedYear,
  useLiveTimeRange,
  liveApiStatus,
  lastSyncTime,
  filteredDeals,
  onSelectCountry,
  onSelectSector,
  onSelectYear,
  onToggleTimeRange,
  onRefreshApi,
  onOpenApiInspector,
  onClearAll,
}) => {
  const sectors = [
    { id: 'Development', label: 'البحث والتطوير', color: '#22ff44' },
    { id: 'Produce', label: 'الإنتاج الحيوي', color: '#00e5ff' },
    { id: 'Software', label: 'البرمجيات الطبية', color: '#0077ff' },
    { id: 'Sales', label: 'المبيعات والتوزيع', color: '#ff6600' },
  ];

  // Export currently filtered dataset to CSV (UTF-8 with BOM for Arabic Excel compatibility)
  const handleExportCsv = () => {
    const headers = [
      'رقم المرجع (Filing ID)',
      'التاريخ',
      'الشركة المستهدفة',
      'الجهة المستحوذة',
      'الدولة',
      'القطاع',
      'القيمة (مليون دولار)',
      'العائد الاستثماري ROI%',
      'شهادة الاعتماد',
    ];
    const rows = filteredDeals.map((d) => [
      d.secFilingId,
      d.date,
      `"${d.targetCompanyAr}"`,
      `"${d.acquirerAr}"`,
      d.countryAr,
      d.category,
      d.amountMillion,
      `${d.roiPct}%`,
      `"${d.isoCert}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `medical_testing_analytics_${selectedCountryCode || 'GLOBAL'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = Boolean(
    selectedCountryCode || selectedSector || selectedYear
  );

  return (
    <div
      dir="rtl"
      className="max-w-[1560px] w-full mx-auto px-3 sm:px-5 md:px-7 mb-3 select-none"
    >
      <div className="bg-[#041412]/90 border border-[#0e482e] rounded px-3 py-2 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,255,102,0.06)]">
        {/* Right Zone: Power BI Style Slicers (Country + Sector + Year) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#00ff66] flex items-center gap-1.5 pl-2 border-l border-[#0e482e]">
            <span className="w-2 h-2 bg-[#00ff66] inline-block" />
            مقسمات التحليل (BI Slicers):
          </span>

          {/* Country Slicer Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-[#020b0a] p-1 rounded border border-[#0a3322]">
            <button
              type="button"
              onClick={() => onSelectCountry(null)}
              className={`px-2 py-0.5 text-[10.5px] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCountryCode === null
                  ? 'bg-[#00ff66] text-[#021208] font-bold'
                  : 'text-[#88c4a6] hover:text-white'
              }`}
            >
              كل الدول
            </button>
            {countries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() =>
                  onSelectCountry(selectedCountryCode === c.code ? null : c.code)
                }
                className={`px-2 py-0.5 text-[10.5px] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCountryCode === c.code
                    ? 'bg-[#00e5ff] text-[#021218] font-bold shadow-[0_0_8px_rgba(0,229,255,0.5)]'
                    : 'text-[#98d5b3] hover:text-white'
                }`}
              >
                {c.nameAr}
              </button>
            ))}
          </div>

          {/* Sector Slicer Pills */}
          <div className="hidden xl:flex items-center gap-1 bg-[#020b0a] p-1 rounded border border-[#0a3322]">
            {sectors.map((sec) => {
              const isSelected = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() =>
                    onSelectSector(isSelected ? null : sec.id)
                  }
                  className={`px-2 py-0.5 text-[10.5px] rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#0b3826] text-white border border-[#00ff66]/60 font-bold'
                      : 'text-[#88c4a6] hover:text-white'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: sec.color }}
                  />
                  {sec.label}
                </button>
              );
            })}
          </div>

          {/* Active Year Filter Chip or Time Range Switch */}
          <button
            type="button"
            onClick={onToggleTimeRange}
            className="px-2.5 py-1 text-[10.5px] rounded bg-[#062119] border border-[#125438] text-[#bfead2] hover:border-[#00ff66] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            السلسلة الزمنية: {useLiveTimeRange ? '2021–2024' : '2015–2018'}
          </button>

          {selectedYear && (
            <button
              type="button"
              onClick={() => onSelectYear(null)}
              className="px-2 py-1 text-[10.5px] rounded bg-[#00e5ff]/20 border border-[#00e5ff] text-[#00e5ff] font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              فلتر السنة: {selectedYear} ✕
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-2 py-1 text-[10.5px] rounded bg-[#ff3b00]/20 border border-[#ff3b00]/60 text-[#ff9d80] hover:bg-[#ff3b00]/30 cursor-pointer whitespace-nowrap shrink-0"
            >
              إلغاء كافة الفلاتر ✕
            </button>
          )}
        </div>

        {/* Left Zone: API Telemetry Proof & Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10.5px] bg-[#020c0b] border border-[#0d3b29] px-2.5 py-1 rounded">
            <span className="text-[#78b896]">حالة API:</span>
            <span className="font-mono-tabular font-semibold text-[#00ff66]">
              {liveApiStatus === 'loading'
                ? 'جاري الجلب...'
                : liveApiStatus === 'live'
                ? 'World Bank API (متصل 200 OK)'
                : 'بيانات مرجعية موثقة'}
            </span>
            <span className="text-[#4c8568] font-mono-tabular">
              [{lastSyncTime}]
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenApiInspector}
            className="px-2.5 py-1 text-[10.5px] font-semibold rounded bg-[#00e5ff]/15 border border-[#00e5ff]/60 text-[#00e5ff] hover:bg-[#00e5ff]/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            فحص إثبات البيانات (API Proof)
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-2.5 py-1 text-[10.5px] font-semibold rounded bg-[#00ff66]/15 border border-[#00ff66]/60 text-[#00ff66] hover:bg-[#00ff66]/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            تصدير التقرير (CSV)
          </button>

          <button
            type="button"
            onClick={onRefreshApi}
            className="px-2 py-1 text-[10.5px] rounded bg-[#051f18] border border-[#125438] text-[#98d5b3] hover:text-white cursor-pointer whitespace-nowrap shrink-0"
            title="إعادة مزامنة بيانات البنك الدولي"
          >
            مزامنة
          </button>
        </div>
      </div>
    </div>
  );
};
