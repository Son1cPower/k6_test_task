import { group, check } from 'k6';
import { requestsManager } from '../../requestsManager.ts';
import { workflowMetrics } from '../../metrics/workflowMetrics.ts';

const CREATED_JOB_STATES = ['LOADED', 'LOAD_REQUESTED', 'LOADING'];

export class CreateJob {
  execute<T extends object>(
    workflowUri: string,
    executionContextId: string,
    asyncLoading: boolean,
    stepData: T = {} as T,
  ) {
    return group('Create job', function () {
      const createdAt = Date.now();
      const resp = requestsManager.executionService.createJob(workflowUri, executionContextId, {
        queryParams: { asyncLoading },
      });
      const jobId = resp.status === 201 ? (resp.json('id') as string) : '';

      check(resp, {
        'CreateJob: job is created': r => r.status === 201 && CREATED_JOB_STATES.includes(r.json('jobState') as string),
      });
      if (!jobId) {
        const tags = { finalState: 'CREATE_FAILED' };
        workflowMetrics.failed.add(1, tags);
        workflowMetrics.successRate.add(false, tags);
        console.warn(`Job was not created: status=${resp.status} body=${String(resp.body).slice(0, 300)}`);
      }

      return { ...stepData, jobId, createdAt };
    });
  }
}
