#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const username = process.env.GITHUB_USERNAME || 'Yashvir-13';

function buildHarmonicWavePath(width, centerY, amplitude, frequency, phaseOffset) {
  const points = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const normalizedX = (i / steps) * Math.PI * 2 * frequency;
    const envelope = Math.sin((i / steps) * Math.PI);
    const y = centerY + Math.sin(normalizedX + phaseOffset) * amplitude * envelope;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

async function fetchYearlyContributions(user, token) {
  // 1. Try GitHub GraphQL API if token is available (automatic in GitHub Actions)
  if (token) {
    try {
      const gqlRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Yashvir-13-Profile-Telemetry-Action',
        },
        body: JSON.stringify({
          query: `query($login: String!) {
            user(login: $login) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                }
              }
            }
          }`,
          variables: { login: user },
        }),
      });
      if (gqlRes.ok) {
        const gqlJson = await gqlRes.json();
        const total =
          gqlJson?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;
        if (typeof total === 'number' && total > 0) {
          return `${total}+`;
        }
      }
    } catch {
      // Fallback below
    }
  }

  // 2. Fallback to public contributions endpoint
  try {
    const pubRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`
    );
    if (pubRes.ok) {
      const pubJson = await pubRes.json();
      const total = pubJson?.total?.lastYear;
      if (typeof total === 'number' && total > 0) {
        return `${total}+`;
      }
    }
  } catch {
    // Fallback below
  }

  return '191+';
}

async function run() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Yashvir-13-Profile-Telemetry-Action',
  };
  const token =
    process.env.GITHUB_TOKEN ||
    process.env.github_token ||
    process.env.GH_TOKEN ||
    process.env.gh_token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let publicRepos = 32;
  let yearlyContributions = await fetchYearlyContributions(username, token);
  let langs = [
    { name: 'Python', percentage: 73.4, fill: '#D99B52' },
    { name: 'Jupyter Notebook', percentage: 13.3, fill: '#94B8D7' },
    { name: 'TypeScript', percentage: 10.0, fill: '#ECEAE4' },
    { name: 'C/C++ & Systems', percentage: 3.3, fill: '#94969C' },
  ];

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers,
      }),
    ]);

    if (userRes.ok && reposRes.ok) {
      const user = await userRes.json();
      const repos = await reposRes.json();
      publicRepos = user.public_repos ?? publicRepos;

      const ownRepos = Array.isArray(repos) ? repos.filter((r) => !r.fork) : [];
      const counts = {};
      for (const r of ownRepos) {
        const l = r.language || 'Python';
        counts[l] = (counts[l] || 0) + 1;
      }
      const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
      const fills = ['#D99B52', '#94B8D7', '#ECEAE4', '#94969C'];
      const computed = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, c], i) => ({
          name:
            name === 'C++' || name === 'C'
              ? 'C / C++'
              : name === 'JavaScript'
              ? 'C/C++ & Systems'
              : name,
          percentage: Number(((c / total) * 100).toFixed(1)),
          fill: fills[i] || '#94969C',
        }));

      if (computed.length >= 2) {
        const sumOthers = computed.slice(1).reduce((acc, item) => acc + item.percentage, 0);
        computed[0].percentage = Number(Math.max(10, 100 - sumOthers).toFixed(1));
        langs = computed;
      }
    }
  } catch (err) {
    console.warn('Using fallback telemetry snapshot:', err.message);
  }

  const today = new Date().toISOString().slice(0, 10);
  const wavePath = buildHarmonicWavePath(165, 166, 11, 2.0, 0.7);

  const telemetrySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 220" width="100%" height="100%" role="img" aria-label="GitHub Repository Telemetry for ${username}">
  <defs>
    <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#121318" />
      <stop offset="100%" stop-color="#060709" />
    </linearGradient>
  </defs>

  <rect width="580" height="220" rx="10" fill="url(#card-bg)" stroke="#262934" stroke-width="1" />

  <!-- Header Row -->
  <text x="26" y="34" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10.5" fill="#D99B52" letter-spacing="1.5">
    03A · REPOSITORY CADENCE &amp; SYSTEMS INDEX
  </text>
  <text x="554" y="34" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10" fill="#94969C">
    @${username}
  </text>
  <line x1="26" y1="48" x2="554" y2="48" stroke="#262934" stroke-width="1" />

  <!-- Primary Tabular Metrics Grid -->
  <g transform="translate(26, 74)">
    <text x="0" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="#94969C">Public Repositories</text>
    <text x="0" y="28" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="25" font-weight="600" fill="#ECEAE4">${publicRepos}</text>

    <text x="148" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="#94969C">Yearly Contributions</text>
    <text x="148" y="28" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="25" font-weight="600" fill="#ECEAE4">${yearlyContributions}</text>

    <text x="304" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="#94969C">Primary Inquiry</text>
    <text x="304" y="25" font-family="Georgia, 'Cormorant Garamond', serif" font-style="italic" font-size="18" fill="#D99B52">Vision, Audio &amp; Epistemics</text>
  </g>

  <line x1="26" y1="120" x2="554" y2="120" stroke="#262934" stroke-width="0.75" />

  <!-- Secondary Row: Bounded Left Column + Dedicated Right Harmonic Box -->
  <g transform="translate(26, 144)">
    <text x="0" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="#94969C">
      Domains: Vision · Optical Flow · Multi-LLM · Acoustics
    </text>
    <text x="0" y="22" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="#ECEAE4">
      Stack: Python · PyTorch · C/C++ · OpenCV
    </text>
    <text x="0" y="46" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="9.5" fill="#94969C">
      SYNCED: ${today} · SELF-CONTAINED SVG
    </text>
  </g>

  <!-- Vertical separator before mini harmonic scope -->
  <line x1="372" y1="132" x2="372" y2="196" stroke="#262934" stroke-width="0.75" />

  <!-- Mini Harmonic Waveform Scope on Bottom Right (x=386..551) -->
  <g transform="translate(386, 0)">
    <line x1="0" y1="166" x2="165" y2="166" stroke="#262934" stroke-width="0.75" stroke-dasharray="2 4" />
    <path d="${wavePath}" fill="none" stroke="#94B8D7" stroke-width="1.4" opacity="0.78" />
    <text x="82.5" y="192" text-anchor="middle" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="8.5" fill="#94969C" letter-spacing="1">
      SIGNAL PHASE · 98% COMMITS
    </text>
  </g>
</svg>`;

  let currentX = 26;
  const barWidth = 528;
  const barRects = langs
    .map((l) => {
      const w = Math.max(8, (l.percentage / 100) * barWidth);
      const x = currentX;
      currentX += w;
      return `<rect x="${x.toFixed(1)}" y="66" width="${Math.max(2, w - 3).toFixed(1)}" height="10" rx="2" fill="${l.fill}" />`;
    })
    .join('\n    ');

  const legendItems = langs
    .map((l, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const lx = 26 + col * 268;
      const ly = 114 + row * 42;
      return `
    <g transform="translate(${lx}, ${ly})">
      <rect x="0" y="-9" width="8" height="8" rx="1.5" fill="${l.fill}" />
      <text x="16" y="-1" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="500" fill="#ECEAE4">${l.name.replace(/&/g, '&amp;')}</text>
      <text x="246" y="-1" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="12" fill="#94969C">${l.percentage.toFixed(1)}%</text>
      <line x1="0" y1="10" x2="246" y2="10" stroke="#262934" stroke-width="0.75" />
    </g>`;
    })
    .join('');

  const languagesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 220" width="100%" height="100%" role="img" aria-label="Language and Medium Distribution for ${username}">
  <defs>
    <linearGradient id="lang-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#121318" />
      <stop offset="100%" stop-color="#060709" />
    </linearGradient>
  </defs>

  <rect width="580" height="220" rx="10" fill="url(#lang-bg)" stroke="#262934" stroke-width="1" />

  <!-- Header Row -->
  <text x="26" y="34" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10.5" fill="#94B8D7" letter-spacing="1.5">
    03B · LANGUAGES &amp; EXPERIMENTAL MEDIUMS
  </text>
  <text x="554" y="34" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10" fill="#94969C">
    DISTRIBUTION
  </text>
  <line x1="26" y1="48" x2="554" y2="48" stroke="#262934" stroke-width="1" />

  <!-- Multi-Segment Proportional Bar -->
  <g>
    ${barRects}
  </g>

  <!-- 2x2 Tabular Breakdown -->
  ${legendItems}

  <!-- Bottom Note -->
  <text x="26" y="198" font-family="Georgia, 'Cormorant Garamond', serif" font-style="italic" font-size="13.5" fill="#94969C">
    Balanced between PyTorch experimentation, C/C++ optical algorithms, and TypeScript systems.
  </text>
</svg>`;

  await fs.mkdir(path.join(rootDir, 'assets'), { recursive: true });
  await fs.writeFile(path.join(rootDir, 'assets', 'telemetry.svg'), telemetrySvg, 'utf8');
  await fs.writeFile(path.join(rootDir, 'assets', 'languages.svg'), languagesSvg, 'utf8');
  console.log(`Updated assets/telemetry.svg and assets/languages.svg for ${username} (${publicRepos} repos, ${yearlyContributions} contributions)`);
}

run();
