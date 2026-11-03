import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  Trash2, 
  Activity, 
  GitBranch, 
  Layers, 
  CheckCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

interface TerminalScreenProps {
  initialCommand?: string;
  onClearInitialCommand?: () => void;
  onNavigateToArchitecture?: () => void;
  onNavigateToDeployments?: () => void;
}

interface CommandOutput {
  id: string;
  command: string;
  timestamp: string;
  content: React.ReactNode;
  isError?: boolean;
}

export const TerminalScreen: React.FC<TerminalScreenProps> = ({
  initialCommand,
  onClearInitialCommand,
  onNavigateToArchitecture,
  onNavigateToDeployments
}) => {
  const [activeTab, setActiveTab] = useState<'shell' | 'traces' | 'deploy-stream'>('shell');
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested commands chips
  const suggestions = [
    'status',
    'cluster ls',
    'perf analyze',
    'deploy --canary',
    'trace tr_8f93a10',
    'doctor',
    'neofetch',
    'help'
  ];

  // Initial welcome message
  useEffect(() => {
    if (outputs.length === 0) {
      setOutputs([
        {
          id: 'welcome',
          command: 'kinetic init',
          timestamp: new Date().toLocaleTimeString(),
          content: (
            <div className="space-y-2 text-[#d4e4fa] font-mono">
              <pre className="text-[#38BDF8] text-[11px] leading-tight select-none">
{`  _  ___ _   _ _____ _____ ___ ____   _____ _____ ____  __  __ ___ _   _    _    _     
 | |/ / | \\ | | ____|_   _|_ _/ ___| |_   _| ____|  _ \\|  \\/  |_ _| \\ | |  / \\  | |    
 | ' /| |  \\| |  _|   | |  | | |       | | |  _| | |_) | |\\/| || ||  \\| | / _ \\ | |    
 | . \\| | |\\  | |___  | |  | | |___    | | | |___|  _ <| |  | || || |\\  |/ ___ \\| |___ 
 |_|\\_\\_|_| \\_|_____| |_| |___\\____|   |_| |_____|_| \\_\\_|  |_|___|_| \\_/_/   \\_\\_____|`}
              </pre>
              <div className="p-3 rounded-lg bg-[#0d1c2d] border border-[#1E293B] text-xs">
                <p className="text-[#F8FAFC] font-semibold">
                  Kinetic Terminal Engine v2.18.0-rc4 [Multi-Region Anycast Mesh]
                </p>
                <p className="text-[#94A3B8] mt-1">
                  Connected to <span className="text-[#38BDF8]">kinetic-nrt-edge-01 (Tokyo)</span>. Ready for high-concurrency stream operations.
                </p>
                <p className="text-[#656d84] mt-2">
                  Type <span className="text-[#b4c5ff]">help</span> to view all commands, or click any suggestion pill below.
                </p>
              </div>
            </div>
          )
        }
      ]);
    }
  }, [outputs.length]);

  // Execute initial command if passed from outside
  useEffect(() => {
    if (initialCommand) {
      handleExecute(initialCommand);
      if (onClearInitialCommand) onClearInitialCommand();
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  const handleExecute = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    soundFX.playCommandExecuted();

    // Update history
    setCommandHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInputVal('');

    const timestamp = new Date().toLocaleTimeString();
    const cmdId = `cmd_${Date.now()}`;

    const args = cmd.split(' ');
    const primary = args[0].toLowerCase();

    let resultNode: React.ReactNode;

    switch (primary) {
      case 'help':
        resultNode = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="text-[#38BDF8] font-bold">AVAILABLE KINETIC COMMANDS:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {[
                { cmd: 'status', desc: 'Display global mesh health, SLA, and P99 latencies' },
                { cmd: 'cluster ls', desc: 'List active edge nodes (Tokyo, FRA, Virginia, SP)' },
                { cmd: 'perf analyze', desc: 'Run zero-copy IO & vector quantization benchmark' },
                { cmd: 'deploy [svc] [--canary]', desc: 'Trigger staged canary rollout pipeline' },
                { cmd: 'trace [req_id]', desc: 'Inspect distributed span latencies across microservices' },
                { cmd: 'logs [-f] [service]', desc: 'Stream live kernel and proxy event logs' },
                { cmd: 'doctor', desc: 'Run automated health audit on TLS and Raft quorums' },
                { cmd: 'curl [url]', desc: 'Simulate HTTP/3 & gRPC zero-copy edge benchmark' },
                { cmd: 'neofetch', desc: 'Display system architecture specs & memory pool' },
                { cmd: 'clear', desc: 'Clear the terminal output screen' },
              ].map((item) => (
                <div key={item.cmd} className="p-2 rounded bg-[#0d1c2d] border border-[#1E293B]">
                  <span className="text-[#b4c5ff] font-semibold">{item.cmd}</span>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'clear':
        setOutputs([]);
        return;

      case 'status':
        resultNode = (
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d1c2d] border border-[#38BDF8]/40">
              <span className="text-[#38BDF8] font-bold">GLOBAL CLUSTER STATUS: OPTIMAL</span>
              <span className="text-[#94A3B8]">EPOCH #481,992</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded bg-[#051424] border border-[#1E293B]">
                <span className="text-[#94A3B8] text-[10px]">THROUGHPUT</span>
                <p className="text-[#F8FAFC] font-bold">284.6k rps</p>
              </div>
              <div className="p-2 rounded bg-[#051424] border border-[#1E293B]">
                <span className="text-[#94A3B8] text-[10px]">P99 EDGE LATENCY</span>
                <p className="text-[#38BDF8] font-bold">14.2 ms</p>
              </div>
              <div className="p-2 rounded bg-[#051424] border border-[#1E293B]">
                <span className="text-[#94A3B8] text-[10px]">CACHE HIT RATE</span>
                <p className="text-[#38BDF8] font-bold">99.42%</p>
              </div>
              <div className="p-2 rounded bg-[#051424] border border-[#1E293B]">
                <span className="text-[#94A3B8] text-[10px]">ERROR BUDGET</span>
                <p className="text-[#F8FAFC] font-bold">99.988%</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'cluster':
      case 'nodes':
        resultNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-[#38BDF8] font-bold">ACTIVE REGIONAL WORKER NODES (4/4 ONLINE):</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[#656d84] border-b border-[#1E293B]">
                  <tr>
                    <th className="py-1">NODE ID</th>
                    <th className="py-1">REGION</th>
                    <th className="py-1">CPU</th>
                    <th className="py-1">RAM</th>
                    <th className="py-1">PING</th>
                    <th className="py-1">TRAFFIC</th>
                    <th className="py-1 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60 text-[11px]">
                  <tr>
                    <td className="py-1.5 text-[#F8FAFC] font-bold">kinetic-nrt-edge-01</td>
                    <td className="py-1.5 text-[#94A3B8]">Tokyo (ap-northeast-1)</td>
                    <td className="py-1.5 text-[#38BDF8]">44.8%</td>
                    <td className="py-1.5 text-[#d4e4fa]">58.2%</td>
                    <td className="py-1.5 text-[#38BDF8]">9.4ms</td>
                    <td className="py-1.5 text-[#d4e4fa]">84.2k rps</td>
                    <td className="py-1.5 text-right text-[#38BDF8]">● SYNCED</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-[#F8FAFC] font-bold">kinetic-fra-core-02</td>
                    <td className="py-1.5 text-[#94A3B8]">Frankfurt (eu-central-1)</td>
                    <td className="py-1.5 text-[#38BDF8]">62.1%</td>
                    <td className="py-1.5 text-[#d4e4fa]">71.4%</td>
                    <td className="py-1.5 text-[#38BDF8]">12.1ms</td>
                    <td className="py-1.5 text-[#d4e4fa]">96.5k rps</td>
                    <td className="py-1.5 text-right text-[#38BDF8]">● SYNCED</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-[#F8FAFC] font-bold">kinetic-iad-gw-03</td>
                    <td className="py-1.5 text-[#94A3B8]">Virginia (us-east-1)</td>
                    <td className="py-1.5 text-[#38BDF8]">53.7%</td>
                    <td className="py-1.5 text-[#d4e4fa]">66.8%</td>
                    <td className="py-1.5 text-[#38BDF8]">11.8ms</td>
                    <td className="py-1.5 text-[#d4e4fa]">104.0k rps</td>
                    <td className="py-1.5 text-right text-[#38BDF8]">● SYNCED</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-[#F8FAFC] font-bold">kinetic-gru-edge-04</td>
                    <td className="py-1.5 text-[#94A3B8]">São Paulo (sa-east-1)</td>
                    <td className="py-1.5 text-[#ffb4ab]">38.2%</td>
                    <td className="py-1.5 text-[#d4e4fa]">49.0%</td>
                    <td className="py-1.5 text-[#ffb4ab]">28.5ms</td>
                    <td className="py-1.5 text-[#d4e4fa]">22.8k rps</td>
                    <td className="py-1.5 text-right text-[#ffb4ab]">● ROUTING</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        break;

      case 'perf':
      case 'benchmark':
        resultNode = (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#0d1c2d] border border-[#1E293B]">
              <p className="text-[#38BDF8] font-bold">KINETIC ZERO-COPY BENCHMARK REPORT:</p>
              <div className="mt-2 space-y-1 text-[#d4e4fa]">
                <p>• Kernel io_uring throughput: <span className="text-[#38BDF8] font-bold">41.8 Gbps</span> (0% lock contention)</p>
                <p>• AVX-512 Quantized Vector HNSW: <span className="text-[#38BDF8] font-bold">14.8M embeddings/sec</span></p>
                <p>• TLS 1.3 0-RTT Session Resumption: <span className="text-[#38BDF8] font-bold">98.9% success</span></p>
                <p>• Memory Allocation Pool (jemalloc): <span className="text-[#38BDF8] font-bold">150μs GC latency bounds</span></p>
              </div>
            </div>
          </div>
        );
        break;

      case 'deploy':
        resultNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-[#38BDF8] font-bold">INITIATING CANARY RELEASE: release/v2.18-stable</p>
            <div className="space-y-1 p-3 rounded-lg bg-[#0d1c2d] border border-[#1E293B]">
              <div className="flex items-center gap-2 text-[#38BDF8]">
                <Check className="w-3.5 h-3.5" />
                <span>Cargo Clippy Strict & Security Audit: PASSED (28s)</span>
              </div>
              <div className="flex items-center gap-2 text-[#38BDF8]">
                <Check className="w-3.5 h-3.5" />
                <span>WASM + Linux aarch64 native compilation: COMPLETE (1m 14s)</span>
              </div>
              <div className="flex items-center gap-2 text-[#38BDF8]">
                <Check className="w-3.5 h-3.5" />
                <span>10,000 Injected Chaos Faults: 0% data drop</span>
              </div>
              <div className="flex items-center gap-2 text-[#b4c5ff] animate-pulse">
                <span>▶ Routing 15% edge canary traffic to Tokyo & Frankfurt POPs...</span>
              </div>
              <div className="w-full bg-[#1c2b3c] h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#38BDF8] h-full w-[15%]" />
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Track full visual pipeline on Canary tab or type <span className="text-[#38BDF8]">status</span>.
            </p>
          </div>
        );
        break;

      case 'trace':
        const traceId = args[1] || 'tr_8f93a10';
        resultNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-[#38BDF8] font-bold">DISTRIBUTED REQUEST TRACE: {traceId}</p>
            <div className="p-3 rounded-lg bg-[#0d1c2d] border border-[#1E293B] space-y-2">
              <div className="flex justify-between text-[#94A3B8] pb-1 border-b border-[#1E293B]">
                <span>SPAN COMPONENT</span>
                <span>DURATION</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#F8FAFC]">1. Envoy L7 Anycast Edge Ingress</span>
                  <span className="text-[#38BDF8] font-bold">1.8 ms</span>
                </div>
                <div className="flex items-center justify-between pl-3 border-l border-[#334155]">
                  <span className="text-[#d4e4fa]">2. Ed25519 Cryptographic Token Mint</span>
                  <span className="text-[#38BDF8]">0.9 ms</span>
                </div>
                <div className="flex items-center justify-between pl-3 border-l border-[#334155]">
                  <span className="text-[#d4e4fa]">3. Tokio io_uring Pub/Sub Router</span>
                  <span className="text-[#38BDF8]">0.6 ms</span>
                </div>
                <div className="flex items-center justify-between pl-6 border-l border-[#38BDF8]">
                  <span className="text-[#F8FAFC] font-semibold">4. SIMD AVX-512 Vector HNSW Lookup</span>
                  <span className="text-[#38BDF8] font-bold">8.4 ms</span>
                </div>
                <div className="flex items-center justify-between pl-3 border-l border-[#334155]">
                  <span className="text-[#d4e4fa]">5. Local In-Memory KV Shard Return</span>
                  <span className="text-[#38BDF8]">0.5 ms</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#1E293B] flex justify-between text-xs font-bold text-[#F8FAFC]">
                <span>TOTAL ROUNDTRIP:</span>
                <span className="text-[#38BDF8]">14.2 ms (P99 compliance)</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'doctor':
        resultNode = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-[#38BDF8] font-bold">RUNNING KINETIC DOCTOR SYSTEM AUDIT...</p>
            <div className="p-3 rounded-lg bg-[#0d1c2d] border border-[#1E293B] space-y-1.5 text-[#d4e4fa]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Anycast BGP Edge Routing: 4/4 POPs responding &lt; 15ms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>TLS 1.3 Certificates: Valid (expires in 284 days, Auto-renew active)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Raft Distributed Quorum: Epoch 481,992 consensus affirmed (Tokyo/FRA/IAD)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Memory Allocation Pool: Jemalloc zero heap fragmentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Canary Health Matrix: Error budget at 99.988%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#38BDF8] font-bold">
              RESULT: All systems operational. Zero critical vulnerabilities found.
            </p>
          </div>
        );
        break;

      case 'neofetch':
      case 'banner':
        resultNode = (
          <div className="p-4 rounded-lg bg-[#0d1c2d] border border-[#1E293B] font-mono text-xs text-[#d4e4fa] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <pre className="text-[#38BDF8] leading-tight select-none">
{`   /\\_____/\\
  /  o   o  \\
 ( ==  ^  == )   KINETIC
  )         (    TERMINAL
 (           )   ARCHITECT
( (  )   (  ) )  v2.18.0
 (__(_____)__)`}
              </pre>
            </div>
            <div className="space-y-1">
              <p><span className="text-[#38BDF8] font-bold">OS:</span> Kinetic Linux Microkernel (x86_64)</p>
              <p><span className="text-[#38BDF8] font-bold">Host:</span> Edge Cluster nrt-01 (Tokyo)</p>
              <p><span className="text-[#38BDF8] font-bold">Kernel:</span> 6.8.0-kinetic-rt-io-uring</p>
              <p><span className="text-[#38BDF8] font-bold">Uptime:</span> 112 days, 4 hours</p>
              <p><span className="text-[#38BDF8] font-bold">Shell:</span> Kinetic Reactive Terminal 2.18</p>
              <p><span className="text-[#38BDF8] font-bold">CPU:</span> AMD EPYC 9654 (128 Cores) @ 3.7GHz</p>
              <p><span className="text-[#38BDF8] font-bold">RAM:</span> 38.4 TB / 60.0 TB Sharded Pool</p>
              <p><span className="text-[#38BDF8] font-bold">Zero-Copy:</span> io_uring ring-buffer active</p>
            </div>
          </div>
        );
        break;

      default:
        resultNode = (
          <div className="text-xs font-mono text-[#ffb4ab]">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-[#38BDF8] underline cursor-pointer" onClick={() => handleExecute('help')}>help</span> to view all available commands.
          </div>
        );
        break;
    }

    setOutputs((prev) => [
      ...prev,
      {
        id: cmdId,
        command: cmd,
        timestamp,
        content: resultNode,
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Terminal Window Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0d1c2d] border border-[#1E293B]">
        <div className="flex items-center gap-3">
          {/* Traffic light terminal dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ffb4ab]/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#38BDF8]/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block" />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#1E293B] text-xs font-mono">
            <TerminalIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[#F8FAFC] font-semibold">kinetic-nrt-edge-01 (Tokyo)</span>
            <span className="text-[#656d84]">|</span>
            <span className="text-[#94A3B8]">bash-5.2 / io_uring</span>
          </div>
        </div>

        {/* Inner View Switcher */}
        <div className="flex items-center gap-1 bg-[#051424] p-1 rounded-lg border border-[#1E293B] text-xs font-mono">
          <button
            onClick={() => {
              soundFX.playKeyClick();
              setActiveTab('shell');
            }}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'shell'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-semibold'
                : 'text-[#94A3B8] hover:text-[#d4e4fa]'
            }`}
          >
            Interactive Shell
          </button>

          <button
            onClick={() => {
              soundFX.playKeyClick();
              setActiveTab('traces');
            }}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
              activeTab === 'traces'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-semibold'
                : 'text-[#94A3B8] hover:text-[#d4e4fa]'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Trace Waterfall</span>
          </button>

          <button
            onClick={() => {
              soundFX.playKeyClick();
              setActiveTab('deploy-stream');
            }}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
              activeTab === 'deploy-stream'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-semibold'
                : 'text-[#94A3B8] hover:text-[#d4e4fa]'
            }`}
          >
            <GitBranch className="w-3 h-3" />
            <span>Deploy Log</span>
          </button>

          <button
            onClick={() => setOutputs([])}
            className="p-1 rounded text-[#94A3B8] hover:text-[#ffb4ab] transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Command Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
        <span className="text-[#656d84] text-[11px] shrink-0">QUICK CMDS:</span>
        {suggestions.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleExecute(cmd)}
            className="px-2.5 py-1 rounded-md bg-[#131E36] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#38BDF8] text-[#38BDF8] hover:text-[#d4e4fa] text-[11px] whitespace-nowrap transition-all shadow-sm"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Main Terminal View Content */}
      {activeTab === 'shell' && (
        <div className="rounded-xl bg-[#051424] border border-[#1E293B] shadow-[0_0_35px_rgba(0,0,0,0.7)] p-4 sm:p-6 min-h-[460px] flex flex-col justify-between scanlines">
          {/* Scrollable output area */}
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {outputs.map((out) => (
              <div key={out.id} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#38BDF8] font-bold">kinetic@edge-nrt:~$</span>
                    <span className="text-[#F8FAFC] font-semibold">{out.command}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-[#656d84]">{out.timestamp}</span>
                    <button
                      onClick={() => copyToClipboard(out.command, out.id)}
                      className="p-1 text-[#94A3B8] hover:text-[#F8FAFC]"
                      title="Copy command"
                    >
                      {copiedId === out.id ? <Check className="w-3 h-3 text-[#38BDF8]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="pl-4 border-l border-[#1E293B]">
                  {out.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Prompt Input Form */}
          <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center gap-2 font-mono text-xs">
            <span className="text-[#38BDF8] font-bold shrink-0">kinetic@edge-nrt:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. status, perf analyze, deploy --canary)..."
              className="w-full bg-transparent text-[#F8FAFC] placeholder-[#656d84] focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => handleExecute(inputVal)}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] font-semibold flex items-center gap-1 shrink-0 transition-all glow-button"
            >
              <span>Run</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Tab: Request Trace Waterfall */}
      {activeTab === 'traces' && (
        <div className="rounded-xl bg-[#0d1c2d] border border-[#1E293B] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC]">Live Distributed Request Waterfall (ID: tr_8f93a10)</h3>
              <p className="text-xs font-mono text-[#94A3B8]">
                Trace path across Anycast L7, Ed25519 token mint, io_uring bus, and SIMD vector HNSW
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#2563EB]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
              Total: 14.2ms (P99)
            </span>
          </div>

          {/* Timeline visualization */}
          <div className="space-y-3 font-mono text-xs">
            {[
              { name: '1. Envoy Edge Ingress (HTTP/3 QUIC)', start: 0, duration: 1.8, service: 'envoy-l7', color: 'bg-[#2563EB]' },
              { name: '2. Stateless Ed25519 Token Audit', start: 1.8, duration: 0.9, service: 'auth-vault', color: 'bg-[#38BDF8]' },
              { name: '3. Tokio Kernel io_uring Stream', start: 2.7, duration: 0.6, service: 'stream-broker', color: 'bg-[#7bd0ff]' },
              { name: '4. Quantized HNSW SIMD Search', start: 3.3, duration: 8.4, service: 'vector-indexer', color: 'bg-[#b4c5ff]' },
              { name: '5. In-Memory Shard Cache Return', start: 11.7, duration: 0.5, service: 'redis-cache', color: 'bg-[#2563EB]' },
              { name: '6. Egress Serialization & Response', start: 12.2, duration: 2.0, service: 'envoy-l7', color: 'bg-[#38BDF8]' },
            ].map((span, idx) => {
              const leftPercent = (span.start / 14.2) * 85;
              const widthPercent = Math.max((span.duration / 14.2) * 85, 4);

              return (
                <div key={idx} className="p-2.5 rounded bg-[#051424] border border-[#1E293B]">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="text-[#F8FAFC] font-semibold">{span.name}</span>
                    <span className="text-[#38BDF8]">{span.duration} ms</span>
                  </div>
                  {/* Visual timeline bar */}
                  <div className="w-full h-3 rounded bg-[#1c2b3c] relative overflow-hidden">
                    <div
                      className={`h-full rounded ${span.color} absolute transition-all`}
                      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1E293B] text-xs">
            <span className="text-[#94A3B8]">Want to view full component topology?</span>
            {onNavigateToArchitecture && (
              <button
                onClick={onNavigateToArchitecture}
                className="text-[#38BDF8] hover:underline flex items-center gap-1 font-mono"
              >
                <span>Open Architecture Blueprints</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab: Deployment Pipeline Stream */}
      {activeTab === 'deploy-stream' && (
        <div className="rounded-xl bg-[#0d1c2d] border border-[#1E293B] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <h3 className="font-bold text-sm text-[#F8FAFC]">Canary Pipeline Console Stream</h3>
              <p className="text-xs font-mono text-[#94A3B8]">
                release/v2.18-stable · commit 8f92a4c · 15% edge canary traffic
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
              Live Rollout
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#051424] border border-[#1E293B] font-mono text-xs text-[#d4e4fa] space-y-2 max-h-[350px] overflow-y-auto">
            <p className="text-[#656d84]">[13:00:12] CI: Worker node dispatched on AMD EPYC 9654 container</p>
            <p className="text-[#656d84]">[13:00:15] RUN: cargo clippy --all-targets --all-features -- -D warnings</p>
            <p className="text-[#38BDF8]">[13:00:43] OK: 0 warnings, 0 clippy lints. Security audit passed.</p>
            <p className="text-[#656d84]">[13:00:45] RUN: cargo build --release --target wasm32-wasi & x86_64</p>
            <p className="text-[#38BDF8]">[13:01:59] OK: Binaries compiled with AVX-512 vector extensions.</p>
            <p className="text-[#656d84]">[13:02:01] RUN: kinetic-chaos-injector --faults 10000 --concurrency 500</p>
            <p className="text-[#38BDF8]">[13:04:06] OK: Chaos simulation finished. 0 drops, 100% quorum affirmed.</p>
            <p className="text-[#b4c5ff] animate-pulse">[13:04:10] STAGE: Canary 15% routed to Tokyo & Frankfurt POPs...</p>
            <p className="text-[#38BDF8]">[13:04:45] METRIC: Tokyo edge P99 latency: 9.4ms (-3.1ms from v2.17)</p>
            <p className="text-[#38BDF8]">[13:05:00] METRIC: Frankfurt core P99 latency: 12.1ms (0.000% error rate)</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
            <span className="text-xs text-[#94A3B8]">Ready to promote to 100% or rollback?</span>
            {onNavigateToDeployments && (
              <button
                onClick={onNavigateToDeployments}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] text-xs font-semibold flex items-center gap-1.5 transition-all glow-button"
              >
                <span>Manage Release Canary</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
