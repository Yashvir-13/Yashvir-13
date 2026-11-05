export interface ProjectArtifact {
  sequence: string;
  title: string;
  repoName: string;
  url: string;
  domain: string;
  language: string;
  status: 'Active' | 'Complete';
  stars?: number;
  description: string;
  architectureNote: string;
  diagramType: 'manifold' | 'epistemic' | 'kinematic' | 'optical-flow' | 'segmentation' | 'game-theory';
}

export interface CreativeNote {
  id: string;
  medium: 'Cinema & Direction' | 'Music & Acoustics' | 'Poetry & Essays' | 'Philosophy of Mind';
  title: string;
  reflection: string;
  detail: string;
  linkLabel?: string;
  linkUrl?: string;
}

export interface LanguageMetric {
  name: string;
  percentage: number;
  bytes: number;
  color: string;
}

export interface GitHubTelemetryData {
  username: string;
  name: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  activeStreams: number;
  primaryStack: string;
  lastSynced: string;
  source: 'live-github-api' | 'repository-snapshot';
  languages: LanguageMetric[];
  recentRepos: {
    name: string;
    description: string;
    language: string;
    updatedAt: string;
    url: string;
    stars: number;
  }[];
}

export interface SvgThemeConfig {
  paletteId: 'tungsten-monograph' | 'silver-halide' | 'cyan-optical';
  grainOpacity: number;
  harmonicAmplitude: number;
  apertureRadius: number;
  showFilmMarkers: boolean;
  animateElements: boolean;
  useRelativeAssetPaths: boolean;
}

export interface ProfileManifest {
  username: string;
  displayName: string;
  pronouns: string;
  tagline: string;
  epigraphQuote: string;
  epigraphAuthor: string;
  observeLead: string;
  observeBody: string;
  focusAreas: string;
  currentInquiry: string;
  coreStack: string;
  offlineReflection: string;
  links: {
    github: string;
    portfolio: string;
    linkedin: string;
    medium: string;
    youtube: string;
    email: string;
  };
  projects: ProjectArtifact[];
  creativeNotes: CreativeNote[];
}

export const PALETTE_PRESETS: Record<
  SvgThemeConfig['paletteId'],
  {
    label: string;
    subtitle: string;
    bgInner: string;
    bgOuter: string;
    primaryAccent: string;
    secondaryAccent: string;
    textPrimary: string;
    textMuted: string;
    ruleColor: string;
  }
> = {
  'tungsten-monograph': {
    label: '35mm Tungsten & Silver',
    subtitle: 'Warm darkroom amber with silver-halide highlights',
    bgInner: '#121318',
    bgOuter: '#060709',
    primaryAccent: '#D99B52',
    secondaryAccent: '#94B8D7',
    textPrimary: '#ECEAE4',
    textMuted: '#94969C',
    ruleColor: '#262934',
  },
  'silver-halide': {
    label: 'Monochrome Silver-Halide',
    subtitle: 'High-contrast archival contact sheet monochrome',
    bgInner: '#14161A',
    bgOuter: '#050608',
    primaryAccent: '#E2E8F0',
    secondaryAccent: '#94A3B8',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    ruleColor: '#272A30',
  },
  'cyan-optical': {
    label: 'Anamorphic Optical Slate',
    subtitle: 'Cool optical glass cyan with warm ivory prose',
    bgInner: '#0F151C',
    bgOuter: '#05070A',
    primaryAccent: '#7CC4E8',
    secondaryAccent: '#D99B52',
    textPrimary: '#ECF0F5',
    textMuted: '#8E9BAE',
    ruleColor: '#1E2936',
  },
};

export const DEFAULT_SVG_CONFIG: SvgThemeConfig = {
  paletteId: 'tungsten-monograph',
  grainOpacity: 0.48,
  harmonicAmplitude: 22,
  apertureRadius: 96,
  showFilmMarkers: true,
  animateElements: true,
  useRelativeAssetPaths: true,
};

