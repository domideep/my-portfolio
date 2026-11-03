import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Activity, 
  Cpu, 
  RefreshCw, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Flame,
  Search,
  Sparkles
} from 'lucide-react';
import { SystemMetric, ClusterNode, Microservice, LogEntry, ScreenType } from '../../types';
import { MetricCards } from '../MetricCards';
import { soundFX } from '../../utils/audio';

interface DashboardScreenProps {
  metrics: SystemMetric[];
  nodes: ClusterNode[];
  microservices: Microservice[];
  logs: LogEntry[];
  onNavigate: (screen: ScreenType) => void;
  onRunCommand: (command: string) => void;
  onSimulateSurge: () => void;
  isSurgeActive: boolean;
  onAddLog: (log: Omit<LogEntry, 'id'>) => void;
  diagnosticResult: string | null;
  onClearDiagnostic: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  metrics,
  nodes,
  microservices,
  logs,
  onNavigate,
  onRunCommand,
  onSimulateSurge,
  isSurgeActive,
  onAddLog,
  diagnosticResult,
  onClearDiagnostic
}) => {
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');
  const [activeMetric, setActiveMetric] = useState<string | undefined>('throughput');
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logFilter === 'ALL' || log.level === logFilter;
    const matchesSearch = logSearch === '' || 
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.service.toLowerCase().includes(logSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Handle flush cache simulation
  const handleFlushCache = () => {
    soundFX.playCommandExecuted();
    onAddLog({
      timestamp: new Date().toISOString().substring(11, 23),
      level: 'NOTICE',
      service: 'vector-cache',
      message: 'Flushed 48,200 stale vector shards across edge nodes. Cold reload in 42ms.'
    });
  };

  return (
    <div className="space-y-6">
      {/* System Diagnostic Modal/Banner if active */}
      {diagnosticResult && (
        <div className="p-4 rounded-xl bg-[#131E36] border border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.25)] flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#2563EB]/20 text-[#38BDF8]">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC]">System Doctor Diagnostic Report</h4>
              <p className="text-xs font-mono text-[#d4e4fa] mt-1 whitespace-pre-line">
                {diagnosticResult}
              </p>
            </div>
          </div>
          <button
            onClick={onClearDiagnostic}
            className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Executive HUD Bar */}
      <div className="relative rounded-2xl p-6 lg:p-8 bg-gradient-to-r from-[#0d1c2d] via-[#122131] to-[#0d1c2d] border border-[#1E293B] shadow-[0_0_35px_rgba(37,99,235,0.12)] overflow-hidden">
        {/* Ambient background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#1E293B]/70 border border-[#38BDF8]/40 text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
              <span>ACTIVE CLUSTER: KINETIC-MESH-PROD</span>
              <span className="text-[#656d84]">|</span>
              <span className="text-[#c3c6d7]">ANYCAST L7</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
              Engineering Control & Telemetry Mesh
            </h1>
            
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Real-time runtime state for zero-copy distributed streams, SIMD-accelerated vector indexing, and multi-region consensus nodes.
            </p>
          </div>

          {/* Interactive Fast Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                soundFX.playBeep(isSurgeActive ? 400 : 880, 0.08);
                onSimulateSurge();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isSurgeActive
                  ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/60 shadow-[0_0_20px_rgba(255,180,171,0.3)]'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] shadow-[0_0_20px_rgba(56,189,248,0.35)]'
              }`}
            >
              <Flame className={`w-4 h-4 ${isSurgeActive ? 'animate-bounce' : ''}`} />
              <span>{isSurgeActive ? 'Surge Active (500k RPS)' : 'Simulate Traffic Spike'}</span>
            </button>

            <button
              onClick={handleFlushCache}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-[#131E36]/80 hover:bg-[#131E36] text-[#d4e4fa] border border-[#334155] hover:border-[#38BDF8] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Flush Cache</span>
            </button>

            <button
              onClick={() => {
                soundFX.playKeyClick();
                onNavigate('terminal');
                onRunCommand('perf analyze');
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-[#131E36]/80 hover:bg-[#131E36] text-[#d4e4fa] border border-[#334155] hover:border-[#38BDF8] transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>CLI Analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <MetricCards 
        metrics={metrics} 
        onSelectMetric={(m) => setActiveMetric(m.id)}
        activeMetricId={activeMetric}
      />

      {/* Dual Section: Cluster Regional Nodes + Microservices Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Region Node Mesh (5 cols) */}
        <div className="lg:col-span-5 rounded-xl p-5 bg-[#131E36]/80 border border-[#1E293B] shadow-[0_0_20px_rgba(37,99,235,0.1)] flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-4">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-semibold text-sm text-[#F8FAFC]">Multi-Region POP Nodes</h3>
            </div>
            <button
              onClick={() => onNavigate('architecture')}
              className="text-xs font-mono text-[#38BDF8] hover:underline flex items-center gap-1"
            >
              <span>Topology</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="p-3.5 rounded-lg bg-[#0d1c2d] border border-[#1E293B] hover:border-[#334155] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#F8FAFC]">
                        {node.name}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        node.status === 'online' ? 'bg-[#38BDF8]' : 'bg-[#ffb4ab] animate-ping'
                      }`} />
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">{node.location} ({node.region})</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-[#38BDF8]">
                      {node.latency} ms
                    </span>
                    <p className="text-[10px] font-mono text-[#656d84]">{node.traffic}</p>
                  </div>
                </div>

                {/* Utilization Bars */}
                <div className="grid grid-cols-2 gap-3 mt-3 pt-2.5 border-t border-[#1E293B]/70">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-[#94A3B8]">
                      <span>CPU</span>
                      <span>{node.cpu}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1c2b3c] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          node.cpu > 70 ? 'bg-[#ffb4ab]' : 'bg-[#2563EB]'
                        }`}
                        style={{ width: `${node.cpu}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-[#94A3B8]">
                      <span>RAM</span>
                      <span>{node.memory}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1c2b3c] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#38BDF8] transition-all duration-500"
                        style={{ width: `${node.memory}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#656d84]">
            <span>Consensus: Raft Monotonic Epoch #481,992</span>
            <span className="text-[#38BDF8]">Quorum 4/4</span>
          </div>
        </div>

        {/* Microservices Fleet Status (7 cols) */}
        <div className="lg:col-span-7 rounded-xl p-5 bg-[#131E36]/80 border border-[#1E293B] shadow-[0_0_20px_rgba(37,99,235,0.1)] flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-semibold text-sm text-[#F8FAFC]">Microservices Fleet Status</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <span>Fleet: 265 Pods</span>
              <span className="text-[#434655]">|</span>
              <span className="text-[#38BDF8]">All Green</span>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-[#656d84] border-b border-[#1E293B] pb-2">
                  <th className="pb-2 font-medium">SERVICE</th>
                  <th className="pb-2 font-medium">PROTOCOL</th>
                  <th className="pb-2 font-medium">REPLICAS</th>
                  <th className="pb-2 font-medium">THROUGHPUT</th>
                  <th className="pb-2 font-medium">P99</th>
                  <th className="pb-2 font-medium text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {microservices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-[#0d1c2d]/70 transition-colors group">
                    <td className="py-2.5 font-semibold text-[#F8FAFC]">
                      <div className="flex flex-col">
                        <span>{svc.name}</span>
                        <span className="text-[10px] text-[#94A3B8] font-sans">{svc.role}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#051424] text-[#38BDF8] border border-[#1E293B]">
                        {svc.protocol}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#d4e4fa]">{svc.instances}</td>
                    <td className="py-2.5 text-[#d4e4fa]">
                      {(svc.qps / 1000).toFixed(1)}k qps
                    </td>
                    <td className="py-2.5 text-[#38BDF8] font-bold">
                      {svc.p99}ms
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#38BDF8]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Want to simulate chaos or trigger canary?</span>
            <button
              onClick={() => onNavigate('deployments')}
              className="text-[#38BDF8] hover:underline font-mono text-xs flex items-center gap-1"
            >
              <span>Manage Canary Pipelines</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Live System Log & Event Telemetry Stream */}
      <div className="rounded-xl p-5 bg-[#0b1120] border border-[#1E293B] shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-[#131E36] border border-[#2563EB]/40">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F8FAFC]">Live System Telemetry Stream</h3>
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                Real-time ring buffer logs from distributed edge proxies & vector indices
              </p>
            </div>
          </div>

          {/* Log Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#656d84] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs font-mono rounded-lg bg-[#051424] border border-[#1E293B] text-[#d4e4fa] placeholder-[#656d84] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {/* Level filters */}
            <div className="flex items-center bg-[#051424] p-0.5 rounded-lg border border-[#1E293B] text-[10px] font-mono">
              {['ALL', 'INFO', 'METRIC', 'WARN', 'NOTICE'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    soundFX.playKeyClick();
                    setLogFilter(lvl);
                  }}
                  className={`px-2 py-1 rounded transition-colors ${
                    logFilter === lvl
                      ? 'bg-[#2563EB] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#d4e4fa]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                isAutoScroll ? 'bg-[#2563EB]/20 border-[#38BDF8] text-[#38BDF8]' : 'bg-[#051424] border-[#1E293B] text-[#656d84]'
              }`}
              title="Toggle Auto Scroll"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Log Viewer Container */}
        <div className="mt-3 font-mono text-xs space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => {
            let badgeBg = 'bg-[#1c2b3c] text-[#94A3B8]';
            if (log.level === 'WARN') badgeBg = 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40';
            if (log.level === 'METRIC') badgeBg = 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40';
            if (log.level === 'NOTICE') badgeBg = 'bg-[#2563EB]/20 text-[#b4c5ff] border border-[#2563EB]/40';

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2 rounded bg-[#051424]/60 hover:bg-[#131E36]/40 transition-colors border border-transparent hover:border-[#1E293B]"
              >
                <span className="text-[#656d84] shrink-0 text-[11px]">{log.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${badgeBg}`}>
                  {log.level}
                </span>
                <span className="text-[#7bd0ff] shrink-0 font-medium">[{log.service}]</span>
                <span className="text-[#d4e4fa] flex-1 break-all">{log.message}</span>
                {log.traceId && (
                  <button
                    onClick={() => {
                      soundFX.playKeyClick();
                      onNavigate('terminal');
                      onRunCommand(`trace ${log.traceId}`);
                    }}
                    className="text-[10px] text-[#38BDF8] hover:underline shrink-0 font-mono"
                  >
                    {log.traceId}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
