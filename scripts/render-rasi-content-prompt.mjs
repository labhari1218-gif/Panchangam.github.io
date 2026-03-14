import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { RASI_SOURCE_META } from './lib/rasi-source-utils.mjs';

const rootDir = process.cwd();
const promptTemplatePath = path.join(rootDir, 'prompts', 'rasi-content-master-prompt.md');
const contentDir = path.join(rootDir, 'src', 'data', 'rasi-content');

const RASI_DETAILS = {
  mesha: {
    rasiName: 'Mesha',
    dateRange: 'Mar 21 - Apr 19',
    nakshatras: 'Ashwini (all 4 padas), Bharani (all 4 padas), Krithika / Krittika (1st pada)',
  },
  vrushabha: {
    rasiName: 'Vrushabha',
    dateRange: 'Apr 20 - May 20',
    nakshatras: 'Krithika / Krittika (2nd, 3rd, 4th padas), Rohini (all 4 padas), Mrigasira (1st, 2nd padas)',
  },
  midhuna: {
    rasiName: 'Midhuna',
    dateRange: 'May 21 - Jun 20',
    nakshatras: 'Mrigasira (3rd, 4th padas), Arudra (all 4 padas), Punarvasu (1st, 2nd, 3rd padas)',
  },
  karkataka: {
    rasiName: 'Karkataka',
    dateRange: 'Jun 21 - Jul 22',
    nakshatras: 'Punarvasu (4th pada), Pushyami / Pushya (all 4 padas), Ashlesha (all 4 padas)',
  },
  simha: {
    rasiName: 'Simha',
    dateRange: 'Jul 23 - Aug 22',
    nakshatras: 'Magha (all 4 padas), Pubba / Purva Phalguni (all 4 padas), Uttara / Uttara Phalguni (1st pada)',
  },
  kanya: {
    rasiName: 'Kanya',
    dateRange: 'Aug 23 - Sep 22',
    nakshatras: 'Uttara / Uttara Phalguni (2nd, 3rd, 4th padas), Hasta (all 4 padas), Chitta (1st, 2nd padas)',
  },
  tula: {
    rasiName: 'Tula',
    dateRange: 'Sep 23 - Oct 22',
    nakshatras: 'Chitta (3rd, 4th padas), Swati (all 4 padas), Visakha / Vishakha (1st, 2nd, 3rd padas)',
  },
  vruchika: {
    rasiName: 'Vruchika',
    dateRange: 'Oct 23 - Nov 21',
    nakshatras: 'Visakha / Vishakha (4th pada), Anuradha (all 4 padas), Jyeshta (all 4 padas)',
  },
  dhanur: {
    rasiName: 'Dhanur',
    dateRange: 'Nov 22 - Dec 21',
    nakshatras: 'Moola (all 4 padas), Purvashada (all 4 padas), Uttarashada (1st pada)',
  },
  makara: {
    rasiName: 'Makara',
    dateRange: 'Dec 22 - Jan 19',
    nakshatras: 'Uttarashada (2nd, 3rd, 4th padas), Shravana (all 4 padas), Dhanishta (1st, 2nd padas)',
  },
  kumbha: {
    rasiName: 'Kumbha',
    dateRange: 'Jan 20 - Feb 18',
    nakshatras: 'Dhanishta (3rd, 4th padas), Shatabhisha (all 4 padas), Purvabhadra / Purva Bhadrapada (1st, 2nd, 3rd padas)',
  },
  meena: {
    rasiName: 'Meena',
    dateRange: 'Feb 19 - Mar 20',
    nakshatras: 'Purvabhadra / Purva Bhadrapada (4th pada), Uttarabhadra / Uttara Bhadrapada (all 4 padas), Revati (all 4 padas)',
  },
};

function usage() {
  console.error('Usage: node scripts/render-rasi-content-prompt.mjs <slug>');
  console.error(`Available slugs: ${RASI_SOURCE_META.map((item) => item.slug).join(', ')}`);
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    usage();
    process.exitCode = 1;
    return;
  }

  const meta = RASI_SOURCE_META.find((item) => item.slug === slug);
  const details = RASI_DETAILS[slug];
  if (!meta || !details) {
    usage();
    process.exitCode = 1;
    return;
  }

  const [template, contentRaw] = await Promise.all([
    readFile(promptTemplatePath, 'utf8'),
    readFile(path.join(contentDir, `${slug}.json`), 'utf8'),
  ]);
  const content = JSON.parse(contentRaw);
  const metrics = content.annualMetrics ?? {};

  const prompt = template
    .replace('[RASI_NAME]', details.rasiName)
    .replace('[ENGLISH_NAME]', meta.englishName)
    .replace('[YEAR_NAME_AND_RANGE]', content.yearTitle ?? 'Sri Parabhava Nama Samvatsara Ugadi 2026-2027')
    .replace('[NAKSHATRA_DETAILS]', details.nakshatras)
    .replace('[DATE_RANGE]', details.dateRange)
    .replace('[SOURCE_PAGE]', meta.sourceUrl)
    .replace('[ADAYAM_VALUE]', metrics.adayam ?? '')
    .replace('[VYAYAM_VALUE]', metrics.vyayam ?? '')
    .replace('[RAJA_POOJYAM_VALUE]', metrics.rajaPoojyam ?? '')
    .replace('[AVAMANAM_VALUE]', metrics.avamanam ?? '')
    .replace('[SHESHA_VALUE]', metrics.seshaNumber ?? '');

  process.stdout.write(prompt);
}

await main();
