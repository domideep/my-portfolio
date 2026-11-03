import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, ChevronUp, ChevronDown, Send } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface QuickTerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRunExternalCommand?: (command: string) => void;
}

export const QuickTerminalDrawer: React.FC<QuickTerminalDrawerProps> = ({
  isOpen,
  onClose,
  onRunExternalCommand
}) => {
  const [inputVal, setInputVal] = useState('');
  const [drawerLogs, setDrawerLogs] = useState<string[]>([
    'Kinetic Quick Terminal Dock connected to kinetic-nrt-edge-01 (Tokyo).',
    'Ready. Try typing: status, cluster ls, or perf analyze.'
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [drawerLogs]);

  if (!isOpen) return null;

  const handleRun = () => {
    const cmd = inputVal.trim();
    if (!cmd) return;

    soundFX.playCommandExecuted();
    setInputVal('');

    setDrawerLogs((prev) => [
      ...prev,
      `kinetic@edge:~$ ${cmd}`
    ]);

    if (cmd === 'clear') {
      setDrawerLogs([]);
      return;
    }

    if (cmd === 'status') {
      setDrawerLogs((prev) => [
        ...prev,
        'Cluster: kinetic-production-mesh · Status: OPTIMAL (99.995%) · Ingress: 284.6k rps'
      ]);
    } else if (cmd === 'cluster ls') {
      setDrawerLogs((prev) => [
        ...prev,
        'Tokyo (9.4ms) | Frankfurt (12.1ms) | Virginia (11.8ms) | São Paulo (28.5ms)'
      ]);
    } else {
      setDrawerLogs((prev) => [
        ...prev,
        `Executed: ${cmd}. (See main Interactive Shell for rich formatting).`
      ]);
      if (onRunExternalCommand) onRunExternalCommand(cmd);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-[#051424]/95 backdrop-blur-lg border-t border-[#334155] shadow-[0_-10px_35px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-6 duration-150 font-mono text-xs">
      <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-between border-b border-[#1E293B] bg-[#0d1c2d]/70">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-bold text-[#F8FAFC]">Kinetic Terminal Dock</span>
          <span className="text-[#656d84] text-[10px]">[` to toggle]</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto p-3 max-h-48 overflow-y-auto space-y-1">
        {drawerLogs.map((log, idx) => (
          <div key={idx} className="text-[#d4e4fa] leading-relaxed">
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="max-w-[1400px] mx-auto p-3 pt-0 flex items-center gap-2">
        <span className="text-[#38BDF8] font-bold">kinetic@edge:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRun()}
          placeholder="Quick command..."
          className="w-full bg-transparent text-[#F8FAFC] placeholder-[#656d84] focus:outline-none"
        />
        <button
          onClick={handleRun}
          className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] font-semibold text-[11px]"
        >
          Run
        </button>
      </div>
    </div>
  );
};
