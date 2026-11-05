import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  DEFAULT_SVG_CONFIG,
  GitHubTelemetryData,
  INITIAL_PROFILE_MANIFEST,
  INITIAL_TELEMETRY_DATA,
  ProfileManifest,
  SvgThemeConfig,
} from './src/utils/profileData';
import {
  generateArtifactsSvg,
  generateGitHubActionYaml,
  generateHeaderSvg,
  generateLanguagesSvg,
  generateReadmeMarkdown,
  generateTelemetrySvg,
} from './src/utils/svgGenerator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

async function writeRepositoryAssets(
  manifest: ProfileManifest,
  telemetry: GitHubTelemetryData,
  config: SvgThemeConfig
): Promise<string[]> {
  const assetsDir = path.join(__dirname, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });

  const headerSvg = generateHeaderSvg(config, manifest);
  const telemetrySvg = generateTelemetrySvg(telemetry, config);
  const languagesSvg = generateLanguagesSvg(telemetry, config);
  const artifactsSvg = generateArtifactsSvg(manifest.projects, config);
  const readmeMd = generateReadmeMarkdown(manifest, telemetry, config);

  await Promise.all([
    fs.writeFile(path.join(assetsDir, 'header.svg'), headerSvg, 'utf8'),
    fs.writeFile(path.join(assetsDir, 'telemetry.svg'), telemetrySvg, 'utf8'),
    fs.writeFile(path.join(assetsDir, 'languages.svg'), languagesSvg, 'utf8'),
    fs.writeFile(path.join(assetsDir, 'artifacts.svg'), artifactsSvg, 'utf8'),
    fs.writeFile(path.join(__dirname, 'README.md'), readmeMd, 'utf8'),
  ]);

  return [
    'README.md',
    'assets/header.svg',
    'assets/artifacts.svg',
    'assets/telemetry.svg',
    'assets/languages.svg',
  ];
}

function getAllGitHubTokens(): string[] {
  const candidates = [
    process.env.GH_TOKEN,
    process.env.gh_token,
    process.env.GITHUB_TOKEN,
    process.env.github_token,
    process.env.PERSONAL_ACCESS_TOKEN,
  ]
    .map((t) => (t ? t.trim() : ''))
    .filter(Boolean);
  return Array.from(new Set(candidates));
}

function resolveGitHubToken(): string | undefined {
  return getAllGitHubTokens()[0];
}

async function fetchGitHubTelemetry(username: string): Promise<GitHubTelemetryData & { authenticated?: boolean }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Yashvir-13-Profile-Studio',
  };
  const token = resolveGitHubToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        { headers }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return {
        ...INITIAL_TELEMETRY_DATA,
        lastSynced: new Date().toISOString(),
        source: 'repository-snapshot',
        authenticated: Boolean(token),
      };
    }

    const userJson = (await userRes.json()) as {
      login?: string;
      name?: string;
      bio?: string;
      public_repos?: number;
      followers?: number;
      following?: number;
    };
    const reposJson = (await reposRes.json()) as Array<{
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      updated_at: string;
      html_url: string;
      fork: boolean;
    }>;

    const ownRepos = Array.isArray(reposJson) ? reposJson.filter((r) => !r.fork) : [];
    const totalStars = ownRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    // Compute language distribution across repositories
    const langCounts: Record<string, number> = {};
    for (const repo of ownRepos) {
      const lang = repo.language || 'Python';
      langCounts[lang] = (langCounts[lang] || 0) + 1;
    }

    const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const paletteColors = ['#D99B52', '#94B8D7', '#ECEAE4', '#6E7685'];
    const sortedLangs = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count], idx) => ({
        name: name === 'C++' || name === 'C' ? 'C / C++' : name,
        percentage: Number(((count / totalLangRepos) * 100).toFixed(1)),
        bytes: count * 25000,
        color: paletteColors[idx] || '#6E7685',
      }));

    // Ensure percentages sum to 100%
    if (sortedLangs.length > 0) {
      const sumOthers = sortedLangs.slice(1).reduce((acc, item) => acc + item.percentage, 0);
      sortedLangs[0].percentage = Number(Math.max(10, 100 - sumOthers).toFixed(1));
    }

    return {
      username: userJson.login || username,
      name: userJson.name || 'Yashvir',
      bio: userJson.bio || INITIAL_TELEMETRY_DATA.bio,
      publicRepos: userJson.public_repos ?? INITIAL_TELEMETRY_DATA.publicRepos,
      followers: userJson.followers ?? INITIAL_TELEMETRY_DATA.followers,
      following: userJson.following ?? INITIAL_TELEMETRY_DATA.following,
      totalStars: Math.max(totalStars, 1),
      activeStreams: INITIAL_PROFILE_MANIFEST.projects.length,
      primaryStack: INITIAL_TELEMETRY_DATA.primaryStack,
      lastSynced: new Date().toISOString(),
      source: 'live-github-api',
      authenticated: Boolean(token),
      languages: sortedLangs.length >= 2 ? sortedLangs : INITIAL_TELEMETRY_DATA.languages,
      recentRepos:
        ownRepos.length > 0
          ? ownRepos.slice(0, 6).map((r) => ({
              name: r.name,
              description: r.description || 'Research implementation & experimental system.',
              language: r.language || 'Python',
              updatedAt: (r.updated_at || '').slice(0, 7),
              url: r.html_url,
              stars: r.stargazers_count || 0,
            }))
          : INITIAL_TELEMETRY_DATA.recentRepos,
    };
  } catch {
    return {
      ...INITIAL_TELEMETRY_DATA,
      lastSynced: new Date().toISOString(),
      source: 'repository-snapshot',
      authenticated: Boolean(token),
    };
  }
}

