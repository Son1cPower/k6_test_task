import { OpenLoginPage } from './steps/auth/openLoginPage.ts';
import { SubmitLogin } from './steps/auth/submitLogin.ts';
import { GetIdentity } from './steps/accounts/getIdentity.ts';
import { StartEnvironment } from './steps/environment/startEnvironment.ts';
import { RunWorkflowJob } from './steps/execution/runWorkflowJob.ts';
import { DeleteTestJobs } from './steps/execution/deleteTestJobs.ts';

class StepsManager {
  openLoginPage: OpenLoginPage = new OpenLoginPage();
  submitLogin: SubmitLogin = new SubmitLogin();
  getIdentity: GetIdentity = new GetIdentity();
  startEnvironment: StartEnvironment = new StartEnvironment();
  runWorkflowJob: RunWorkflowJob = new RunWorkflowJob();
  deleteTestJobs: DeleteTestJobs = new DeleteTestJobs();
}

export const stepsManager = new StepsManager();
