import React from 'react';

export type StudioTab = 'profile' | 'svg-studio' | 'monograph' | 'readme-code';

interface TopBarProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  onSyncGitHub: () => void;
  isSyncing: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onSyncGitHub,
  isSyncing,
}) => {
  const navItems: { id: StudioTab; label: string }[] = [
    { id: 'profile', label: 'Profile Canvas' },
    { id: 'svg-studio', label: 'SVG Studio' },
    { id: 'monograph', label: 'Systems & Cinema' },
    { id: 'readme-code', label: 'README & Action' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-[#07080A]/95 backdrop-blur-md border-b border-[#1E2028]">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('profile');
        }}
        className="text-xl font-semibold tracking-tight text-[#ECEAE4] whitespace-nowrap shrink-0 font-serif-display"
      >
        Yashvir Singh
      </a>

      {/* Zone 2: 4 concise single-line text navigation links */}
      <nav aria-label="Primary Workspace Views" className="flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b ${
                isActive
                  ? 'text-[#ECEAE4] border-[#D99B52]'
                  : 'text-[#94969C] border-transparent hover:text-[#ECEAE4]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onSyncGitHub}
          disabled={isSyncing}
          className="px-4 py-2 text-xs font-medium text-[#07080A] bg-[#D99B52] hover:bg-[#E3AA63] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isSyncing ? 'Syncing GitHub...' : 'Sync Live Stats'}
        </button>
      </div>
    </header>
  );
};
