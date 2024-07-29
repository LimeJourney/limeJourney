export class Metrics {
  increment(metric: string, tags: Record<string, string | number> = {}) {
    // In a real application, this would send metrics to a service like StatsD or Prometheus
    console.log(`Incrementing metric: ${metric}`, tags);
  }
}
