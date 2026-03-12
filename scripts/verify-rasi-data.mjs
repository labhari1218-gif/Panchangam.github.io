import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const contentDir = join(root, 'src/data/rasi-content');
const files = readdirSync(contentDir).filter((file) => file.endsWith('.json')).sort();
const requiredFields = [
  'slug',
  'yearTitle',
  'overview',
  'yearlyTheme',
  'opportunities',
  'caution',
  'studiesCareer',
  'familyRelationships',
  'healthWellbeing',
  'blessing',
  'annualMetrics',
  'planetaryInfluences',
  'monthlyHighlights',
  'sourceAudit',
];

if (files.length !== 12) {
  throw new Error(`Expected 12 content files, found ${files.length}`);
}

const slugs = new Set();
for (const file of files) {
  const payload = JSON.parse(readFileSync(join(contentDir, file), 'utf8'));
  for (const field of requiredFields) {
    if (!(field in payload)) {
      throw new Error(`${file} is missing required field "${field}"`);
    }
  }

  if (!Array.isArray(payload.monthlyHighlights) || payload.monthlyHighlights.length < 12) {
    throw new Error(`${file} must have at least 12 monthlyHighlights entries`);
  }

  if (!Array.isArray(payload.planetaryInfluences) || payload.planetaryInfluences.length === 0) {
    throw new Error(`${file} must include planetaryInfluences`);
  }

  const validEffects = new Set(['favorable', 'unfavorable', 'mixed']);
  for (const influence of payload.planetaryInfluences) {
    if (!influence.planet || !validEffects.has(influence.effect) || !influence.summary) {
      throw new Error(`${file} has an invalid planetary influence entry`);
    }
  }

  if (!payload.sourceAudit?.status) {
    throw new Error(`${file} must include sourceAudit.status`);
  }

  if (slugs.has(payload.slug)) {
    throw new Error(`Duplicate slug ${payload.slug}`);
  }
  slugs.add(payload.slug);
}

const sourceMapText = readFileSync(join(root, 'src/lib/sourceMap.ts'), 'utf8');
for (const slug of slugs) {
  if (!sourceMapText.includes(`slug: '${slug}'`)) {
    throw new Error(`Missing source map entry for ${slug}`);
  }
}

if (!/Read full detailed Panchangam/.test(sourceMapText)) {
  throw new Error('Expected source label not found in source map');
}

for (const match of sourceMapText.matchAll(/sourceUrl:\s*'([^']+)'/g)) {
  if (!match[1].startsWith('https://www.oursubhakaryam.com/')) {
    throw new Error(`Invalid source URL ${match[1]}`);
  }
}

const symbolDir = join(root, 'src/assets/rasi');
const symbolFiles = existsSync(symbolDir)
  ? readdirSync(symbolDir).filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
  : [];
if (symbolFiles.length !== 12) {
  throw new Error(`Expected 12 local rasi symbol assets, found ${symbolFiles.length}`);
}

const auditReportPath = join(root, 'reports/source-audit.json');
if (!existsSync(auditReportPath)) {
  throw new Error('Missing reports/source-audit.json');
}
const auditReport = JSON.parse(readFileSync(auditReportPath, 'utf8'));
for (const slug of slugs) {
  if (!auditReport[slug]?.audit?.status) {
    throw new Error(`Audit report is missing status for ${slug}`);
  }
}

const componentFiles = [
  join(root, 'src/components/AudioTrigger.tsx'),
  join(root, 'src/components/RasiHelperSheet.tsx'),
];

const audioTriggerText = readFileSync(componentFiles[0], 'utf8');
if (!audioTriggerText.includes('new Howl')) {
  throw new Error('AudioTrigger.tsx must contain Howler initialization');
}

const audioTriggerUsages = audioTriggerText.match(/new Howl/g) ?? [];
if (audioTriggerUsages.length !== 2) {
  throw new Error('AudioTrigger.tsx should initialize exactly two Howl instances');
}

for (const file of readdirSync(join(root, 'src/components'))) {
  if (file === 'AudioTrigger.tsx') {
    continue;
  }
  const text = readFileSync(join(root, 'src/components', file), 'utf8');
  if (text.includes('new Howl')) {
    throw new Error(`Unexpected Howler initialization outside AudioTrigger.tsx: ${file}`);
  }
}

const helperText = readFileSync(componentFiles[1], 'utf8');
if (!helperText.includes('noopener noreferrer')) {
  throw new Error('RasiHelperSheet.tsx must use rel="noopener noreferrer" for external links');
}

console.log(`Verified ${files.length} rasi content files, symbol assets, and source audit report.`);
