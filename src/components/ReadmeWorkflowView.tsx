import React, { useState } from 'react';
import { Check, Copy, Download, Save } from 'lucide-react';
import {
  GitHubTelemetryData,
  ProfileManifest,
  SvgThemeConfig,
} from '../utils/profileData';
import {
  generateArtifactsSvg,
  generateGitHubActionYaml,
  generateHeaderSvg,
  generateLanguagesSvg,
  generateReadmeMarkdown,
  generateTelemetrySvg,
} from '../utils/svgGenerator';

interface ReadmeWorkflowViewProps {
  manifest: ProfileManifest;
  telemetry: GitHubTelemetryData;
  config: SvgThemeConfig;
  onSaveToRepo: () => void;
  isSaving: boolean;
  saveStatus: string | null;
}

export const ReadmeWorkflowView: React.FC<ReadmeWorkflowViewProps> = ({
  manifest,
  telemetry,
  config,
  onSaveToRepo,
  isSaving,
  saveStatus,
}) => {
  const [copiedKey, setCopiedKey] = useState<'readme' | 'action' | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [pushMessage, setPushMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const readmeContent = generateReadmeMarkdown(manifest, telemetry, config);
  const workflowYaml = generateGitHubActionYaml(manifest.username);

  const handleCopy = async (key: 'readme' | 'action', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const handleDownloadAllFiles = () => {
    const files: { name: string; content: string; type: string }[] = [
      { name: 'README.md', content: readmeContent, type: 'text/markdown;charset=utf-8' },
      {
        name: 'header.svg',
        content: generateHeaderSvg(config, manifest),
        type: 'image/svg+xml;charset=utf-8',
      },
      {
        name: 'artifacts.svg',
        content: generateArtifactsSvg(manifest.projects, config),
        type: 'image/svg+xml;charset=utf-8',
      },
      {
        name: 'telemetry.svg',
        content: generateTelemetrySvg(telemetry, config),
        type: 'image/svg+xml;charset=utf-8',
      },
      {
        name: 'languages.svg',
        content: generateLanguagesSvg(telemetry, config),
        type: 'image/svg+xml;charset=utf-8',
      },
    ];

    files.forEach((file, idx) => {
      setTimeout(() => {
        const blob = new Blob([file.content], { type: file.type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, idx * 180);
    });
  };

  const githubNewWorkflowUrl = `https://github.com/${encodeURIComponent(
    manifest.username
  )}/${encodeURIComponent(
    manifest.username
  )}/new/main?filename=${encodeURIComponent(
    '.github/workflows/telemetry.yml'
  )}&value=${encodeURIComponent(workflowYaml)}`;

  const handlePushToGitHub = async () => {
    setIsPushing(true);
    setPushMessage(null);
    try {
      const res = await fetch('/api/push-to-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manifest, telemetry, config }),
      });
      const rawText = await res.text();
      let data: { ok?: boolean; pushedFiles?: string[]; workflowPushed?: boolean; error?: string } = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = {
          ok: false,
          error:
            'Your GitHub token in GH_TOKEN / GITHUB_TOKEN is read-only. Click the AI Studio GitHub icon in the top-right bar to sync README.md & SVGs, or click "Install Workflow on GitHub ↗" below to activate the automated Action.',
        };
      }

      if (data.ok) {
        const wfNote = data.workflowPushed
          ? ' (including .github/workflows/telemetry.yml)'
          : ' (use "Install Workflow on GitHub ↗" below if .github/workflows/telemetry.yml is not yet in your repo)';
        setPushMessage({
          ok: true,
          text: `Pushed ${data.pushedFiles?.length || 6} files directly to github.com/${manifest.username}/${manifest.username}${wfNote}`,
        });
      } else {
        setPushMessage({
          ok: false,
          text: data.error || 'Could not push to GitHub',
        });
      }
    } catch {
      setPushMessage({
        ok: false,
        text: 'Could not reach server. Make sure the preview server is running or use the AI Studio GitHub sync button in the top-right toolbar.',
      });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1E2028]">
        <div>
          <p className="text-xs font-mono-tabular text-[#D99B52] tracking-wider mb-1">
            COMMIT-READY REPOSITORY ARTIFACTS
          </p>
          <h1 className="text-3xl font-semibold font-serif-display text-[#ECEAE4]">
            README.md &amp; Automated GitHub Actions Telemetry
          </h1>
          <p className="mt-1.5 text-sm text-[#94969C] max-w-2xl">
            Your <code className="text-[#ECEAE4]">/README.md</code>, four{' '}
            <code className="text-[#ECEAE4]">/assets/*.svg</code> files, and{' '}
            <code className="text-[#ECEAE4]">/scripts/update-telemetry.mjs</code> are saved to the
            workspace root. We keep <code className="text-[#ECEAE4]">.github/workflows</code> off local
            disk so AI Studio&apos;s GitHub OAuth sync button never fails with workflow permission errors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadAllFiles}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#ECEAE4] bg-[#12141A] hover:bg-[#191C24] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#94B8D7]" />
            <span>Download All 5 Files</span>
          </button>

          <button
            type="button"
            onClick={onSaveToRepo}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#ECEAE4] bg-[#12141A] hover:bg-[#191C24] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {saveStatus ? <Check className="w-3.5 h-3.5 text-[#D99B52]" /> : <Save className="w-3.5 h-3.5 text-[#94B8D7]" />}
            <span>{isSaving ? 'Syncing Disk...' : saveStatus || 'Sync Files to Disk'}</span>
          </button>

          <button
            type="button"
            onClick={handlePushToGitHub}
            disabled={isPushing}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#07080A] bg-[#D99B52] hover:bg-[#E3AA63] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{isPushing ? 'Pushing to GitHub...' : 'Push to GitHub Repo'}</span>
          </button>
        </div>
      </div>

      {pushMessage && (
        <div
          role="status"
          className={`p-4 rounded-xl border text-xs font-mono-tabular leading-relaxed ${
            pushMessage.ok
              ? 'bg-[#0E1512] border-[#264032] text-[#ECEAE4]'
              : 'bg-[#171112] border-[#42262A] text-[#ECEAE4]'
          }`}
        >
          {pushMessage.text}
        </div>
      )}

      {/* 2-Column Code View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: /README.md */}
        <section className="p-6 bg-[#0B0D11] border border-[#1E2028] rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-[#ECEAE4]">/README.md</h2>
              <p className="text-xs text-[#94969C] font-mono-tabular">
                References self-contained ./assets/header.svg, artifacts.svg, telemetry.svg, languages.svg
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('readme', readmeContent)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ECEAE4] bg-[#141720] hover:bg-[#1C202C] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedKey === 'readme' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D99B52]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#94969C]" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-[#07080A] border border-[#1E2028] rounded-lg text-xs font-mono-tabular text-[#ECEAE4] overflow-x-auto max-h-[540px] leading-relaxed">
            <code>{readmeContent}</code>
          </pre>
        </section>

        {/* Column 2: /.github/workflows/telemetry.yml */}
        <section className="p-6 bg-[#0B0D11] border border-[#1E2028] rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-[#ECEAE4]">
                /.github/workflows/telemetry.yml
              </h2>
              <p className="text-xs text-[#94969C] font-mono-tabular">
                Runs scripts/update-telemetry.mjs every 12h &amp; commits updated SVGs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={githubNewWorkflowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#07080A] bg-[#D99B52] hover:bg-[#E3AA63] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Install Workflow on GitHub ↗</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy('action', workflowYaml)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ECEAE4] bg-[#141720] hover:bg-[#1C202C] border border-[#262934] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedKey === 'action' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#D99B52]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#94969C]" />
                    <span>Copy YAML</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-[#11131A] border border-[#222634] rounded-lg text-xs text-[#94969C] leading-relaxed">
            <strong className="text-[#ECEAE4]">How Auto-Sync Works:</strong>{' '}
            <code className="text-[#94B8D7]">scripts/update-telemetry.mjs</code> is already synced in
            your repository. Click <strong className="text-[#D99B52]">Install Workflow on GitHub ↗</strong>{' '}
            above once—it opens GitHub with <code className="text-[#ECEAE4]">.github/workflows/telemetry.yml</code>{' '}
            pre-filled. Click <strong className="text-[#ECEAE4]">Commit changes</strong>, and GitHub
            Actions will automatically run every 12 hours (using GitHub&apos;s built-in{' '}
            <code className="text-[#ECEAE4]">GITHUB_TOKEN</code>) to refresh your repo count, yearly
            contributions, and language distribution SVGs.
          </div>

          <pre className="p-4 bg-[#07080A] border border-[#1E2028] rounded-lg text-xs font-mono-tabular text-[#94B8D7] overflow-x-auto max-h-[460px] leading-relaxed">
            <code>{workflowYaml}</code>
          </pre>
        </section>
      </div>
    </div>
  );
};
