import { SystemMetric, ClusterNode, Microservice, LogEntry, TraceSpan, ArchitectureNode, DeploymentPipeline } from '../types';

export const INITIAL_METRICS: SystemMetric[] = [
  {
    id: 'throughput',
    name: 'Global Edge Ingress',
    value: '284.6k',
    unit: 'req/s',
    change: '+12.4%',
    changeType: 'positive',
    history: [240, 248, 255, 262, 270, 275, 280, 284.6],
    target: '350.0k max',
    status: 'optimal',
    detail: 'Balanced across 4 Anycast edge POPs'
  },
  {
    id: 'latency',
    name: 'P99 Edge Latency',
    value: '14.2',
    unit: 'ms',
    change: '-3.1ms',
    changeType: 'positive',
    history: [19.4, 18.2, 17.5, 16.1, 15.0, 14.8, 14.2],
    target: '< 25.0 ms',
    status: 'optimal',
    detail: 'WASM zero-copy edge compute'
  },
  {
    id: 'cache',
    name: 'Vector Cache Hit Rate',
    value: '99.42',
    unit: '%',
    change: '+0.18%',
    changeType: 'positive',
    history: [98.8, 99.0, 99.1, 99.25, 99.38, 99.42],
    target: '> 98.50%',
    status: 'optimal',
    detail: 'NVMe-backed local sharded RAM'
  },
  {
    id: 'nodes',
    name: 'Active Mesh Workers',
    value: '1,482',
    unit: 'nodes',
    change: '+24 pods',
    changeType: 'neutral',
    history: [1410, 1420, 1445, 1450, 1460, 1478, 1482],
    target: '1,500 cap',
    status: 'optimal',
    detail: 'Auto-scaled based on CPU load > 65%'
  },
  {
    id: 'error_rate',
    name: 'Error Budget Remaining',
    value: '99.988',
    unit: '%',
    change: '0.001% err',
    changeType: 'positive',
    history: [99.982, 99.985, 99.986, 99.988, 99.988],
    target: '> 99.950%',
    status: 'optimal',
    detail: 'Zero critical outages in last 90 days'
  },
  {
    id: 'memory',
    name: 'Aggregated Memory Pool',
    value: '38.4',
    unit: 'TB',
    change: '64.2% util',
    changeType: 'neutral',
    history: [32.1, 33.4, 35.0, 36.8, 37.5, 38.4],
    target: '60.0 TB total',
    status: 'optimal',
    detail: 'Fast memory allocator (Jemalloc v5)'
  }
];

export const INITIAL_NODES: ClusterNode[] = [
  {
    id: 'tokyo-edge-01',
    name: 'kinetic-nrt-edge-01',
    region: 'ap-northeast-1',
    location: 'Tokyo, Japan',
    status: 'online',
    cpu: 44.8,
    memory: 58.2,
    latency: 9.4,
    traffic: '84.2k rps',
    version: 'v2.18.0-rc4',
    uptime: '49d 12h'
  },
  {
    id: 'frankfurt-core-02',
    name: 'kinetic-fra-core-02',
    region: 'eu-central-1',
    location: 'Frankfurt, Germany',
    status: 'online',
    cpu: 62.1,
    memory: 71.4,
    latency: 12.1,
    traffic: '96.5k rps',
    version: 'v2.18.0-rc4',
    uptime: '112d 04h'
  },
  {
    id: 'virginia-gateway-03',
    name: 'kinetic-iad-gw-03',
    region: 'us-east-1',
    location: 'N. Virginia, USA',
    status: 'online',
    cpu: 53.7,
    memory: 66.8,
    latency: 11.8,
    traffic: '104.0k rps',
    version: 'v2.18.0-rc4',
    uptime: '84d 19h'
  },
  {
    id: 'saopaulo-edge-04',
    name: 'kinetic-gru-edge-04',
    region: 'sa-east-1',
    location: 'São Paulo, Brazil',
    status: 'syncing',
    cpu: 38.2,
    memory: 49.0,
    latency: 28.5,
    traffic: '22.8k rps',
    version: 'v2.18.0-rc3',
    uptime: '14d 08h'
  }
];

