import { group } from 'k6';
import { requestsManager } from '../../requestsManager.ts';

export class ExecuteJob {
  execute<T extends object>(jobId: string, stepData: T = {} as T) {
    return group('Execute job', function () {
      const resp = requestsManager.executionService.executeJob(jobId);
      const isStarted = resp.status === 200;

      return { ...stepData, isStarted };
    });
  }
}
