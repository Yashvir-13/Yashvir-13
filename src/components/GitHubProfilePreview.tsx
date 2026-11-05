import React from 'react';
import { BookOpen, ExternalLink, Film, Layers, Mail, Sliders } from 'lucide-react';
import {
  GitHubTelemetryData,
  ProfileManifest,
  ProjectArtifact,
  SvgThemeConfig,
} from '../utils/profileData';
import {
  generateArtifactsSvg,
  generateHeaderSvg,
  generateLanguagesSvg,
  generateTelemetrySvg,
} from '../utils/svgGenerator';

interface GitHubProfilePreviewProps {
  manifest: ProfileManifest;
  telemetry: GitHubTelemetryData;
  svgConfig: SvgThemeConfig;
  onSelectProject: (project: ProjectArtifact) => void;
  onOpenSvgStudio: (assetName?: 'header' | 'artifacts' | 'telemetry' | 'languages') => void;
  onOpenReadmeCode: () => void;
}

export const GitHubProfilePreview: React.FC<GitHubProfilePreviewProps> = ({
  manifest,
  telemetry,
  svgConfig,
  onSelectProject,
  onOpenSvgStudio,
  onOpenReadmeCode,
}) => {
  const headerSvg = generateHeaderSvg(svgConfig, manifest);
  const artifactsSvg = generateArtifactsSvg(manifest.projects, svgConfig);
  const telemetrySvg = generateTelemetrySvg(telemetry, svgConfig);
  const languagesSvg = generateLanguagesSvg(telemetry, svgConfig);

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8">
      {/* Editorial Intro Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-8 border-b border-[#1E2028]">
        <div className="max-w-2xl">
          <p className="text-xs font-mono-tabular text-[#D99B52] tracking-wider mb-2">
            LIVE GITHUB PROFILE MONOGRAPH · {manifest.username.toUpperCase()}
          </p>
          <h1
            className="text-3xl sm:text-4xl font-semibold text-[#ECEAE4] font-serif-display tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Where physical light, gesture, and sound meet machine representation.
          </h1>
          <p className="mt-2 text-sm text-[#94969C] leading-relaxed">
            Below is the live rendering of your upgraded <code className="text-[#ECEAE4]">Yashvir-13/README.md</code> and
            self-contained SVG suite. Broken external stat cards have been replaced with local,
            auto-updating SVG telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenSvgStudio('header')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#ECEAE4] bg-[#12141A] hover:bg-[#191C24] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#D99B52]" />
            <span>Customize SVGs</span>
          </button>
          <button
            type="button"
            onClick={onOpenReadmeCode}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#ECEAE4] bg-[#12141A] hover:bg-[#191C24] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#94B8D7]" />
            <span>Inspect README &amp; Action</span>
          </button>
        </div>
      </div>

      {/* Authentic GitHub 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: GitHub Profile Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex flex-col items-start">
            {/* Oil-painting / Eclipse Styled Avatar Container */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border border-[#262934] bg-[#0E1014] mb-5">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                role="img"
                aria-label="Yashvir Profile Emblem"
              >
                <defs>
                  <radialGradient id="avatar-sky" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#D99B52" stopOpacity="0.65" />
                    <stop offset="45%" stopColor="#3B526B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#090B0E" />
                  </radialGradient>
                </defs>
                <rect width="200" height="200" fill="url(#avatar-sky)" />
                {/* Abstract brushstroke & geometricwindmill/aperture lines evoking the profile oil painting */}
                <g stroke="#ECEAE4" strokeOpacity="0.35" strokeWidth="1.2">
                  <line x1="135" y1="15" x2="115" y2="185" />
                  <line x1="75" y1="45" x2="175" y2="120" />
                  <line x1="165" y1="35" x2="80" y2="135" />
                </g>
                <circle
                  cx="88"
                  cy="98"
                  r="42"
                  fill="#D8B4C8"
                  fillOpacity="0.78"
                  stroke="#ECEAE4"
                  strokeWidth="1.5"
                />
                <path
                  d="M 0 155 Q 65 135 125 162 T 200 148 L 200 200 L 0 200 Z"
                  fill="#8C2D19"
                  fillOpacity="0.65"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-[#ECEAE4] tracking-tight">
              {manifest.displayName.split(' ')[0]}
            </h2>
            <p className="text-sm text-[#94969C] font-mono-tabular mt-0.5">
              {manifest.username} · {manifest.pronouns}
            </p>

            <p className="mt-4 text-sm text-[#ECEAE4] leading-relaxed">{manifest.tagline}</p>

            <div className="mt-4 text-xs text-[#94969C] font-mono-tabular whitespace-nowrap">
              <span>{telemetry.publicRepos} repos</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{telemetry.followers} follower</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{telemetry.following} following</span>
            </div>
          </div>

          <div className="pt-5 border-t border-[#1E2028] space-y-2.5 text-xs text-[#ECEAE4]">
            <div className="flex items-center gap-2.5 text-[#94969C]">
              <Mail className="w-3.5 h-3.5 text-[#D99B52] shrink-0" />
              <a
                href={`mailto:${manifest.links.email}`}
                className="hover:text-[#ECEAE4] transition-colors truncate"
              >
                {manifest.links.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-[#94969C]">
              <Film className="w-3.5 h-3.5 text-[#D99B52] shrink-0" />
              <a
                href={manifest.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ECEAE4] transition-colors truncate"
              >
                yashvirafterhours.me
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-[#94969C]">
              <ExternalLink className="w-3.5 h-3.5 text-[#94B8D7] shrink-0" />
              <a
                href={manifest.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ECEAE4] transition-colors truncate"
              >
                in/yashvir-singh-71281228a
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-[#94969C]">
              <BookOpen className="w-3.5 h-3.5 text-[#94B8D7] shrink-0" />
              <a
                href={manifest.links.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ECEAE4] transition-colors truncate"
              >
                medium.com/@yashvir.126
              </a>
            </div>
          </div>

          {/* Repository Asset Health Summary */}
          <div className="pt-5 border-t border-[#1E2028] space-y-2">
            <p className="text-xs font-mono-tabular text-[#94969C] uppercase tracking-wider">
              Repository SVG Suite
            </p>
            <div className="text-xs text-[#94969C] space-y-1.5">
              <div className="flex items-center justify-between">
                <span>assets/header.svg</span>
                <button
                  type="button"
                  onClick={() => onOpenSvgStudio('header')}
                  className="text-[#D99B52] hover:underline cursor-pointer"
                >
                  Inspect
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>assets/artifacts.svg</span>
                <button
                  type="button"
                  onClick={() => onOpenSvgStudio('artifacts')}
                  className="text-[#D99B52] hover:underline cursor-pointer"
                >
                  Inspect
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>assets/telemetry.svg</span>
                <button
                  type="button"
                  onClick={() => onOpenSvgStudio('telemetry')}
                  className="text-[#D99B52] hover:underline cursor-pointer"
                >
                  Inspect
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>assets/languages.svg</span>
                <button
                  type="button"
                  onClick={() => onOpenSvgStudio('languages')}
                  className="text-[#D99B52] hover:underline cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Rendered Yashvir-13 / README.md Container + Pinned Repositories */}
        <div className="lg:col-span-9 space-y-8">
          <section
            aria-label="Rendered GitHub Profile README"
            className="bg-[#0B0D11] border border-[#1E2028] rounded-xl p-6 sm:p-8 space-y-8"
          >
            {/* GitHub README file header bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2028]">
              <p className="text-xs font-mono-tabular text-[#94969C]">
                <span className="text-[#ECEAE4]">{manifest.username}</span> / README.md
              </p>
              <button
                type="button"
                onClick={() => onOpenSvgStudio('header')}
                className="text-xs font-mono-tabular text-[#D99B52] hover:underline cursor-pointer"
              >
                Tune Header &amp; Telemetry SVGs →
              </button>
            </div>

            {/* 1. Dynamic Header SVG */}
            <div
              className="w-full rounded-lg overflow-hidden border border-[#1E2028] bg-[#050608] cursor-pointer group relative"
              onClick={() => onOpenSvgStudio('header')}
              title="Click to customize header.svg in SVG Studio"
            >
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: headerSvg }}
              />
            </div>

            {/* Philosophical Epigraph (No thick left accent bar per design rules) */}
            <div className="py-3 text-center max-w-2xl mx-auto">
              <p className="text-lg sm:text-xl italic font-serif-display text-[#ECEAE4] leading-relaxed">
                “{manifest.epigraphQuote}”
              </p>
              <p className="mt-1.5 text-xs text-[#94969C] font-mono-tabular">
                — {manifest.epigraphAuthor}
              </p>
            </div>

            {/* Section 01: Perception & Representation */}
            <div className="space-y-4 pt-4 border-t border-[#1E2028]">
              <h3 className="text-xl font-semibold font-serif-display text-[#ECEAE4]">
                01. Perception &amp; Representation
              </h3>
              <p className="text-sm sm:text-base text-[#ECEAE4] leading-relaxed">
                {manifest.observeLead} {manifest.observeBody}
              </p>
              <div className="pt-2 space-y-1.5 text-sm text-[#94969C]">
                <p>
                  <strong className="text-[#ECEAE4] font-medium">Focus:</strong> {manifest.focusAreas}
                </p>
                <p>
                  <strong className="text-[#ECEAE4] font-medium">Current Inquiry:</strong>{' '}
                  {manifest.currentInquiry}
                </p>
                <p>
                  <strong className="text-[#ECEAE4] font-medium">Core Stack:</strong>{' '}
                  {manifest.coreStack}
                </p>
              </div>
            </div>

            {/* Section 02: Selected Works & Research Artifacts */}
            <div className="space-y-5 pt-6 border-t border-[#1E2028]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold font-serif-display text-[#ECEAE4]">
                  02. Selected Works &amp; Research Artifacts
                </h3>
                <span className="text-xs text-[#94969C] font-mono-tabular">
                  Click any work to inspect architecture
                </span>
              </div>

              {/* Self-contained SVG Project Schematic Banner */}
              <div
                onClick={() => onOpenSvgStudio('artifacts')}
                className="w-full rounded-lg overflow-hidden border border-[#1E2028] cursor-pointer"
                title="Click to inspect assets/artifacts.svg"
                dangerouslySetInnerHTML={{ __html: artifactsSvg }}
              />

              {/* Clean Markdown Table Representation */}
              <div className="overflow-x-auto border border-[#1E2028] rounded-lg">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#1E2028] bg-[#0E1014] text-xs font-mono-tabular text-[#94969C]">
                      <th className="py-3 px-4 w-16">Seq</th>
                      <th className="py-3 px-4 w-48">Subject</th>
                      <th className="py-3 px-4">Inquiry &amp; Architecture</th>
                      <th className="py-3 px-4 w-44 text-right">Medium &amp; State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2028]">
                    {manifest.projects.map((proj) => (
                      <tr
                        key={proj.sequence}
                        onClick={() => onSelectProject(proj)}
                        className="hover:bg-[#12151C] transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono-tabular text-xs text-[#D99B52]">
                          {proj.sequence}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#ECEAE4]">
                          <span className="underline decoration-[#262934] hover:decoration-[#D99B52] underline-offset-4">
                            {proj.title}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#94969C] leading-relaxed">
                          {proj.description}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono-tabular text-xs text-[#94969C] whitespace-nowrap">
                          {proj.language} · {proj.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 03: Repository Telemetry (Fixes broken github-readme-stats images) */}
            <div className="space-y-4 pt-6 border-t border-[#1E2028]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold font-serif-display text-[#ECEAE4]">
                  03. Repository Telemetry &amp; Mediums
                </h3>
                <span className="text-xs font-mono-tabular text-[#94969C]">
                  Self-contained SVGs · Auto-updated via GitHub Actions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => onOpenSvgStudio('telemetry')}
                  className="rounded-lg overflow-hidden border border-[#1E2028] cursor-pointer hover:border-[#D99B52]/50 transition-colors"
                  title="Click to customize assets/telemetry.svg"
                  dangerouslySetInnerHTML={{ __html: telemetrySvg }}
                />
                <div
                  onClick={() => onOpenSvgStudio('languages')}
                  className="rounded-lg overflow-hidden border border-[#1E2028] cursor-pointer hover:border-[#94B8D7]/50 transition-colors"
                  title="Click to customize assets/languages.svg"
                  dangerouslySetInnerHTML={{ __html: languagesSvg }}
                />
              </div>
            </div>

            {/* Section 04: After Hours — Cinema, Music, Poetry & Philosophy */}
            <div className="space-y-4 pt-6 border-t border-[#1E2028]">
              <h3 className="text-xl font-semibold font-serif-display text-[#ECEAE4]">
                04. After Hours — Cinema, Music, Poetry &amp; Philosophy
              </h3>
              <p className="text-sm text-[#ECEAE4] leading-relaxed">
                {manifest.offlineReflection}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {manifest.creativeNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-lg bg-[#0E1014] border border-[#1E2028] space-y-2"
                  >
                    <p className="text-xs font-mono-tabular text-[#D99B52]">
                      {note.medium} · {note.title}
                    </p>
                    <p className="text-xs sm:text-sm text-[#94969C] leading-relaxed">
                      {note.reflection}
                    </p>
                    {note.linkUrl && (
                      <a
                        href={note.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#ECEAE4] hover:text-[#D99B52] transition-colors pt-1"
                      >
                        <span>{note.linkLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Clean Footer Links inside README */}
              <div className="pt-6 border-t border-[#1E2028] flex flex-wrap items-center justify-between gap-4 text-xs text-[#94969C]">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={manifest.links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ECEAE4] hover:text-[#D99B52] transition-colors"
                  >
                    After Hours Portfolio
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={manifest.links.medium}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ECEAE4] hover:text-[#D99B52] transition-colors"
                  >
                    Medium Essays
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={manifest.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ECEAE4] hover:text-[#D99B52] transition-colors"
                  >
                    YouTube Visual Essay
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={manifest.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ECEAE4] hover:text-[#D99B52] transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
                <span className="font-mono-tabular">
                  FRAME 001A · UPDATED {telemetry.lastSynced.slice(0, 10)}
                </span>
              </div>
            </div>
          </section>

          {/* Pinned Repositories Grid (Matching user screenshot 3) */}
          <section aria-label="Pinned Repositories" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-[#ECEAE4]">Pinned Repositories</h2>
              <span className="text-xs text-[#94969C] font-mono-tabular">
                Click any repository card to inspect architecture schematic
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {manifest.projects.map((proj) => (
                <div
                  key={proj.repoName}
                  onClick={() => onSelectProject(proj)}
                  className="p-5 rounded-xl bg-[#0B0D11] border border-[#1E2028] hover:border-[#2E3342] transition-colors flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#94B8D7] hover:underline">
                        <Layers className="w-4 h-4 text-[#94969C] shrink-0" />
                        <span className="line-clamp-1">{proj.repoName}</span>
                      </div>
                      <span className="text-xs font-mono-tabular text-[#94969C] shrink-0">
                        Public
                      </span>
                    </div>
                    <p className="mt-2.5 text-xs text-[#94969C] leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E2028]/60 flex items-center justify-between text-xs text-[#94969C] font-mono-tabular">
                    <span>
                      {proj.language} · {proj.domain.split(' · ')[0]}
                    </span>
                    {proj.stars ? <span>★ {proj.stars}</span> : <span>Seq {proj.sequence}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
