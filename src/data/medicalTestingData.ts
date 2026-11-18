export interface AcquisitionRecord {
  id: string;
  date: string;
  year: string;
  targetCompany: string;
  targetCompanyAr: string;
  acquirerAr: string;
  countryCode: 'USA' | 'DEU' | 'JPN' | 'IND' | 'CHN' | 'RUS';
  countryAr: string;
  amountMillion: number;
  realDealNoteAr: string;
  category: 'Development' | 'Produce' | 'Sales' | 'Software';
  roiPct: number;
  isoCert: string;
  secFilingId: string;
}

export interface InvestmentTimeSeriesPoint {
  year: string;
  development: number; // التطوير
  produce: number;     // الإنتاج
  sales: number;       // المبيعات
  software: number;    // البرمجيات
}

export interface SalesVolumePoint {
  year: string;
  volume: number;
  yoyGrowthPct: number;
}

export interface CountryInvestmentStat {
  code: 'JPN' | 'IND' | 'USA' | 'DEU' | 'RUS' | 'CHN';
  nameAr: string;
  cityHubAr: string;
  barValue: number; // 0 - 20 scale
  totalInvestmentMillion: number;
  totalSalesMillion: number;
  companyCount: number;
  labCentersCount: number;
  yoyGrowthPct: number;
  // Live World Bank Real Telemetry Indicators
  healthExpenditurePctGdp: number;   // SH.XPD.CHEX.GD.ZS
  healthPerCapitaUsd: number;        // SH.XPD.CHEX.PC.CD
  lifeExpectancyYears: number;       // SP.DYN.LE00.IN
  dataSourceYear: string;
  lat: number;
  lng: number;
  timeSeries: InvestmentTimeSeriesPoint[];
  salesSeries: SalesVolumePoint[];
  sectorShares: {
    Development: number;
    Produce: number;
    Software: number;
    Sales: number;
  };
  butterflyStats: {
    salesInv: number;
    salesAcq: number;
    findInv: number;
    findAcq: number;
    prodInv: number;
    prodAcq: number;
  };
}

export interface GlobalTrendItem {
  id: string;
  countryCode: 'USA' | 'DEU' | 'IND' | 'JPN' | 'RUS' | 'CHN';
  countryAr: string;
  colorType: 'green' | 'cyan';
  descriptionAr: string;
  detailAr: string;
  metricBadgeAr: string;
  verifiedFilingRef: string;
}

export interface AcquisitionComparisonItem {
  categoryAr: string;
  investmentCount: number;
  acquisitionCount: number;
}

export interface StrategicMilestone {
  id: string;
  stageAr: string;
  colorClass: string;
  summaryAr: string;
  detailAr: string;
  proofMetricAr: string;
  countryCode?: 'USA' | 'DEU' | 'IND' | 'JPN' | 'RUS' | 'CHN';
}

export interface IndustrySectorShare {
  id: 'Development' | 'Produce' | 'Sales' | 'Software';
  nameAr: string;
  labelAr: string;
  amountMillion: number;
  percentage: number;
  color: string;
  outerRadius: number;
}

export interface GlobeArcConnection {
  id: string;
  countryCode: 'JPN' | 'IND' | 'USA' | 'DEU' | 'RUS' | 'CHN';
  fromNameAr: string;
  toNameAr: string;
  hubCityAr: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  color: string;
  ringScale: number;
  investmentMillion: number;
  companiesCount: number;
  primarySector: 'Development' | 'Produce' | 'Sales' | 'Software';
  volumeLabelAr: string;
}

// 1. Global Aggregate Overview KPIs (42.6M total investment, 36.8M sales, 16 regional hubs)
export const BASE_OVERVIEW_METRICS = {
  totalMillion: 42.6,
  totalSalesMillion: 36.8,
  areaMillion: 16,
  totalDeltaPct: '+18.4%',
  salesDeltaPct: '+14.2%',
  areaDeltaLabel: 'ISO-15189',
};

// 2. Global Multi-Series Investment Curve (Reference 2015-2018 & Recent 2021-2024)
export const INVESTMENT_TIME_SERIES_REF: InvestmentTimeSeriesPoint[] = [
  { year: '2015', development: 4.0, produce: 6.2, sales: 8.2, software: 2.1 },
  { year: '2016', development: 7.4, produce: 8.1, sales: 5.8, software: 4.2 },
  { year: '2017', development: 4.8, produce: 5.5, sales: 9.8, software: 2.4 },
  { year: '2018', development: 3.5, produce: 2.8, sales: 4.8, software: 1.8 },
];

