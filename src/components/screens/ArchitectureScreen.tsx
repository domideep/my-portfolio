import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  Zap, 
  Check, 
  Copy, 
  Share2, 
  Database, 
  Globe, 
  ShieldCheck, 
  Server,
  Activity
} from 'lucide-react';
import { ARCHITECTURE_BLUEPRINTS } from '../../data/systemData';
import { ArchitectureNode } from '../../types';
import { soundFX } from '../../utils/audio';

export const ArchitectureScreen: React.FC = () => {
  const [selectedBlueprintIndex, setSelectedBlueprintIndex] = useState(0);
  const currentBlueprint = ARCHITECTURE_BLUEPRINTS[selectedBlueprintIndex] || ARCHITECTURE_BLUEPRINTS[0];
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(currentBlueprint.nodes[1] || currentBlueprint.nodes[0]);
  const [copied, setCopied] = useState(false);

  const handleSelectBlueprint = (idx: number) => {
    soundFX.playKeyClick();
    setSelectedBlueprintIndex(idx);
    setSelectedNode(ARCHITECTURE_BLUEPRINTS[idx].nodes[0]);
  };

  const handleSelectNode = (node: ArchitectureNode) => {
    soundFX.playKeyClick();
    setSelectedNode(node);
  };

  const handleCopySpec = () => {
    soundFX.playCommandExecuted();
    navigator.clipboard.writeText(JSON.stringify(currentBlueprint, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getNodeIcon = (type: ArchitectureNode['type']) => {
    switch (type) {
      case 'edge': return <Globe className="w-4 h-4 text-[#38BDF8]" />;
      case 'gateway': return <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />;
      case 'compute': return <Cpu className="w-4 h-4 text-[#b4c5ff]" />;
      case 'cache': return <Zap className="w-4 h-4 text-[#38BDF8]" />;
      case 'storage': return <Database className="w-4 h-4 text-[#7bd0ff]" />;
      case 'ai': return <Activity className="w-4 h-4 text-[#38BDF8]" />;
      default: return <Server className="w-4 h-4 text-[#38BDF8]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Blueprint Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1c2d] border border-[#1E293B] shadow-[0_0_30px_rgba(37,99,235,0.1)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40">
              ARCHITECTURE SCHEMATIC
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">v2.18 SPECIFICATION</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            {currentBlueprint.title}
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-2xl mt-1">
            {currentBlueprint.description}
          </p>
        </div>

        {/* Blueprint Switcher Buttons & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {ARCHITECTURE_BLUEPRINTS.map((bp, idx) => (
            <button
              key={bp.id}
              onClick={() => handleSelectBlueprint(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedBlueprintIndex === idx
                  ? 'bg-[#2563EB] text-[#F8FAFC] font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-[#131E36] text-[#94A3B8] hover:text-[#d4e4fa] border border-[#1E293B]'
              }`}
            >
              {idx === 0 ? 'High-Throughput Gateway' : 'Autonomous AI Mesh'}
            </button>
          ))}

          <button
            onClick={handleCopySpec}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#131E36] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#38BDF8] text-[#d4e4fa] transition-all"
            title="Copy Blueprint JSON Specification"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Export JSON'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Topology Diagram + Deep Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Mesh Canvas (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-[#051424] border border-[#1E293B] shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
            <span className="text-xs font-mono font-bold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              Dataflow Pipeline & Node Topology
            </span>
            <span className="text-[11px] font-mono text-[#38BDF8] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              Interactive (Click node to inspect)
            </span>
          </div>

          {/* Connected Topology Diagram Nodes */}
          <div className="space-y-4 my-auto py-2">
            {currentBlueprint.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isLast = index === currentBlueprint.nodes.length - 1;

              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => handleSelectNode(node)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#131E36] border-[#38BDF8] shadow-[0_0_25px_rgba(56,189,248,0.22)]'
                        : 'bg-[#0d1c2d]/80 hover:bg-[#131E36] border-[#1E293B] hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#051424] border border-[#1E293B] shrink-0 mt-0.5">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#F8FAFC]">
                              {node.title}
                            </span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-mono uppercase bg-[#051424] text-[#38BDF8] border border-[#1E293B]">
                              {node.type}
                            </span>
                          </div>
                          <p className="text-xs text-[#94A3B8] mt-0.5">{node.subtitle}</p>

                          {/* Fast Pill specs */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {node.features.map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#051424]/80 text-[#c3c6d7] border border-[#1E293B]"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-[#38BDF8]">
                          {node.metrics.latency}
                        </span>
                        <p className="text-[10px] font-mono text-[#656d84]">{node.specs.throughput}</p>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow Connector between nodes */}
                  {!isLast && (
                    <div className="flex justify-center my-1">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-[#38BDF8]/60 via-[#2563EB] to-[#38BDF8]/40 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#656d84] mt-4">
            <span>Protocol: Zero-Copy io_uring + Ed25519 Token Hash</span>
            <span className="text-[#38BDF8]">P99 Target &lt; 20ms</span>
          </div>
        </div>

        {/* Deep Component Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-[#0d1c2d] border border-[#1E293B] shadow-[0_0_25px_rgba(37,99,235,0.1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
              <span className="text-xs font-mono font-bold text-[#F8FAFC] tracking-wider uppercase">
                Component Specification
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40">
                ACTIVE
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC]">
                    {selectedNode.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{selectedNode.subtitle}</p>
                </div>

                {/* Key Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#051424] border border-[#1E293B]">
                    <span className="text-[#656d84] text-[10px] block">RUNTIME ENGINE</span>
                    <span className="text-[#F8FAFC] font-bold mt-1 block">
                      {selectedNode.specs.runtime}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#051424] border border-[#1E293B]">
                    <span className="text-[#656d84] text-[10px] block">PEAK THROUGHPUT</span>
                    <span className="text-[#38BDF8] font-bold mt-1 block">
                      {selectedNode.specs.throughput}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#051424] border border-[#1E293B]">
                    <span className="text-[#656d84] text-[10px] block">CONCURRENCY BOUNDS</span>
                    <span className="text-[#F8FAFC] font-bold mt-1 block">
                      {selectedNode.specs.concurrency}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#051424] border border-[#1E293B]">
                    <span className="text-[#656d84] text-[10px] block">NETWORK PROTOCOL</span>
                    <span className="text-[#38BDF8] font-bold mt-1 block">
                      {selectedNode.specs.protocol}
                    </span>
                  </div>
                </div>

                {/* Real-time Load & Latency */}
                <div className="p-4 rounded-xl bg-[#051424] border border-[#1E293B] space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#94A3B8]">Simulated Core Load</span>
                    <span className="text-[#38BDF8] font-bold">{selectedNode.metrics.load}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1c2b3c] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8]"
                      style={{ width: `${selectedNode.metrics.load}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#656d84] pt-1">
                    <span>Target Latency: {selectedNode.metrics.latency}</span>
                    <span>Failover: 0-downtime hot standby</span>
                  </div>
                </div>

                {/* Architecture Safeguards */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#94A3B8] font-semibold">
                    Engine Architectural Guarantees:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {selectedNode.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#d4e4fa] font-mono text-[11px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8]">Select any node in the left diagram to view specifications.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono">
            <span className="text-[#656d84]">Memory Allocator: Jemalloc v5</span>
            <span className="text-[#38BDF8]">AVX-512 Quantized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
