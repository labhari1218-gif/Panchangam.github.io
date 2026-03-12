import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const lamejs = require('lamejs-fixed');

const sampleRate = 44100;

function envelope(index, totalSamples, decayPower) {
  const progress = index / totalSamples;
  return Math.pow(1 - progress, decayPower);
}

function createWave(durationSeconds, formula) {
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const samples = new Int16Array(totalSamples);
  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate;
    const value = Math.max(-1, Math.min(1, formula(t, i, totalSamples)));
    samples[i] = value * 32767;
  }
  return samples;
}

function encodeMp3(samples, fileName) {
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  const chunks = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const frame = samples.subarray(i, i + 1152);
    const encoded = encoder.encodeBuffer(frame);
    if (encoded.length > 0) {
      chunks.push(Buffer.from(encoded));
    }
  }
  const flush = encoder.flush();
  if (flush.length > 0) {
    chunks.push(Buffer.from(flush));
  }
  writeFileSync(join(process.cwd(), 'public/audio', fileName), Buffer.concat(chunks));
}

const clickWave = createWave(0.14, (t, index, totalSamples) => {
  const base = Math.sin(2 * Math.PI * 900 * t);
  const overtone = 0.35 * Math.sin(2 * Math.PI * 1800 * t);
  return (base + overtone) * 0.55 * envelope(index, totalSamples, 5.5);
});

const bellWave = createWave(0.85, (t, index, totalSamples) => {
  const fundamental = Math.sin(2 * Math.PI * 660 * t);
  const harmonic = 0.45 * Math.sin(2 * Math.PI * 1320 * t + 0.3);
  const shimmer = 0.15 * Math.sin(2 * Math.PI * 990 * t + 0.2);
  return (fundamental + harmonic + shimmer) * 0.42 * envelope(index, totalSamples, 2.8);
});

encodeMp3(clickWave, 'click.mp3');
encodeMp3(bellWave, 'bell.mp3');

console.log('Generated click.mp3 and bell.mp3 in public/audio');
