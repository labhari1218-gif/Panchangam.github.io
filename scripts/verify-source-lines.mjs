import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  RASI_SOURCE_META,
  discoverPdfPath,
  extractPdfPageOneOcr,
  fetchSourceHtml,
  parseSourceHtml,
  verifySentenceAgainstSource,
} from './lib/rasi-source-utils.mjs';

function cleanText(value) {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => cleanText(sentence))
    .filter(Boolean);
}

function metricValueStatus(expected, actual, fallback) {
  const normalize = (value) => {
    const normalized = String(value ?? '').trim().replace(/^0+/, '');
    return normalized === '' ? null : normalized;
  };

  if (!expected) {
    return { status: 'missing_local_value', expected, actual, fallback };
  }
  if (actual && normalize(expected) === normalize(actual)) {
    return { status: 'direct_match', expected, actual };
  }
  if (fallback && normalize(expected) === normalize(fallback)) {
    return { status: 'pdf_match', expected, fallback };
  }
  return { status: 'unmatched', expected, actual, fallback };
}

function summarizeField(lines) {
  if (lines.length === 0) {
    return 'unmatched';
  }
  if (lines.every((line) => line.status === 'direct_match')) {
    return 'direct_match';
  }
  if (lines.every((line) => line.status === 'direct_match' || line.status === 'close_match')) {
    return 'close_match';
  }
  return 'unmatched';
}

function fieldSourceTexts(parsed, field) {
  const directSection = parsed.sections?.[field];
  if (directSection) {
    return [directSection];
  }

  switch (field) {
    case 'overview':
    case 'yearlyTheme':
    case 'blessing':
      return [parsed.sections?.yearlyTheme, parsed.sections?.yearlySignals].filter(Boolean);
    case 'opportunities':
      return [parsed.sections?.opportunities, parsed.sourceLines?.planetParagraphs?.Guru, parsed.sourceLines?.planetParagraphs?.Rahu].filter(Boolean);
    case 'caution':
      return [parsed.sections?.caution, parsed.sourceLines?.planetParagraphs?.Shani, parsed.sourceLines?.planetParagraphs?.Ketu].filter(Boolean);
    case 'studiesCareer':
      return [parsed.sections?.studiesCareer, parsed.sourceLines?.planetParagraphs?.Guru, parsed.sourceLines?.planetParagraphs?.Shani].filter(Boolean);
    case 'familyRelationships':
      return [parsed.sections?.familyRelationships, parsed.sourceLines?.planetParagraphs?.Guru, parsed.sourceLines?.planetParagraphs?.Ketu].filter(Boolean);
    case 'healthWellbeing':
      return [parsed.sections?.healthWellbeing, parsed.sourceLines?.planetParagraphs?.Shani, parsed.sourceLines?.planetParagraphs?.Ketu].filter(Boolean);
    default:
      return parsed.sourceLines?.englishParagraphs ?? [];
  }
}

const reportDir = path.join(process.cwd(), 'reports');
const contentDir = path.join(process.cwd(), 'src/data/rasi-content');

await mkdir(reportDir, { recursive: true });

const report = {};

