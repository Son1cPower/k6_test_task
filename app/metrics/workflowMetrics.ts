import { Counter, Rate, Trend } from 'k6/metrics';

export const workflowMetrics = {
  completed: new Counter('workflow_completed'),
  failed: new Counter('workflow_failed'),
  successRate: new Rate('workflow_success_rate'),
  e2eDuration: new Trend('workflow_e2e_duration', true),
  executionDuration: new Trend('workflow_execution_duration', true),
  environmentStartupDuration: new Trend('environment_startup_duration', true),
};
