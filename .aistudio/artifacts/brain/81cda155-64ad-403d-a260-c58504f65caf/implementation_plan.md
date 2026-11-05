# Yashvir-13 — Dynamic GitHub Profile Repository & Interactive SVG Studio

An upgraded, self-contained GitHub profile repository (`README.md`, custom animated SVG assets, and automated GitHub Actions telemetry workflow) paired with a live interactive web studio on port 3000 for previewing, tuning, and exporting every asset. Designed around an honest, abstract intersection of cinema, music, poetry, philosophy, and machine perception—free of AI clichés or pretentious jargon.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Why the Dev Server Didn't Start Yet**: Your imported GitHub repository currently contains only `/README.md` and `/assets/header.svg` (no `package.json` or web server on port 3000), and Planning Mode pauses file creation until you approve the plan. Click **Proceed** on this plan card to immediately bootstrap the port 3000 dev server, build the interactive SVG Studio, and generate your upgraded GitHub profile assets.

- **Confirmed Deliverable**: Complete GitHub Profile Repository (`README.md`, `assets/*.svg`, `.github/workflows/telemetry.yml`) + Interactive Live Preview & SVG Studio Web App running on port 3000 (fixes the dev server startup).
- **Confirmed Aesthetic & Tone**: Abstract monograph curating filmmaking, cinema, music, poetry, and philosophy alongside AI/ML and computer science—written in direct, honest, unpretentious language with zero mechanical buzzwords.
- **Confirmed Dynamic Capabilities**:
  1. Self-contained custom SVG telemetry & language cards (replacing the broken external Vercel stats images).
  2. Upgraded abstract SVG header and animated project architecture/artifact SVGs.
  3. GitHub Actions workflow (`telemetry.yml`) + Node script that pulls live GitHub API data and regenerates the SVG telemetry cards automatically.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **GitHub Profile Repository**: Upgrades `/README.md` and `/assets/` with custom-crafted, self-contained animated SVGs (Header, Optical/Acoustic Monograph Divider, Live Telemetry & Language Breakdown, and Project Architecture Cards) plus a GitHub Action that keeps repository statistics updated without relying on fragile third-party image servers.
  2. **Interactive Profile & SVG Studio (Port 3000)**: A live web application that fixes the missing dev server, renders a faithful GitHub Profile dark-mode canvas alongside an interactive SVG inspector and live GitHub API sync tool, and writes changes directly to the repository files.
- **Target Audience / Persona**: Engineers, researchers, filmmakers, and collaborators visiting `github.com/Yashvir-13` or exploring Yashvir's work in AI Studio.
- **Key Value**: Eliminates broken external stats images permanently, unifies computer vision/AI work with cinema, music, and philosophy in an authentic voice, and provides an interactive studio to preview and export every SVG and Markdown section.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **GitHub Profile Canvas (Default View)**: Opens directly to a high-craft preview of how `Yashvir-13/README.md` renders on GitHub, complete with live data fetched from `api.github.com/users/Yashvir-13`, the new abstract cinema/optics SVG banner, curated project artifacts (*Asteria*, *Fathom*, *Samvedna*, *Frame Interpolation*, *Semantic Segmentation*, *Multi-LLM Game Theory*), self-contained SVG telemetry, and notes on film, music, and writing.
2. **SVG Asset Inspector & Visual Tuner**: Clicking any SVG artwork (or selecting the **SVG Studio** view) opens a dedicated canvas where you can inspect individual SVG layers (35mm film grain, optical aperture geometry, harmonic sine waves, project architecture diagrams), tweak visual parameters (grain opacity, warm tungsten vs. silver-halide accent, animation cadence), and save updated SVGs directly to `/assets/` or download them.
3. **Live Telemetry & GitHub Actions Sync**: Clicking **Sync Live GitHub Data** fetches real-time repository metrics, language byte counts, and recent activity from the GitHub API, immediately updating the self-contained `assets/telemetry.svg` and `assets/languages.svg` files and previewing the automated GitHub Actions workflow.
4. **Markdown & Export Workspace**: View and copy the exact `README.md` source, inspect the `.github/workflows/telemetry.yml` automation script, or save prose edits directly to the repository.

### Visual Identity & Theme
- **Aesthetic Direction**: *35mm Silver-Halide & Optical Monograph* — inspired by Criterion Collection essays, analog contact sheets, acoustic harmonic oscilloscopes, and geometric studies of light and perception.
- **Color Palette & Mood (60-30-10 Discipline)**:
  - **60% Dominant Neutral Canvas**: Deep darkroom obsidian (`#07080A` / `--background`) with subtle warm carbon surfaces (`#0E1014`).
  - **30% Structural Surfaces & Typography**: Soft silver-halide ivory (`#ECEAE4`) for primary prose, muted warm slate (`#94969C`) for secondary notes, and subtle `1px` hairline rules (`#1E2028`).
  - **10% Focal Accent**: Warm tungsten amber (`#D99B52`) paired with optical cyan-silver (`#94B8D7`) strictly for active focal geometry, harmonic wave highlights, and primary interactive controls.
- **Typography & Hierarchy (2+1 Font Rule)**:
  - *Expressive Editorial Display*: `Cormorant Garamond` (for philosophical quotes, literary kickers, and monograph headings).
  - *Primary UI & Body Prose*: `Plus Jakarta Sans` (clean, unpretentious readability for project descriptions and controls).
  - *Data & Telemetry*: `JetBrains Mono` with `tabular-nums` (strictly for sequence numbers, optical/EXIF coordinates, and repository metrics).
