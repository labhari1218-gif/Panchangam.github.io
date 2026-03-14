export type RasiSourceMeta = {
  id: number;
  slug: string;
  teluguName: string;
  englishName: string;
  symbolName: string;
  dateRangeLabel: string;
  sourceUrl: string;
  symbolAsset: string;
};

export const RASI_SOURCE_MAP: RasiSourceMeta[] = [
  {
    id: 1,
    slug: 'mesha',
    teluguName: 'మేష',
    englishName: 'Aries',
    symbolName: 'Ram',
    dateRangeLabel: 'Mar 21 - Apr 19',
    symbolAsset: 'mesha.png',
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
    symbolAsset: 'vrushabha.png',
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
    symbolAsset: 'midhuna.png',
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
    symbolAsset: 'karkataka.png',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Karkataka_raasi_free_telugu_rasi_phalalu_Cancer_horoscope.html',
  },
  {
    id: 5,
    slug: 'simha',
    teluguName: 'సింహ రాశి',
    englishName: 'Leo',
    symbolName: 'Lion',
    dateRangeLabel: 'Jul 23 – Aug 22 • Magha (all 4 padas), Pubba / Purva Phalguni (all 4 padas), Uttara / Uttara Phalguni (1st pada)',
    symbolAsset: 'simha.png',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Simha_raasi_free_telugu_rasi_phalalu_Leo_horoscope.html',
  },
  {
    id: 6,
    slug: 'kanya',
    teluguName: 'కన్యా రాశి',
    englishName: 'Virgo',
    symbolName: 'Maiden',
    dateRangeLabel: 'Uttara Phalguni (2nd, 3rd, 4th padas), Hasta (all 4 padas), Chitta (1st, 2nd padas) • Aug 24 – Sep 22',
    symbolAsset: 'kanya.png',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_nama_Kanya_rasi_free_telugu_raasi_phalalu_Virgo_horoscope.html',
  },
  {
    id: 7,
    slug: 'tula',
    teluguName: 'తులా రాశి',
    englishName: 'Libra',
    symbolName: 'Balance',
    dateRangeLabel: 'Chitta 3, 4 padas • Swati 1-4 padas • Visakha 1-3 padas',
    symbolAsset: 'tula.png',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_naama_Tula_raasi_free_telugu_raasi_phalalu_Libra_astroloy_horoscope.html',
  },
  {
    id: 8,
    slug: 'vruchika',
    teluguName: 'వృశ్చికం',
    englishName: 'Scorpio',
    symbolName: 'Scorpion',
    dateRangeLabel: 'Oct 23 – Nov 21',
    symbolAsset: 'vruchika.png',
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
    symbolAsset: 'dhanur.png',
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
    symbolAsset: 'makara.png',
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
    symbolAsset: 'kumbha.png',
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
    symbolAsset: 'meena.png',
    sourceUrl:
      'https://www.oursubhakaryam.com/2026-2027_sri_parabhava_naama_Meena_raasi_free_telugu_raasi_phalalu_Pisces_astroloy_horoscope.html',
  },
];

export const SOURCE_LABEL = 'Read full detailed Panchangam';

export function getRasiMeta(slug: string): RasiSourceMeta {
  const match = RASI_SOURCE_MAP.find((item) => item.slug === slug);
  if (!match) {
    throw new Error(`Unknown rasi slug: ${slug}`);
  }
  return match;
}
