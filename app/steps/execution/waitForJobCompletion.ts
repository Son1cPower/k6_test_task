import { group, check, sleep } from 'k6';
import { requestsManager } from '../../requestsManager.ts';
import { workflowMetrics } from '../../metrics/workflowMetrics.ts';
import { toMillis } from '../../../framework/utils/dateUtils.ts';

const SUCCESS_STATES = ['EXECUTION_FINISHED'];
const FAILURE_STATES = [
  'EXECUTION_FAILED',
  'EXECUTION_FAILED_WITH_CONTENT',
  'EXECUTION_CANCELLED',
  'NOT_EXECUTABLE',
  'INTERACTION_REQUIRED',
];
const FAILED_JOB_STATES = ['LOAD_ERROR', 'VANISHED', 'DISCARDED'];

export class WaitForJobCompletion {
  execute<T extends object>(
    jobId: string,
    createdAt: number,
    pollIntervalSec: number,
    timeoutSec: number,
    stepData: T = {} as T,
  ) {
    return group('Wait for job completion', function () {
      const deadline = Date.now() + timeoutSec * 1000;
      let job: any = {};
      let isTerminal = false;

      while (!isTerminal && Date.now() < deadline) {
        sleep(pollIntervalSec);
        const resp = requestsManager.executionService.getJob(jobId, {
          enabledStatusCheck: false,
          enabledBodyCheck: false,
        });
        if (resp.status !== 200) continue;
        job = resp.json();
        isTerminal =
          SUCCESS_STATES.includes(job.workflowState) ||
          FAILURE_STATES.includes(job.workflowState) ||
          FAILED_JOB_STATES.includes(job.jobState);
      }

      const isSuccess = SUCCESS_STATES.includes(job.workflowState) && !FAILED_JOB_STATES.includes(job.jobState);
      const finalState: string = isTerminal ? job.workflowState : 'TIMEOUT';
      const tags = { finalState };

      workflowMetrics.e2eDuration.add(Date.now() - createdAt, tags);
      if (job.startedExecutionAt && job.finishedExecutionAt) {
        workflowMetrics.executionDuration.add(
          toMillis(job.finishedExecutionAt) - toMillis(job.startedExecutionAt),
          tags,
        );
      }
      workflowMetrics.successRate.add(isSuccess, tags);
      (isSuccess ? workflowMetrics.completed : workflowMetrics.failed).add(1, tags);

      check(job, {
        'WaitForJobCompletion: workflow finished successfully': () => isSuccess,
      });
      if (!isSuccess) {
        console.warn(
          `Job ${jobId} ended as ${finalState} (jobState=${job.jobState}) errors=${JSON.stringify(job.errors ?? [])}`,
        );
      }

      return { ...stepData, finalState, isSuccess };
    });
  }
}
