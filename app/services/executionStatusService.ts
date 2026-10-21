import http from 'k6/http';
import { BaseRequestsService } from './baseRequestsService.ts';
import { ExtendedParams } from '../../framework/utils/requestBuilder.ts';
import { API_URL } from '../../config/k6Config.ts';

export class ExecutionStatusService extends BaseRequestsService {
  constructor() {
    super(API_URL);
  }

  getStatus(executionContextId: string, params?: ExtendedParams) {
    return this.get(`/execution-status/execution-contexts/${executionContextId}`, {
      requestName: 'GET /execution-status/execution-contexts/{id}',
      ...params,
      headers: { Accept: 'application/json', ...params?.headers },
    });
  }

  start(executionContextId: string, params?: ExtendedParams) {
    return this.put(`/execution-status/execution-contexts/${executionContextId}/start`, null, {
      requestName: 'PUT /execution-status/execution-contexts/{id}/start',
      responseCallback: http.expectedStatuses(200, 409),
      enabledStatusCheck: false,
      enabledBodyCheck: false,
      ...params,
    });
  }
}