export const MICROSERVICES: Microservice[] = [
  {
    id: 'srv-ingress',
    name: 'Envoy Edge Ingress',
    role: 'TLS Termination & L7 Routing',
    protocol: 'HTTP/3',
    instances: 48,
    qps: 284600,
    p99: 1.8,
    errorRate: 0.0004,
    status: 'active',
    description: 'High-concurrency Rust & C++ proxy with automated QUIC/HTTP3 fallback'
  },
  {
    id: 'srv-vector',
    name: 'Vector Search Pipeline',
    role: 'HNSW Embedding & Similarity Index',
    protocol: 'gRPC',
    instances: 96,
    qps: 52400,
    p99: 8.4,
    errorRate: 0.0001,
    status: 'active',
    description: 'Low-latency quantized similarity search with SIMD AVX-512 acceleration'
  },
  {
    id: 'srv-broker',
    name: 'Tokio Stream Broker',
    role: 'Zero-Copy Pub/Sub Ring Buffer',
    protocol: 'IPC',
    instances: 32,
    qps: 189000,
    p99: 0.6,
    errorRate: 0.0000,
    status: 'active',
    description: 'Kernel bypass io_uring event loop streaming up to 40 Gbps'
  },
  {
    id: 'srv-consensus',
    name: 'Distributed Raft Consensus',
    role: 'Leader Election & State Machine',
    protocol: 'gRPC',
    instances: 7,
    qps: 8400,
    p99: 3.2,
    errorRate: 0.0000,
    status: 'active',
    description: 'Multi-region quorum coordinator with deterministic monotonic clocks'
  },
  {
    id: 'srv-auth',
    name: 'Cryptographic Auth Vault',
    role: 'Ed25519 Token Minting & Policy',
    protocol: 'WASM/Edge',
    instances: 64,
    qps: 142000,
    p99: 2.1,
    errorRate: 0.0002,
    status: 'active',
    description: 'Stateless boundary validation with sub-millisecond public key cache'
  },
  {
    id: 'srv-canary',
    name: 'Canary Traffic Shifter',
    role: 'Dynamic Weighted Flow Control',
    protocol: 'WASM/Edge',
    instances: 16,
    qps: 44000,
    p99: 1.2,
    errorRate: 0.0000,
    status: 'active',
    description: 'Granular header-based routing for incremental blue-green deployments'
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '13:02:18.492',
    level: 'INFO',
    service: 'envoy-ingress',
    message: 'Anycast ingress routing table updated across 4 global POPs. P99 latency: 14.2ms',
    traceId: 'tr_8f93a10'
  },
  {
    id: 'log-2',
    timestamp: '13:02:19.104',
    level: 'METRIC',
    service: 'vector-index',
    message: 'Vector index compaction complete. 14.8M embeddings refreshed in 184ms via AVX-512',
    traceId: 'tr_3b72c91'
  },
  {
    id: 'log-3',
    timestamp: '13:02:20.551',
    level: 'NOTICE',
    service: 'raft-consensus',
    message: 'Heartbeat epoch 481,992 acknowledged by Tokyo, Frankfurt, Virginia quorum (3/3)',
    traceId: 'tr_4c21e05'
  },
  {
    id: 'log-4',
    timestamp: '13:02:21.018',
    level: 'WARN',
    service: 'canary-shifter',
    message: 'São Paulo edge node latency skew +4.2ms during cross-Atlantic fiber reroute',
    traceId: 'tr_9d04a62'
  },
  {
    id: 'log-5',
    timestamp: '13:02:22.330',
    level: 'INFO',
    service: 'stream-broker',
    message: 'Kernel io_uring ring buffer flushed 1.4M events without lock contention',
    traceId: 'tr_1e87f33'
  }
];

