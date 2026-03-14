import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fetchSourceHtml, parseSourceHtml } from './lib/rasi-source-utils.mjs';

const root = process.cwd();
const contentDir = path.join(root, 'src/data/rasi-content');
const reportPath = path.join(root, 'reports/source-audit.json');
const report = JSON.parse(await readFile(reportPath, 'utf8'));
const files = (await readdir(contentDir)).filter((file) => file.endsWith('.json')).sort();

function normalizeMetric(value) {
  const normalized = String(value ?? '').trim().replace(/^0+/, '');
  return normalized === '' ? null : normalized;
}

function makeSignal(name, matched) {
  return { name, matched: Boolean(matched) };
}

for (const file of files) {
  const filePath = path.join(contentDir, file);
  const payload = JSON.parse(await readFile(filePath, 'utf8'));
  const sourceMeta = report[payload.slug];

  if (!sourceMeta?.sourceUrl) {
    throw new Error(`Missing source URL for ${payload.slug} in reports/source-audit.json`);
  }

  const sourceHtml = await fetchSourceHtml(sourceMeta.sourceUrl);
  const parsed = parseSourceHtml(sourceHtml, {
    slug: payload.slug,
    englishName: sourceMeta.englishName,
    sourceUrl: sourceMeta.sourceUrl,
  });

  const sourcePlanets = new Set(parsed.planetaryInfluences.map((item) => item.planet));
  const currentPlanets = new Set(
    (payload.planetaryInfluences ?? [])
      .map((item) => item.planet?.split('/')[0].trim())
      .filter(Boolean),
  );

  const signals = [
    makeSignal('English heading', /parabhava nama samvatsara/i.test(payload.yearTitle ?? '') && /parabhava/i.test(parsed.title ?? '')),
    makeSignal('Adayam metric', normalizeMetric(payload.annualMetrics?.adayam) === normalizeMetric(parsed.annualMetrics.adayam)),
    makeSignal('Vyayam metric', normalizeMetric(payload.annualMetrics?.vyayam) === normalizeMetric(parsed.annualMetrics.vyayam)),
    makeSignal(
      'Raja Poojyam metric',
      normalizeMetric(payload.annualMetrics?.rajaPoojyam) === normalizeMetric(parsed.annualMetrics.rajaPoojyam),
    ),
    makeSignal(
      'Avamanam metric',
      normalizeMetric(payload.annualMetrics?.avamanam) === normalizeMetric(parsed.annualMetrics.avamanam),
    ),
    makeSignal(
      'Sesha metric',
      normalizeMetric(payload.annualMetrics?.seshaNumber) === normalizeMetric(parsed.annualMetrics.seshaNumber),
    ),
    makeSignal('Guru annual section', currentPlanets.has('Guru') && sourcePlanets.has('Guru')),
    makeSignal('Shani annual section', currentPlanets.has('Shani') && sourcePlanets.has('Shani')),
    makeSignal('Rahu annual section', currentPlanets.has('Rahu') && sourcePlanets.has('Rahu')),
    makeSignal('Ketu annual section', currentPlanets.has('Ketu') && sourcePlanets.has('Ketu')),
    makeSignal(
      'First month heading',
      (payload.monthlyHighlights?.[0]?.monthLabel ?? '').trim() !== '' &&
        payload.monthlyHighlights?.[0]?.monthLabel === parsed.monthHighlights?.[0]?.monthLabel,
    ),
  ];

  const matchedSignals = signals.filter((signal) => signal.matched).map((signal) => signal.name);
  const mismatches = signals.filter((signal) => !signal.matched).map((signal) => signal.name);
  const ratio = signals.length === 0 ? 0 : matchedSignals.length / signals.length;
  const status = ratio >= 0.9 ? 'match' : ratio >= 0.55 ? 'partial_match' : 'manual_review';

  const nextAudit = {
    status,
    sourceImage: parsed.sourceImage ?? sourceMeta.sourceImage,
    matchedSignals,
    mismatches,
    notes: [
      'Compared current JSON content against the live source HTML.',
      'Metric values are normalized before comparison; status is based on annual metrics, annual planet markers, and the first month heading.',
    ],
  };

  payload.sourceAudit = nextAudit;
  sourceMeta.audit = nextAudit;

  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Refreshed source audit metadata for ${files.length} rasi pages.`);
