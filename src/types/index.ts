export type ScreenType = 'dashboard' | 'terminal' | 'architecture' | 'deployments' | 'config';

export interface SystemMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  history: number[];
  target: string;
  status: 'optimal' | 'warning' | 'alert';
  detail: string;
}

export interface ClusterNode {
  id: string;
  name: string;
  region: string;
  location: string;
  status: 'online' | 'degraded' | 'syncing';
  cpu: number;
  memory: number;
  latency: number;
  traffic: string;
  version: string;
  uptime: string;
}

export interface Microservice {
  id: string;
  name: string;
  role: string;
  protocol: 'gRPC' | 'WASM/Edge' | 'HTTP/3' | 'IPC' | 'WebSocket';
  instances: number;
  qps: number;
  p99: number;
  errorRate: number;
  status: 'active' | 'warning' | 'syncing';
  description: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'NOTICE' | 'WARN' | 'METRIC' | 'CRIT';
  service: string;
  message: string;
  traceId?: string;
}

export interface TraceSpan {
  id: string;
  name: string;
  service: string;
  durationMs: number;
  status: 'success' | 'warning' | 'error';
  tags: Record<string, string>;
  children?: TraceSpan[];
}

export interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  type: 'edge' | 'gateway' | 'compute' | 'storage' | 'cache' | 'ai';
  specs: {
    runtime: string;
    throughput: string;
    concurrency: string;
    protocol: string;
  };
  features: string[];
  metrics: {
    load: number;
    latency: string;
  };
}

export interface DeploymentPipeline {
  id: string;
  commitHash: string;
  branch: string;
  author: string;
  message: string;
  version: string;
  status: 'deploying' | 'canary' | 'promoted' | 'failed' | 'rollback';
  canaryPercent: number;
  startedAt: string;
  stages: {
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
    duration: string;
    details?: string;
  }[];
}