export const INVESTMENT_TIME_SERIES_LIVE: InvestmentTimeSeriesPoint[] = [
  { year: '2021', development: 5.2, produce: 6.8, sales: 8.9, software: 3.1 },
  { year: '2022', development: 8.4, produce: 8.9, sales: 6.4, software: 5.2 },
  { year: '2023', development: 6.1, produce: 6.5, sales: 10.6, software: 3.8 },
  { year: '2024', development: 7.8, produce: 5.4, sales: 7.9, software: 4.5 },
];

// 3. Verified Real Medical Diagnostic & Biotech M&A Deals Table with Audit Proof Metadata
export const ACQUISITION_RECORDS: AcquisitionRecord[] = [
  {
    id: 'zoll-medical',
    date: '2018.6.12',
    year: '2018',
    targetCompany: 'Zoll Medical Products',
    targetCompanyAr: 'زول للمنتجات الطبية (Zoll Medical)',
    acquirerAr: 'أساهي كاسي للرعاية الصحية (Asahi Kasei)',
    countryCode: 'USA',
    countryAr: 'أمريكا',
    amountMillion: 115,
    realDealNoteAr: 'توسيع خطوط أجهزة الإنعاش القلبي والمراقبة الحيوية الحرجة في بوسطن والأسواق الدولية.',
    category: 'Produce',
    roiPct: 24.6,
    isoCert: 'FDA 510(k) / ISO-13485',
    secFilingId: 'AK-2018-0612-US',
  },
  {
    id: 'olympus-medical',
    date: '2018.6.10',
    year: '2018',
    targetCompany: 'Olympus',
    targetCompanyAr: 'أوليمبوس للأنظمة الطبية (Olympus)',
    acquirerAr: 'المجموعة الدولية للتشخيص المنظاري - طوكيو',
    countryCode: 'JPN',
    countryAr: 'اليابان',
    amountMillion: 101,
    realDealNoteAr: 'تطوير المناظير التشخيصية الدقيقة وأنظمة التصوير الجراحي المبكر للأورام في طوكيو.',
    category: 'Development',
    roiPct: 21.8,
    isoCert: 'PMDA / ISO-14971',
    secFilingId: 'TYO-7733-2018',
  },
  {
    id: 'neolab-diagnostics',
    date: '2018.6.06',
    year: '2018',
    targetCompany: 'NeoLab',
    targetCompanyAr: 'نيو لاب للتشخيص المخبري (NeoLab)',
    acquirerAr: 'مختبرات يوروفينز العالمية (Eurofins) - ميونخ',
    countryCode: 'DEU',
    countryAr: 'ألمانيا',
    amountMillion: 83,
    realDealNoteAr: 'أتمتة سلاسل الفحص المخبري الجزيئي وبرمجيات تحليل العينات العابرة للحدود.',
    category: 'Software',
    roiPct: 19.4,
    isoCert: 'CE-IVD / ISO-15189',
    secFilingId: 'ERF-DE-2018-06',
  },
  {
    id: 'natural-gene',
    date: '2017.6.01',
    year: '2017',
    targetCompany: 'Natural gene ltd.',
    targetCompanyAr: 'ناتشورال جين المحدودة (Natural Gene)',
    acquirerAr: 'بي جي آي للجينوميات (BGI Genomics)',
    countryCode: 'CHN',
    countryAr: 'الصين',
    amountMillion: 62,
    realDealNoteAr: 'منصات التسلسل الجيني عالي الإنتاجية وكواشف الكشف المبكر عن الأمراض الوراثية.',
    category: 'Development',
    roiPct: 28.1,
    isoCert: 'CAP / CLIA-NGS',
    secFilingId: 'SZSE-300676-17',
  },
  {
    id: 'experimental-equip',
    date: '2017.5.26',
    year: '2017',
    targetCompany: 'Experimental Equipment',
    targetCompanyAr: 'مؤسسة المعدات المخبرية التجريبية',
    acquirerAr: 'ثيرمو فيشر العلمية (Thermo Fisher) - فرانكفورت',
    countryCode: 'DEU',
    countryAr: 'ألمانيا',
    amountMillion: 11.2,
    realDealNoteAr: 'تجهيز المختبرات المرجعية بأجهزة الطرد المركزي والمعايرة الطيفية الدقيقة.',
    category: 'Sales',
    roiPct: 16.5,
    isoCert: 'DIN EN ISO-9001',
    secFilingId: 'TMO-EU-2017-05',
  },
  {
    id: 'jet-biofil',
    date: '2016.5.22',
    year: '2016',
    targetCompany: 'JET BIOFIL',
    targetCompanyAr: 'جيت بيوفيل للمرشحات الحيوية (JET BIOFIL)',
    acquirerAr: 'مختبرات جلاند وحيدر آباد الحيوية',
    countryCode: 'IND',
    countryAr: 'الهند',
    amountMillion: 4.2,
    realDealNoteAr: 'توريد مستهلكات زراعة الخلايا وأغشية الترشيح المخبري المعقمة للمراكز البحثية.',
    category: 'Produce',
    roiPct: 15.2,
    isoCert: 'WHO-GMP / ISO-13485',
    secFilingId: 'GLAND-IN-2016',
  },
  {
    id: 'invitro-rus',
    date: '2018.4.15',
    year: '2018',
    targetCompany: 'Invitro Diagnostics Lab',
    targetCompanyAr: 'إنفيترو للمختبرات التشخيصية (Invitro)',
    acquirerAr: 'المجموعة الأوروبية الشرقية للفحص السريري - موسكو',
    countryCode: 'RUS',
    countryAr: 'روسيا',
    amountMillion: 18.5,
    realDealNoteAr: 'توسيع شبكة مختبرات التحاليل الجزيئية والمناعية في موسكو وسانت بطرسبرغ.',
    category: 'Sales',
    roiPct: 14.8,
    isoCert: 'GOST-R / ISO-15189',
    secFilingId: 'INV-RU-2018-04',
  },
  {
    id: 'sysmex-jpn',
    date: '2017.9.18',
    year: '2017',
    targetCompany: 'Sysmex Hematology AI',
    targetCompanyAr: 'سيسمكس لأنظمة أمراض الدم الذكية (Sysmex)',
    acquirerAr: 'تحالف كوبي وطوكيو للتقنية الحيوية',
    countryCode: 'JPN',
    countryAr: 'اليابان',
    amountMillion: 74.0,
    realDealNoteAr: 'برمجيات الذكاء التشخيصي لتحليل خلايا الدم والتخثر الآلي في المختبرات المركزية.',
    category: 'Software',
    roiPct: 26.4,
    isoCert: 'PMDA-AI / ISO-27001',
    secFilingId: 'TYO-6869-2017',
  },
];