- **Component Styling & Anti-Slop Discipline**:
  - Clean 3-zone top bar contract (`Yashvir Singh` wordmark — 4 single-line view links — `Sync Live Stats` primary action).
  - Zero static pill enclosures: project domains, languages, and statuses render as clean unboxed typography separated by `·`.
  - Honest, human section headings (`01. Perception & Systems`, `02. Selected Works`, `03. Repository Telemetry`, `04. Film, Music & Writing`) replacing mechanical `//` code-comment headers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Self-Hosted SVG Telemetry + GitHub Actions vs. Third-Party Stat Image URLs**
  - *Chosen Approach*: Generate local, self-contained SVG files (`assets/telemetry.svg` and `assets/languages.svg`) inside the repository, backed by a scheduled GitHub Actions workflow (`.github/workflows/telemetry.yml`) and a live Express/client sync endpoint.
  - *Why*: As seen in the current profile screenshots, `github-readme-stats.vercel.app` frequently rate-limits or fails on GitHub's Camo proxy, leaving broken image icons. Local SVGs in your own repo load 100% of the time with zero external dependencies and match your custom aesthetic.
- **Decision 2: Abstract Visual Synthesis of Cinema, Music, Philosophy & AI**
  - *Chosen Approach*: Design the SVG suite around three visual motifs that bridge your interests naturally: (1) **Optical Aperture & Light Geometry** (computer vision & cinematography), (2) **Harmonic Phase Curves** (music & signal processing), and (3) **Epistemic Horizon & Film Grain** (philosophy & analog filmmaking).
  - *Why*: Conveys depth and personal taste visually without resorting to wordy, pretentious paragraphs.
- **Decision 3: Full-Stack Live Workspace Sync**
  - *Chosen Approach*: Include a lightweight Express server alongside the Vite React frontend so any changes you make in the Studio (regenerating SVGs with live GitHub stats or editing `README.md`) are written directly to `/README.md` and `/assets/*.svg` on disk.
  - *Why*: Ensures the repository files in your workspace are always commit-ready for GitHub while giving you an immediate visual studio on port 3000.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   GitHub REST API (users/Yashvir-13 & repos)                │
└───────────────────┬─────────────────────────────────────┬───────────────────┘
                    │ Live Fetch                          │ Scheduled Cron
                    ▼                                     ▼
┌───────────────────────────────────────┐   ┌─────────────────────────────────┐
│   Interactive Studio App (Port 3000)  │   │   GitHub Actions Workflow       │
│  ┌─────────────────────────────────┐  │   │  (.github/workflows/update.yml) │
│  │ Top Bar (3-Zone Navigation)     │  │   └─────────────────┬───────────────┘
│  ├─────────────────┬───────────────┤  │                     │ Runs
│  │ GitHub Profile  │ SVG & Asset   │  │                     ▼
│  │ Live Preview    │ Inspector     │  │   ┌─────────────────────────────────┐
│  │ (Dark Canvas)   │ (Live Tuner)  │  │   │   SVG & README Generator Engine │
│  └────────┬────────┴───────┬───────┘  │   │  • Header (Aperture & Harmonics)│
│           │                │          │   │  • Project Architecture SVGs    │
│           ▼                ▼          │   │  • Telemetry & Language SVGs    │
│  ┌─────────────────────────────────┐  │   └─────────────────┬───────────────┘
│  │ Express Local File Sync API     ├──┼─────────────────────┘
│  │ (POST /api/sync-repo)           │  │     Writes Directly To Disk
│  └─────────────────────────────────┘  │                     │
└───────────────────────────────────────┘                     ▼
                                            ┌─────────────────────────────────┐
                                            │   Repository Files (Commit-Ready│
                                            │  • /README.md                   │
                                            │  • /assets/header.svg           │
                                            │  • /assets/telemetry.svg        │
                                            │  • /assets/languages.svg        │
                                            │  • /assets/projects/*.svg       │
                                            └─────────────────────────────────┘
```

### Data Model & State
- **Profile Manifest (`ProfileConfig`)**: Holds curated biographical copy, philosophical epigraph, selected works (*Asteria*, *Fathom*, *Samvedna*, *Frame Interpolation*, *Semantic Segmentation*, *Multi-LLM Game Theory*), creative pursuits (filmmaking, music, essays), and visual SVG parameters (grain density, harmonic frequency, accent tone).
- **Live Telemetry State (`GitHubTelemetry`)**: Real-time statistics fetched from `https://api.github.com/users/Yashvir-13` and `/repos` (public repositories, total stars, language breakdown across Python, Jupyter Notebook, C/C++, TypeScript, recent push timestamps, and top active repositories), with resilient fallback to cached snapshot data if rate-limited.

### Interactive Component & State Mapping
- **View Switcher (Top Bar)**: Switches cleanly between `Profile Preview` (full GitHub UI simulation), `SVG Gallery & Tuner` (interactive layer inspection for all repository SVGs), `README & Action Code` (raw Markdown and workflow YAML viewer/editor), and `Off-Terminal & Cinema Notes`.
- **Live GitHub Sync Handler**: Fetches live data from GitHub's API, recalculates language percentages and commit/repo telemetry, regenerates `/assets/telemetry.svg` and `/assets/languages.svg`, and persists them to the workspace via `POST /api/save-assets`.
- **SVG Parameter Controls**: Interactive sliders and palette toggles that dynamically update the SVG DOM in real time and allow one-click saving to `/assets/` or downloading individual `.svg` files.
