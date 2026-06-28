import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Calendar, Sparkles, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../UI/Button';

interface ChangelogVersion {
  id: number;
  version: string;
  release_date: string;
  sections: { title: string; items: string[] }[];
}

interface VersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_VERSIONS: ChangelogVersion[] = [
  {
    id: 3,
    version: '1.1.1',
    release_date: 'June 28, 2026',
    sections: [
      { title: 'New Features', items: ['**Audit Logs** tab in Settings for full activity history', '**Version changelog** modal accessible from sidebar', 'Expanded dashboard with **Team Leaderboard** chart'] },
      { title: 'Bug Fixes', items: ['Fixed pagination reset on search in DataTable', 'Resolved `Sidebar` active state flicker on route change', 'Corrected `PageLayout` breadcrumb overflow on narrow screens'] },
    ],
  },
  {
    id: 2,
    version: '1.1.0',
    release_date: 'June 15, 2026',
    sections: [
      { title: 'New Features', items: ['**Help Center** page with module FAQ accordion', 'Quick-launch cards for **User Guide**, **Getting Started**, **Schema Reference**', '`SearchInput` component with debounced filtering'] },
      { title: 'Enhancements', items: ['Migrated design system to **Outfit** font family', 'Unified button variants across all `Button` components', '`Card` component now supports `title` / `description` / `actions` slots'] },
    ],
  },
  {
    id: 1,
    version: '1.0.0',
    release_date: 'June 1, 2026',
    sections: [
      { title: 'Initial Release', items: ['Dashboard with revenue charts and KPI cards', 'Order and Quotation management pages', 'Customer and Inventory management', 'Financial reporting module', 'Settings and Support pages'] },
    ],
  },
];

const parseMarkdown = (text: string): React.ReactNode => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-extrabold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const VersionsModal: React.FC<VersionsModalProps> = ({ isOpen, onClose }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedVersions = showAll ? MOCK_VERSIONS : MOCK_VERSIONS.slice(0, 1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="What's New (Versions)"
      className="max-w-4xl"
      footer={
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            className="shadow-lg shadow-blue-500/10 rounded-xl"
          >
            Looks good, thanks!
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm text-slate-700 max-h-[65vh] overflow-y-auto pr-3 scrollbar-thin">
        <div className="space-y-8">
          {displayedVersions.map((v, idx) => (
            <div key={v.id} className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <span className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg">
                  Version {v.version}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} className="text-slate-300" />
                  {v.release_date} {idx === 0 && <span className="text-blue-500 font-extrabold text-[9px] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded ml-1 tracking-widest">LATEST</span>}
                </span>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-slate-100/80">
                {v.sections.map((section) => (
                  <section key={section.title} className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {section.title.toLowerCase().includes('bug') ? (
                          <Bug size={13} className="text-rose-500 animate-pulse" />
                      ) : (
                        <Sparkles size={13} className="text-amber-500" />
                      )}
                      {section.title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs leading-relaxed font-medium">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{parseMarkdown(item)}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          ))}

          {MOCK_VERSIONS.length > 1 && (
            <div className="flex justify-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-all flex items-center gap-1.5 py-2 px-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-100 active:scale-[0.98]"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={14} />
                    Show newest release only
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Show older release history ({MOCK_VERSIONS.length - 1} more)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
