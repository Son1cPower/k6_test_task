import http from 'k6/http';
import { stepsManager } from '../../app/stepsManager.ts';
import {
  CURRENT_SCENARIO,
  THRESHOLD,
  ENV_NAME,
  LOAD_NAME,
  API_URL,
  WORKFLOW,
  ASYNC_LOADING,
} from '../../config/k6Config.ts';
import { buildSummary } from '../../framework/k6Summary.ts';
import { default as loginScenario } from './loginScenario.ts';

const testNameTag = `WorkflowExecution-${ENV_NAME}-${LOAD_NAME}${ASYNC_LOADING ? '-asyncLoading' : ''}`;

export const options = {
  scenarios: { workflowExecution: CURRENT_SCENARIO },
  thresholds: THRESHOLD,
  tags: { testName: testNameTag },
  setupTimeout: '10m',
  teardownTimeout: '10m',
};

export const handleSummary = buildSummary(testNameTag);

type SetupData = { sessionCookie: string; testStartedAt: number };

export function setup() {
  const testStartedAt = Date.now();
  const { sessionCookie } = loginScenario();
  if (!sessionCookie) throw new Error('Login failed: Auth cookie is not set');

  const { isEnvironmentReady, environmentStatus } = stepsManager.startEnvironment.execute(
    WORKFLOW.executionContextId,
    WORKFLOW.pollIntervalSec,
    WORKFLOW.timeoutSec,
  );
  if (!isEnvironmentReady) throw new Error(`Environment is not ready: ${environmentStatus}`);

  return { sessionCookie, testStartedAt };
}

export default function (data: SetupData) {
  http.cookieJar().set(API_URL, 'knime_hub_auth', data.sessionCookie);

  const createdJobData = stepsManager.createJob.execute(WORKFLOW.id, WORKFLOW.executionContextId, ASYNC_LOADING);
  if (!createdJobData.jobId) return;

  const waitForJobCompletionData = stepsManager.waitForJobCompletion.execute(
    createdJobData.jobId,
    createdJobData.createdAt,
    WORKFLOW.pollIntervalSec,
    WORKFLOW.timeoutSec,
    createdJobData,
  );
}

export function teardown(data: SetupData) {
  http.cookieJar().set(API_URL, 'knime_hub_auth', data.sessionCookie);
  const deleteTestJobsData = stepsManager.deleteTestJobs.execute(WORKFLOW.id, data.testStartedAt);
}
