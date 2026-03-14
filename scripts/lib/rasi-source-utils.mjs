import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { load } from 'cheerio';

export const RASI_SOURCE_META = [
  {
    id: 1,
    slug: 'mesha',
    teluguName: 'మేష',
    englishName: 'Aries',
    symbolName: 'Ram',
    dateRangeLabel: 'Mar 21 - Apr 19',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Mesha_raasi_free_telugu_raasi_phalalu_Aries_astroloy.html',
  },
  {
    id: 2,
    slug: 'vrushabha',
    teluguName: 'వృషభ',
    englishName: 'Taurus',
    symbolName: 'Bull',
    dateRangeLabel: 'Apr 20 - May 20',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Vrushabha_raasi_free_telugu_rasi_phalalu_Taurus_horoscope.html',
  },
  {
    id: 3,
    slug: 'midhuna',
    teluguName: 'మిధున',
    englishName: 'Gemini',
    symbolName: 'Twins',
    dateRangeLabel: 'May 21 - Jun 20',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Midhuna_raasi_free_telugu_rasi_phalalu_Gemini_horoscope.html',
  },
  {
    id: 4,
    slug: 'karkataka',
    teluguName: 'కర్కాటక',
    englishName: 'Cancer',
    symbolName: 'Crab',
    dateRangeLabel: 'Jun 21 - Jul 22',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Karkataka_raasi_free_telugu_rasi_phalalu_Cancer_horoscope.html',
  },
  {
    id: 5,
    slug: 'simha',
    teluguName: 'సింహ',
    englishName: 'Leo',
    symbolName: 'Lion',
    dateRangeLabel: 'Jul 23 - Aug 22',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Simha_raasi_free_telugu_rasi_phalalu_Leo_horoscope.html',
  },
  {
    id: 6,
    slug: 'kanya',
    teluguName: 'కన్య',
    englishName: 'Virgo',
    symbolName: 'Maiden',
    dateRangeLabel: 'Aug 23 - Sep 22',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Kanya_rasi_free_telugu_raasi_phalalu_Virgo_horoscope.html',
  },
  {
    id: 7,
    slug: 'tula',
    teluguName: 'తుల',
    englishName: 'Libra',
    symbolName: 'Balance',
    dateRangeLabel: 'Sep 23 - Oct 22',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_naama_Tula_raasi_free_telugu_raasi_phalalu_Libra_astroloy_horoscope.html',
  },
  {
    id: 8,
    slug: 'vruchika',
    teluguName: 'వృశ్చిక',
    englishName: 'Scorpio',
    symbolName: 'Scorpion',
    dateRangeLabel: 'Oct 23 - Nov 21',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Vruchika_raasi_free_telugu_raasi_phalalu_Scorpio_astroloy_horoscope.html',
  },
  {
    id: 9,
    slug: 'dhanur',
    teluguName: 'ధనుస్సు',
    englishName: 'Sagittarius',
    symbolName: 'Archer',
    dateRangeLabel: 'Nov 22 - Dec 21',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Dhanur_raasi_free_telugu_rasi_phalalu_Sagittarius_astroloy_horoscope.html',
  },
  {
    id: 10,
    slug: 'makara',
    teluguName: 'మకర',
    englishName: 'Capricorn',
    symbolName: 'Sea-Goat',
    dateRangeLabel: 'Dec 22 - Jan 19',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_naama_Makara_raasi_free_telugu_rasi_phalalu_Capricorn_horoscope.html',
  },
  {
    id: 11,
    slug: 'kumbha',
    teluguName: 'కుంభ',
    englishName: 'Aquarius',
    symbolName: 'Water Bearer',
    dateRangeLabel: 'Jan 20 - Feb 18',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_naama_Kumbha_raasi_free_telugu_raasi_phalalu_Aquarius_astroloy_horoscope.html',
  },
  {
    id: 12,
    slug: 'meena',
    teluguName: 'మీన',
    englishName: 'Pisces',
    symbolName: 'Fish',
    dateRangeLabel: 'Feb 19 - Mar 20',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_naama_Meena_raasi_free_telugu_raasi_phalalu_Pisces_astroloy_horoscope.html',
  },
];

const REQUEST_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
  'accept-language': 'en-US,en;q=0.9',
  referer: 'https://www.oursubhakaryam.com/',
};

const MONTH_HEADING_RE =
  /\b(March|April|May|June|July|August|September|October|November|December|January|February)\s+(2026|2027)\b[^:]*Predictions:/i;

