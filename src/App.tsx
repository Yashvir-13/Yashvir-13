import React, { useEffect, useState } from 'react';
import { ArchitectureModal } from './components/ArchitectureModal';
import { GitHubProfilePreview } from './components/GitHubProfilePreview';
import { ReadmeWorkflowView } from './components/ReadmeWorkflowView';
import { SvgAssetKey, SvgStudioView } from './components/SvgStudioView';
import { SystemsCinemaView } from './components/SystemsCinemaView';
import { StudioTab, TopBar } from './components/TopBar';
import {
  DEFAULT_SVG_CONFIG,
  GitHubTelemetryData,
  INITIAL_PROFILE_MANIFEST,
  INITIAL_TELEMETRY_DATA,
  ProfileManifest,
  ProjectArtifact,
  SvgThemeConfig,
} from './utils/profileData';

export function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>('profile');
  const [activeSvgAsset, setActiveSvgAsset] = useState<SvgAssetKey>('header');
  const [manifest, setManifest] = useState<ProfileManifest>(INITIAL_PROFILE_MANIFEST);
  const [telemetry, setTelemetry] = useState<GitHubTelemetryData>(INITIAL_TELEMETRY_DATA);
  const [svgConfig, setSvgConfig] = useState<SvgThemeConfig>(DEFAULT_SVG_CONFIG);
  const [selectedProject, setSelectedProject] = useState<ProjectArtifact | null>(null);
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [isSavingRepo, setIsSavingRepo] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const syncRepoFilesToDisk = async (
    nextManifest = manifest,
    nextTelemetry = telemetry,
    nextConfig = svgConfig
  ) => {
    setIsSavingRepo(true);
    try {
      const res = await fetch('/api/sync-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manifest: nextManifest,
          telemetry: nextTelemetry,
          config: nextConfig,
        }),
      });
      if (res.ok) {
        setSaveBanner('Saved README.md & 4 SVGs to repo');
        setTimeout(() => setSaveBanner(null), 3000);
      }
    } catch {
      // Ignore network error in offline mode
    } finally {
      setIsSavingRepo(false);
    }
  };

  const handleSyncGitHub = async () => {
    setIsSyncingGitHub(true);
    try {
      const res = await fetch(
        `/api/github-telemetry?username=${encodeURIComponent(manifest.username)}`
      );
      if (res.ok) {
        const data = (await res.json()) as GitHubTelemetryData;
        setTelemetry(data);
        await syncRepoFilesToDisk(manifest, data, svgConfig);
      }
    } catch {
      // Keep snapshot if offline
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  useEffect(() => {
    // Fetch live GitHub telemetry on mount
    handleSyncGitHub();
  }, []);

  const handleOpenSvgStudio = (asset: SvgAssetKey = 'header') => {
    setActiveSvgAsset(asset);
    setActiveTab('svg-studio');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#07080A] text-[#ECEAE4]">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSyncGitHub={handleSyncGitHub}
        isSyncing={isSyncingGitHub}
      />

      <main className="flex-1">
        {activeTab === 'profile' && (
          <GitHubProfilePreview
            manifest={manifest}
            telemetry={telemetry}
            svgConfig={svgConfig}
            onSelectProject={setSelectedProject}
            onOpenSvgStudio={handleOpenSvgStudio}
            onOpenReadmeCode={() => setActiveTab('readme-code')}
          />
        )}

        {activeTab === 'svg-studio' && (
          <SvgStudioView
            activeAsset={activeSvgAsset}
            onSelectAsset={setActiveSvgAsset}
            config={svgConfig}
            onChangeConfig={setSvgConfig}
            manifest={manifest}
            telemetry={telemetry}
            onSaveToRepo={() => syncRepoFilesToDisk(manifest, telemetry, svgConfig)}
            isSaving={isSavingRepo}
            saveStatus={saveBanner}
          />
        )}

        {activeTab === 'monograph' && (
          <SystemsCinemaView
            manifest={manifest}
            onChangeManifest={setManifest}
            onSelectProject={setSelectedProject}
            onSaveToRepo={() => syncRepoFilesToDisk(manifest, telemetry, svgConfig)}
            isSaving={isSavingRepo}
          />
        )}

        {activeTab === 'readme-code' && (
          <ReadmeWorkflowView
            manifest={manifest}
            telemetry={telemetry}
            config={svgConfig}
            onSaveToRepo={() => syncRepoFilesToDisk(manifest, telemetry, svgConfig)}
            isSaving={isSavingRepo}
            saveStatus={saveBanner}
          />
        )}
      </main>

      <footer className="border-t border-[#1E2028] py-6 px-6 text-xs text-[#94969C]">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>
            {manifest.displayName} ({manifest.username}) · Profile Repository &amp; SVG Monograph Studio
          </span>
          <div className="flex items-center gap-3">
            <a
              href={manifest.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ECEAE4] transition-colors"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={manifest.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ECEAE4] transition-colors"
            >
              After Hours
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={manifest.links.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ECEAE4] transition-colors"
            >
              Medium
            </a>
          </div>
        </div>
      </footer>

      <ArchitectureModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
