import React from 'react';
import { Check, Download, Save } from 'lucide-react';
import {
  GitHubTelemetryData,
  PALETTE_PRESETS,
  ProfileManifest,
  SvgThemeConfig,
} from '../utils/profileData';
import {
  generateArtifactsSvg,
  generateHeaderSvg,
  generateLanguagesSvg,
  generateTelemetrySvg,
} from '../utils/svgGenerator';

export type SvgAssetKey = 'header' | 'artifacts' | 'telemetry' | 'languages';

interface SvgStudioViewProps {
  activeAsset: SvgAssetKey;
  onSelectAsset: (asset: SvgAssetKey) => void;
  config: SvgThemeConfig;
  onChangeConfig: (next: SvgThemeConfig) => void;
  manifest: ProfileManifest;
  telemetry: GitHubTelemetryData;
  onSaveToRepo: () => void;
  isSaving: boolean;
  saveStatus: string | null;
}

export const SvgStudioView: React.FC<SvgStudioViewProps> = ({
  activeAsset,
  onSelectAsset,
  config,
  onChangeConfig,
  manifest,
  telemetry,
  onSaveToRepo,
  isSaving,
  saveStatus,
}) => {
  const svgs: Record<SvgAssetKey, { filename: string; title: string; subtitle: string; content: string }> = {
    header: {
      filename: 'assets/header.svg',
      title: 'Optical & Acoustic Monograph Header',
      subtitle: '1200×420 · Combines eclipse aperture geometry, harmonic waves, and 35mm film grain',
      content: generateHeaderSvg(config, manifest),
    },
    artifacts: {
      filename: 'assets/artifacts.svg',
      title: 'Selected Works & Architecture Schematics',
      subtitle: '1192×336 · Vector manifold, epistemic boundary, ISL kinematics, and optical flow',
      content: generateArtifactsSvg(manifest.projects, config),
    },
    telemetry: {
      filename: 'assets/telemetry.svg',
      title: 'Self-Contained Repository Telemetry Card',
      subtitle: '580×220 · Replaces broken external github-readme-stats image with local SVG',
      content: generateTelemetrySvg(telemetry, config),
    },
    languages: {
      filename: 'assets/languages.svg',
      title: 'Languages & Experimental Mediums Card',
      subtitle: '580×220 · Replaces broken external top-langs image with local proportional SVG',
      content: generateLanguagesSvg(telemetry, config),
    },
  };

  const currentSvg = svgs[activeAsset];

  const handleDownloadSvg = () => {
    const blob = new Blob([currentSvg.content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentSvg.filename.replace('assets/', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1E2028]">
        <div>
          <p className="text-xs font-mono-tabular text-[#D99B52] tracking-wider mb-1">
            INTERACTIVE SVG ASSET STUDIO
          </p>
          <h1 className="text-3xl font-semibold font-serif-display text-[#ECEAE4]">
            Optical, Acoustic &amp; Telemetry SVG Generator
          </h1>
          <p className="mt-1.5 text-sm text-[#94969C] max-w-2xl">
            Every visual banner and telemetry card in your repository is a pure, self-contained SVG.
            Tune the optical aperture, harmonic phase waves, and color grade below, then write the
            updated files directly to <code className="text-[#ECEAE4]">/assets/</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#ECEAE4] bg-[#12141A] hover:bg-[#191C24] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#94B8D7]" />
            <span>Download {currentSvg.filename.replace('assets/', '')}</span>
          </button>

          <button
            type="button"
            onClick={onSaveToRepo}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#07080A] bg-[#D99B52] hover:bg-[#E3AA63] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {saveStatus ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Writing Files...' : saveStatus || 'Write All Assets to Repo'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: High-Resolution Live SVG Canvas & Selector */}
        <div className="lg:col-span-8 space-y-6">
          {/* Segmented Asset Selector */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0E1014] border border-[#1E2028] rounded-xl">
            {(Object.keys(svgs) as SvgAssetKey[]).map((key) => {
              const isSelected = activeAsset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectAsset(key)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C2029] text-[#ECEAE4] border border-[#2E3442]'
                      : 'text-[#94969C] hover:text-[#ECEAE4]'
                  }`}
                >
                  {svgs[key].filename}
                </button>
              );
            })}
          </div>

          {/* Active SVG Preview Stage */}
          <div className="p-6 bg-[#0B0D11] border border-[#1E2028] rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-[#ECEAE4]">{currentSvg.title}</h2>
                <p className="text-xs text-[#94969C] font-mono-tabular">{currentSvg.subtitle}</p>
              </div>
              <span className="text-xs font-mono-tabular text-[#D99B52]">
                {currentSvg.content.length.toLocaleString()} bytes
              </span>
            </div>

            <div className="p-4 bg-[#050608] border border-[#1E2028] rounded-lg flex items-center justify-center min-h-[280px]">
              <div
                className="w-full max-w-full"
                dangerouslySetInnerHTML={{ __html: currentSvg.content }}
              />
            </div>
          </div>

          {/* Raw SVG Source Preview */}
          <div className="p-6 bg-[#0B0D11] border border-[#1E2028] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#94969C]">
                Generated SVG Markup ({currentSvg.filename})
              </h3>
              <span className="text-xs font-mono-tabular text-[#94969C]">
                Zero external dependencies · GitHub Camo safe
              </span>
            </div>
            <pre className="p-4 bg-[#07080A] border border-[#1E2028] rounded-lg text-xs font-mono-tabular text-[#94969C] overflow-x-auto max-h-60">
              <code>{currentSvg.content}</code>
            </pre>
          </div>
        </div>

        {/* Right 4 Columns: Parameter Controls */}
        <aside className="lg:col-span-4 p-6 bg-[#0B0D11] border border-[#1E2028] rounded-xl space-y-6">
          <div>
            <h2 className="text-base font-medium text-[#ECEAE4]">Optical &amp; Film Parameters</h2>
            <p className="text-xs text-[#94969C] mt-1">
              Adjust the visual language across your SVG suite.
            </p>
          </div>

          {/* Color Grade Preset */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[#94969C]">
              Color Grade &amp; Emulsion
            </label>
            <div className="space-y-2">
              {(Object.keys(PALETTE_PRESETS) as Array<SvgThemeConfig['paletteId']>).map((pid) => {
                const preset = PALETTE_PRESETS[pid];
                const isSelected = config.paletteId === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, paletteId: pid })}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#141720] border-[#D99B52] text-[#ECEAE4]'
                        : 'bg-[#0E1014] border-[#1E2028] text-[#94969C] hover:border-[#2E3442]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#ECEAE4]">{preset.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.primaryAccent }}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.secondaryAccent }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-[#94969C] mt-1">{preset.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-4 border-t border-[#1E2028]">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="aperture-slider" className="text-[#ECEAE4]">
                  Eclipse / Aperture Radius
                </label>
                <span className="font-mono-tabular text-[#D99B52]">{config.apertureRadius}px</span>
              </div>
              <input
                id="aperture-slider"
                type="range"
                min={70}
                max={118}
                value={config.apertureRadius}
                onChange={(e) =>
                  onChangeConfig({ ...config, apertureRadius: Number(e.target.value) })
                }
                className="w-full accent-[#D99B52] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="harmonic-slider" className="text-[#ECEAE4]">
                  Harmonic Wave Amplitude
                </label>
                <span className="font-mono-tabular text-[#D99B52]">
                  {config.harmonicAmplitude}px
                </span>
              </div>
              <input
                id="harmonic-slider"
                type="range"
                min={6}
                max={42}
                value={config.harmonicAmplitude}
                onChange={(e) =>
                  onChangeConfig({ ...config, harmonicAmplitude: Number(e.target.value) })
                }
                className="w-full accent-[#D99B52] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="grain-slider" className="text-[#ECEAE4]">
                  35mm Film Grain Density
                </label>
                <span className="font-mono-tabular text-[#D99B52]">
                  {Math.round(config.grainOpacity * 100)}%
                </span>
              </div>
              <input
                id="grain-slider"
                type="range"
                min={0}
                max={80}
                value={Math.round(config.grainOpacity * 100)}
                onChange={(e) =>
                  onChangeConfig({ ...config, grainOpacity: Number(e.target.value) / 100 })
                }
                className="w-full accent-[#D99B52] cursor-pointer"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-4 border-t border-[#1E2028] text-xs">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-[#ECEAE4]">35mm Contact Sheet Frame Markers</span>
              <input
                type="checkbox"
                checked={config.showFilmMarkers}
                onChange={(e) =>
                  onChangeConfig({ ...config, showFilmMarkers: e.target.checked })
                }
                className="accent-[#D99B52] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-[#ECEAE4]">Subtle SVG Breathing &amp; Ring Rotation</span>
              <input
                type="checkbox"
                checked={config.animateElements}
                onChange={(e) =>
                  onChangeConfig({ ...config, animateElements: e.target.checked })
                }
                className="accent-[#D99B52] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-[#ECEAE4]">Use Relative Asset Paths (./assets/*.svg)</span>
              <input
                type="checkbox"
                checked={config.useRelativeAssetPaths}
                onChange={(e) =>
                  onChangeConfig({ ...config, useRelativeAssetPaths: e.target.checked })
                }
                className="accent-[#D99B52] w-4 h-4"
              />
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
};
