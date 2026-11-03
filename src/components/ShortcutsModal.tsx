import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1', desc: 'Jump to Command HUD & Global Telemetry' },
    { key: '2', desc: 'Jump to Interactive Shell & Traces' },
    { key: '3', desc: 'Jump to Architecture Blueprints' },
    { key: '4', desc: 'Jump to Canary Releases & Deployments' },
    { key: '5', desc: 'Jump to Config Playground & Tuning' },
    { key: '⌘K / Ctrl+K', desc: 'Open Command Palette' },
    { key: '` (Backtick)', desc: 'Toggle Quick Terminal Dock' },
    { key: '?', desc: 'Show Keyboard Shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close open dialogs or drawers' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010f1f]/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-[#0d1c2d] border border-[#334155] rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.2)] p-6 space-y-4 font-mono animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="font-bold text-sm text-[#F8FAFC]">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => {
              soundFX.playKeyClick();
              onClose();
            }}
            className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#051424] border border-[#1E293B]">
              <span className="text-[#94A3B8]">{sc.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#131E36] border border-[#334155] text-[#38BDF8] font-bold text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#1E293B] text-[11px] text-center text-[#656d84]">
          Kinetic Terminal — Built for high-agency digital architects
        </div>
      </div>
    </div>
  );
};
