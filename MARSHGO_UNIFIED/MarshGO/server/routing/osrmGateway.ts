export interface RoutingMetrics {
  requests: number;
  failures: number;
  avgMs: number;
}

export const routingMetricsPrometheus = (): string => {
  return `# HELP marshgo_routing_requests_total Total routing requests\n# TYPE marshgo_routing_requests_total counter\nmarshgo_routing_requests_total ${routingMetricsPrometheusState.requests}\n`;
};

const routingMetricsPrometheusState = { requests: 0, failures: 0, avgMs: 0 };
