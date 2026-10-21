import { OpenLoginPage } from './steps/auth/openLoginPage.ts';
import { SubmitLogin } from './steps/auth/submitLogin.ts';
import { GetIdentity } from './steps/accounts/getIdentity.ts';
import { StartEnvironment } from './steps/environment/startEnvironment.ts';
import { CreateJob } from './steps/execution/createJob.ts';
import { ExecuteJob } from './steps/execution/executeJob.ts';
import { WaitForJobCompletion } from './steps/execution/waitForJobCompletion.ts';
import { DeleteTestJobs } from './steps/execution/deleteTestJobs.ts';

class StepsManager {
  openLoginPage: OpenLoginPage = new OpenLoginPage();
  submitLogin: SubmitLogin = new SubmitLogin();
  getIdentity: GetIdentity = new GetIdentity();
  startEnvironment: StartEnvironment = new StartEnvironment();
  createJob: CreateJob = new CreateJob();
  executeJob: ExecuteJob = new ExecuteJob();
  waitForJobCompletion: WaitForJobCompletion = new WaitForJobCompletion();
  deleteTestJobs: DeleteTestJobs = new DeleteTestJobs();
}

export const stepsManager = new StepsManager();