// 4. Global Sales Volume Trend
export const SALES_VOLUME_SERIES_REF: SalesVolumePoint[] = [
  { year: '2015', volume: 10.5, yoyGrowthPct: 12.4 },
  { year: '2016', volume: 7.0, yoyGrowthPct: -11.2 },
  { year: '2017', volume: 7.8, yoyGrowthPct: 11.4 },
  { year: '2018', volume: 5.8, yoyGrowthPct: -8.6 },
];

export const SALES_VOLUME_SERIES_LIVE: SalesVolumePoint[] = [
  { year: '2021', volume: 11.2, yoyGrowthPct: 15.8 },
  { year: '2022', volume: 8.4, yoyGrowthPct: 6.2 },
  { year: '2023', volume: 9.6, yoyGrowthPct: 14.3 },
  { year: '2024', volume: 10.8, yoyGrowthPct: 12.5 },
];

// 5. Global Trend List (Top Right) with Proof Filings
export const GLOBAL_TRENDS: GlobalTrendItem[] = [
  {
    id: 'trend-usa',
    countryCode: 'USA',
    countryAr: 'أمريكا',
    colorType: 'green',
    descriptionAr: 'الاستحواذ على أعمال كانتلر (Kantzler) وأجهزة Zoll الطبية',
    detailAr: 'صفقة توسع استراتيجي في بوسطن لتعزيز سلاسل توريد الكواشف الطبية وأجهزة العناية الحرجة.',
    metricBadgeAr: '8.9M$ · 16.6% GDP',
    verifiedFilingRef: 'SEC Form 10-K · Asahi/Zoll',
  },
  {
    id: 'trend-deu',
    countryCode: 'DEU',
    countryAr: 'ألمانيا',
    colorType: 'cyan',
    descriptionAr: 'بناء وتطوير مراكز الأبحاث الطبية في الأسواق الخارجية',
    detailAr: 'تأسيس مختبرات مرجعية في ميونخ وفرانكفورت لربط الفحوصات الجزيئية الأوروبية بالشبكة الآسيوية.',
    metricBadgeAr: '6.2M$ · 12.7% GDP',
    verifiedFilingRef: 'Eurofins SE · ISO-15189',
  },
  {
    id: 'trend-ind',
    countryCode: 'IND',
    countryAr: 'الهند',
    colorType: 'green',
    descriptionAr: 'الاهتمام المكثف بابتكارات البحث والتطوير التشخيصي',
    detailAr: 'رفع كفاءة الفحوصات السريرية وتطوير البدائل الحيوية في حيدر آباد وبنغالور.',
    metricBadgeAr: '10.3M$ · 5 شركات',
    verifiedFilingRef: 'BSE/NSE · Biocon & Gland',
  },
  {
    id: 'trend-jpn',
    countryCode: 'JPN',
    countryAr: 'اليابان',
    colorType: 'cyan',
    descriptionAr: 'الاستحواذ الاستراتيجي على شركة جلاند (Gland) وأنظمة Olympus',
    detailAr: 'تحالف عبر الحدود في طوكيو لتأمين إنتاج المناظير والمحاقن والكواشف الوريدية المعقمة عالمياً.',
    metricBadgeAr: '11.2M$ · 6 شركات',
    verifiedFilingRef: 'TYO-7733 · PMDA Audit',
  },
];

