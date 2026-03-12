import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  RASI_SOURCE_META,
  auditSourceAgainstPdf,
  discoverPdfPath,
  downloadSourceImage,
  extractPdfPageOneOcr,
  fetchSourceHtml,
  parseSourceHtml,
} from './lib/rasi-source-utils.mjs';

const outputDir = path.join(process.cwd(), 'src/data/rasi-content');

await mkdir(outputDir, { recursive: true });

for (const meta of RASI_SOURCE_META) {
  console.log(`Generating ${meta.slug}...`);
  const sourceHtml = await fetchSourceHtml(meta.sourceUrl);
  const pdfPath = discoverPdfPath(meta.slug);
  const pageOneOcr = pdfPath ? await extractPdfPageOneOcr(pdfPath, meta.slug) : '';
  const parsed = parseSourceHtml(sourceHtml, meta);
  await downloadSourceImage(parsed.sourceImage, meta.slug);
  const metricFallbacks = {
    adayam: pageOneOcr.match(/Adayam \(Income\):\s*([0-9]+)/i)?.[1],
    vyayam: pageOneOcr.match(/Vyayam \(Expenditure\):\s*([0-9]+)/i)?.[1],
    rajaPoojyam: pageOneOcr.match(/Raja Poojyam \(Honor\/Respect\):\s*([0-9]+)/i)?.[1],
    avamanam: pageOneOcr.match(/Avamanam \(Dishonor\/Insult\):\s*([0-9]+)/i)?.[1],
    seshaNumber:
      pageOneOcr.match(/Sesha.*?['"]?([0-9]+)['"]?/i)?.[1] ??
      pageOneOcr.match(/remainder .*?['"]?([0-9]+)['"]?/i)?.[1],
  };
  const annualMetrics = {
    adayam: parsed.annualMetrics.adayam ?? metricFallbacks.adayam,
    vyayam: parsed.annualMetrics.vyayam ?? metricFallbacks.vyayam,
    rajaPoojyam: parsed.annualMetrics.rajaPoojyam ?? metricFallbacks.rajaPoojyam,
    avamanam: parsed.annualMetrics.avamanam ?? metricFallbacks.avamanam,
    seshaNumber: parsed.annualMetrics.seshaNumber ?? metricFallbacks.seshaNumber,
  };
  const sourceAudit = await auditSourceAgainstPdf(meta, sourceHtml, pdfPath);

  const payload = {
    slug: meta.slug,
    yearTitle: 'Sri Parabhava Nama Samvatsara Ugadi 2026-2027',
    overview: parsed.sections.overview,
    yearlyTheme: parsed.sections.yearlyTheme,
    opportunities: parsed.sections.opportunities,
    caution: parsed.sections.caution,
    studiesCareer: parsed.sections.studiesCareer,
    familyRelationships: parsed.sections.familyRelationships,
    healthWellbeing: parsed.sections.healthWellbeing,
    blessing: parsed.sections.blessing,
    annualMetrics,
    planetaryInfluences: parsed.planetaryInfluences,
    monthlyHighlights: parsed.monthHighlights,
    sourceAudit,
  };

  await writeFile(path.join(outputDir, `${meta.slug}.json`), `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(`Generated ${RASI_SOURCE_META.length} source-grounded rasi content files in ${outputDir}`);
