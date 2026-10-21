import { group, check } from 'k6';
import http from 'k6/http';
import { requestsManager } from '../../requestsManager.ts';
import { HUB_URL } from '../../../config/k6Config.ts';

export class SubmitLogin {
  execute<T extends object>(loginActionUrl: string, username: string, password: string, stepData: T = {} as T) {
    return group('Submit login', function () {
      const resp = requestsManager.authService.submitLoginForm(loginActionUrl, username, password);
      const sessionCookie = http.cookieJar().cookiesForURL(HUB_URL).knime_hub_auth;

      const isLoggedIn = check(resp, {
        'SubmitLogin: landed on Hub home page': r => r.url.startsWith(HUB_URL),
        'SubmitLogin: knime_hub_auth cookie is set': () => !!sessionCookie && sessionCookie.length > 0,
      });

      return { ...stepData, sessionCookie };
    });
  }
}
