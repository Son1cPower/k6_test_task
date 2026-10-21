import { BaseRequestsService } from './baseRequestsService.ts';
import { ExtendedParams } from '../../framework/utils/requestBuilder.ts';
import { HUB_URL } from '../../config/k6Config.ts';
import { HTML_ACCEPT } from './hubWebService.ts';

export class AuthService extends BaseRequestsService {
  constructor() {
    super(HUB_URL);
  }

  submitLoginForm(actionUrl: string, username: string, password: string, params?: ExtendedParams) {
    return this.post(
      actionUrl,
      { username, password, credentialId: '' },
      {
        ...params,
        headers: { Accept: HTML_ACCEPT, ...params?.headers },
      },
    );
  }
}
