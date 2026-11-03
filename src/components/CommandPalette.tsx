import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  Activity, 
  Cpu, 
  GitBranch, 
  Sliders, 
  Zap, 
  Volume2, 
  Play, 
  ArrowRight,
  Server
} from 'lucide-react';
import { ScreenType } from '../types';
import { soundFX } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screen: ScreenType) => void;
  onRunTerminalCommand: (command: string) => void;
  onToggleAudio: () => void;
  audioEnabled: boolean;
  onTriggerDiagnostic: () => void;
}

interface PaletteItem {
  id: string;
  category: 'Screens' | 'Terminal Actions' | 'Microservices' | 'System Controls';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
  onRunTerminalCommand,
  onToggleAudio,
  audioEnabled,
  onTriggerDiagnostic,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: PaletteItem[] = [
    {
      id: 'screen-dashboard',
      category: 'Screens',
      title: 'Command HUD & Global Telemetry',
      subtitle: 'View real-time throughput, multi-region cluster status, and live event logs',
      icon: <Activity className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onSelectScreen('dashboard')
    },
    {
      id: 'screen-terminal',
      category: 'Screens',
      title: 'Interactive Kinetic Shell',
      subtitle: 'Access the full CLI console, distributed trace waterfall, and deployment stream',
      icon: <Terminal className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onSelectScreen('terminal')
    },
    {
      id: 'screen-architecture',
      category: 'Screens',
      title: 'Architecture Blueprints & Visual Mesh',
      subtitle: 'Interactive node topology, zero-copy protocol specifications, and memory bounds',
      icon: <Cpu className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onSelectScreen('architecture')
    },
    {
      id: 'screen-deployments',
      category: 'Screens',
      title: 'Canary Releases & Progressive Rollout',
      subtitle: 'Inspect CI/CD matrix stages, promote canary traffic (15% -> 100%), and trigger rollbacks',
      icon: <GitBranch className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onSelectScreen('deployments')
    },
    {
      id: 'screen-config',
      category: 'Screens',
      title: 'IaC Configuration Editor & Diff',
      subtitle: 'Side-by-side spec comparison, thread tuning sliders, and simulated performance tests',
      icon: <Sliders className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onSelectScreen('config')
    },
    {
      id: 'cmd-status',
      category: 'Terminal Actions',
      title: 'run: status',
      subtitle: 'Query cluster health, error budget, and active edge nodes in Tokyo/Frankfurt/IAD',
      icon: <Play className="w-4 h-4 text-[#b4c5ff]" />,
      action: () => {
        onSelectScreen('terminal');
        onRunTerminalCommand('status');
      }
    },
    {
      id: 'cmd-nodes',
      category: 'Terminal Actions',
      title: 'run: cluster ls',
      subtitle: 'List all edge worker nodes, CPU & memory utilization, and network ping times',
      icon: <Server className="w-4 h-4 text-[#b4c5ff]" />,
      action: () => {
        onSelectScreen('terminal');
        onRunTerminalCommand('cluster ls');
      }
    },
    {
      id: 'cmd-deploy',
      category: 'Terminal Actions',
      title: 'run: deploy --canary',
      subtitle: 'Initiate staged canary deployment pipeline with automated chaos test verification',
      icon: <Play className="w-4 h-4 text-[#b4c5ff]" />,
      action: () => {
        onSelectScreen('terminal');
        onRunTerminalCommand('deploy --canary');
      }
    },
    {
      id: 'cmd-trace',
      category: 'Terminal Actions',
      title: 'run: trace tr_8f93a10',
      subtitle: 'Inspect distributed span latencies from Envoy Ingress to Redis Vector Cache',
      icon: <Play className="w-4 h-4 text-[#b4c5ff]" />,
      action: () => {
        onSelectScreen('terminal');
        onRunTerminalCommand('trace tr_8f93a10');
      }
    },
    {
      id: 'sys-doctor',
      category: 'System Controls',
      title: 'Run System Doctor & Diagnostics',
      subtitle: 'Audit TLS certificates, memory fragmentation, and quorum heartbeats',
      icon: <Zap className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onTriggerDiagnostic()
    },
    {
      id: 'sys-audio',
      category: 'System Controls',
      title: audioEnabled ? 'Mute Mechanical Audio Feedback' : 'Enable Mechanical Sound Synthesizer',
      subtitle: 'Tactile Web Audio API sound effects for keyboard strokes and command dispatch',
      icon: <Volume2 className="w-4 h-4 text-[#38BDF8]" />,
      action: () => onToggleAudio()
    }
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundFX.playKeyClick();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundFX.playKeyClick();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          soundFX.playCommandExecuted();
          filteredItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#010f1f]/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl bg-[#0d1c2d] border border-[#334155] rounded-xl shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1E293B] bg-[#051424]/60">
          <Search className="w-5 h-5 text-[#38BDF8] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a screen, command, microservice, or action..."
            className="w-full bg-transparent text-[#F8FAFC] placeholder-[#656d84] text-sm focus:outline-none font-mono"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#131E36] border border-[#1E293B] text-[#94A3B8] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#94A3B8]">
              No matching commands found for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundFX.playCommandExecuted();
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1c2b3c] border border-[#38BDF8]/60 shadow-[0_0_15px_rgba(56,189,248,0.15)] text-[#F8FAFC]'
                      : 'text-[#d4e4fa] hover:bg-[#131E36]/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-md bg-[#051424] border border-[#1E293B] shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs tracking-tight truncate font-mono">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-[#051424] text-[#7bd0ff] border border-[#1E293B]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${
                    isSelected ? 'opacity-100 text-[#38BDF8]' : 'opacity-0'
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[#1E293B] bg-[#051424]/80 flex items-center justify-between text-[11px] font-mono text-[#656d84]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="text-[#38BDF8]">Kinetic Terminal Fast HUD</span>
        </div>
      </div>
    </div>
  );
};
