import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Server
} from 'lucide-react';
import { INITIAL_PIPELINES } from '../../data/systemData';
import { DeploymentPipeline } from '../../types';
import { soundFX } from '../../utils/audio';

interface DeploymentsScreenProps {
  onNavigateToConfig?: () => void;
}

export const DeploymentsScreen: React.FC<DeploymentsScreenProps> = ({ onNavigateToConfig }) => {
  const [pipelines, setPipelines] = useState<DeploymentPipeline[]>(INITIAL_PIPELINES);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activePipeline = pipelines[0];

  const handlePromoteCanary = () => {
    soundFX.playCommandExecuted();
    const currentPercent = activePipeline.canaryPercent;
    let nextPercent = 50;
    if (currentPercent >= 50) nextPercent = 100;

    setPipelines((prev) => [
      {
        ...prev[0],
        canaryPercent: nextPercent,
        status: nextPercent === 100 ? 'promoted' : 'canary',
        stages: prev[0].stages.map((stage) => {
          if (stage.name.includes('Canary Traffic') && nextPercent === 50) {
            return { ...stage, details: '50% edge traffic routed to Tokyo, FRA, and Virginia' };
          }
          if (stage.name.includes('Full Global') && nextPercent === 100) {
            return { ...stage, status: 'completed', duration: 'Just now', details: '100% traffic live worldwide' };
          }
          return stage;
        })
      },
      ...prev.slice(1)
    ]);

    setActionNotice(`Canary successfully promoted to ${nextPercent}% global edge distribution.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRollback = () => {
    soundFX.playAlert();
    setPipelines((prev) => [
      {
        ...prev[0],
        status: 'rollback',
        canaryPercent: 0,
        stages: prev[0].stages.map((stage) => ({
          ...stage,
          details: 'Traffic instantaneously reverted to v2.17.9 stable snapshot'
        }))
      },
      ...prev.slice(1)
    ]);

    setActionNotice('EMERGENCY ROLLBACK EXECUTED: All edge nodes reverted to v2.17.9 in 12ms.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleInjectChaos = () => {
    soundFX.playBeep(450, 0.12, 'sawtooth');
    setActionNotice('Chaos Monkey test active: Injected 5,000 synthetic packet drops. 0% state corruption recorded.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-[#131E36] border border-[#38BDF8] shadow-[0_0_25px_rgba(56,189,248,0.2)] flex items-center justify-between text-xs font-mono text-[#F8FAFC] animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38BDF8] animate-spin" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-[#94A3B8] hover:text-[#F8FAFC] px-2 py-0.5 rounded bg-[#1E293B]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Pipeline Overview */}
      <div className="p-6 rounded-2xl bg-[#0d1c2d] border border-[#1E293B] shadow-[0_0_30px_rgba(37,99,235,0.12)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40">
                RELEASE PIPELINE
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">{activePipeline.branch}</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              {activePipeline.version} — {activePipeline.message}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#94A3B8]">
              <span>Commit: <span className="text-[#38BDF8]">{activePipeline.commitHash}</span></span>
              <span>•</span>
              <span>Author: <span className="text-[#F8FAFC]">{activePipeline.author}</span></span>
              <span>•</span>
              <span>Started: {activePipeline.startedAt}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {activePipeline.status !== 'promoted' && activePipeline.status !== 'rollback' && (
              <button
                onClick={handlePromoteCanary}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-[#F8FAFC] shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all glow-button"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>
                  {activePipeline.canaryPercent < 50
                    ? 'Promote Canary to 50%'
                    : 'Promote 100% Global Rollout'}
                </span>
              </button>
            )}

            <button
              onClick={handleInjectChaos}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-[#131E36] hover:bg-[#1E293B] text-[#d4e4fa] border border-[#334155] hover:border-[#38BDF8] transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Chaos Monkey Test</span>
            </button>

            <button
              onClick={handleRollback}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Instant Rollback</span>
            </button>
          </div>
        </div>

        {/* Canary Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#1E293B]">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-[#94A3B8]">
              Edge Traffic Weight: <span className="text-[#38BDF8] font-bold">{activePipeline.canaryPercent}%</span>
            </span>
            <span className="text-[#656d84]">
              {activePipeline.canaryPercent === 100 ? 'Fully Propagated' : 'Dual Canary Shifting Active'}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#051424] p-0.5 border border-[#1E293B] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#2563EB] transition-all duration-700"
              style={{ width: `${Math.max(activePipeline.canaryPercent, 2)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Staged CI/CD Pipeline Progression Cards */}
      <div className="rounded-2xl p-6 bg-[#051424] border border-[#1E293B] shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <h3 className="font-bold text-sm text-[#F8FAFC] mb-4 font-mono tracking-wider uppercase">
          Continuous Delivery Verification Matrix
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {activePipeline.stages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isInProgress
                    ? 'bg-[#131E36] border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : isCompleted
                    ? 'bg-[#0d1c2d]/70 border-[#1E293B]'
                    : 'bg-[#051424] border-[#1E293B]/40 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                    ) : isInProgress ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#656d84]" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-[#F8FAFC] text-xs">
                      {stage.name}
                    </span>
                    {stage.details && (
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">{stage.details}</p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-bold ${isInProgress ? 'text-[#38BDF8]' : 'text-[#656d84]'}`}>
                    {stage.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Pipelines */}
      <div className="rounded-2xl p-6 bg-[#0d1c2d] border border-[#1E293B]">
        <h3 className="font-bold text-sm text-[#F8FAFC] mb-3 font-mono">
          Previous Production Release (v2.17.9)
        </h3>
        <div className="p-4 rounded-xl bg-[#051424] border border-[#1E293B] flex items-center justify-between text-xs font-mono">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F8FAFC]">v2.17.9</span>
              <span className="text-[#38BDF8]">● Promoted</span>
              <span className="text-[#656d84]">commit: 3e11b90</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] mt-1">fix: optimize Redis connection pool recycling during spike load</p>
          </div>
          <span className="text-[#656d84]">Deployed 2 days ago</span>
        </div>
      </div>
    </div>
  );
};
