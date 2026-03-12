import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const searchDirs = ['.', 'src/assets/pdfs', 'public/pdfs', 'assets/pdfs', 'content/pdfs'];
const slugs = [
  'mesha',
  'vrushabha',
  'midhuna',
  'karkataka',
  'simha',
  'kanya',
  'tula',
  'vruchika',
  'dhanur',
  'makara',
  'kumbha',
  'meena',
];

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z]/g, '');
}

function walk(dir, files) {
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

const files = [];
for (const dir of searchDirs) {
  const absolute = join(process.cwd(), dir);
  if (!existsSync(absolute)) {
    continue;
  }
  if (statSync(absolute).isDirectory()) {
    walk(absolute, files);
  }
}

const lines = slugs.map((slug) => {
  const match = files.find((file) => normalize(file).includes(normalize(slug)));
  return `${slug}: ${match ? relative(process.cwd(), match).replaceAll('\\', '/') : 'MISSING'}`;
});

console.log(lines.join('\n'));
