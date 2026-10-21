import { BaseRequestsService } from './baseRequestsService.ts';
import { ExtendedParams } from '../../framework/utils/requestBuilder.ts';
import { API_URL } from '../../config/k6Config.ts';

const JSON_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };

export class ExecutionService extends BaseRequestsService {
  constructor() {
    super(API_URL);
  }

  createJob(workflowUri: string, executionContextId: string, params?: ExtendedParams) {
    return this.post('/execution/jobs', JSON.stringify({ executionContext: executionContextId }), {
      timeout: '6m',
      ...params,
      queryParams: { workflowUri, itemVersion: 'current-state', wizardExecution: true, ...params?.queryParams },
      headers: { ...JSON_HEADERS, ...params?.headers },
    });
  }

  executeJob(jobId: string, params?: ExtendedParams) {
    return this.post(`/execution/jobs/${jobId}`, null, {
      requestName: 'POST /execution/jobs/{id}',
      ...params,
      queryParams: { async: true, ...params?.queryParams },
      headers: { ...JSON_HEADERS, ...params?.headers },
    });
  }

  getJob(jobId: string, params?: ExtendedParams) {
    return this.get(`/execution/jobs/${jobId}`, {
      requestName: 'GET /execution/jobs/{id}',
      ...params,
      headers: { Accept: 'application/json', ...params?.headers },
    });
  }

  getExecutionContext(executionContextId: string, params?: ExtendedParams) {
    return this.get(`/execution/execution-contexts/${executionContextId}`, {
      requestName: 'GET /execution/execution-contexts/{id}',
      ...params,
      headers: { Accept: 'application/json', ...params?.headers },
    });
  }

  getJobs(params?: ExtendedParams) {
    return this.get('/execution/jobs', {
      ...params,
      headers: { Accept: 'application/json', ...params?.headers },
    });
  }

  deleteJobs(jobIds: string[], params?: ExtendedParams) {
    return this.delete('/execution/jobs', JSON.stringify(jobIds), {
      enabledBodyCheck: false,
      ...params,
      headers: { ...JSON_HEADERS, ...params?.headers },
    });
  }
}
