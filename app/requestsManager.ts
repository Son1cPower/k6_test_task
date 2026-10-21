import { HubWebService } from './services/hubWebService.ts';
import { AuthService } from './services/authService.ts';
import { AccountsService } from './services/accountsService.ts';
import { ExecutionService } from './services/executionService.ts';
import { ExecutionStatusService } from './services/executionStatusService.ts';

class RequestManager {
  hubWebService: HubWebService = new HubWebService();
  authService: AuthService = new AuthService();
  accountsService: AccountsService = new AccountsService();
  executionService: ExecutionService = new ExecutionService();
  executionStatusService: ExecutionStatusService = new ExecutionStatusService();
}

export const requestsManager = new RequestManager();