function cleanText(value) {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function isUsefulEnglish(value) {
  const text = cleanText(value);
  if (!text || !/[A-Za-z]/.test(text)) {
    return false;
  }
  const letters = text.match(/[A-Za-z]/g)?.length ?? 0;
  return letters >= 18;
}

function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => cleanText(sentence))
    .filter(Boolean);
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function findParagraph(paragraphs, predicate) {
  return paragraphs.find((paragraph) => predicate(paragraph)) ?? '';
}

function sentenceTokenSet(text) {
  return new Set(
    cleanText(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function isBoundaryParagraph(paragraph) {
  return (
    MONTH_HEADING_RE.test(paragraph) ||
    /we offer your complete horoscope/i.test(paragraph) ||
    /stay updated with our daily telugu panchangam/i.test(paragraph) ||
    /^overall[, ]|^in summary/i.test(paragraph)
  );
}

function extractMetric(bodyText, patterns) {
  for (const pattern of patterns) {
    const match = bodyText.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
}

function extractGroupedSection(paragraphs, startMatcher, stopMatchers) {
  const startIndex = paragraphs.findIndex((paragraph) => startMatcher(paragraph));
  if (startIndex === -1) {
    return '';
  }

  const collected = [];
  for (let index = startIndex; index < paragraphs.length; index += 1) {
    const paragraph = paragraphs[index];
    if (index !== startIndex && (isBoundaryParagraph(paragraph) || stopMatchers.some((matcher) => matcher(paragraph)))) {
      break;
    }
    if (isUsefulEnglish(paragraph)) {
      collected.push(paragraph);
    }
  }

  return cleanText(collected.join(' '));
}

function extractDatePhrases(text, kind) {
  const cleaned = cleanText(text);
  const phrases = [];

  if (kind === 'caution') {
    const cautionPatterns = [
      /(?:Please note that the|the)\s+([0-9a-z,\sandthrdn]+)\s+are\s+(?:not favorable|unfavorable)\s+dates/i,
      /on the\s+([0-9a-z,\sandthrdn]+),\s+as there is a possibility/i,
      /specifically on the\s+([0-9a-z,\sandthrdn]+)\s+are not favorable/i,
      /avoid .*? on the\s+([0-9a-z,\sandthrdn]+),\s+as these dates are not auspicious/i,
      /the\s+([0-9a-z,\sandthrdn]+)\s+are considered inauspicious/i,
    ];

    for (const pattern of cautionPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        phrases.push(cleanText(match[1]));
      }
    }
  }

  if (kind === 'favorable') {
    const favorablePatterns = [
      /between the\s+([0-9a-z,\sandthrdn]+)\s*,?\s+opportunities/i,
      /after\s+([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}(?:st|nd|rd|th)?)/g,
      /specifically after the\s+([0-9a-z,\sandthrdn]+)/i,
      /between the\s+([0-9a-z,\sandthrdn]+)\s+is exceptionally favorable/i,
    ];

    for (const pattern of favorablePatterns) {
      if (pattern.global) {
        for (const match of cleaned.matchAll(pattern)) {
          phrases.push(cleanText(match[1]));
        }
      } else {
        const match = cleaned.match(pattern);
        if (match) {
          phrases.push(cleanText(match[1]));
        }
      }
    }
  }

  return uniq(phrases);
}

function pickSentences(paragraphs, keywords, maxCount = 2) {
  const keywordSet = keywords.map((keyword) => keyword.toLowerCase());
  const matches = [];

  for (const paragraph of paragraphs) {
    for (const sentence of splitSentences(paragraph)) {
      const lowered = sentence.toLowerCase();
      if (keywordSet.some((keyword) => lowered.includes(keyword))) {
        matches.push(sentence);
      }
    }
  }

  return uniq(matches).slice(0, maxCount).join(' ');
}

function detectPlanetEffect(text) {
  const cleaned = cleanText(text);
  const lowered = cleaned.toLowerCase();
  if (!lowered) {
    return 'mixed';
  }

  const lead = splitSentences(cleaned).slice(0, 2).join(' ').toLowerCase();
  if (/mixed results|mixed outcome|mixed effects/.test(lead)) {
    return 'mixed';
  }
  if (/unfavorable results|adverse effects|challenging phase|severe adverse results|negative again/.test(lead)) {
    return 'unfavorable';
  }
  if (
    /highly favorable|favorable results|favorable outcome|generally bring favorable|largely favorable|largely positive|prosperity|golden period/.test(
      lead,
    )
  ) {
    return /however|until .*? unfavorable|from .*? unfavorable|brief challenging phase/.test(lead)
      ? 'mixed'
      : 'favorable';
  }

  const positive = /(highly favorable|favorable results|favorable outcome|golden period|positive shift|largely positive|largely favorable|prosper|prosperity|beneficial|good period|relief returns|success)/.test(
    lowered,
  );
  const negative =
    /(unfavorable|adverse|negative again|negative results|challenging phase|mixed results|mixed outcome|setbacks|misfortune|distress|loss|stagnation|severe)/.test(
      lowered,
    );

  if (positive && negative) {
    return 'mixed';
  }
  if (positive) {
    return 'favorable';
  }
  if (negative) {
    return 'unfavorable';
  }
  return 'mixed';
}

function buildOverview(meta, metrics, positivePlanets, cautionPlanets, mixedPlanets, yearlyTheme) {
  const details = [];
  if (metrics.adayam && metrics.vyayam) {
    details.push(
      `${meta.englishName} enters the Sri Parabhava year with Income ${metrics.adayam} and Expenditure ${metrics.vyayam}.`,
    );
  }
  if (metrics.rajaPoojyam && metrics.avamanam) {
    details.push(`Honor registers at ${metrics.rajaPoojyam}, while Dishonor registers at ${metrics.avamanam}.`);
  }
  if (positivePlanets.length > 0) {
    details.push(`The strongest supportive currents come through ${positivePlanets.join(' and ')}.`);
  }
  if (cautionPlanets.length > 0) {
    details.push(`Pressure points are tied to ${cautionPlanets.join(' and ')} and need measured handling.`);
  }
  if (mixedPlanets.length > 0) {
    details.push(`Mixed stretches are shaped by ${mixedPlanets.join(' and ')} and need timing awareness.`);
  }
  if (details.length === 0 && yearlyTheme) {
    details.push(splitSentences(yearlyTheme)[0] ?? '');
  }
  return details.join(' ');
}

function buildBlessing(meta, positivePlanets, cautionPlanets, overallSummary) {
  if (overallSummary) {
    return splitSentences(overallSummary).slice(0, 2).join(' ');
  }
  const positive = positivePlanets.length > 0 ? positivePlanets.join(' and ') : 'your stronger periods';
  const caution = cautionPlanets.length > 0 ? cautionPlanets.join(' and ') : 'your sensitive phases';
  return `Use ${positive} well, move carefully through ${caution}, and treat this year as a disciplined reading rather than a passive forecast.`;
}

export async function fetchSourceHtml(url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(url, {
      headers: REQUEST_HEADERS,
    });
    if (response.ok) {
      return await response.text();
    }
    if (attempt === 3) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 900));
  }
  throw new Error(`Failed to fetch ${url}`);
}

