import React, { useState, useEffect } from 'react';
import { ScreenType, SystemMetric, ClusterNode, Microservice, LogEntry } from './types';
import { INITIAL_METRICS, INITIAL_NODES, MICROSERVICES, INITIAL_LOGS } from './data/systemData';
import { Header } from './components/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { TerminalScreen } from './components/screens/TerminalScreen';
import { ArchitectureScreen } from './components/screens/ArchitectureScreen';
import { DeploymentsScreen } from './components/screens/DeploymentsScreen';
import { ConfigPlaygroundScreen } from './components/screens/ConfigPlaygroundScreen';
import { CommandPalette } from './components/CommandPalette';
import { QuickTerminalDrawer } from './components/QuickTerminalDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { soundFX } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [metrics, setMetrics] = useState<SystemMetric[]>(INITIAL_METRICS);
  const [nodes, setNodes] = useState<ClusterNode[]>(INITIAL_NODES);
  const [microservices, setMicroservices] = useState<Microservice[]>(MICROSERVICES);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(soundFX.isEnabled());
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [pendingTerminalCmd, setPendingTerminalCmd] = useState<string | undefined>(undefined);

  // Periodic telemetry simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id === 'throughput') {
            const base = isSurgeActive ? 512.4 : 284.6;
            const variance = (Math.random() * 6 - 3).toFixed(1);
            const newVal = +(base + Number(variance)).toFixed(1);
            return {
              ...m,
              value: `${newVal}k`,
              history: [...m.history.slice(1), newVal]
            };
          }
          if (m.id === 'latency') {
            const base = isSurgeActive ? 22.8 : 14.2;
            const variance = (Math.random() * 0.8 - 0.4).toFixed(1);
            const newVal = +(base + Number(variance)).toFixed(1);
            return {
              ...m,
              value: `${newVal}`,
              history: [...m.history.slice(1), newVal]
            };
          }
          return m;
        })
      );

      // Random occasional telemetry log
      if (Math.random() > 0.65) {
        const events = [
          { svc: 'envoy-ingress', lvl: 'INFO' as const, msg: 'HTTP/3 0-RTT TLS connection pool recycled 4,200 handles.' },
          { svc: 'vector-index', lvl: 'METRIC' as const, msg: 'Cosine distance SIMD AVX-512 batch query resolved in 0.82ms.' },
          { svc: 'raft-consensus', lvl: 'NOTICE' as const, msg: 'Multi-region quorum heartbeats confirmed: Tokyo, Frankfurt, Virginia (3/3).' },
          { svc: 'stream-broker', lvl: 'INFO' as const, msg: 'Kernel io_uring submission queue depth at 12% capacity.' }
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().substring(11, 23),
          level: randomEvent.lvl,
          service: randomEvent.svc,
          message: randomEvent.msg,
          traceId: `tr_${Math.random().toString(36).substring(2, 9)}`
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSurgeActive]);

  // Global Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundFX.playKeyClick();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '`') {
        e.preventDefault();
        soundFX.playKeyClick();
        setIsDrawerOpen((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        soundFX.playKeyClick();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === '1') {
        soundFX.playKeyClick();
        setCurrentScreen('dashboard');
      } else if (e.key === '2') {
        soundFX.playKeyClick();
        setCurrentScreen('terminal');
      } else if (e.key === '3') {
        soundFX.playKeyClick();
        setCurrentScreen('architecture');
      } else if (e.key === '4') {
        soundFX.playKeyClick();
        setCurrentScreen('deployments');
      } else if (e.key === '5') {
        soundFX.playKeyClick();
        setCurrentScreen('config');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSimulateSurge = () => {
    setIsSurgeActive((prev) => !prev);
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 23),
      level: isSurgeActive ? 'NOTICE' : 'WARN',
      service: 'canary-shifter',
      message: isSurgeActive 
        ? 'Traffic spike simulation disabled. Load returned to nominal 284k rps.' 
        : 'TRAFFIC SURGE SIMULATION TRIGGERED: Ingress load stepped up to 512k rps. Edge pods auto-scaling.'
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleTriggerDoctor = () => {
    setIsDiagnosticRunning(true);
    soundFX.playBeep(600, 0.1);

    setTimeout(() => {
      setIsDiagnosticRunning(false);
      soundFX.playCommandExecuted();
      setDiagnosticResult(
        `✓ All 4 Global Anycast POPs online & responding < 15ms\n✓ TLS 1.3 certificates validated across all edge ingress endpoints\n✓ Multi-region Raft quorum affirmed (Epoch #481,992)\n✓ Zero heap fragmentation recorded across Jemalloc memory pools\n✓ System status: 100% HEALTHY`
      );
    }, 1200);
  };

  const handleRunCommandFromOutside = (cmd: string) => {
    setPendingTerminalCmd(cmd);
    setCurrentScreen('terminal');
  };

  const handleAddLog = (newLog: Omit<LogEntry, 'id'>) => {
    setLogs((prev) => [{ ...newLog, id: `log-${Date.now()}` }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex flex-col font-sans selection:bg-[#2563EB]/40 selection:text-[#38BDF8]">
      {/* Global Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleTerminalDrawer={() => setIsDrawerOpen((prev) => !prev)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(soundFX.isEnabled())}
        isDrawerOpen={isDrawerOpen}
        onTriggerDiagnostic={handleTriggerDoctor}
        isDiagnosticRunning={isDiagnosticRunning}
      />

      {/* Screen Views Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-6 pb-20">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            metrics={metrics}
            nodes={nodes}
            microservices={microservices}
            logs={logs}
            onNavigate={setCurrentScreen}
            onRunCommand={handleRunCommandFromOutside}
            onSimulateSurge={handleSimulateSurge}
            isSurgeActive={isSurgeActive}
            onAddLog={handleAddLog}
            diagnosticResult={diagnosticResult}
            onClearDiagnostic={() => setDiagnosticResult(null)}
          />
        )}

        {currentScreen === 'terminal' && (
          <TerminalScreen
            initialCommand={pendingTerminalCmd}
            onClearInitialCommand={() => setPendingTerminalCmd(undefined)}
            onNavigateToArchitecture={() => setCurrentScreen('architecture')}
            onNavigateToDeployments={() => setCurrentScreen('deployments')}
          />
        )}

        {currentScreen === 'architecture' && (
          <ArchitectureScreen />
        )}

        {currentScreen === 'deployments' && (
          <DeploymentsScreen
            onNavigateToConfig={() => setCurrentScreen('config')}
          />
        )}

        {currentScreen === 'config' && (
          <ConfigPlaygroundScreen />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#051424]/80 py-4 px-4 lg:px-8 text-xs font-mono text-[#656d84] mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span className="text-[#94A3B8]">KINETIC TERMINAL ARCHITECTURE</span>
            <span>·</span>
            <span>v2.18.0-rc4</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#131E36] text-[#38BDF8]">?</kbd> for shortcuts</span>
            <span>·</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#131E36] text-[#38BDF8]">⌘K</kbd> for commands</span>
          </div>
        </div>
      </footer>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        onRunTerminalCommand={handleRunCommandFromOutside}
        onToggleAudio={() => setAudioEnabled(soundFX.isEnabled())}
        audioEnabled={audioEnabled}
        onTriggerDiagnostic={handleTriggerDoctor}
      />

      {/* Bottom Terminal Dock Drawer */}
      <QuickTerminalDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRunExternalCommand={handleRunCommandFromOutside}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
