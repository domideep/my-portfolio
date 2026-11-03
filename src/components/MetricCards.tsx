import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';
import { SystemMetric } from '../types';
import { soundFX } from '../utils/audio';

interface MetricCardsProps {
  metrics: SystemMetric[];
  onSelectMetric?: (metric: SystemMetric) => void;
  activeMetricId?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ 
  metrics, 
  onSelectMetric,
  activeMetricId 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((metric) => {
        const isSelected = activeMetricId === metric.id;
        
        // Simple SVG sparkline points calculation
        const min = Math.min(...metric.history);
        const max = Math.max(...metric.history);
        const range = max - min || 1;
        const height = 24;
        const width = 80;
        const points = metric.history
          .map((val, idx) => {
            const x = (idx / (metric.history.length - 1)) * width;
            const y = height - ((val - min) / range) * (height - 6) - 3;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <div
            key={metric.id}
            onClick={() => {
              soundFX.playKeyClick();
              if (onSelectMetric) onSelectMetric(metric);
            }}
            className={`group relative rounded-xl p-4 transition-all cursor-pointer border ${
              isSelected
                ? 'bg-[#131E36] border-[#38BDF8] shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                : 'bg-[#131E36]/70 hover:bg-[#131E36] border-[#1E293B] hover:border-[#334155] hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]'
            }`}
          >
            {/* Top perimeter highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent group-hover:via-[#38BDF8]/40" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#94A3B8] tracking-tight group-hover:text-[#d4e4fa] transition-colors line-clamp-1">
                {metric.name}
              </span>
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute w-2 h-2 rounded-full bg-[#38BDF8] opacity-60 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                {metric.value}
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">
                {metric.unit}
              </span>
            </div>

            {/* Sparkline & Change pill */}
            <div className="mt-3 pt-2.5 border-t border-[#1E293B]/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {metric.changeType === 'positive' && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                )}
                {metric.changeType === 'negative' && (
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#ffb4ab]" />
                )}
                {metric.changeType === 'neutral' && (
                  <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />
                )}
                <span
                  className={`text-[11px] font-mono font-medium ${
                    metric.changeType === 'positive'
                      ? 'text-[#38BDF8]'
                      : metric.changeType === 'negative'
                      ? 'text-[#ffb4ab]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {metric.change}
                </span>
              </div>

              {/* Sparkline SVG */}
              <div className="w-[70px] h-[22px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>

            {/* Target threshold indicator */}
            <div className="mt-1.5 text-[10px] font-mono text-[#656d84] flex items-center justify-between">
              <span>Goal: {metric.target}</span>
              <span className="text-[9px] uppercase tracking-wider text-[#38BDF8]/80 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> Normal
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
