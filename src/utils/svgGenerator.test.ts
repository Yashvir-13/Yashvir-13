import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SVG_CONFIG,
  INITIAL_PROFILE_MANIFEST,
  INITIAL_TELEMETRY_DATA,
} from './profileData';
import {
  buildHarmonicWavePath,
  escapeXml,
  generateArtifactsSvg,
  generateGitHubActionYaml,
  generateHeaderSvg,
  generateLanguagesSvg,
  generateReadmeMarkdown,
  generateTelemetrySvg,
} from './svgGenerator';

test('escapeXml safely encodes XML special characters', () => {
  assert.equal(escapeXml('C & C++ <Optical> "Frame"'), 'C &amp; C++ &lt;Optical&gt; &quot;Frame&quot;');
});

test('buildHarmonicWavePath generates valid SVG path starting with M', () => {
  const path = buildHarmonicWavePath(1200, 285, 22, 2.5, 0);
  assert.equal(path.startsWith('M 0.0 285.0'), true);
  assert.equal(path.includes('L 600.0'), true);
});

test('generateHeaderSvg returns valid self-contained SVG with optical & harmonic elements', () => {
  const svg = generateHeaderSvg(DEFAULT_SVG_CONFIG, INITIAL_PROFILE_MANIFEST);
  assert.equal(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'), true);
  assert.equal(svg.includes('FRAME 001A'), true);
  assert.equal(svg.includes('YASHVIR SINGH'), true);
  assert.equal(svg.endsWith('</svg>'), true);
});

test('generateTelemetrySvg and generateLanguagesSvg produce self-contained SVG cards without external URLs', () => {
  const telemetrySvg = generateTelemetrySvg(INITIAL_TELEMETRY_DATA, DEFAULT_SVG_CONFIG);
  const languagesSvg = generateLanguagesSvg(INITIAL_TELEMETRY_DATA, DEFAULT_SVG_CONFIG);

  assert.equal(telemetrySvg.includes('Public Repositories'), true);
  assert.equal(telemetrySvg.includes(String(INITIAL_TELEMETRY_DATA.publicRepos)), true);
  assert.equal(telemetrySvg.includes('vercel.app'), false);

  assert.equal(languagesSvg.includes('Python'), true);
  assert.equal(languagesSvg.includes('Jupyter Notebook'), true);
  assert.equal(languagesSvg.includes('64.2%'), true);
});

test('generateArtifactsSvg renders all 4 featured project architectures', () => {
  const artifactsSvg = generateArtifactsSvg(INITIAL_PROFILE_MANIFEST.projects, DEFAULT_SVG_CONFIG);
  assert.equal(artifactsSvg.includes('Asteria'), true);
  assert.equal(artifactsSvg.includes('Fathom'), true);
  assert.equal(artifactsSvg.includes('Samvedna'), true);
  assert.equal(artifactsSvg.includes('Cinematic Frame Interpolation'), true);
});

test('generateReadmeMarkdown replaces broken external stats with local SVG assets and preserves links', () => {
  const md = generateReadmeMarkdown(
    INITIAL_PROFILE_MANIFEST,
    INITIAL_TELEMETRY_DATA,
    DEFAULT_SVG_CONFIG
  );
  assert.equal(md.includes('./assets/header.svg'), true);
  assert.equal(md.includes('./assets/telemetry.svg'), true);
  assert.equal(md.includes('./assets/languages.svg'), true);
  assert.equal(md.includes('./assets/artifacts.svg'), true);
  assert.equal(md.includes('github-readme-stats.vercel.app'), false);
  assert.equal(md.includes('https://www.yashvirafterhours.me/'), true);
});

test('generateGitHubActionYaml produces valid GitHub Actions workflow', () => {
  const yaml = generateGitHubActionYaml('Yashvir-13');
  assert.equal(yaml.includes('GITHUB_USERNAME: Yashvir-13'), true);
  assert.equal(yaml.includes('node scripts/update-telemetry.mjs'), true);
});