export const ARCHITECTURE_BLUEPRINTS: {
  id: string;
  title: string;
  description: string;
  nodes: ArchitectureNode[];
}[] = [
  {
    id: 'edge-gateway',
    title: 'High-Throughput Edge Streaming & RPC Gateway',
    description: 'Global multi-region topology featuring zero-copy WASM proxying, TLS session tickets resumption, and real-time HNSW vector caching.',
    nodes: [
      {
        id: 'node-client',
        title: 'Global Clients & Mobile SDKs',
        subtitle: 'Multi-Region Inbound Traffic',
        type: 'edge',
        specs: {
          runtime: 'HTTP/3, QUIC, WebSocket',
          throughput: '284k req/sec',
          concurrency: '1.2M conn',
          protocol: 'TLS 1.3 0-RTT'
        },
        features: ['BBR Congestion Control', 'Fast Anycast BGP', 'Client-side connection pooling'],
        metrics: { load: 88, latency: '4.2ms' }
      },
      {
        id: 'node-envoy',
        title: 'Envoy Edge Gateway & Rate Shifter',
        subtitle: 'Rust + WASM Filtering Layer',
        type: 'gateway',
        specs: {
          runtime: 'Envoy v1.30 + Wasmtime',
          throughput: '32 Gbps',
          concurrency: '350k req/s',
          protocol: 'gRPC-Web / HTTP/2'
        },
        features: ['Token bucket rate limit', 'Ed25519 signature audit', 'Distributed circuit breaker'],
        metrics: { load: 54, latency: '1.8ms' }
      },
      {
        id: 'node-router',
        title: 'Tokio Stream Router',
        subtitle: 'Asynchronous Rust Core',
        type: 'compute',
        specs: {
          runtime: 'Tokio / Rust 1.84',
          throughput: '189k msg/s',
          concurrency: '64 worker threads',
          protocol: 'io_uring IPC'
        },
        features: ['Zero-copy ring buffer', 'Work-stealing threadpool', 'Jemalloc memory bounds'],
        metrics: { load: 61, latency: '0.6ms' }
      },
      {
        id: 'node-cache',
        title: 'Vector Cache & KV Mesh',
        subtitle: 'In-Memory Sharded Store',
        type: 'cache',
        specs: {
          runtime: 'Redis 7 Cluster + RocksDB',
          throughput: '99.4% hit rate',
          concurrency: '128 shards',
          protocol: 'RESP3 Binary'
        },
        features: ['SIMD cosine distance', 'Automatic hot-key replication', 'Append-only persistence'],
        metrics: { load: 42, latency: '0.9ms' }
      },
      {
        id: 'node-storage',
        title: 'Distributed Storage Core',
        subtitle: 'Fault-Tolerant WAL Database',
        type: 'storage',
        specs: {
          runtime: 'PostgreSQL 16 + Raft Quorum',
          throughput: '45k tx/s',
          concurrency: 'Active-Active Read Replicas',
          protocol: 'Wire Protocol v3'
        },
        features: ['Sub-second failover', 'Continuous logical backup', 'Row-level cryptographic integrity'],
        metrics: { load: 38, latency: '3.1ms' }
      }
    ]
  },
  {
    id: 'ai-agents',
    title: 'Autonomous AI Agent Mesh & Tool Runtime',
    description: 'Event-driven agent orchestrator with speculative inference routing, semantic guardrails, and persistent vector memory banks.',
    nodes: [
      {
        id: 'node-ingress-ai',
        title: 'Prompt Ingress & Safety Guard',
        subtitle: 'Content Filtering & Sanitization',
        type: 'gateway',
        specs: {
          runtime: 'Go 1.22 + Regex SIMD',
          throughput: '4,200 tok/s',
          concurrency: '1,000 streams',
          protocol: 'Server-Sent Events'
        },
        features: ['Prompt injection guard', 'PII redaction', 'Budget quota tracker'],
        metrics: { load: 45, latency: '3.4ms' }
      },
      {
        id: 'node-orchestrator',
        title: 'Kinetic Agent Orchestrator',
        subtitle: 'Directed Acyclic Graph Engine',
        type: 'ai',
        specs: {
          runtime: 'Rust async state machine',
          throughput: '850 plans/s',
          concurrency: '5,000 subagents',
          protocol: 'gRPC v2'
        },
        features: ['Speculative branch pruning', 'Memory checkpointing', 'Tool invocation sandbox'],
        metrics: { load: 68, latency: '8.2ms' }
      },
      {
        id: 'node-vector-memory',
        title: 'Semantic Memory Bank',
        subtitle: 'Hybrid Dense-Sparse Embeddings',
        type: 'cache',
        specs: {
          runtime: 'Qdrant / Custom HNSW',
          throughput: '24M vectors',
          concurrency: '1,500 queries/s',
          protocol: 'gRPC'
        },
        features: ['Context sliding window', 'Temporal recency decay', 'Multi-tenant namespace isolation'],
        metrics: { load: 52, latency: '5.1ms' }
      }
    ]
  }
];