async function startServer() {
  // Fetch live telemetry on boot (using GITHUB_TOKEN / github_token if set) and write assets
  const initialTelemetry = await fetchGitHubTelemetry(INITIAL_PROFILE_MANIFEST.username);
  await writeRepositoryAssets(
    INITIAL_PROFILE_MANIFEST,
    initialTelemetry,
    DEFAULT_SVG_CONFIG
  );

  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Serve generated SVG assets directly so /assets/*.svg works in preview and README
  app.use('/assets', express.static(path.join(__dirname, 'assets')));

  app.get('/api/github-telemetry', async (req, res) => {
    const username = String(req.query.username || 'Yashvir-13');
    const telemetry = await fetchGitHubTelemetry(username);
    res.json(telemetry);
  });

  app.post('/api/sync-repo', async (req, res) => {
    try {
      const manifest: ProfileManifest = req.body.manifest || INITIAL_PROFILE_MANIFEST;
      const telemetry: GitHubTelemetryData = req.body.telemetry || INITIAL_TELEMETRY_DATA;
      const config: SvgThemeConfig = req.body.config || DEFAULT_SVG_CONFIG;

      const filesWritten = await writeRepositoryAssets(manifest, telemetry, config);
      res.json({
        ok: true,
        filesWritten,
        authenticated: Boolean(resolveGitHubToken()),
        syncedAt: new Date().toISOString(),
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to write repository assets',
      });
    }
  });

  app.post('/api/push-to-github', async (req, res) => {
    const tokens = getAllGitHubTokens();
    if (tokens.length === 0) {
      res.status(400).json({
        ok: false,
        error:
          'No GitHub token detected in server environment (GH_TOKEN or GITHUB_TOKEN). All files are already saved to your workspace—click the GitHub icon in the top-right AI Studio toolbar to push.',
      });
      return;
    }

    try {
      const manifest: ProfileManifest = req.body.manifest || INITIAL_PROFILE_MANIFEST;
      const telemetry: GitHubTelemetryData = req.body.telemetry || INITIAL_TELEMETRY_DATA;
      const config: SvgThemeConfig = req.body.config || DEFAULT_SVG_CONFIG;

      await writeRepositoryAssets(manifest, telemetry, config);

      const owner = manifest.username;
      const repo = manifest.username;
      const filesToPush = [
        'README.md',
        'assets/header.svg',
        'assets/artifacts.svg',
        'assets/telemetry.svg',
        'assets/languages.svg',
        'scripts/update-telemetry.mjs',
      ];

      let lastError = '';
      for (const token of tokens) {
        const headers = {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Yashvir-13-Profile-Studio',
          'Content-Type': 'application/json',
        };

        const pushedFiles: string[] = [];
        let tokenFailedWith403 = false;

        for (const relPath of filesToPush) {
          const fullPath = path.join(__dirname, relPath);
          const contentText = await fs.readFile(fullPath, 'utf8');
          const contentBase64 = Buffer.from(contentText, 'utf8').toString('base64');

          const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${relPath}`;
          const existingRes = await fetch(apiUrl, { headers });
          let sha: string | undefined;
          if (existingRes.ok) {
            const existingJson = (await existingRes.json()) as { sha?: string };
            sha = existingJson.sha;
          }

          const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              message: `chore(profile): update ${relPath} via Profile Monograph Studio`,
              content: contentBase64,
              ...(sha ? { sha } : {}),
            }),
          });

          if (putRes.ok) {
            pushedFiles.push(relPath);
          } else {
            const errBody = await putRes.text();
            lastError = `GitHub API (${relPath}): ${putRes.status} ${errBody.slice(0, 140)}`;
            if (putRes.status === 403 || putRes.status === 401) {
              tokenFailedWith403 = true;
              break;
            }
            throw new Error(lastError);
          }
        }

        if (!tokenFailedWith403 && pushedFiles.length === filesToPush.length) {
          res.json({
            ok: true,
            pushedFiles,
            repoUrl: `https://github.com/${owner}/${repo}`,
          });
          return;
        }
      }

      // If we reach here, all provided tokens returned 403/401 on write
      res.status(403).json({
        ok: false,
        error:
          'Your GitHub Personal Access Token is currently Read-Only (403 Resource not accessible by personal access token). Either: (1) Click the GitHub icon in the top-right AI Studio bar to push the saved workspace files directly, or (2) In GitHub → Settings → Developer settings → Fine-grained tokens, set Repository permissions → "Contents" to "Read and write" for Yashvir-13/Yashvir-13.',
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to push files to GitHub',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yashvir-13 Profile Studio running on http://localhost:${PORT}`);
  });
}

startServer();
