import React, { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { ProjectArtifact } from '../utils/profileData';

interface ArchitectureModalProps {
  project: ProjectArtifact | null;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0E1014] border border-[#262934] rounded-xl p-8 text-[#ECEAE4] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-mono-tabular text-[#D99B52] tracking-wider mb-1">
              SEQUENCE {project.sequence} · {project.domain}
            </p>
            <h2
              id="modal-project-title"
              className="text-3xl font-semibold font-serif-display text-[#ECEAE4]"
            >
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project detail modal"
            className="p-2 text-[#94969C] hover:text-[#ECEAE4] rounded-lg border border-[#262934] hover:border-[#3A3F50] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Schematic Visual */}
        <div className="mb-6 p-6 bg-[#07080A] border border-[#1E2028] rounded-lg flex flex-col items-center justify-center">
          {project.diagramType === 'manifold' && (
            <svg viewBox="0 0 420 140" className="w-full h-36">
              <circle cx="210" cy="70" r="56" fill="none" stroke="#262934" strokeDasharray="3 5" />
              <line x1="145" y1="44" x2="210" y2="36" stroke="#D99B52" strokeWidth="1.2" opacity="0.7" />
              <line x1="210" y1="36" x2="268" y2="62" stroke="#D99B52" strokeWidth="1.2" opacity="0.7" />
              <line x1="145" y1="44" x2="195" y2="96" stroke="#94B8D7" strokeWidth="1.2" opacity="0.7" />
              <line x1="195" y1="96" x2="268" y2="62" stroke="#D99B52" strokeWidth="1.2" opacity="0.7" />
              <circle cx="145" cy="44" r="5" fill="#D99B52" />
              <circle cx="210" cy="36" r="5" fill="#ECEAE4" />
              <circle cx="268" cy="62" r="5.5" fill="#94B8D7" />
              <circle cx="195" cy="96" r="4.5" fill="#D99B52" />
              <text x="210" y="132" textAnchor="middle" fill="#94969C" fontSize="10" fontFamily="monospace">
                ASSOCIATIVE VECTOR NEIGHBORHOOD · SEMANTIC RETRIEVAL
              </text>
            </svg>
          )}
          {project.diagramType === 'epistemic' && (
            <svg viewBox="0 0 420 140" className="w-full h-36">
              <circle cx="210" cy="64" r="50" fill="none" stroke="#D99B52" strokeWidth="1.5" strokeDasharray="5 4" />
              <circle cx="210" cy="64" r="28" fill="#D99B52" fillOpacity="0.14" stroke="#ECEAE4" strokeWidth="1.2" />
              <circle cx="210" cy="64" r="3.5" fill="#ECEAE4" />
              <text x="115" y="34" fill="#94969C" fontSize="10" fontFamily="monospace">UNVERIFIED HORIZON</text>
              <text x="210" y="132" textAnchor="middle" fill="#94969C" fontSize="10" fontFamily="monospace">
                EPISTEMIC BOUNDARY · DELIBERATE ABSTENTION OUTSIDE GROUNDING
              </text>
            </svg>
          )}
          {project.diagramType === 'kinematic' && (
            <svg viewBox="0 0 420 140" className="w-full h-36">
              <g stroke="#94B8D7" strokeWidth="1.5" fill="none">
                <polyline points="165,105 190,72 205,32" />
                <polyline points="190,72 225,38 242,22" />
                <polyline points="190,72 240,64 264,56" />
                <polyline points="190,72 232,88 252,94" />
              </g>
              <circle cx="165" cy="105" r="4" fill="#D99B52" />
              <circle cx="190" cy="72" r="4" fill="#ECEAE4" />
              <circle cx="205" cy="32" r="3.5" fill="#94B8D7" />
              <circle cx="242" cy="22" r="3.5" fill="#94B8D7" />
              <circle cx="264" cy="56" r="3.5" fill="#94B8D7" />
              <text x="210" y="132" textAnchor="middle" fill="#94969C" fontSize="10" fontFamily="monospace">
                SPATIAL-TEMPORAL KINEMATICS TO LINGUISTIC TOKENS (ISL)
              </text>
            </svg>
          )}
          {(project.diagramType === 'optical-flow' ||
            project.diagramType === 'segmentation' ||
            project.diagramType === 'game-theory') && (
            <svg viewBox="0 0 420 140" className="w-full h-36">
              <rect x="115" y="24" width="52" height="76" rx="4" fill="none" stroke="#94969C" strokeWidth="1.2" />
              <rect x="184" y="24" width="52" height="76" rx="4" fill="#D99B52" fillOpacity="0.1" stroke="#D99B52" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="253" y="24" width="52" height="76" rx="4" fill="none" stroke="#94969C" strokeWidth="1.2" />
              <line x1="141" y1="52" x2="279" y2="68" stroke="#94B8D7" strokeWidth="1.4" />
              <circle cx="210" cy="60" r="4" fill="#D99B52" />
              <text x="141" y="114" textAnchor="middle" fill="#94969C" fontSize="9.5" fontFamily="monospace">t = 0</text>
              <text x="210" y="114" textAnchor="middle" fill="#D99B52" fontSize="9.5" fontFamily="monospace">t = 0.5</text>
              <text x="279" y="114" textAnchor="middle" fill="#94969C" fontSize="9.5" fontFamily="monospace">t = 1</text>
            </svg>
          )}
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#94969C] mb-1">
              Problem &amp; Core Inquiry
            </h3>
            <p className="text-[#ECEAE4]">{project.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#94969C] mb-1">
              Representation &amp; System Architecture
            </h3>
            <p className="text-[#94969C]">{project.architectureNote}</p>
          </div>

          <div className="pt-4 border-t border-[#1E2028] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#94969C] font-mono-tabular">
              <span>{project.language}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Status: {project.status}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Repo: {project.repoName}</span>
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#07080A] bg-[#D99B52] hover:bg-[#E3AA63] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