export function parseSourceHtml(html, meta) {
  const $ = load(html);
  const paragraphs = $('p')
    .toArray()
    .map((element) => cleanText($(element).text()))
    .filter(Boolean);

  const englishParagraphs = paragraphs.filter(isUsefulEnglish);
  const bodyText = cleanText($('body').text());
  const title =
    cleanText(
      $('h1')
        .toArray()
        .map((element) => cleanText($(element).text()))
        .find((value) => value.includes('Sree Parabhava Nama Samvatsara')) ?? '',
    ) || cleanText($('title').text());

  const sourceImage =
    $('img')
      .toArray()
      .map((element) => $(element).attr('src'))
      .find((src) => src && src.startsWith('images/') && !src.includes('site_banner')) ?? undefined;

  const annualMetrics = {
    adayam: extractMetric(bodyText, [
      /Adayam \(Income\):\s*([0-9]+)/i,
      /Income\s*[-:]\s*([0-9]+)/i,
    ]),
    vyayam: extractMetric(bodyText, [
      /Vyayam \(Expenditure\):\s*([0-9]+)/i,
      /Expenditure\s*[-:]\s*([0-9]+)/i,
    ]),
    rajaPoojyam: extractMetric(bodyText, [
      /Raja Poojyam \(Honor\/Respect\):\s*([0-9]+)/i,
      /Social Honou?r \(Raja Poojyam\):\s*([0-9]+)/i,
      /Honor\/Social Status\s*[-:]\s*([0-9]+)/i,
      /Social Honor \(Raja Poojyam\):\s*([0-9]+)/i,
    ]),
    avamanam: extractMetric(bodyText, [
      /Avamanam \(Dishonor\/Insult\):\s*([0-9]+)/i,
      /Dishonor\/Insult\s*[-:]\s*([0-9]+)/i,
      /Dishonor\/Challenges \(Avamanam\):\s*([0-9]+)/i,
    ]),
    seshaNumber:
      extractMetric(bodyText, [
        /Sesha\) number for .*? is ['"]?([0-9]+)['"]?/i,
        /remainder number .*? is ['"]?([0-9]+)['"]?/i,
        /remainder .*? is ['"]?([0-9]+)['"]?/i,
      ]),
  };

  const yearContextPattern = /parabhava/i;
  const guruStart = (paragraph) => /(Guru Graha|Jupiter)/i.test(paragraph) && yearContextPattern.test(paragraph);
  const shaniStart = (paragraph) => /(Elinati Shani|Saturn|Shani)/i.test(paragraph) && yearContextPattern.test(paragraph);
  const rahuStart = (paragraph) => /\bRahu\b/i.test(paragraph) && yearContextPattern.test(paragraph);
  const ketuStart = (paragraph) => /\b(Ketu|Kethu)\b/i.test(paragraph) && yearContextPattern.test(paragraph);

  const guruParagraph = extractGroupedSection(englishParagraphs, guruStart, [shaniStart, rahuStart, ketuStart]);
  const shaniParagraph = extractGroupedSection(englishParagraphs, shaniStart, [guruStart, rahuStart, ketuStart]);
  const rahuParagraph = extractGroupedSection(englishParagraphs, rahuStart, [guruStart, shaniStart, ketuStart]);
  const ketuParagraph = extractGroupedSection(englishParagraphs, ketuStart, [guruStart, shaniStart, rahuStart]);

  const planetaryInfluences = [
    {
      planet: 'Guru',
      effect: detectPlanetEffect(guruParagraph),
      summary: cleanText(guruParagraph),
    },
    {
      planet: 'Shani',
      effect: detectPlanetEffect(shaniParagraph),
      summary: cleanText(shaniParagraph),
      remedyNote:
        splitSentences(shaniParagraph).find((sentence) => sentence.toLowerCase().includes('advisable')) ?? '',
    },
    {
      planet: 'Rahu',
      effect: detectPlanetEffect(rahuParagraph),
      summary: cleanText(rahuParagraph),
    },
    {
      planet: 'Ketu',
      effect: detectPlanetEffect(ketuParagraph),
      summary: cleanText(ketuParagraph),
    },
  ].filter((item) => item.summary);

  const monthHighlights = [];
  const paragraphNodes = $('p').toArray();

  for (let index = 0; index < paragraphNodes.length; index += 1) {
    const currentText = cleanText($(paragraphNodes[index]).text());
    const headingMatch = currentText.match(MONTH_HEADING_RE);
    if (!headingMatch) {
      continue;
    }

    const monthLabel = `${headingMatch[1]} ${headingMatch[2]}`;
    const fragments = [];
    for (let scanIndex = index + 1; scanIndex < Math.min(index + 10, paragraphNodes.length); scanIndex += 1) {
      const candidate = cleanText($(paragraphNodes[scanIndex]).text());
      if (MONTH_HEADING_RE.test(candidate)) {
        break;
      }
      if (isUsefulEnglish(candidate)) {
        fragments.push(candidate);
      }
    }

    const summary = cleanText(fragments.join(' '));

    if (!summary) {
      continue;
    }

    monthHighlights.push({
      monthLabel,
      summary,
      favorableDates: extractDatePhrases(summary, 'favorable'),
      cautionDates: extractDatePhrases(summary, 'caution'),
    });
  }

  const opportunities = pickSentences(
    [guruParagraph, rahuParagraph, ...monthHighlights.map((item) => item.summary)],
    [
      'promotion',
      'government employment',
      'profitable',
      'financial gains',
      'favorable',
      'travel',
      'property',
      'auspicious',
      'recognition',
      'success',
      'marriage',
    ],
  );

  const caution = pickSentences(
    [shaniParagraph, ketuParagraph, ...monthHighlights.map((item) => item.summary)],
    [
      'legal',
      'unfavorable',
      'distress',
      'decrease in income',
      'caution',
      'careful',
      'obstacles',
      'anxiety',
      'health issues',
      'postpone',
      'expenditure',
    ],
  );

  const studiesCareer = pickSentences(
    [guruParagraph, shaniParagraph, ...monthHighlights.map((item) => item.summary)],
    [
      'students',
      'employees',
      'employment',
      'professional',
      'job',
      'career',
      'business',
      'interviews',
      'transfer',
      'promotion',
      'government',
    ],
  );

  const familyRelationships = pickSentences(
    [guruParagraph, ketuParagraph, ...monthHighlights.map((item) => item.summary)],
    [
      'family',
      'children',
      'spouse',
      'marital',
      'marriage',
      'mother',
      'relatives',
      'domestic',
      'progeny',
    ],
  );

  const healthWellbeing = pickSentences(
    [shaniParagraph, ketuParagraph, ...monthHighlights.map((item) => item.summary)],
    [
      'health',
      'mental',
      'surgery',
      'anxiety',
      'stress',
      'well-being',
      'driving',
      'gynecological',
      'sleep',
      'distress',
    ],
  );

  const yearlyTheme = cleanText(guruParagraph || englishParagraphs[0] || '');
  const yearlySignals = cleanText(
    findParagraph(englishParagraphs, (paragraph) => /(^overall|^in summary|in summary,|overall,)/i.test(paragraph)) ||
      guruParagraph,
  );
  const positivePlanets = planetaryInfluences
    .filter((item) => item.effect === 'favorable')
    .map((item) => item.planet);
  const cautionPlanets = planetaryInfluences
    .filter((item) => item.effect === 'unfavorable')
    .map((item) => item.planet);
  const mixedPlanets = planetaryInfluences.filter((item) => item.effect === 'mixed').map((item) => item.planet);

  return {
    title,
    sourceImage,
    annualMetrics,
    planetaryInfluences,
    monthHighlights,
    sourceLines: {
      englishParagraphs,
      planetParagraphs: {
        Guru: guruParagraph,
        Shani: shaniParagraph,
        Rahu: rahuParagraph,
        Ketu: ketuParagraph,
      },
    },
    sections: {
      overview: buildOverview(
        meta,
        annualMetrics,
        uniq(positivePlanets),
        uniq(cautionPlanets),
        uniq(mixedPlanets),
        yearlyTheme,
      ),
      yearlyTheme,
      opportunities,
      caution,
      studiesCareer,
      familyRelationships,
      healthWellbeing,
      blessing: buildBlessing(meta, positivePlanets, cautionPlanets, yearlySignals),
      yearlySignals,
    },
  };
}

export function verifySentenceAgainstSource(sentence, sourceTexts) {
  const normalizedSentence = cleanText(sentence);
  if (!normalizedSentence) {
    return { status: 'skipped', source: '' };
  }

  const loweredSentence = normalizedSentence.toLowerCase();
  const sentenceTokens = sentenceTokenSet(normalizedSentence);
  let bestScore = 0;
  let bestSource = '';

  for (const sourceText of sourceTexts.filter(Boolean)) {
    const loweredSource = sourceText.toLowerCase();
    if (loweredSource.includes(loweredSentence)) {
      return { status: 'direct_match', source: sourceText };
    }

    const sourceTokens = sentenceTokenSet(sourceText);
    const intersection = [...sentenceTokens].filter((token) => sourceTokens.has(token)).length;
    const denominator = Math.max(sentenceTokens.size, 1);
    const score = intersection / denominator;
    if (score > bestScore) {
      bestScore = score;
      bestSource = sourceText;
    }
  }

  if (bestScore >= 0.72) {
    return { status: 'close_match', source: bestSource };
  }

  return { status: 'unmatched', source: bestSource };
}

export async function downloadSourceImage(sourceImage, slug) {
  if (!sourceImage) {
    return null;
  }

  const sourceUrl = new URL(sourceImage, 'https://www.oursubhakaryam.com/').toString();
  const response = await fetch(sourceUrl, {
    headers: REQUEST_HEADERS,
  });
  if (!response.ok) {
    throw new Error(`Failed to download source image ${sourceUrl}: ${response.status}`);
  }

  const assetDir = path.join(process.cwd(), 'src/assets/rasi');
  await mkdir(assetDir, { recursive: true });
  const fileName = `${slug}.png`;
  const filePath = path.join(assetDir, fileName);
  const arrayBuffer = await response.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));
  return `../assets/rasi/${fileName}`;
}

