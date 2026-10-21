import { group, check } from 'k6';
import { requestsManager } from '../../requestsManager.ts';

export class GetIdentity {
  execute<T extends object>(username: string, stepData: T = {} as T) {
    return group('Get identity', function () {
      const resp = requestsManager.accountsService.getIdentity();
      const accountId = resp.json('id') as string;
      const accountName = resp.json('name') as string;

      check(resp, {
        'GetIdentity: session belongs to the logged in user': () => accountName === username,
      });

      return { ...stepData, accountId, accountName };
    });
  }
}
