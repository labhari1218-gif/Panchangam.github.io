import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  RASI_SOURCE_META,
  auditSourceAgainstPdf,
  discoverPdfPath,
  fetchSourceHtml,
  parseSourceHtml,
} from './lib/rasi-source-utils.mjs';

const reportDir = path.join(process.cwd(), 'reports');
await mkdir(reportDir, { recursive: true });

const report = {};

for (const meta of RASI_SOURCE_META) {
  const sourceHtml = await fetchSourceHtml(meta.sourceUrl);
  const parsed = parseSourceHtml(sourceHtml, meta);
  const pdfPath = discoverPdfPath(meta.slug);
  report[meta.slug] = {
    englishName: meta.englishName,
    sourceUrl: meta.sourceUrl,
    localPdfAsset: pdfPath ? path.relative(process.cwd(), pdfPath).replaceAll('\\', '/') : null,
    sourceImage: parsed.sourceImage ?? null,
    audit: await auditSourceAgainstPdf(meta, sourceHtml, pdfPath),
  };
}

const reportPath = path.join(reportDir, 'source-audit.json');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wrote source audit report to ${reportPath}`);
