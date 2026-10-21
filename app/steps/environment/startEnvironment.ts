import { group, check, sleep } from 'k6';
import { requestsManager } from '../../requestsManager.ts';
import { workflowMetrics } from '../../metrics/workflowMetrics.ts';

const READY_STATES = ['Running', 'At full capacity'];

export class StartEnvironment {
  execute<T extends object>(
    executionContextId: string,
    pollIntervalSec: number,
    timeoutSec: number,
    stepData: T = {} as T,
  ) {
    return group('Start environment', function () {
      const startedAt = Date.now();
      const deadline = startedAt + timeoutSec * 1000;
      const contextResp = requestsManager.executionService.getExecutionContext(executionContextId);
      const minExecutors =
        contextResp.status === 200 ? ((contextResp.json('operationInfo.minExecutors') as number) ?? 1) : 1;
      const startResp = requestsManager.executionStatusService.start(executionContextId);
      let environment: any = {};
      let isEnvironmentReady = false;

      while (!isEnvironmentReady && Date.now() < deadline) {
        const resp = requestsManager.executionStatusService.getStatus(executionContextId, {
          enabledStatusCheck: false,
          enabledBodyCheck: false,
        });
        if (resp.status === 200) {
          environment = resp.json();
          const executors: any[] = environment.executors ?? [];
          isEnvironmentReady =
            READY_STATES.includes(environment.status) &&
            executors.filter(executor => READY_STATES.includes(executor.status)).length >= minExecutors;
        }
        if (!isEnvironmentReady) sleep(pollIntervalSec);
      }

      workflowMetrics.environmentStartupDuration.add(Date.now() - startedAt);

      check(startResp, {
        'StartEnvironment: start accepted or already running': r => r.status === 200 || r.status === 409,
      });
      check(environment, {
        'StartEnvironment: environment and executors are running': () => isEnvironmentReady,
      });

      return { ...stepData, isEnvironmentReady, environmentStatus: environment.status };
    });
  }
}
