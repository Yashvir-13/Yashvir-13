import {
  GitHubTelemetryData,
  PALETTE_PRESETS,
  ProfileManifest,
  ProjectArtifact,
  SvgThemeConfig,
} from './profileData';

export function escapeXml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Splits prose into bounded lines so SVG <text> never overflows or collides with schematics.
 */
export function wrapSvgText(
  text: string,
  maxCharsPerLine: number,
  maxLines = 3
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
    } else {
      if (currentLine) {
        if (lines.length === maxLines - 1) {
          // Last allowed line: append ellipsis cleanly at word boundary
          const trimmed =
            currentLine.length > maxCharsPerLine - 3
              ? currentLine.replace(/\s+\S+$/, '')
              : currentLine;
          lines.push(`${trimmed.replace(/[.,;—-]+$/, '')}...`);
          return lines;
        }
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Generates an abstract harmonic sine path representing acoustic resonance & signal phase
 */
export function buildHarmonicWavePath(
  width: number,
  centerY: number,
  amplitude: number,
  frequency: number,
  phaseOffset: number
): string {
  const points: string[] = [];
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

/**
 * 1. Header SVG (assets/header.svg)
 * Abstract synthesis of:
 * - Optical aperture & eclipse geometry (Cinema & Computer Vision)
 * - Harmonic phase waves (Music & Signal Processing)
 * - Epistemic horizon & monolith (Philosophy & Perception)
 * - 35mm contact sheet frame annotations
 */
export function generateHeaderSvg(
  config: SvgThemeConfig,
  manifest: ProfileManifest
): string {
  const palette = PALETTE_PRESETS[config.paletteId] || PALETTE_PRESETS['tungsten-monograph'];
  const r = Math.max(64, Math.min(125, config.apertureRadius));
  const amp = Math.max(4, Math.min(48, config.harmonicAmplitude));
  const grain = Math.max(0, Math.min(0.9, config.grainOpacity));

  const wave1 = buildHarmonicWavePath(1200, 285, amp, 2.5, 0);
  const wave2 = buildHarmonicWavePath(1200, 285, amp * 0.62, 4.0, 1.2);
  const wave3 = buildHarmonicWavePath(1200, 285, amp * 0.35, 6.5, 2.4);

  const pulseAnim1 = config.animateElements
    ? `<animate attributeName="opacity" values="0.55;0.92;0.55" dur="7s" repeatCount="indefinite" />`
    : '';
  const pulseAnim2 = config.animateElements
    ? `<animate attributeName="r" values="${r + 26};${r + 31};${r + 26}" dur="8s" repeatCount="indefinite" />`
    : '';

  const filmMarkers = config.showFilmMarkers
    ? `
  <!-- 35mm Contact Sheet & Optical Frame Annotations -->
  <g font-family="ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace" font-size="10" fill="${palette.textMuted}" opacity="0.72" letter-spacing="1.6">
    <text x="42" y="36">FRAME 001A · 35MM OPTICAL</text>
    <text x="600" y="36" text-anchor="middle">PERCEPTION · REPRESENTATION · CINEMA · ACOUSTICS</text>
    <text x="1158" y="36" text-anchor="end">ASPECT 2.85:1</text>

    <!-- Corner Registration Crop Marks -->
    <path d="M 28 46 L 28 24 L 50 24" fill="none" stroke="${palette.primaryAccent}" stroke-width="1" opacity="0.65" />
    <path d="M 1172 46 L 1172 24 L 1150 24" fill="none" stroke="${palette.primaryAccent}" stroke-width="1" opacity="0.65" />
    <path d="M 28 374 L 28 396 L 50 396" fill="none" stroke="${palette.primaryAccent}" stroke-width="1" opacity="0.65" />
    <path d="M 1172 374 L 1172 396 L 1150 396" fill="none" stroke="${palette.primaryAccent}" stroke-width="1" opacity="0.65" />

    <text x="42" y="390">${escapeXml(manifest.displayName.toUpperCase())} · ${escapeXml(manifest.username.toUpperCase())}</text>
    <text x="1158" y="390" text-anchor="end">f/1.4 · 50MM · LATENT MANIFOLD</text>
  </g>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="100%" height="100%" role="img" aria-label="${escapeXml(manifest.displayName)} — Optical and Acoustic Monograph Header">
  <defs>
    <radialGradient id="bg" cx="50%" cy="44%" r="72%">
      <stop offset="0%" stop-color="${palette.bgInner}" />
      <stop offset="100%" stop-color="${palette.bgOuter}" />
    </radialGradient>

    <radialGradient id="amber-aura" cx="50%" cy="43%" r="38%">
      <stop offset="0%" stop-color="${palette.primaryAccent}" stop-opacity="0.26" />
      <stop offset="55%" stop-color="${palette.secondaryAccent}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="${palette.bgOuter}" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="eclipse-corona" cx="50%" cy="50%" r="50%">
      <stop offset="68%" stop-color="${palette.bgOuter}" stop-opacity="0" />
      <stop offset="83%" stop-color="${palette.primaryAccent}" stop-opacity="0.45" />
      <stop offset="91%" stop-color="${palette.textPrimary}" stop-opacity="0.6" />
      <stop offset="100%" stop-color="${palette.bgOuter}" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="horizon-glow" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="${palette.primaryAccent}" stop-opacity="0.15" />
      <stop offset="35%" stop-color="${palette.secondaryAccent}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="${palette.bgOuter}" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="wave-grad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="${palette.secondaryAccent}" stop-opacity="0" />
      <stop offset="22%" stop-color="${palette.secondaryAccent}" stop-opacity="0.48" />
      <stop offset="50%" stop-color="${palette.primaryAccent}" stop-opacity="0.88" />
      <stop offset="78%" stop-color="${palette.secondaryAccent}" stop-opacity="0.48" />
      <stop offset="100%" stop-color="${palette.secondaryAccent}" stop-opacity="0" />
    </linearGradient>

    <pattern id="film-grain" width="120" height="120" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="22" r="0.6" fill="${palette.textPrimary}" opacity="0.18" />
      <circle cx="68" cy="11" r="0.5" fill="${palette.textPrimary}" opacity="0.14" />
      <circle cx="102" cy="48" r="0.7" fill="${palette.primaryAccent}" opacity="0.16" />
      <circle cx="37" cy="79" r="0.5" fill="${palette.textPrimary}" opacity="0.15" />
      <circle cx="89" cy="96" r="0.6" fill="${palette.secondaryAccent}" opacity="0.15" />
      <circle cx="53" cy="44" r="0.4" fill="${palette.textPrimary}" opacity="0.12" />
      <circle cx="19" cy="108" r="0.6" fill="${palette.textPrimary}" opacity="0.14" />
    </pattern>
  </defs>

  <!-- Base Darkroom Field -->
  <rect width="1200" height="420" fill="url(#bg)" />
  <rect width="1200" height="420" fill="url(#amber-aura)" />

  <!-- Subtle Geometric Optical Grid & Focal Rays -->
  <g stroke="${palette.textPrimary}" opacity="0.07" stroke-width="0.75">
    <line x1="600" y1="18" x2="600" y2="402" stroke-dasharray="3 6" />
    <line x1="220" y1="182" x2="980" y2="182" stroke-dasharray="2 8" />
    <circle cx="600" cy="182" r="${r + 58}" fill="none" stroke-dasharray="4 8" />
    <circle cx="600" cy="182" r="${r + 118}" fill="none" />
    <line x1="360" y1="42" x2="840" y2="322" />
    <line x1="360" y1="322" x2="840" y2="42" />
  </g>

  <!-- Aperture Measurement Ring -->
  <circle cx="600" cy="182" r="${r + 28}" fill="none" stroke="${palette.primaryAccent}" stroke-width="1" stroke-dasharray="2 8" opacity="0.38">
    ${pulseAnim2}
  </circle>

  <!-- Starfield / Dust Particles -->
  <g fill="${palette.textPrimary}" opacity="0.34">
    <circle cx="170" cy="118" r="1.0" />
    <circle cx="285" cy="76" r="0.7" />
    <circle cx="430" cy="64" r="1.2" />
    <circle cx="775" cy="72" r="0.9" />
    <circle cx="930" cy="108" r="1.4" />
    <circle cx="1040" cy="176" r="0.8" />
    <circle cx="885" cy="238" r="0.7" />
    <circle cx="315" cy="242" r="1.1" />
    <circle cx="135" cy="264" r="1.3" />
  </g>

  <!-- Acoustic & Signal Phase Harmonic Curves -->
  <g fill="none">
    <path d="${wave3}" stroke="${palette.secondaryAccent}" stroke-width="0.9" opacity="0.3" />
    <path d="${wave2}" stroke="url(#wave-grad)" stroke-width="1.25" opacity="0.55" />
    <path d="${wave1}" stroke="url(#wave-grad)" stroke-width="1.8" opacity="0.86" />
  </g>

  <!-- The Eclipse Halo (Optical Corona via smooth radial gradient) -->
  <circle cx="600" cy="182" r="${r + 24}" fill="url(#eclipse-corona)" />
  <circle cx="600" cy="182" r="${r + 2.5}" fill="none" stroke="${palette.primaryAccent}" stroke-width="2" opacity="0.85">
    ${pulseAnim1}
  </circle>
  <circle cx="600" cy="182" r="${r + 0.8}" fill="none" stroke="${palette.textPrimary}" stroke-width="1.5" opacity="0.78" />

  <!-- Core Dark Body (Eclipse / Camera Obscura) -->
  <circle cx="600" cy="182" r="${r}" fill="${palette.bgOuter}" />
  <circle cx="600" cy="182" r="${r - 1}" fill="none" stroke="${palette.textPrimary}" stroke-width="0.6" opacity="0.35" />

  <!-- Subtle Inner Geometry Inside the Black Box -->
  <g stroke="${palette.primaryAccent}" stroke-width="0.75" fill="none" opacity="0.34">
    <polygon points="600,${182 - r * 0.62} ${600 + r * 0.56},${182 + r * 0.34} ${600 - r * 0.56},${182 + r * 0.34}" />
    <circle cx="600" cy="182" r="${r * 0.34}" stroke="${palette.secondaryAccent}" />
    <circle cx="600" cy="182" r="2.4" fill="${palette.primaryAccent}" />
  </g>

  <!-- Horizon Line & Ground Reflection -->
  <line x1="0" y1="285" x2="1200" y2="285" stroke="${palette.textPrimary}" stroke-width="1" opacity="0.22" />
  <rect x="0" y="285" width="1200" height="135" fill="url(#horizon-glow)" opacity="0.75" />

  <!-- Monolith / Observer Silhouette -->
  <rect x="586" y="252" width="28" height="82" fill="#030406" opacity="0.96" />
  <rect x="586" y="252" width="28" height="82" fill="none" stroke="${palette.textPrimary}" stroke-width="0.6" opacity="0.3" />

  <!-- Honest Editorial Caption Along Lower Third -->
  <text x="600" y="362" text-anchor="middle" font-family="Georgia, 'Cormorant Garamond', serif" font-style="italic" font-size="15.5" fill="${palette.textPrimary}" opacity="0.88" letter-spacing="0.4">
    “Studying the geometry inside the black box — through code, cinema, music, and philosophy.”
  </text>

  ${filmMarkers}

  <!-- 35mm Film Grain Texture Overlay -->
  <rect width="1200" height="420" fill="url(#film-grain)" opacity="${grain}" style="pointer-events:none;" />
</svg>`;
}

/**
 * 2. Self-Contained Telemetry SVG (assets/telemetry.svg)
 * Cleanly separated left/right columns with zero text overlap
 */
export function generateTelemetrySvg(
  telemetry: GitHubTelemetryData,
  config: SvgThemeConfig
): string {
  const palette = PALETTE_PRESETS[config.paletteId] || PALETTE_PRESETS['tungsten-monograph'];
  const wavePath = buildHarmonicWavePath(165, 166, 11, 2.0, 0.7);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 220" width="100%" height="100%" role="img" aria-label="GitHub Repository Telemetry for ${escapeXml(telemetry.username)}">
  <defs>
    <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bgInner}" />
      <stop offset="100%" stop-color="${palette.bgOuter}" />
    </linearGradient>
  </defs>

  <rect width="580" height="220" rx="10" fill="url(#card-bg)" stroke="${palette.ruleColor}" stroke-width="1" />

  <!-- Header Row -->
  <text x="26" y="34" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10.5" fill="${palette.primaryAccent}" letter-spacing="1.5">
    03A · REPOSITORY CADENCE &amp; SYSTEMS INDEX
  </text>
  <text x="554" y="34" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10" fill="${palette.textMuted}">
    @${escapeXml(telemetry.username)}
  </text>
  <line x1="26" y1="48" x2="554" y2="48" stroke="${palette.ruleColor}" stroke-width="1" />

  <!-- Primary Tabular Metrics Grid -->
  <g transform="translate(26, 74)">
    <text x="0" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="${palette.textMuted}">Public Repositories</text>
    <text x="0" y="28" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="25" font-weight="600" fill="${palette.textPrimary}">${telemetry.publicRepos}</text>

    <text x="148" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="${palette.textMuted}">Yearly Contributions</text>
    <text x="148" y="28" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="25" font-weight="600" fill="${palette.textPrimary}">191+</text>

    <text x="304" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="${palette.textMuted}">Primary Inquiry</text>
    <text x="304" y="25" font-family="Georgia, 'Cormorant Garamond', serif" font-style="italic" font-size="18" fill="${palette.primaryAccent}">Vision, Audio &amp; Epistemics</text>
  </g>

  <line x1="26" y1="120" x2="554" y2="120" stroke="${palette.ruleColor}" stroke-width="0.75" />

  <!-- Secondary Row: Bounded Left Column + Dedicated Right Harmonic Box -->
  <g transform="translate(26, 144)">
    <text x="0" y="0" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="${palette.textMuted}">
      Domains: Vision · Optical Flow · Multi-LLM · Acoustics
    </text>
    <text x="0" y="22" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5" fill="${palette.textPrimary}">
      Stack: ${escapeXml(telemetry.primaryStack)}
    </text>
    <text x="0" y="46" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="9.5" fill="${palette.textMuted}">
      SYNCED: ${escapeXml(telemetry.lastSynced.slice(0, 10))} · SELF-CONTAINED SVG
    </text>
  </g>

  <!-- Vertical separator before mini harmonic scope -->
  <line x1="372" y1="132" x2="372" y2="196" stroke="${palette.ruleColor}" stroke-width="0.75" />

  <!-- Mini Harmonic Waveform Scope on Bottom Right (x=386..551) -->
  <g transform="translate(386, 0)">
    <line x1="0" y1="166" x2="165" y2="166" stroke="${palette.ruleColor}" stroke-width="0.75" stroke-dasharray="2 4" />
    <path d="${wavePath}" fill="none" stroke="${palette.secondaryAccent}" stroke-width="1.4" opacity="0.78" />
    <text x="82.5" y="192" text-anchor="middle" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="8.5" fill="${palette.textMuted}" letter-spacing="1">
      SIGNAL PHASE · 98% COMMITS
    </text>
  </g>
</svg>`;
}

/**
 * 3. Self-Contained Languages & Mediums SVG (assets/languages.svg)
 */
export function generateLanguagesSvg(
  telemetry: GitHubTelemetryData,
  config: SvgThemeConfig
): string {
  const palette = PALETTE_PRESETS[config.paletteId] || PALETTE_PRESETS['tungsten-monograph'];
  const barWidth = 528;
  let currentX = 26;

  const segments = telemetry.languages.map((lang, idx) => {
    const segW = Math.max(8, (lang.percentage / 100) * barWidth);
    const x = currentX;
    currentX += segW;
    const fill =
      idx === 0
        ? palette.primaryAccent
        : idx === 1
        ? palette.secondaryAccent
        : idx === 2
        ? palette.textPrimary
        : palette.textMuted;
    return { ...lang, x, width: segW, fill };
  });

  const barRects = segments
    .map(
      (seg) =>
        `<rect x="${seg.x.toFixed(1)}" y="66" width="${Math.max(2, seg.width - 3).toFixed(1)}" height="10" rx="2" fill="${seg.fill}" />`
    )
    .join('\n    ');

  const legendItems = segments
    .map((seg, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const lx = 26 + col * 268;
      const ly = 114 + row * 42;
      return `
    <g transform="translate(${lx}, ${ly})">
      <rect x="0" y="-9" width="8" height="8" rx="1.5" fill="${seg.fill}" />
      <text x="16" y="-1" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="500" fill="${palette.textPrimary}">${escapeXml(seg.name)}</text>
      <text x="246" y="-1" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="12" fill="${palette.textMuted}">${seg.percentage.toFixed(1)}%</text>
      <line x1="0" y1="10" x2="246" y2="10" stroke="${palette.ruleColor}" stroke-width="0.75" />
    </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 220" width="100%" height="100%" role="img" aria-label="Language and Medium Distribution for ${escapeXml(telemetry.username)}">
  <defs>
    <linearGradient id="lang-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bgInner}" />
      <stop offset="100%" stop-color="${palette.bgOuter}" />
    </linearGradient>
  </defs>

  <rect width="580" height="220" rx="10" fill="url(#lang-bg)" stroke="${palette.ruleColor}" stroke-width="1" />

  <!-- Header Row -->
  <text x="26" y="34" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10.5" fill="${palette.secondaryAccent}" letter-spacing="1.5">
    03B · LANGUAGES &amp; EXPERIMENTAL MEDIUMS
  </text>
  <text x="554" y="34" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10" fill="${palette.textMuted}">
    DISTRIBUTION
  </text>
  <line x1="26" y1="48" x2="554" y2="48" stroke="${palette.ruleColor}" stroke-width="1" />

  <!-- Multi-Segment Proportional Bar -->
  <g>
    ${barRects}
  </g>

  <!-- 2x2 Tabular Breakdown -->
  ${legendItems}

  <!-- Bottom Note -->
  <text x="26" y="198" font-family="Georgia, 'Cormorant Garamond', serif" font-style="italic" font-size="13.5" fill="${palette.textMuted}">
    Balanced between PyTorch experimentation, C/C++ optical algorithms, and TypeScript systems.
  </text>
</svg>`;
}

/**
 * 4. Visual Project Architecture Cards SVG (assets/artifacts.svg)
 * Wraps prose strictly within x=24..410 and places schematics cleanly in x=430..570
 * so text and diagrams NEVER overlap on GitHub!
 */
export function generateArtifactsSvg(
  projects: ProjectArtifact[],
  config: SvgThemeConfig
): string {
  const palette = PALETTE_PRESETS[config.paletteId] || PALETTE_PRESETS['tungsten-monograph'];
  const featured = projects.slice(0, 4);

  const cardsMarkup = featured
    .map((proj, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col * 604;
      const y = row * 184;

      let schematic = '';
      if (proj.diagramType === 'manifold') {
        schematic = `
        <g transform="translate(506, 84)" stroke="${palette.primaryAccent}" fill="none">
          <circle cx="0" cy="0" r="34" stroke="${palette.ruleColor}" stroke-dasharray="2 4" />
          <line x1="-18" y1="-12" x2="14" y2="-8" stroke-width="1.1" opacity="0.65" />
          <line x1="14" y1="-8" x2="4" y2="18" stroke-width="1.1" opacity="0.65" />
          <line x1="-18" y1="-12" x2="4" y2="18" stroke-width="1.1" opacity="0.65" />
          <line x1="4" y1="18" x2="-20" y2="14" stroke="${palette.secondaryAccent}" stroke-width="1.1" opacity="0.65" />
          <circle cx="-18" cy="-12" r="3.5" fill="${palette.primaryAccent}" />
          <circle cx="14" cy="-8" r="3.5" fill="${palette.secondaryAccent}" />
          <circle cx="4" cy="18" r="4" fill="${palette.textPrimary}" />
          <circle cx="-20" cy="14" r="2.5" fill="${palette.secondaryAccent}" />
          <text x="0" y="48" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="${palette.textMuted}" letter-spacing="0.8">MANIFOLD</text>
        </g>`;
      } else if (proj.diagramType === 'epistemic') {
        schematic = `
        <g transform="translate(506, 84)" fill="none">
          <circle cx="0" cy="0" r="31" stroke="${palette.primaryAccent}" stroke-width="1.4" stroke-dasharray="4 3" />
          <circle cx="0" cy="0" r="16" fill="${palette.primaryAccent}" fill-opacity="0.14" stroke="${palette.textPrimary}" stroke-width="1.1" />
          <circle cx="0" cy="0" r="2.5" fill="${palette.textPrimary}" />
          <text x="0" y="48" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="${palette.textMuted}" letter-spacing="0.8">HORIZON</text>
        </g>`;
      } else if (proj.diagramType === 'kinematic') {
        schematic = `
        <g transform="translate(506, 86)" stroke="${palette.secondaryAccent}" stroke-width="1.25" fill="none">
          <polyline points="-18,16 -8,2 0,-18" />
          <polyline points="-8,2 8,-14 16,-24" />
          <polyline points="-8,2 18,-2 26,-6" />
          <circle cx="-18" cy="16" r="2.5" fill="${palette.primaryAccent}" />
          <circle cx="-8" cy="2" r="2.5" fill="${palette.textPrimary}" />
          <circle cx="0" cy="-18" r="2.2" fill="${palette.secondaryAccent}" />
          <circle cx="16" cy="-24" r="2.2" fill="${palette.secondaryAccent}" />
          <circle cx="26" cy="-6" r="2.2" fill="${palette.secondaryAccent}" />
          <text x="0" y="46" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="${palette.textMuted}" stroke="none" letter-spacing="0.8">KINEMATICS</text>
        </g>`;
      } else {
        schematic = `
        <g transform="translate(506, 84)" fill="none">
          <rect x="-32" y="-22" width="22" height="36" rx="2" stroke="${palette.textMuted}" stroke-width="1" />
          <rect x="-11" y="-18" width="22" height="36" rx="2" stroke="${palette.primaryAccent}" stroke-width="1.4" stroke-dasharray="2 2" />
          <rect x="10" y="-14" width="22" height="36" rx="2" stroke="${palette.textMuted}" stroke-width="1" />
          <line x1="-20" y1="-4" x2="20" y2="4" stroke="${palette.primaryAccent}" stroke-width="1.2" />
          <text x="0" y="48" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="${palette.textMuted}" letter-spacing="0.8">OPTICAL FLOW</text>
        </g>`;
      }

      // Wrap description to 52 chars per line (max 3 lines) so full prose stays strictly left of x=424
      const wrappedLines = wrapSvgText(proj.description, 52, 3);
      const tspans = wrappedLines
        .map(
          (line, lineIdx) =>
            `<tspan x="24" dy="${lineIdx === 0 ? 0 : 16.5}">${escapeXml(line)}</tspan>`
        )
        .join('');

      return `
  <g transform="translate(${x}, ${y})">
    <rect width="588" height="168" rx="10" fill="${palette.bgInner}" stroke="${palette.ruleColor}" stroke-width="1" />
    <text x="24" y="30" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10" fill="${palette.primaryAccent}" letter-spacing="1.2">
      ${escapeXml(proj.sequence)} · ${escapeXml(proj.domain.toUpperCase())}
    </text>
    <text x="24" y="56" font-family="Georgia, 'Cormorant Garamond', serif" font-size="22" font-weight="600" fill="${palette.textPrimary}">
      ${escapeXml(proj.title)}
    </text>
    <text x="24" y="80" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="12" fill="${palette.textMuted}">
      ${tspans}
    </text>
    <text x="24" y="146" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="10.5" fill="${palette.secondaryAccent}">
      ${escapeXml(proj.language)} · ${escapeXml(proj.status)}
    </text>
    <!-- Subtle vertical divider separating prose column from schematic column -->
    <line x1="428" y1="22" x2="428" y2="146" stroke="${palette.ruleColor}" stroke-width="0.75" />
    ${schematic}
  </g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1192 352" width="100%" height="100%" role="img" aria-label="Selected Systems and Research Artifacts">
  ${cardsMarkup}
</svg>`;
}

/**
 * 5. Complete Markdown Generator for /README.md
 */
export function generateReadmeMarkdown(
  manifest: ProfileManifest,
  telemetry: GitHubTelemetryData,
  config: SvgThemeConfig
): string {
  const assetPrefix = config.useRelativeAssetPaths
    ? './assets'
    : `https://raw.githubusercontent.com/${manifest.username}/${manifest.username}/main/assets`;

  const artifactRows = manifest.projects
    .map(
      (p) =>
        `| **${p.sequence}** | [**${p.title}**](${p.url}) | ${p.description} | \`${p.language}\` | \`${p.status.toUpperCase()}\` |`
    )
    .join('\n');

  const creativeRows = manifest.creativeNotes
    .map((c) => `- **${c.medium}** — *${c.title}*: ${c.reflection}`)
    .join('\n');

  return `<div align="center">
  <img src="${assetPrefix}/header.svg?v=2" width="100%" alt="${manifest.displayName} — Optical & Acoustic Monograph" />
</div>

<br>

<div align="center">
  <blockquote>
    <p><i>"${manifest.epigraphQuote}"</i></p>
    <sub>— ${manifest.epigraphAuthor}</sub>
  </blockquote>
</div>

<br>

### 01. Perception & Representation

${manifest.observeLead} ${manifest.observeBody}

- **Focus:** ${manifest.focusAreas}
- **Current Inquiry:** ${manifest.currentInquiry}
- **Core Stack:** ${manifest.coreStack}

<br>

### 02. Selected Works & Research Artifacts

<div align="center">
  <img src="${assetPrefix}/artifacts.svg?v=2" width="100%" alt="Selected Works Schematic" />
</div>

<br>

| Seq | Subject | Inquiry & Architecture | Medium | State |
| :---: | :--- | :--- | :--- | :---: |
${artifactRows}

<br>

### 03. Repository Telemetry & Mediums

<p align="center">
  <img src="${assetPrefix}/telemetry.svg?v=2" width="49%" alt="Repository Cadence & Systems Index" />
  <img src="${assetPrefix}/languages.svg?v=2" width="49%" alt="Languages & Experimental Mediums" />
</p>

<br>

### 04. After Hours — Cinema, Music, Poetry & Philosophy

${manifest.offlineReflection}

${creativeRows}

<br>

<div align="center">
  <a href="${manifest.links.portfolio}">After Hours Portfolio</a> ·
  <a href="${manifest.links.medium}">Medium Essays</a> ·
  <a href="${manifest.links.youtube}">YouTube Visual Work</a> ·
  <a href="${manifest.links.linkedin}">LinkedIn</a> ·
  <a href="mailto:${manifest.links.email}">${manifest.links.email}</a>
</div>

<br>

<div align="center">
  <sub>FRAME 001A · 35MM OPTICAL &amp; LATENT GEOMETRY · UPDATED ${telemetry.lastSynced.slice(0, 10)}</sub>
</div>
`;
}

/**
 * 6. Automated GitHub Actions Workflow (.github/workflows/telemetry.yml)
 */
export function generateGitHubActionYaml(username: string): string {
  return `name: Update Self-Contained SVG Telemetry

on:
  schedule:
    # Runs every 12 hours to refresh repository metrics & language distribution
    - cron: '0 */12 * * *'
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - 'scripts/update-telemetry.mjs'

permissions:
  contents: write

jobs:
  update-profile-svgs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout ${username} Profile Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Fetch Live GitHub Telemetry & Regenerate SVGs
        env:
          GITHUB_USERNAME: ${username}
          GITHUB_TOKEN: \${{ secrets.GH_TOKEN || secrets.PAT_TOKEN || secrets.GITHUB_TOKEN }}
        run: node scripts/update-telemetry.mjs

      - name: Commit & Push Updated SVG Assets
        run: |
          git config --local user.email "actions@github.com"
          git config --local user.name "GitHub Actions Telemetry"
          git add assets/telemetry.svg assets/languages.svg
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore(telemetry): refresh self-contained profile SVG cards" && git push)
`;
}
