import { discoverPdfMap } from '../lib/discoverPdfs';
import { getRasiMeta, RASI_SOURCE_MAP, SOURCE_LABEL } from '../lib/sourceMap';

const symbolAssets = import.meta.glob<{ default: { src: string } }>('../assets/rasi/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

export type MonthlyHighlight = {
  monthLabel: string;
  summary: string;
  favorableDates?: string[];
  cautionDates?: string[];
};

export type AnnualMetrics = {
  adayam?: string;
  vyayam?: string;
  rajaPoojyam?: string;
  avamanam?: string;
  seshaNumber?: string;
};

export type PlanetaryInfluence = {
  planet: string;
  effect: 'favorable' | 'unfavorable' | 'mixed';
  effectLabel?: string;
  summary: string;
  remedyNote?: string;
};

export type SourceAuditStatus = 'match' | 'partial_match' | 'manual_review';

export type SourceAudit = {
  status: SourceAuditStatus;
  sourceImage?: string;
  matchedSignals: string[];
  mismatches: string[];
  notes: string[];
};

export type RasiContent = {
  id: number;
  slug: string;
  teluguName: string;
  englishName: string;
  symbolName: string;
  dateRangeLabel?: string;
  yearTitle: string;
  overview: string;
  yearlyTheme: string;
  opportunities: string;
  caution: string;
  studiesCareer: string;
  familyRelationships: string;
  healthWellbeing: string;
  blessing: string;
  sourceNote?: string;
  sourceLabel: string;
  sourceUrl: string;
  localPdfAsset?: string;
  extractedNotes?: string[];
  annualMetrics?: AnnualMetrics;
  planetaryInfluences: PlanetaryInfluence[];
  monthlyHighlights: MonthlyHighlight[];
  sourceAudit?: SourceAudit;
};

export type RasiEntry = RasiContent & {
  symbolAsset?: string;
};

type RasiModule = {
  default: Omit<RasiContent, 'sourceLabel' | 'sourceUrl' | 'localPdfAsset' | 'id'>;
};

const contentModules = import.meta.glob('./rasi-content/*.json', {
  eager: true,
}) as Record<string, RasiModule>;

const pdfMap = discoverPdfMap();

export const allRasiContent: RasiEntry[] = RASI_SOURCE_MAP.map((meta) => {
  const moduleKey = `./rasi-content/${meta.slug}.json`;
  const content = contentModules[moduleKey]?.default;
  if (!content) {
    throw new Error(`Missing content file for ${meta.slug}`);
  }

  const discoveredPdf = pdfMap[meta.slug];
  return {
    ...content,
    id: meta.id,
    slug: meta.slug,
    teluguName: meta.teluguName,
    englishName: meta.englishName,
    symbolName: meta.symbolName,
    dateRangeLabel: meta.dateRangeLabel,
    symbolAsset: symbolAssets[`../assets/rasi/${meta.symbolAsset}`]?.default.src,
    sourceLabel: SOURCE_LABEL,
    sourceUrl: meta.sourceUrl,
    localPdfAsset: discoveredPdf ?? undefined,
    extractedNotes: discoveredPdf
      ? [
          `Archived source PDF auto-detected at ${discoveredPdf}.`,
          'Direct text extraction from the local archive is limited because the PDF is a screen capture.',
        ]
      : ['No local PDF archive was auto-detected for this sign during build time.'],
  };
});

export function getRasiBySlug(slug: string) {
  return allRasiContent.find((item) => item.slug === slug);
}

export function getStaticRasiPaths() {
  return RASI_SOURCE_MAP.map(({ slug }) => ({
    params: { slug },
    props: {
      rasi: getRasiMeta(slug),
    },
  }));
}