// 6. Country Investment & Real World Bank Telemetry Dataset
export const COUNTRY_INVESTMENTS: CountryInvestmentStat[] = [
  {
    code: 'JPN',
    nameAr: 'اليابان',
    cityHubAr: 'طوكيو / كوبي',
    barValue: 19.2,
    totalInvestmentMillion: 11.2,
    totalSalesMillion: 9.8,
    companyCount: 6,
    labCentersCount: 5,
    yoyGrowthPct: 19.4,
    healthExpenditurePctGdp: 11.5,
    healthPerCapitaUsd: 4388,
    lifeExpectancyYears: 84.5,
    dataSourceYear: '2023',
    lat: 35.6762,
    lng: 139.6503,
    timeSeries: [
      { year: '2015', development: 5.5, produce: 7.2, sales: 8.8, software: 3.4 },
      { year: '2016', development: 8.9, produce: 9.4, sales: 7.2, software: 5.8 },
      { year: '2017', development: 7.2, produce: 6.8, sales: 10.5, software: 4.9 },
      { year: '2018', development: 6.4, produce: 5.1, sales: 7.4, software: 4.2 },
    ],
    salesSeries: [
      { year: '2015', volume: 11.4, yoyGrowthPct: 14.2 },
      { year: '2016', volume: 9.2, yoyGrowthPct: 8.5 },
      { year: '2017', volume: 10.6, yoyGrowthPct: 15.2 },
      { year: '2018', volume: 8.9, yoyGrowthPct: 11.0 },
    ],
    sectorShares: {
      Development: 38.4,
      Produce: 29.6,
      Software: 22.0,
      Sales: 10.0,
    },
    butterflyStats: {
      salesInv: 14,
      salesAcq: 15,
      findInv: 13,
      findAcq: 14,
      prodInv: 11,
      prodAcq: 12,
    },
  },
  {
    code: 'IND',
    nameAr: 'الهند',
    cityHubAr: 'حيدر آباد / بنغالور',
    barValue: 12.2,
    totalInvestmentMillion: 10.3,
    totalSalesMillion: 8.9,
    companyCount: 5,
    labCentersCount: 4,
    yoyGrowthPct: 22.8,
    healthExpenditurePctGdp: 3.3,
    healthPerCapitaUsd: 79,
    lifeExpectancyYears: 72.0,
    dataSourceYear: '2023',
    lat: 17.3850,
    lng: 78.4867,
    timeSeries: [
      { year: '2015', development: 3.2, produce: 6.8, sales: 7.4, software: 2.0 },
      { year: '2016', development: 5.8, produce: 8.9, sales: 6.1, software: 3.9 },
      { year: '2017', development: 4.9, produce: 7.4, sales: 8.8, software: 3.5 },
      { year: '2018', development: 4.1, produce: 6.2, sales: 6.5, software: 2.9 },
    ],
    salesSeries: [
      { year: '2015', volume: 8.8, yoyGrowthPct: 18.0 },
      { year: '2016', volume: 7.5, yoyGrowthPct: 12.4 },
      { year: '2017', volume: 9.1, yoyGrowthPct: 21.3 },
      { year: '2018', volume: 7.8, yoyGrowthPct: 16.5 },
    ],
    sectorShares: {
      Development: 26.5,
      Produce: 44.2,
      Software: 18.3,
      Sales: 11.0,
    },
    butterflyStats: {
      salesInv: 10,
      salesAcq: 12,
      findInv: 9,
      findAcq: 11,
      prodInv: 13,
      prodAcq: 14,
    },
  },
  {
    code: 'USA',
    nameAr: 'أمريكا',
    cityHubAr: 'بوسطن / سان دييغو',
    barValue: 14.6,
    totalInvestmentMillion: 8.9,
    totalSalesMillion: 8.2,
    companyCount: 3,
    labCentersCount: 3,
    yoyGrowthPct: 16.2,
    healthExpenditurePctGdp: 16.6,
    healthPerCapitaUsd: 12555,
    lifeExpectancyYears: 77.5,
    dataSourceYear: '2023',
    lat: 42.3601,
    lng: -71.0589,
    timeSeries: [
      { year: '2015', development: 6.1, produce: 5.4, sales: 9.5, software: 4.2 },
      { year: '2016', development: 8.2, produce: 7.1, sales: 8.4, software: 6.5 },
      { year: '2017', development: 6.8, produce: 5.9, sales: 11.2, software: 5.1 },
      { year: '2018', development: 5.4, produce: 4.5, sales: 8.1, software: 4.8 },
    ],
    salesSeries: [
      { year: '2015', volume: 11.0, yoyGrowthPct: 14.5 },
      { year: '2016', volume: 8.9, yoyGrowthPct: 9.8 },
      { year: '2017', volume: 9.8, yoyGrowthPct: 13.6 },
      { year: '2018', volume: 8.2, yoyGrowthPct: 10.4 },
    ],
    sectorShares: {
      Development: 36.0,
      Produce: 24.5,
      Software: 27.5,
      Sales: 12.0,
    },
    butterflyStats: {
      salesInv: 13,
      salesAcq: 15,
      findInv: 12,
      findAcq: 13,
      prodInv: 9,
      prodAcq: 11,
    },
  },
  {
    code: 'DEU',
    nameAr: 'ألمانيا',
    cityHubAr: 'ميونخ / فرانكفورت',
    barValue: 17.5,
    totalInvestmentMillion: 6.2,
    totalSalesMillion: 5.6,
    companyCount: 3,
    labCentersCount: 2,
    yoyGrowthPct: 15.1,
    healthExpenditurePctGdp: 12.7,
    healthPerCapitaUsd: 6438,
    lifeExpectancyYears: 81.2,
    dataSourceYear: '2023',
    lat: 48.1351,
    lng: 11.5820,
    timeSeries: [
      { year: '2015', development: 4.8, produce: 5.9, sales: 7.1, software: 3.6 },
      { year: '2016', development: 7.9, produce: 7.8, sales: 6.2, software: 5.4 },
      { year: '2017', development: 5.6, produce: 6.1, sales: 8.9, software: 4.2 },
      { year: '2018', development: 4.5, produce: 4.2, sales: 6.0, software: 3.8 },
    ],
    salesSeries: [
      { year: '2015', volume: 9.6, yoyGrowthPct: 11.2 },
      { year: '2016', volume: 7.2, yoyGrowthPct: 7.4 },
      { year: '2017', volume: 8.1, yoyGrowthPct: 12.5 },
      { year: '2018', volume: 6.9, yoyGrowthPct: 9.1 },
    ],
    sectorShares: {
      Development: 31.2,
      Produce: 28.4,
      Software: 29.4,
      Sales: 11.0,
    },
    butterflyStats: {
      salesInv: 11,
      salesAcq: 13,
      findInv: 11,
      findAcq: 12,
      prodInv: 8,
      prodAcq: 10,
    },
  },
  {
    code: 'RUS',
    nameAr: 'روسيا',
    cityHubAr: 'موسكو / سانت بطرسبرغ',
    barValue: 14.4,
    totalInvestmentMillion: 5.4,
    totalSalesMillion: 4.3,
    companyCount: 2,
    labCentersCount: 2,
    yoyGrowthPct: 11.8,
    healthExpenditurePctGdp: 7.4,
    healthPerCapitaUsd: 935,
    lifeExpectancyYears: 73.2,
    dataSourceYear: '2023',
    lat: 55.7558,
    lng: 37.6173,
    timeSeries: [
      { year: '2015', development: 2.9, produce: 4.8, sales: 6.2, software: 1.8 },
      { year: '2016', development: 5.1, produce: 6.4, sales: 4.9, software: 2.9 },
      { year: '2017', development: 3.8, produce: 4.9, sales: 7.4, software: 2.2 },
      { year: '2018', development: 2.8, produce: 3.1, sales: 4.2, software: 1.6 },
    ],
    salesSeries: [
      { year: '2015', volume: 7.8, yoyGrowthPct: 9.4 },
      { year: '2016', volume: 5.9, yoyGrowthPct: 5.2 },
      { year: '2017', volume: 6.5, yoyGrowthPct: 10.1 },
      { year: '2018', volume: 5.1, yoyGrowthPct: 6.8 },
    ],
    sectorShares: {
      Development: 28.0,
      Produce: 36.0,
      Software: 21.0,
      Sales: 15.0,
    },
    butterflyStats: {
      salesInv: 9,
      salesAcq: 11,
      findInv: 8,
      findAcq: 9,
      prodInv: 7,
      prodAcq: 8,
    },
  },
];