export const INITIAL_PIPELINES: DeploymentPipeline[] = [
  {
    id: 'pipe-v218-canary',
    commitHash: '8f92a4c',
    branch: 'release/v2.18-stable',
    author: 'systems-architect@kinetic.internal',
    message: 'perf: integrate zero-copy io_uring buffer & SIMD vector quantization',
    version: 'v2.18.0-rc4',
    status: 'canary',
    canaryPercent: 15,
    startedAt: '12 minutes ago',
    stages: [
      { name: 'Cargo Lint & Security Audit', status: 'completed', duration: '28s', details: 'Zero vulnerabilities, clippy strict passed' },
      { name: 'WASM & Native Binaries Matrix', status: 'completed', duration: '1m 14s', details: 'Compiled for x86_64, aarch64, wasm32-wasi' },
      { name: 'Distributed Chaos Simulation', status: 'completed', duration: '2m 05s', details: '10,000 fault injections, zero data drop' },
      { name: '15% Edge Canary Traffic (Tokyo & Frankfurt)', status: 'in_progress', duration: 'Ongoing', details: 'Error rate: 0.000%, P99: 14.1ms (-2.8ms)' },
      { name: 'Full Global Edge Propagation (100%)', status: 'pending', duration: 'Scheduled' }
    ]
  },
  {
    id: 'pipe-v217-prod',
    commitHash: '3e11b90',
    branch: 'main',
    author: 'runtime-lead@kinetic.internal',
    message: 'fix: optimize Redis connection pool recycling during spike load',
    version: 'v2.17.9',
    status: 'promoted',
    canaryPercent: 100,
    startedAt: '2 days ago',
    stages: [
      { name: 'Cargo Lint & Security Audit', status: 'completed', duration: '31s' },
      { name: 'WASM & Native Binaries Matrix', status: 'completed', duration: '1m 08s' },
      { name: 'Distributed Chaos Simulation', status: 'completed', duration: '1m 55s' },
      { name: 'Edge Canary Traffic', status: 'completed', duration: '15m 00s' },
      { name: 'Full Global Edge Propagation', status: 'completed', duration: '4m 12s' }
    ]
  }
];

export const INITIAL_CONFIG_CODE = `# Kinetic Terminal Runtime Specification
# Target: Global Distributed Mesh (v2.18.0)

system "kinetic_core" {
  cluster_name      = "kinetic-production-mesh"
  anycast_routing   = true
  zero_copy_stream  = true
  log_level         = "NOTICE"
  allocation_pool   = "jemalloc_v5"
}

ingress "envoy_l7" {
  protocol          = ["HTTP/3", "gRPC", "WebSocket"]
  tls_min_version   = "TLS1.3"
  bbr_congestion    = true
  max_connections   = 1200000
  rate_limit_rps    = 350000
  idle_timeout_ms   = 45000
}

engine "rust_worker" {
  thread_concurrency = 64
  io_uring_entries   = 4096
  simd_acceleration  = "AVX-512"
  memory_limit_gb    = 64
  gc_pause_target_us = 150
}

cache "vector_store" {
  engine             = "hnsw_quantized"
  memory_shards      = 128
  ttl_seconds        = 86400
  hit_target_ratio   = 0.99
  replication_factor = 3
}

telemetry "metrics_daemon" {
  sample_rate_p99    = 1.0
  export_interval_s  = 5
  trace_propagation  = "w3c_trace_context"
  distributed_tracing= true
}
`;
