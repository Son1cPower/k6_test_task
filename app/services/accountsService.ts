import { BaseRequestsService } from './baseRequestsService.ts';
import { ExtendedParams } from '../../framework/utils/requestBuilder.ts';
import { API_URL } from '../../config/k6Config.ts';

export class AccountsService extends BaseRequestsService {
  constructor() {
    super(API_URL);
  }

  getIdentity(params?: ExtendedParams) {
    return this.get('/accounts/identity', {
      ...params,
      headers: { Accept: 'application/json', ...params?.headers },
    });
  }
}
