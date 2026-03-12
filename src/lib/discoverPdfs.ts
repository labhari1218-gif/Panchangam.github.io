import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { RASI_SOURCE_MAP } from './sourceMap';

const SEARCH_DIRS = [
  '.',
  'src/assets/pdfs',
  'public/pdfs',
  'assets/pdfs',
  'content/pdfs',
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '');
}

function walk(dir: string, files: string[]) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (name.toLowerCase().endsWith('.pdf')) {
      files.push(fullPath);
    }
  }
}

export function discoverPdfMap(rootDir = process.cwd()) {
  const pdfFiles: string[] = [];

  for (const searchDir of SEARCH_DIRS) {
    const absoluteDir = join(rootDir, searchDir);
    if (!existsSync(absoluteDir)) {
      continue;
    }

    const stats = statSync(absoluteDir);
    if (stats.isDirectory()) {
      walk(absoluteDir, pdfFiles);
    } else if (absoluteDir.toLowerCase().endsWith('.pdf')) {
      pdfFiles.push(absoluteDir);
    }
  }

  const bySlug = Object.fromEntries(RASI_SOURCE_MAP.map(({ slug }) => [slug, null as string | null]));

  for (const file of pdfFiles) {
    const normalized = normalize(file);
    for (const sign of RASI_SOURCE_MAP) {
      if (normalized.includes(normalize(sign.slug)) || normalized.includes(normalize(sign.englishName))) {
        bySlug[sign.slug] = relative(rootDir, file).replaceAll('\\', '/');
      }
    }
  }

  return bySlug;
}
