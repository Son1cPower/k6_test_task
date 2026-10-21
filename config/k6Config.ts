import { envConfigs } from './envConfigs.ts';
import { loadConfigs } from './loadConfigs.ts';
import { thresholdsConfig } from './thresholds.ts';

function resolveConfig<T>(configs: Record<string, T>, name: string, type: string): T {
  const config = configs[name];
  if (!config) throw new Error(`Unknown ${type}: "${name}". Valid: ${Object.keys(configs).join(', ')}`);
  return config;
}

export const ENV_NAME: string = __ENV.ENV ?? 'exercise';
export const LOAD_NAME: string = __ENV.LOAD ?? 'smoke';
export const THRESHOLD_NAME: string = __ENV.THRESHOLD ?? 'smoke';
export const ASYNC_LOADING: boolean = __ENV.ASYNC_LOADING === 'true';

export const currentEnv = resolveConfig(envConfigs, ENV_NAME, 'ENV');
export const currentLoad = resolveConfig(loadConfigs, LOAD_NAME, 'LOAD');

export const HUB_URL = currentEnv.hubUrl;
export const API_URL = currentEnv.apiUrl;
export const DATA_DIR = currentEnv.dataDir;
export const WORKFLOW = currentEnv.workflow;

export const CURRENT_SCENARIO = currentLoad.executor;
export const THRESHOLD = resolveConfig(thresholdsConfig, THRESHOLD_NAME, 'THRESHOLD');