export const INITIAL_PROFILE_MANIFEST: ProfileManifest = {
  username: 'Yashvir-13',
  displayName: 'Yashvir Singh',
  pronouns: 'he/him',
  tagline: 'Exploring AI, systems, and ideas around intelligence',
  epigraphQuote:
    'The machine does not isolate man from the great problems of nature but plunges him more deeply into them.',
  epigraphAuthor: 'Antoine de Saint-Exupéry, Wind, Sand and Stars (1939)',
  observeLead:
    'I write software to study perception, representation, and the boundary between human and machine interpretation.',
  observeBody:
    'My work sits where physical reality—light, motion, gesture, and language—is translated into mathematical structure. Rather than treating neural architectures as opaque black boxes, I care about the geometry of the latent spaces inside them, and how classical constraints can keep modern systems honest. Outside of code, that same curiosity pulls me toward filmmaking, music, poetry, and philosophy: different ways of framing time, silence, and human attention.',
  focusAreas: 'Intelligent Systems · Computer Vision · Representation Geometry',
  currentInquiry: 'Classical physical & epistemic constraints in modern neural architectures',
  coreStack: 'Python · PyTorch · C/C++ · OpenCV · TypeScript',
  offlineReflection:
    'When I step away from the terminal, I spend my time behind a lens capturing still and moving images, listening to and studying music, and writing essays and poetry on perception and human agency.',
  links: {
    github: 'https://github.com/Yashvir-13',
    portfolio: 'https://www.yashvirafterhours.me/',
    linkedin: 'https://www.linkedin.com/in/yashvir-singh-71281228a',
    medium: 'https://medium.com/@yashvir.126',
    youtube: 'https://www.youtube.com/watch?v=5Uh2H4MIgHY&t=9s',
    email: 'yashvir.126@gmail.com',
  },
  projects: [
    {
      sequence: '01',
      title: 'Asteria',
      repoName: 'Asteria',
      url: 'https://github.com/Yashvir-13/Asteria',
      domain: 'Information Retrieval · Associative Memory',
      language: 'Python',
      status: 'Active',
      description:
        'A system exploring how scattered information can be retrieved, connected, and made genuinely useful through an associative interface.',
      architectureNote:
        'Maps documents and queries into a shared vector neighborhood so related ideas surface by semantic proximity rather than rigid keyword folders.',
      diagramType: 'manifold',
    },
    {
      sequence: '02',
      title: 'Fathom',
      repoName: 'An-Epistemically-Constrained-Philosophical-Conversational-Agent',
      url: 'https://github.com/Yashvir-13/An-Epistemically-Constrained-Philosophical-Conversational-Agent',
      domain: 'Epistemology · Constrained Reasoning',
      language: 'Python',
      status: 'Complete',
      description:
        'An experiment in constrained conversational reasoning—giving a system deliberate boundaries on what it can claim to know.',
      architectureNote:
        'Enforces an explicit epistemic horizon: propositions outside verified grounding are recognized as uncertain rather than confabulated.',
      diagramType: 'epistemic',
    },
    {
      sequence: '03',
      title: 'Samvedna',
      repoName: 'Indian-Sign-Language-Recognition',
      url: 'https://github.com/Yashvir-13/Indian-Sign-Language-Recognition',
      domain: 'Computer Vision · Gesture Translation',
      language: 'Python · OpenCV',
      status: 'Active',
      description:
        'Translating continuous visual gesture into machine-readable language, using Indian Sign Language (ISL) as the grounding domain.',
      architectureNote:
        'Extracts spatial-temporal hand and posture landmarks across video frames to bridge visual kinematics and linguistic tokens.',
      diagramType: 'kinematic',
    },
    {
      sequence: '04',
      title: 'Cinematic Frame Interpolation',
      repoName: 'Cinematic-Frame-Interpolation-Using-Classical-Techniques',
      url: 'https://github.com/Yashvir-13/Cinematic-Frame-Interpolation-Using-Classical-Techniques',
      domain: 'Optical Flow · Computational Cinematography',
      language: 'Python · C/C++',
      status: 'Complete',
      description:
        'Generating intermediate motion frames by treating dense motion estimation as the core problem, relying on classical optical flow.',
      architectureNote:
        'Computes bidirectional displacement fields between consecutive film frames (t0, t1) to warp and blend temporal intermediates without neural hallucination.',
      diagramType: 'optical-flow',
    },
    {
      sequence: '05',
      title: 'DenseNet121 Scene Segmentation',
      repoName: 'Semantic-Segmenation-using-DenseNet121',
      url: 'https://github.com/Yashvir-13/Semantic-Segmenation-using-DenseNet121',
      domain: 'Dense Prediction · Representation',
      language: 'Jupyter Notebook · PyTorch',
      status: 'Complete',
      description:
        'Pixel-level semantic segmentation on Pascal VOC using a DenseNet121 encoder paired with a U-Net multi-scale skip-connection decoder.',
      architectureNote:
        'Preserves fine spatial boundaries from early convolutional layers while integrating deep semantic context across feature scales.',
      diagramType: 'segmentation',
    },
    {
      sequence: '06',
      title: 'Multi-LLM Game-Theoretic Agents',
      repoName: 'Studying-Multi-LLM-agents-behaviour-in-game-theoretic-environments',
      url: 'https://github.com/Yashvir-13/Studying-Multi-LLM-agents-behaviour-in-game-theoretic-environments',
      domain: 'Game Theory · Multi-Agent Systems',
      language: 'Python',
      status: 'Active',
      stars: 1,
      description:
        'Studying how multiple language model agents cooperate, defect, and adapt strategies inside repeated game-theoretic environments.',
      architectureNote:
        'Evaluates payoff matrices, memory horizons, and equilibrium stability across iterative multi-agent interactions.',
      diagramType: 'game-theory',
    },
  ],
  creativeNotes: [
    {
      id: 'cinema',
      medium: 'Cinema & Direction',
      title: 'Light, Frame & Temporal Pacing',
      reflection:
        'Filmmaking and computer vision ask the exact same first question: what happens when three-dimensional light is projected onto a two-dimensional plane over time? Studying optical flow made me a more attentive editor; cutting film taught me what motion vectors miss.',
      detail: '35mm & digital cinematography · Visual essays · Pacing & montage',
      linkLabel: 'Watch Visual Essay on YouTube',
      linkUrl: 'https://www.youtube.com/watch?v=5Uh2H4MIgHY&t=9s',
    },
    {
      id: 'music',
      medium: 'Music & Acoustics',
      title: 'Harmonic Structure & Resonance',
      reflection:
        'Music is geometry you can feel before you can name it. Whether analyzing Fourier transforms in signal processing or listening to a sustained chord resolve, the tension between mathematical ratio and human emotion stays constant.',
      detail: 'Acoustic analysis · Ambient & instrumental studies · Signal phase',
      linkLabel: 'Explore After Hours Archive',
      linkUrl: 'https://www.yashvirafterhours.me/',
    },
    {
      id: 'poetry',
      medium: 'Poetry & Essays',
      title: 'Precision Without Verbosity',
      reflection:
        'Good poetry and good code share an economy of language. Every word or line of logic should carry weight. I write essays and verse to slow down thoughts that move too quickly in a terminal window.',
      detail: 'Long-form essays · Aphorisms · Notes on technology & solitude',
      linkLabel: 'Read Essays on Medium',
      linkUrl: 'https://medium.com/@yashvir.126',
    },
    {
      id: 'philosophy',
      medium: 'Philosophy of Mind',
      title: 'The Boundary of What Machines Know',
      reflection:
        'Wittgenstein wrote that the limits of my language mean the limits of my world. In machine learning, the architecture and loss function define what a model can perceive—and what remains outside its epistemic boundary.',
      detail: 'Epistemology · Phenomenology of perception · Representation limits',
      linkLabel: 'Inspect Fathom Repository',
      linkUrl: 'https://github.com/Yashvir-13/An-Epistemically-Constrained-Philosophical-Conversational-Agent',
    },
  ],
};

