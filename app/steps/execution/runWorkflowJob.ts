import { group, check, sleep } from 'k6';
import { requestsManager } from '../../requestsManager.ts';
import { workflowMetrics } from '../../metrics/workflowMetrics.ts';
import { toMillis } from '../../../framework/utils/dateUtils.ts';

const CREATED_JOB_STATES = ['LOADED', 'LOAD_REQUESTED', 'LOADING'];
const SUCCESS_STATES = ['EXECUTION_FINISHED'];
const FAILURE_STATES = [
  'EXECUTION_FAILED',
  'EXECUTION_FAILED_WITH_CONTENT',
  'EXECUTION_CANCELLED',
  'NOT_EXECUTABLE',
  'INTERACTION_REQUIRED',
];
const FAILED_JOB_STATES = ['LOAD_ERROR', 'VANISHED', 'DISCARDED'];

export class RunWorkflowJob {
  execute<T extends object>(
    workflowUri: string,
    executionContextId: string,
    asyncLoading: boolean,
    pollIntervalSec: number,
    timeoutSec: number,
    stepData: T = {} as T,
  ) {
    return group('Run workflow job', function () {
      /** ========== ACTION 1: Create Job ========== */
      const createdAt = Date.now();
      const createResp = requestsManager.executionService.createJob(workflowUri, executionContextId, {
        queryParams: { asyncLoading },
      });
      const jobId = createResp.status === 201 ? (createResp.json('id') as string) : '';

      check(createResp, {
        'RunWorkflowJob: job is created': r =>
          r.status === 201 && CREATED_JOB_STATES.includes(r.json('jobState') as string),
      });
      if (!jobId) {
        const tags = { finalState: 'CREATE_FAILED' };
        workflowMetrics.failed.add(1, tags);
        workflowMetrics.successRate.add(false, tags);
        console.warn(`Job was not created: status=${createResp.status} body=${String(createResp.body).slice(0, 300)}`);
        return { ...stepData, jobId, finalState: 'CREATE_FAILED', isSuccess: false };
      }

      /** ========== ACTION 2: Check Status ========== */
      const { finalState, isSuccess } = group('Wait for job completion', function () {
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
          'RunWorkflowJob: workflow finished successfully': () => isSuccess,
        });
        if (!isSuccess) {
          console.warn(
            `Job ${jobId} ended as ${finalState} (jobState=${job.jobState}) errors=${JSON.stringify(job.errors ?? [])}`,
          );
        }

        return { finalState, isSuccess };
      });

      return { ...stepData, jobId, finalState, isSuccess };
    });
  }
}
