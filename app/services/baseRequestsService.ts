import http, { RequestBody } from 'k6/http';
import {
  processResponse,
  buildUrl,
  resolveRequestParams,
  mergeParams,
  ExtendedParams,
} from '../../framework/utils/requestBuilder.ts';
import { currentEnv } from '../../config/k6Config.ts';

export class BaseRequestsService {
  constructor(protected readonly baseUrl: string) {}

  private request(method: string, path: string, body: RequestBody | null, params?: ExtendedParams) {
    const mergedParams = mergeParams(currentEnv.defaultParams, params);
    const finalParams = resolveRequestParams(mergedParams, method, path);
    const resp = http.request(method, buildUrl(this.baseUrl, path, mergedParams.queryParams), body, finalParams);
    processResponse(resp, finalParams);
    return resp;
  }

  protected get(path: string, params?: ExtendedParams) {
    return this.request('GET', path, null, params);
  }

  protected post(path: string, body: RequestBody | null, params?: ExtendedParams) {
    return this.request('POST', path, body, params);
  }

  protected put(path: string, body: RequestBody | null, params?: ExtendedParams) {
    return this.request('PUT', path, body, params);
  }

  protected delete(path: string, body: RequestBody | null, params?: ExtendedParams) {
    return this.request('DELETE', path, body, params);
  }
}