for (const meta of RASI_SOURCE_META) {
  console.log(`Verifying ${meta.slug}...`);
  const sourceHtml = await fetchSourceHtml(meta.sourceUrl);
  const parsed = parseSourceHtml(sourceHtml, meta);
  const payload = JSON.parse(await readFile(path.join(contentDir, `${meta.slug}.json`), 'utf8'));
  const pdfPath = discoverPdfPath(meta.slug);
  const pdfOcr = pdfPath ? await extractPdfPageOneOcr(pdfPath, meta.slug) : '';
  const sourceTexts = parsed.sourceLines.englishParagraphs;
  const pdfMetricFallbacks = {
    adayam: pdfOcr.match(/Adayam \(Income\):\s*([0-9]+)/i)?.[1] ?? pdfOcr.match(/Income\s*[-:]\s*([0-9]+)/i)?.[1],
    vyayam:
      pdfOcr.match(/Vyayam \(Expenditure\):\s*([0-9]+)/i)?.[1] ??
      pdfOcr.match(/Expenditure\s*[-:]\s*([0-9]+)/i)?.[1],
    rajaPoojyam:
      pdfOcr.match(/Raja Poojyam \(Honor\/Respect\):\s*([0-9]+)/i)?.[1] ??
      pdfOcr.match(/Honor\/Social Status\s*[-:]\s*([0-9]+)/i)?.[1] ??
      pdfOcr.match(/Social Honor .*?[:\-]\s*([0-9]+)/i)?.[1],
    avamanam:
      pdfOcr.match(/Avamanam \(Dishonor\/Insult\):\s*([0-9]+)/i)?.[1] ??
      pdfOcr.match(/Dishonor\/Insult\s*[-:]\s*([0-9]+)/i)?.[1] ??
      pdfOcr.match(/Dishonor\/Challenges .*?[:\-]\s*([0-9]+)/i)?.[1],
    seshaNumber:
      pdfOcr.match(/remainder number .*?['"]?([0-9]+)['"]?/i)?.[1] ??
      pdfOcr.match(/Sesha.*?['"]?([0-9]+)['"]?/i)?.[1],
  };

  const fieldResults = {};
  for (const field of [
    'overview',
    'yearlyTheme',
    'opportunities',
    'caution',
    'studiesCareer',
    'familyRelationships',
    'healthWellbeing',
    'blessing',
  ]) {
    const comparisonTexts = fieldSourceTexts(parsed, field);
    const lines = splitSentences(payload[field]).map((sentence) => {
      const verified = verifySentenceAgainstSource(sentence, comparisonTexts);
      return {
        sentence,
        status: verified.status,
        sourcePreview: verified.source ? verified.source.slice(0, 220) : '',
      };
    });
    fieldResults[field] = {
      status: summarizeField(lines),
      lines,
    };
  }

  const metricResults = {
    income: metricValueStatus(payload.annualMetrics?.adayam, parsed.annualMetrics.adayam, pdfMetricFallbacks.adayam),
    expenditure: metricValueStatus(
      payload.annualMetrics?.vyayam,
      parsed.annualMetrics.vyayam,
      pdfMetricFallbacks.vyayam,
    ),
    honor: metricValueStatus(
      payload.annualMetrics?.rajaPoojyam,
      parsed.annualMetrics.rajaPoojyam,
      pdfMetricFallbacks.rajaPoojyam,
    ),
    dishonor: metricValueStatus(
      payload.annualMetrics?.avamanam,
      parsed.annualMetrics.avamanam,
      pdfMetricFallbacks.avamanam,
    ),
    remainder: metricValueStatus(
      payload.annualMetrics?.seshaNumber,
      parsed.annualMetrics.seshaNumber,
      pdfMetricFallbacks.seshaNumber,
    ),
  };

  const monthlyResults = payload.monthlyHighlights.map((item) => {
    const sourceMonth = parsed.monthHighlights.find((month) => month.monthLabel === item.monthLabel);
    const verification = verifySentenceAgainstSource(item.summary, [sourceMonth?.summary ?? '', parsed.sections?.yearlyTheme ?? '']);
    return {
      monthLabel: item.monthLabel,
      status: verification.status,
      sourcePreview: verification.source ? verification.source.slice(0, 220) : '',
    };
  });

  const unmatchedFieldCount = Object.values(fieldResults).filter((field) => field.status === 'unmatched').length;
  const unmatchedMonthCount = monthlyResults.filter((month) => month.status === 'unmatched').length;
  const unmatchedMetricCount = Object.values(metricResults).filter((metric) => metric.status === 'unmatched').length;

  report[meta.slug] = {
    englishName: meta.englishName,
    sourceUrl: meta.sourceUrl,
    contentStatus:
      unmatchedFieldCount === 0 && unmatchedMonthCount === 0 && unmatchedMetricCount === 0
        ? 'verified'
        : (payload.sourceAudit?.status === 'match' && unmatchedMetricCount === 0) || (unmatchedFieldCount <= 2 && unmatchedMonthCount <= 2)
          ? 'mostly_verified'
          : 'needs_manual_review',
    metrics: metricResults,
    fields: fieldResults,
    monthlyHighlights: monthlyResults,
    sourceAudit: payload.sourceAudit,
  };
}

const reportPath = path.join(reportDir, 'line-verification.json');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wrote line verification report to ${reportPath}`);