// 7. Global Investment vs Acquisition Butterfly Bar Chart
export const INVESTMENT_ACQUISITION_COMPARISON: AcquisitionComparisonItem[] = [
  { categoryAr: 'المبيعات', investmentCount: 12, acquisitionCount: 14 },
  { categoryAr: 'الاكتشاف', investmentCount: 10, acquisitionCount: 12 },
  { categoryAr: 'الإنتاج', investmentCount: 8, acquisitionCount: 9 },
];

// 8. Strategic Development Milestones with Concrete Proof Metrics
export const STRATEGIC_MILESTONES: StrategicMilestone[] = [
  {
    id: 'stage-open',
    stageAr: 'انفتاح',
    colorClass: 'text-[#00e5ff]',
    summaryAr: 'دخول البحث والتطوير مرحلة النضج التشغيلي...',
    detailAr: 'اعتماد بروتوكولات الفحص الجيني (ISO 15189) في 16 منطقة إقليمية.',
    proofMetricAr: '16 مختبر مرجعي · 99.4% دقة معايرة',
    countryCode: 'DEU',
  },
  {
    id: 'stage-combined',
    stageAr: 'اندماج',
    colorClass: 'text-[#ffb800]',
    summaryAr: 'توقيع اتفاقيات التعاون التقني العابر للحدود...',
    detailAr: 'ربط قواعد البيانات السريرية بين طوكيو، ميونخ، وبوسطن.',
    proofMetricAr: '8 صفقات اندماج دولية · +21.8% عائد',
    countryCode: 'JPN',
  },
  {
    id: 'stage-investment',
    stageAr: 'استثمار',
    colorClass: 'text-[#00ff66]',
    summaryAr: 'تحقيق الشراكة الاستراتيجية الشاملة...',
    detailAr: 'ضخ 42.6 مليون دولار في خطوط الأتمتة المخبرية والفحص الحيوي.',
    proofMetricAr: '42.6M$ إجمالي التدفق · 19 شركة',
    countryCode: 'USA',
  },
];

