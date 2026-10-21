import { group, check } from 'k6';
import { requestsManager } from '../../requestsManager.ts';

export class OpenLoginPage {
  execute<T extends object>(stepData: T = {} as T) {
    return group('Open login page', function () {
      const resp = requestsManager.hubWebService.openHomePage();
      const loginActionUrl = resp.html().find('#kc-form-login').attr('action') ?? '';

      check(resp, {
        'OpenLoginPage: redirected to Keycloak login': r => r.url.includes('/protocol/openid-connect/auth'),
        'OpenLoginPage: login form action found': () => loginActionUrl.length > 0,
      });

      return { ...stepData, loginActionUrl };
    });
  }
}
