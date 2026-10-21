import { group, check } from 'k6';
import { requestsManager } from '../../requestsManager.ts';
import { toMillis } from '../../../framework/utils/dateUtils.ts';

const DELETE_BATCH_SIZE = 100;

export class DeleteTestJobs {
  execute<T extends object>(workflowId: string, createdAfter: number, stepData: T = {} as T) {
    return group('Delete test jobs', function () {
      const jobIds: string[] = [];
      let cursor = '';
      let isListed = true;
      let isDeleted = true;

      do {
        const resp = requestsManager.executionService.getJobs({
          queryParams: cursor ? { pagelen: 100, cursor } : { q: `workflowId=${workflowId}`, pagelen: 100 },
        });
        if (resp.status !== 200) {
          isListed = false;
          break;
        }
        const body: any = resp.json();
        body.jobs
          .filter((job: any) => toMillis(job.createdAt) >= createdAfter)
          .forEach((job: any) => jobIds.push(job.id));
        cursor = body.pagination?.nextPageCursor ?? '';
      } while (cursor);

      for (let i = 0; i < jobIds.length; i += DELETE_BATCH_SIZE) {
        const resp = requestsManager.executionService.deleteJobs(jobIds.slice(i, i + DELETE_BATCH_SIZE));
        if (resp.status !== 204) isDeleted = false;
      }

      check(jobIds, {
        'DeleteTestJobs: all test jobs deleted': () => isListed && isDeleted,
      });

      return { ...stepData, deletedJobIds: jobIds };
    });
  }
}