export const INITIAL_TELEMETRY_DATA: GitHubTelemetryData = {
  username: 'Yashvir-13',
  name: 'Yashvir',
  bio: 'Exploring AI, systems, and ideas around intelligence',
  publicRepos: 32,
  followers: 1,
  following: 0,
  totalStars: 4,
  activeStreams: 6,
  primaryStack: 'Python · PyTorch · C/C++ · OpenCV',
  lastSynced: '2026-11-05T15:50:00Z',
  source: 'repository-snapshot',
  languages: [
    { name: 'Python', percentage: 73.3, bytes: 549000, color: '#D99B52' },
    { name: 'Jupyter Notebook', percentage: 13.3, bytes: 99750, color: '#94B8D7' },
    { name: 'TypeScript', percentage: 6.7, bytes: 50250, color: '#ECEAE4' },
    { name: 'C/C++ & Systems', percentage: 6.7, bytes: 50250, color: '#6E7685' },
  ],
  recentRepos: [
    {
      name: 'Asteria',
      description: 'A system exploring how information can be retrieved, connected, and made useful through an AI-driven interface.',
      language: 'Python',
      updatedAt: '2026-10',
      url: 'https://github.com/Yashvir-13/Asteria',
      stars: 1,
    },
    {
      name: 'Studying-Multi-LLM-agents-behaviour-in-game-theoretic-environments',
      description: 'Studying Multi-LLM agents behaviour in game-theoretic environments.',
      language: 'Python',
      updatedAt: '2026-10',
      url: 'https://github.com/Yashvir-13/Studying-Multi-LLM-agents-behaviour-in-game-theoretic-environments',
      stars: 1,
    },
    {
      name: 'Cinematic-Frame-Interpolation-Using-Classical-Techniques',
      description: 'Generating intermediate frames by treating motion estimation as the core problem, relying on classical optical flow.',
      language: 'Python',
      updatedAt: '2026-09',
      url: 'https://github.com/Yashvir-13/Cinematic-Frame-Interpolation-Using-Classical-Techniques',
      stars: 1,
    },
    {
      name: 'An-Epistemically-Constrained-Philosophical-Conversational-Agent',
      description: 'An experiment in constrained conversational reasoning—giving a system deliberate boundaries on what it can claim to know.',
      language: 'Python',
      updatedAt: '2026-08',
      url: 'https://github.com/Yashvir-13/An-Epistemically-Constrained-Philosophical-Conversational-Agent',
      stars: 1,
    },
  ],
};
