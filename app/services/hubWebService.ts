import { BaseRequestsService } from './baseRequestsService.ts';
import { ExtendedParams } from '../../framework/utils/requestBuilder.ts';
import { HUB_URL } from '../../config/k6Config.ts';

export const HTML_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

export class HubWebService extends BaseRequestsService {
  constructor() {
    super(HUB_URL);
  }

  openHomePage(params?: ExtendedParams) {
    return this.get('/', {
      ...params,
      headers: { Accept: HTML_ACCEPT, ...params?.headers },
    });
  }
}