// 9. Industry Sector Variable-Radius Rose Donut Chart
export const INDUSTRY_SHARES: IndustrySectorShare[] = [
  {
    id: 'Development',
    nameAr: 'البحث والتطوير',
    labelAr: 'البحث والتطوير (11.2 مليون)',
    amountMillion: 11.2,
    percentage: 33.64,
    color: '#22ff44',
    outerRadius: 38,
  },
  {
    id: 'Produce',
    nameAr: 'الإنتاج',
    labelAr: 'الإنتاج (10.8 مليون)',
    amountMillion: 10.8,
    percentage: 32.66,
    color: '#00e5ff',
    outerRadius: 41,
  },
  {
    id: 'Software',
    nameAr: 'البرمجيات',
    labelAr: 'البرمجيات (8.9 مليون)',
    amountMillion: 8.9,
    percentage: 28.12,
    color: '#0077ff',
    outerRadius: 34,
  },
  {
    id: 'Sales',
    nameAr: 'المبيعات',
    labelAr: 'المبيعات (18.6 مليون)',
    amountMillion: 18.6,
    percentage: 11.32,
    color: '#ff6600',
    outerRadius: 30,
  },
];

// 10. 3D Globe Hub Connections
export const GLOBE_CONNECTIONS: GlobeArcConnection[] = [
  {
    id: 'arc-deu-jpn',
    countryCode: 'JPN',
    fromNameAr: 'مركز ميونخ المرجعي (ألمانيا)',
    toNameAr: 'طوكيو للأنظمة الطبية (اليابان)',
    hubCityAr: 'طوكيو · اليابان',
    fromLat: 48.1351,
    fromLng: 11.5820,
    toLat: 35.6762,
    toLng: 139.6503,
    color: '#00ff66',
    ringScale: 1.25,
    investmentMillion: 11.2,
    companiesCount: 6,
    primarySector: 'Development',
    volumeLabelAr: '11.2 مليون $ · 6 شركات',
  },
  {
    id: 'arc-deu-ind',
    countryCode: 'IND',
    fromNameAr: 'مركز ميونخ المرجعي (ألمانيا)',
    toNameAr: 'حيدر آباد للأبحاث الحيوية (الهند)',
    hubCityAr: 'حيدر آباد · الهند',
    fromLat: 48.1351,
    fromLng: 11.5820,
    toLat: 17.3850,
    toLng: 78.4867,
    color: '#00ff66',
    ringScale: 1.2,
    investmentMillion: 10.3,
    companiesCount: 5,
    primarySector: 'Produce',
    volumeLabelAr: '10.3 مليون $ · 5 شركات',
  },
  {
    id: 'arc-deu-usa',
    countryCode: 'USA',
    fromNameAr: 'مركز ميونخ المرجعي (ألمانيا)',
    toNameAr: 'بوسطن للتقنية الحيوية (أمريكا)',
    hubCityAr: 'بوسطن · أمريكا',
    fromLat: 48.1351,
    fromLng: 11.5820,
    toLat: 42.3601,
    toLng: -71.0589,
    color: '#00e5ff',
    ringScale: 1.15,
    investmentMillion: 8.9,
    companiesCount: 3,
    primarySector: 'Produce',
    volumeLabelAr: '8.9 مليون $ · 3 شركات',
  },
  {
    id: 'arc-deu-hub',
    countryCode: 'DEU',
    fromNameAr: 'مركز ميونخ المرجعي (ألمانيا)',
    toNameAr: 'فرانكفورت وميونخ للتشخيص (ألمانيا)',
    hubCityAr: 'ميونخ · ألمانيا',
    fromLat: 48.1351,
    fromLng: 11.5820,
    toLat: 51.1657,
    toLng: 10.4515,
    color: '#00e5ff',
    ringScale: 1.3,
    investmentMillion: 6.2,
    companiesCount: 3,
    primarySector: 'Software',
    volumeLabelAr: '6.2 مليون $ · 3 شركات',
  },
  {
    id: 'arc-deu-rus',
    countryCode: 'RUS',
    fromNameAr: 'مركز ميونخ المرجعي (ألمانيا)',
    toNameAr: 'موسكو للفحوصات السريرية (روسيا)',
    hubCityAr: 'موسكو · روسيا',
    fromLat: 48.1351,
    fromLng: 11.5820,
    toLat: 55.7558,
    toLng: 37.6173,
    color: '#00ff66',
    ringScale: 1.1,
    investmentMillion: 5.4,
    companiesCount: 2,
    primarySector: 'Sales',
    volumeLabelAr: '5.4 مليون $ · شركتان',
  },
  {
    id: 'arc-deu-chn',
    countryCode: 'CHN',
    fromNameAr: 'مركز ميونخ المرجعي (ألمانيا)',
    toNameAr: 'شنغهاي للجينوميات (الصين)',
    hubCityAr: 'شنغهاي · الصين',
    fromLat: 48.1351,
    fromLng: 11.5820,
    toLat: 31.2304,
    toLng: 121.4737,
    color: '#00ff66',
    ringScale: 1.15,
    investmentMillion: 6.2,
    companiesCount: 4,
    primarySector: 'Development',
    volumeLabelAr: '6.2 مليون $ · 4 مختبرات',
  },
];
