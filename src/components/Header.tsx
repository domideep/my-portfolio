import React from 'react';
import { 
  Terminal, 
  Activity, 
  Cpu, 
  GitBranch, 
  Sliders, 
  Search, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Zap,
  Globe
} from 'lucide-react';
import { ScreenType } from '../types';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenCommandPalette: () => void;
  onToggleTerminalDrawer: () => void;
  onOpenShortcuts: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  isDrawerOpen: boolean;
  onTriggerDiagnostic: () => void;
  isDiagnosticRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenCommandPalette,
  onToggleTerminalDrawer,
  onOpenShortcuts,
  audioEnabled,
  onToggleAudio,
  isDrawerOpen,
  onTriggerDiagnostic,
  isDiagnosticRunning,
}) => {
  const screens: { id: ScreenType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'dashboard', label: 'Command HUD', icon: <Activity className="w-4 h-4" />, shortcut: '1' },
    { id: 'terminal', label: 'Interactive Shell', icon: <Terminal className="w-4 h-4" />, shortcut: '2' },
    { id: 'architecture', label: 'Architecture', icon: <Cpu className="w-4 h-4" />, shortcut: '3' },
    { id: 'deployments', label: 'Canary Releases', icon: <GitBranch className="w-4 h-4" />, shortcut: '4' },
    { id: 'config', label: 'Config & Tuning', icon: <Sliders className="w-4 h-4" />, shortcut: '5' },
  ];

  const handleNavClick = (screen: ScreenType) => {
    soundFX.playKeyClick();
    onSelectScreen(screen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#051424]/90 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-8 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Status Beacon */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-lg bg-[#131E36] border border-[#2563EB]/40 flex items-center justify-center group-hover:border-[#38BDF8] transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)]">
              <Zap className="w-4 h-4 text-[#38BDF8] animate-pulse" />
              <div className="absolute inset-0 rounded-lg bg-[#38BDF8]/10 blur-sm group-hover:bg-[#38BDF8]/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm lg:text-base tracking-tight text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                  KINETIC TERMINAL
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
                  v2.18
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8] hidden sm:block">
                Systems Architecture & Runtime
              </p>
            </div>
          </button>

          {/* Real-time Health Beacon */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-[#1E293B]">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute w-full h-full rounded-full bg-[#38BDF8] opacity-75 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-[#38BDF8]" />
            </div>
            <div className="text-[11px] font-mono">
              <span className="text-[#38BDF8] font-semibold">ONLINE</span>
              <span className="text-[#94A3B8] ml-1.5">99.995% SLA</span>
              <span className="text-[#434655] mx-1.5">|</span>
              <span className="text-[#c3c6d7] inline-flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#38BDF8]" /> 4 Multi-Regions
              </span>
            </div>
          </div>
        </div>

        {/* Screen Switcher Nav */}
        <nav className="hidden md:flex items-center bg-[#0d1c2d] p-1 rounded-lg border border-[#1E293B]">
          {screens.map((screen) => {
            const isActive = currentScreen === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => handleNavClick(screen.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.3)] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#d4e4fa] hover:bg-[#131E36]/60'
                }`}
                title={`Shortcut: ${screen.shortcut}`}
              >
                {screen.icon}
                <span>{screen.label}</span>
                <span className={`text-[10px] font-mono ml-0.5 px-1 py-0.2 rounded ${
                  isActive ? 'bg-black/25 text-[#d4e4fa]' : 'text-[#656d84]'
                }`}>
                  {screen.shortcut}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Command Palette Button */}
          <button
            onClick={() => {
              soundFX.playKeyClick();
              onOpenCommandPalette();
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#122131] border border-[#1E293B] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#d4e4fa] text-xs transition-all"
            title="Search & Command Palette (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Commands</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-[#051424] border border-[#1E293B] rounded text-[#94A3B8]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Terminal Drawer Toggle */}
          <button
            onClick={() => {
              soundFX.playKeyClick();
              onToggleTerminalDrawer();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isDrawerOpen 
                ? 'bg-[#2563EB]/20 border-[#38BDF8] text-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                : 'bg-[#122131] border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#d4e4fa]'
            }`}
            title="Toggle Quick Terminal Drawer (`)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dock</span>
            <kbd className="text-[10px] text-[#656d84] hidden md:inline">`</kbd>
          </button>

          {/* Diagnostics Trigger Button */}
          <button
            onClick={() => {
              soundFX.playBeep(700, 0.05);
              onTriggerDiagnostic();
            }}
            disabled={isDiagnosticRunning}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isDiagnosticRunning
                ? 'bg-[#2563EB]/30 border-[#38BDF8] text-[#38BDF8] animate-pulse'
                : 'bg-[#122131] border-[#1E293B] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#d4e4fa]'
            }`}
            title="Run quick system sanity diagnostics"
          >
            <Activity className={`w-3.5 h-3.5 text-[#38BDF8] ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
            <span>{isDiagnosticRunning ? 'Auditing...' : 'Doctor'}</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              const newState = soundFX.toggle();
              onToggleAudio();
              if (newState) {
                soundFX.playBeep(880, 0.08);
              }
            }}
            className={`p-2 rounded-lg border transition-all ${
              audioEnabled 
                ? 'bg-[#2563EB]/15 border-[#38BDF8]/60 text-[#38BDF8]' 
                : 'bg-[#122131] border-[#1E293B] text-[#656d84] hover:text-[#94A3B8]'
            }`}
            title={audioEnabled ? 'Mechanical Sound Effects Enabled (Click to mute)' : 'Muted (Click to enable audio feedback)'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Keyboard Shortcuts Helper */}
          <button
            onClick={() => {
              soundFX.playKeyClick();
              onOpenShortcuts();
            }}
            className="p-2 rounded-lg bg-[#122131] border border-[#1E293B] text-[#94A3B8] hover:text-[#d4e4fa] hover:border-[#334155] transition-all"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Screen Switcher Bar */}
      <div className="flex md:hidden overflow-x-auto gap-2 mt-2 pt-2 border-t border-[#1E293B] no-scrollbar">
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => handleNavClick(screen.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              currentScreen === screen.id
                ? 'bg-[#2563EB] text-[#F8FAFC]'
                : 'bg-[#0d1c2d] text-[#94A3B8] border border-[#1E293B]'
            }`}
          >
            {screen.icon}
            <span>{screen.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
