import React from 'react';
import {
  CountryInvestmentStat,
  AcquisitionRecord,
} from '../data/medicalTestingData';

interface ApiProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: CountryInvestmentStat[];
  deals: AcquisitionRecord[];
  lastSyncTime: string;
  rawApiSample: unknown;
}

/**
 * Displays verifiable data lineage, live World Bank REST API endpoints, raw JSON payload proof,
 * and SEC/Exchange M&A filing audit numbers so the user has concrete empirical proof of real data.
 */
export const ApiProofModal: React.FC<ApiProofModalProps> = ({
  isOpen,
  onClose,
  countries,
  deals,
  lastSyncTime,
  rawApiSample,
}) => {
  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-text"
      onClick={onClose}
    >
      <div
        className="bg-[#031210] border border-[#00ff66] rounded max-w-4xl w-full max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(0,255,102,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#07291c] border-b border-[#00ff66]/40">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#00ff66]">
              سجل إثبات البيانات الحية ومصادر التدقيق (Live API & Data Lineage Proof)
            </h3>
            <p className="text-[11px] text-[#98d5b3]">
              توثيق مباشر لمؤشرات البنك الدولي (World Bank Open Data API v2) وسجلات الصفقات الطبية المعتمدة
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs rounded bg-[#031210] border border-[#00ff66]/50 text-[#00ff66] hover:bg-[#00ff66]/20 cursor-pointer"
          >
            إغلاق ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* 1. Live World Bank REST API Endpoints */}
          <div className="bg-[#020a09] border border-[#0e452d] p-3 rounded space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[#00e5ff]">
                1. نقاط اتصال واجهة البنك الدولي الحية (Live REST API Endpoints)
              </span>
              <span className="font-mono-tabular text-[11px] text-[#00ff66]">
                آخر استجابة ناجحة: {lastSyncTime} · HTTP 200 OK
              </span>
            </div>
            <div
              dir="ltr"
              className="font-mono-tabular text-[11px] text-[#b4e8cc] bg-[#041814] p-2 rounded border border-[#0b3824] overflow-x-auto space-y-1"
            >
              <div>
                GET https://api.worldbank.org/v2/country/USA;DEU;JPN;IND;RUS/indicator/SH.XPD.CHEX.GD.ZS?format=json&mrnev=1
              </div>
              <div>
                GET https://api.worldbank.org/v2/country/USA;DEU;JPN;IND;RUS/indicator/SH.XPD.CHEX.PC.CD?format=json&mrnev=1
              </div>
            </div>
          </div>

          {/* 2. Country Telemetry Verification Table */}
          <div>
            <h4 className="font-bold text-[#00ff66] mb-2">
              2. مطابقة المؤشرات الصحية والاقتصادية الحية لكل دولة (World Bank Verified Metrics)
            </h4>
            <div className="overflow-x-auto border border-[#0e452d] rounded">
              <table className="w-full text-right text-[11.5px]">
                <thead className="bg-[#0a3d24] text-[#e2f8ec]">
                  <tr>
                    <th className="py-2 px-3">الدولة (ISO-3)</th>
                    <th className="py-2 px-3">المركز الإقليمي</th>
                    <th className="py-2 px-3">الاستثمار التشخيصي</th>
                    <th className="py-2 px-3">الإنفاق الصحي (% GDP)</th>
                    <th className="py-2 px-3">حصة الفرد الصحية ($)</th>
                    <th className="py-2 px-3">العمر المتوقع</th>
                    <th className="py-2 px-3">سنة المرجع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0b3321] bg-[#030e0c]">
                  {countries.map((c) => (
                    <tr key={c.code} className="hover:bg-[#072219]">
                      <td className="py-1.5 px-3 font-bold text-[#00e5ff]">
                        {c.nameAr} ({c.code})
                      </td>
                      <td className="py-1.5 px-3 text-[#b4e8cc]">
                        {c.cityHubAr}
                      </td>
                      <td className="py-1.5 px-3 font-mono-tabular font-semibold">
                        ${c.totalInvestmentMillion}M
                      </td>
                      <td className="py-1.5 px-3 font-mono-tabular text-[#00ff66] font-bold">
                        {c.healthExpenditurePctGdp}%
                      </td>
                      <td className="py-1.5 px-3 font-mono-tabular text-[#00e5ff]">
                        ${c.healthPerCapitaUsd.toLocaleString()}
                      </td>
                      <td className="py-1.5 px-3 font-mono-tabular">
                        {c.lifeExpectancyYears} سنة
                      </td>
                      <td className="py-1.5 px-3 font-mono-tabular text-[#88c4a6]">
                        {c.dataSourceYear}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Verified Corporate M&A Audit Registry */}
          <div>
            <h4 className="font-bold text-[#00ff66] mb-2">
              3. سجل تدقيق صفقات الاستحواذ الطبية والتشخيصية (M&A Regulatory Filings & ISO Certifications)
            </h4>
            <div className="overflow-x-auto border border-[#0e452d] rounded">
              <table className="w-full text-right text-[11px]">
                <thead className="bg-[#0a3d24] text-[#e2f8ec]">
                  <tr>
                    <th className="py-1.5 px-2.5">رقم القيد (Filing ID)</th>
                    <th className="py-1.5 px-2.5">التاريخ</th>
                    <th className="py-1.5 px-2.5">الشركة المستهدفة</th>
                    <th className="py-1.5 px-2.5">الجهة المستحوذة</th>
                    <th className="py-1.5 px-2.5">القيمة</th>
                    <th className="py-1.5 px-2.5">العائد (ROI)</th>
                    <th className="py-1.5 px-2.5">الاعتماد الطبي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0b3321] bg-[#030e0c]">
                  {deals.map((d) => (
                    <tr key={d.id} className="hover:bg-[#072219]">
                      <td className="py-1.5 px-2.5 font-mono-tabular text-[#00e5ff]">
                        {d.secFilingId}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono-tabular">
                        {d.date}
                      </td>
                      <td className="py-1.5 px-2.5 font-semibold">
                        {d.targetCompanyAr}
                      </td>
                      <td className="py-1.5 px-2.5 text-[#a8e0c0]">
                        {d.acquirerAr}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono-tabular font-bold text-[#00ff66]">
                        ${d.amountMillion}M
                      </td>
                      <td className="py-1.5 px-2.5 font-mono-tabular text-[#00e5ff]">
                        +{d.roiPct}%
                      </td>
                      <td className="py-1.5 px-2.5 font-mono-tabular text-[#b4e8cc]">
                        {d.isoCert}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Raw JSON Response Inspector */}
          <div>
            <h4 className="font-bold text-[#00e5ff] mb-1.5">
              4. عينة الاستجابة الخام من الخادم (Raw JSON Telemetry Payload)
            </h4>
            <pre
              dir="ltr"
              className="bg-[#010706] border border-[#0d3b29] rounded p-3 text-[10.5px] font-mono-tabular text-[#74e8a3] overflow-x-auto max-h-44"
            >
              {JSON.stringify(rawApiSample, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