export function discoverPdfPath(slug) {
  const pdfDir = path.join(process.cwd(), 'src/assets/pdfs');
  const pdf = existsSync(pdfDir)
    ? readdirSync(pdfDir)
        .filter((entry) => entry.toLowerCase().endsWith('.pdf'))
        .map((entry) => path.join(pdfDir, entry))
        .find((entry) => entry.toLowerCase().includes(slug))
    : null;
  return pdf ?? null;
}

export async function extractPdfPageOneOcr(pdfPath, slug) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), `ugadi-audit-${slug}-`));
  const pngBase = path.join(tempDir, slug);

  try {
    execFileSync('pdfimages', ['-f', '1', '-l', '1', '-png', pdfPath, pngBase], {
      stdio: 'ignore',
    });
    const extractedImage =
      readdirSync(tempDir)
        .filter((entry) => entry.toLowerCase().endsWith('.png'))
        .map((entry) => path.join(tempDir, entry))
        .sort()[0] ?? `${pngBase}.png`;
    const ocrText = execFileSync('tesseract', [extractedImage, 'stdout', '--psm', '6'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return cleanText(ocrText);
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function auditSourceAgainstPdf(meta, sourceHtml, pdfPath) {
  const parsed = parseSourceHtml(sourceHtml, meta);

  if (!pdfPath || !(await readFile(pdfPath).catch(() => null))) {
    return {
      status: 'manual_review',
      sourceImage: parsed.sourceImage,
      matchedSignals: [],
      mismatches: ['Local PDF not found'],
      notes: ['Source page could be fetched, but no PDF was available for comparison.'],
    };
  }

  const normalizedOcr = (await extractPdfPageOneOcr(pdfPath, meta.slug)).toLowerCase();
  const normalizedTitle = parsed.title.toLowerCase();
  const signals = [
      {
        name: 'English heading',
        matched:
          normalizedOcr.includes('sree parabhava nama samvatsara') ||
          normalizedOcr.includes('parabhava nama') ||
          normalizedTitle.includes('sree parabhava nama samvatsara'),
      },
    ];

  if (parsed.annualMetrics.adayam) {
    signals.push({
      name: 'Adayam metric',
      matched: normalizedOcr.includes(`adayam (income): ${parsed.annualMetrics.adayam}`),
    });
  }
  if (parsed.annualMetrics.vyayam) {
    signals.push({
      name: 'Vyayam metric',
      matched: normalizedOcr.includes(`vyayam (expenditure): ${parsed.annualMetrics.vyayam}`),
    });
  }
  if (parsed.annualMetrics.rajaPoojyam) {
    signals.push({
      name: 'Raja Poojyam metric',
      matched: normalizedOcr.includes(`raja poojyam (honor/respect): ${parsed.annualMetrics.rajaPoojyam}`),
    });
  }
  if (parsed.annualMetrics.avamanam) {
    signals.push({
      name: 'Avamanam metric',
      matched: normalizedOcr.includes(`avamanam (dishonor/insult): ${parsed.annualMetrics.avamanam}`),
    });
  }
  if (parsed.planetaryInfluences.find((item) => item.planet === 'Guru')) {
    signals.push({
      name: 'Guru annual section',
      matched: normalizedOcr.includes('guru') || normalizedOcr.includes('jupiter'),
    });
  }
  if (parsed.planetaryInfluences.find((item) => item.planet === 'Shani')) {
    signals.push({
      name: 'Shani annual section',
      matched: normalizedOcr.includes('shani') || normalizedOcr.includes('saturn'),
    });
  }
  if (parsed.planetaryInfluences.find((item) => item.planet === 'Rahu')) {
    signals.push({
      name: 'Rahu annual section',
      matched: normalizedOcr.includes('rahu'),
    });
  }
  if (parsed.planetaryInfluences.find((item) => item.planet === 'Ketu')) {
    signals.push({
      name: 'Ketu annual section',
      matched: normalizedOcr.includes('ketu'),
    });
  }
  if (parsed.monthHighlights.length > 0) {
    signals.push({
      name: 'First month heading',
      matched: normalizedOcr.includes(parsed.monthHighlights[0].monthLabel.toLowerCase()),
    });
  }

  const matchedSignals = signals.filter((signal) => signal.matched).map((signal) => signal.name);
  const mismatches = signals.filter((signal) => !signal.matched).map((signal) => signal.name);
  const ratio = signals.length === 0 ? 0 : matchedSignals.length / signals.length;
  const status = ratio >= 0.9 ? 'match' : ratio >= 0.55 ? 'partial_match' : 'manual_review';

  return {
    status,
    sourceImage: parsed.sourceImage,
    matchedSignals,
    mismatches,
    notes: [
      'OCR used page 1 of the local PDF capture.',
      'Match status is based on heading, available metrics, available annual section markers, and first month marker.',
    ],
  };
}
