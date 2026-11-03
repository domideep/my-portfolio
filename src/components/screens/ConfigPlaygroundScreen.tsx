import React, { useState } from 'react';
import { 
  Sliders, 
  Code, 
  Copy, 
  Check, 
  RotateCcw, 
  Play, 
  Cpu, 
  Zap, 
  Split, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { INITIAL_CONFIG_CODE } from '../../data/systemData';
import { soundFX } from '../../utils/audio';

export const ConfigPlaygroundScreen: React.FC = () => {
  const [configCode, setConfigCode] = useState(INITIAL_CONFIG_CODE);
  const [viewMode, setViewMode] = useState<'editor' | 'diff'>('editor');
  const [copied, setCopied] = useState(false);
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  // Tunable system parameters
  const [threads, setThreads] = useState(64);
  const [ringBufferEntries, setRingBufferEntries] = useState(4096);
  const [vectorShards, setVectorShards] = useState(128);
  const [idleTimeout, setIdleTimeout] = useState(45);

  // Derived benchmark calculations
  const estimatedRps = Math.round((threads * 4400) * (ringBufferEntries / 4096) * 0.98);
  const estimatedLatency = +(14.2 * (64 / threads) * (4096 / ringBufferEntries) * 0.95).toFixed(1);
  const estimatedRamGb = Math.round(38.4 + (vectorShards - 128) * 0.12);

  const handleCopy = () => {
    soundFX.playCommandExecuted();
    navigator.clipboard.writeText(configCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSimulateApply = () => {
    soundFX.playCommandExecuted();
    setSimulatedNotice('Tuned kernel parameters applied to local node container sandbox. Latency updated.');
    setTimeout(() => setSimulatedNotice(null), 3500);
  };

  const handleReset = () => {
    soundFX.playKeyClick();
    setThreads(64);
    setRingBufferEntries(4096);
    setVectorShards(128);
    setIdleTimeout(45);
    setConfigCode(INITIAL_CONFIG_CODE);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1c2d] border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40">
              RUNTIME PLAYGROUND
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">kinetic.mesh.hcl</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Infrastructure as Code & Parameter Tuning
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Tune thread affinity, io_uring queue depth, and vector shard distribution with instant simulated telemetry.
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#051424] p-1 rounded-lg border border-[#1E293B] text-xs font-mono">
            <button
              onClick={() => {
                soundFX.playKeyClick();
                setViewMode('editor');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === 'editor' ? 'bg-[#2563EB] text-[#F8FAFC] font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HCL Editor</span>
            </button>
            <button
              onClick={() => {
                soundFX.playKeyClick();
                setViewMode('diff');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === 'diff' ? 'bg-[#2563EB] text-[#F8FAFC] font-semibold' : 'text-[#94A3B8]'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Diff v2.17 vs v2.18</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono bg-[#131E36] hover:bg-[#1E293B] border border-[#1E293B] text-[#d4e4fa]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {simulatedNotice && (
        <div className="p-4 rounded-xl bg-[#131E36] border border-[#38BDF8] flex items-center justify-between text-xs font-mono text-[#F8FAFC] animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38BDF8] animate-spin" />
            <span>{simulatedNotice}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Parameter Tuning Sliders + Code Editor / Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Parameter Tuning Sliders (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-[#0d1c2d] border border-[#1E293B] shadow-[0_0_20px_rgba(37,99,235,0.1)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <span className="text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#38BDF8]" />
              Kernel & Runtime Sliders
            </span>
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-[#94A3B8] hover:text-[#38BDF8] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Thread Concurrency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Worker Thread Concurrency</span>
              <span className="text-[#38BDF8] font-bold">{threads} Cores</span>
            </div>
            <input
              type="range"
              min="16"
              max="128"
              step="16"
              value={threads}
              onChange={(e) => {
                soundFX.playKeyClick();
                setThreads(Number(e.target.value));
              }}
              className="w-full accent-[#38BDF8] bg-[#1c2b3c] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#656d84]">
              <span>16 min</span>
              <span>Default: 64</span>
              <span>128 max</span>
            </div>
          </div>

          {/* Slider 2: io_uring Ring Buffer Depth */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">io_uring SQ/CQ Ring Entries</span>
              <span className="text-[#38BDF8] font-bold">{ringBufferEntries} Entries</span>
            </div>
            <input
              type="range"
              min="1024"
              max="8192"
              step="1024"
              value={ringBufferEntries}
              onChange={(e) => {
                soundFX.playKeyClick();
                setRingBufferEntries(Number(e.target.value));
              }}
              className="w-full accent-[#38BDF8] bg-[#1c2b3c] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#656d84]">
              <span>1024</span>
              <span>Default: 4096</span>
              <span>8192 (High IO)</span>
            </div>
          </div>

          {/* Slider 3: Vector Cache Shard Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">HNSW Vector Shards</span>
              <span className="text-[#38BDF8] font-bold">{vectorShards} Shards</span>
            </div>
            <input
              type="range"
              min="32"
              max="256"
              step="32"
              value={vectorShards}
              onChange={(e) => {
                soundFX.playKeyClick();
                setVectorShards(Number(e.target.value));
              }}
              className="w-full accent-[#38BDF8] bg-[#1c2b3c] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#656d84]">
              <span>32 low</span>
              <span>Default: 128</span>
              <span>256 high-perf</span>
            </div>
          </div>

          {/* Live Calculated Impact Cards */}
          <div className="p-4 rounded-xl bg-[#051424] border border-[#1E293B] space-y-3 font-mono text-xs">
            <span className="text-[11px] font-bold text-[#38BDF8] block">
              PREDICTED BENCHMARK PROJECTIONS:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-[#0d1c2d] border border-[#1E293B]">
                <span className="text-[10px] text-[#656d84]">PROJECTED RPS</span>
                <p className="text-sm font-bold text-[#F8FAFC]">
                  {(estimatedRps / 1000).toFixed(1)}k req/s
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#0d1c2d] border border-[#1E293B]">
                <span className="text-[10px] text-[#656d84]">P99 LATENCY</span>
                <p className="text-sm font-bold text-[#38BDF8]">
                  {estimatedLatency} ms
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0d1c2d] border border-[#1E293B]">
              <span className="text-[10px] text-[#656d84]">MEMORY FOOTPRINT</span>
              <p className="text-sm font-bold text-[#d4e4fa]">
                {estimatedRamGb} TB
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateApply}
            className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all glow-button"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Apply Dynamic Config to Mesh</span>
          </button>
        </div>

        {/* Code Editor or Diff View (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-[#051424] border border-[#1E293B] shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
            <span className="text-xs font-mono font-bold text-[#F8FAFC] flex items-center gap-2">
              <Code className="w-4 h-4 text-[#38BDF8]" />
              {viewMode === 'editor' ? 'kinetic.mesh.hcl (Active Candidate)' : 'Unified Diff vs Production v2.17.9'}
            </span>
            <span className="text-[10px] font-mono text-[#656d84]">
              {viewMode === 'editor' ? 'Live Editable HCL' : 'Read-only Diff'}
            </span>
          </div>

          {viewMode === 'editor' ? (
            <textarea
              value={configCode}
              onChange={(e) => setConfigCode(e.target.value)}
              className="w-full h-[420px] bg-[#071322] font-mono text-xs text-[#d4e4fa] p-4 rounded-xl border border-[#1E293B] focus:border-[#38BDF8] focus:outline-none resize-none leading-relaxed selection:bg-[#2563EB]/40"
              spellCheck={false}
            />
          ) : (
            <div className="w-full h-[420px] bg-[#071322] font-mono text-xs p-4 rounded-xl border border-[#1E293B] overflow-y-auto space-y-1">
              <p className="text-[#656d84]">@@ -14,10 +14,12 @@ engine &quot;rust_worker&quot;</p>
              <p className="text-[#ffb4ab] bg-[#93000a]/20 px-1 py-0.5 rounded">- thread_concurrency = 32</p>
              <p className="text-[#38BDF8] bg-[#2563EB]/20 px-1 py-0.5 rounded">+ thread_concurrency = {threads}</p>
              <p className="text-[#ffb4ab] bg-[#93000a]/20 px-1 py-0.5 rounded">- io_uring_entries   = 2048</p>
              <p className="text-[#38BDF8] bg-[#2563EB]/20 px-1 py-0.5 rounded">+ io_uring_entries   = {ringBufferEntries}</p>
              <p className="text-[#d4e4fa]">  simd_acceleration  = &quot;AVX-512&quot;</p>
              <p className="text-[#656d84]">@@ -28,6 +30,8 @@ cache &quot;vector_store&quot;</p>
              <p className="text-[#ffb4ab] bg-[#93000a]/20 px-1 py-0.5 rounded">- memory_shards      = 64</p>
              <p className="text-[#38BDF8] bg-[#2563EB]/20 px-1 py-0.5 rounded">+ memory_shards      = {vectorShards}</p>
              <p className="text-[#d4e4fa]">  ttl_seconds        = 86400</p>
              <p className="text-[#38BDF8] bg-[#2563EB]/20 px-1 py-0.5 rounded">+ zero_copy_stream  = true</p>
            </div>
          )}

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#656d84] mt-4">
            <span>Syntax: HashiCorp HCL2 format</span>
            <span className="text-[#38BDF8]">Validation: Clean (0 errors)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
