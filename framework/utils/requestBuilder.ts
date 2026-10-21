import { Params, RefinedResponse } from 'k6/http';
import { check } from 'k6';
import { ENV_NAME, LOAD_NAME } from '../../config/k6Config.ts';

export interface ExtendedParams extends Params {
  requestName?: string;
  enabledStatusCheck?: boolean;
  enabledBodyCheck?: boolean;
  queryParams?: Record<string, string | number | boolean>;
}

const defaultRequestTags: Record<string, string> = { env: ENV_NAME, load: LOAD_NAME };

export function validateStatus(resp: RefinedResponse<'text' | 'binary' | 'none'>, params?: ExtendedParams): void {
  if (params?.enabledStatusCheck === false) return;
  const name = params?.tags?.name ?? params?.requestName;
  check(resp, {
    [`${name}: status is 200 - 399`]: r => r.status >= 200 && r.status < 400,
  });
}

export function validateResponseBody(resp: RefinedResponse<'text' | 'binary' | 'none'>, params?: ExtendedParams): void {
  if (params?.enabledBodyCheck === false) return;
  const name = params?.tags?.name ?? params?.requestName;
  check(resp, {
    [`${name}: body is not empty`]: r => !!r.body && typeof r.body === 'string',
  });
}

export function processResponse(resp: RefinedResponse<'text' | 'binary' | 'none'>, params?: ExtendedParams): void {
  validateStatus(resp, params);
  validateResponseBody(resp, params);
}

function toRequestPath(path: string): string {
  return path.replace(/^https?:\/\/[^/]+/, '').split('?')[0] || '/';
}

export function mergeParams(...layers: (ExtendedParams | undefined)[]): ExtendedParams {
  return layers.reduce<ExtendedParams>(
    (merged, layer) => ({
      ...merged,
      ...layer,
      headers: { ...merged.headers, ...layer?.headers },
      tags: { ...merged.tags, ...layer?.tags },
      queryParams: { ...merged.queryParams, ...layer?.queryParams },
    }),
    {},
  );
}

export function resolveRequestParams(params: ExtendedParams, method: string, path: string): ExtendedParams {
  const resolvedName = params.requestName ?? params.tags?.name ?? `${method} ${toRequestPath(path)}`;
  const { requestName, queryParams, ...rest } = params;
  return {
    ...rest,
    tags: { ...defaultRequestTags, ...rest.tags, name: resolvedName },
  };
}

export function buildUrl(
  baseUrl: string,
  path: string,
  queryParams?: Record<string, string | number | boolean>,
): string {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  if (!queryParams || Object.keys(queryParams).length === 0) return url;
  const query = Object.entries(queryParams)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `${url}${url.includes('?') ? '&' : '?'}${query}`;
}
