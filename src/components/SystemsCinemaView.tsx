import React from 'react';
import { ExternalLink, Save } from 'lucide-react';
import { ProfileManifest, ProjectArtifact } from '../utils/profileData';

interface SystemsCinemaViewProps {
  manifest: ProfileManifest;
  onChangeManifest: (next: ProfileManifest) => void;
  onSelectProject: (project: ProjectArtifact) => void;
  onSaveToRepo: () => void;
  isSaving: boolean;
}

export const SystemsCinemaView: React.FC<SystemsCinemaViewProps> = ({
  manifest,
  onChangeManifest,
  onSelectProject,
  onSaveToRepo,
  isSaving,
}) => {
  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1E2028]">
        <div className="max-w-2xl">
          <p className="text-xs font-mono-tabular text-[#D99B52] tracking-wider mb-2">
            CURATED MONOGRAPH · AI, VISION, CINEMA, MUSIC &amp; PHILOSOPHY
          </p>
          <h1
            className="text-3xl sm:text-4xl font-semibold font-serif-display text-[#ECEAE4]"
            style={{ textWrap: 'balance' }}
          >
            Honest notes on perception, representation, and life away from the terminal.
          </h1>
          <p className="mt-2 text-sm text-[#94969C] leading-relaxed">
            Explore the architectural diagrams behind your six core systems alongside your reflections
            on cinema, music, poetry, and philosophy—or edit your manifesto text below to update{' '}
            <code className="text-[#ECEAE4]">README.md</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={onSaveToRepo}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#07080A] bg-[#D99B52] hover:bg-[#E3AA63] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving to README.md...' : 'Save Prose Edits to Repo'}</span>
        </button>
      </div>

      {/* Bento Grid of 6 Selected Systems */}
      <section aria-label="Systems and Research Architecture Bento" className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold font-serif-display text-[#ECEAE4]">
            01. Systems &amp; Representation Architectures
          </h2>
          <span className="text-xs font-mono-tabular text-[#94969C]">
            6 curated repositories · Click any card for full schematic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {manifest.projects.map((proj, index) => {
            const isWide = index === 0 || index === 3;
            return (
              <div
                key={proj.sequence}
                onClick={() => onSelectProject(proj)}
                className={`${
                  isWide ? 'md:col-span-2' : 'md:col-span-1'
                } p-6 rounded-2xl bg-[#0B0D11] border border-[#1E2028] hover:border-[#D99B52]/60 transition-colors flex flex-col justify-between cursor-pointer`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 text-xs font-mono-tabular text-[#94969C]">
                    <span className="text-[#D99B52] truncate">
                      {proj.sequence} · {proj.domain}
                    </span>
                    <span className="shrink-0">{proj.status}</span>
                  </div>

                  <h3 className="text-2xl font-semibold font-serif-display text-[#ECEAE4]">
                    {proj.title}
                  </h3>

                  <p className="text-sm text-[#ECEAE4] leading-relaxed">{proj.description}</p>
                  <p className="text-xs text-[#94969C] leading-relaxed">{proj.architectureNote}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2028] flex items-center justify-between text-xs font-mono-tabular text-[#94969C]">
                  <span>{proj.language}</span>
                  <span className="text-[#D99B52]">Inspect Schematic →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Four Disciplines: Cinema, Music, Poetry, Philosophy */}
      <section aria-label="Cinema, Music, Poetry and Philosophy" className="space-y-5 pt-4 border-t border-[#1E2028]">
        <div>
          <h2 className="text-2xl font-semibold font-serif-display text-[#ECEAE4]">
            02. Film, Music, Poetry &amp; Philosophy
          </h2>
          <p className="text-sm text-[#94969C] mt-1">
            How artistic disciplines inform your approach to machine intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {manifest.creativeNotes.map((item, idx) => (
            <article
              key={item.id}
              className="p-6 rounded-2xl bg-[#0B0D11] border border-[#1E2028] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <p className="text-xs font-mono-tabular text-[#D99B52]">
                  0{idx + 1}. {item.medium.toUpperCase()}
                </p>
                <h3 className="text-2xl font-semibold font-serif-display text-[#ECEAE4]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#ECEAE4] leading-relaxed">{item.reflection}</p>
              </div>

              <div className="pt-4 border-t border-[#1E2028] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94969C]">
                <span>{item.detail}</span>
                {item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#D99B52] hover:underline"
                  >
                    <span>{item.linkLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Honest Prose Editor for README.md */}
      <section aria-label="Edit Manifesto Prose" className="p-6 rounded-2xl bg-[#0B0D11] border border-[#1E2028] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#ECEAE4]">
              03. Refine Profile Prose &amp; Epigraph
            </h2>
            <p className="text-xs text-[#94969C]">
              Changes here immediately update both the live GitHub preview and exported README.md.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="epigraph-input" className="block text-xs font-mono-tabular text-[#94969C]">
              Epigraph Quote
            </label>
            <textarea
              id="epigraph-input"
              rows={2}
              value={manifest.epigraphQuote}
              onChange={(e) =>
                onChangeManifest({ ...manifest, epigraphQuote: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-[#07080A] border border-[#262934] text-sm text-[#ECEAE4] focus:outline-none focus:border-[#D99B52]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="observe-lead-input" className="block text-xs font-mono-tabular text-[#94969C]">
              Opening Line (01. Perception &amp; Representation)
            </label>
            <textarea
              id="observe-lead-input"
              rows={2}
              value={manifest.observeLead}
              onChange={(e) =>
                onChangeManifest({ ...manifest, observeLead: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-[#07080A] border border-[#262934] text-sm text-[#ECEAE4] focus:outline-none focus:border-[#D99B52]"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="observe-body-input" className="block text-xs font-mono-tabular text-[#94969C]">
              Core Reflection Paragraph
            </label>
            <textarea
              id="observe-body-input"
              rows={3}
              value={manifest.observeBody}
              onChange={(e) =>
                onChangeManifest({ ...manifest, observeBody: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-[#07080A] border border-[#262934] text-sm text-[#ECEAE4] focus:outline-none focus:border-[#D99B52]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
