import { stepsManager } from '../../app/stepsManager.ts';
import { getUserForVu } from '../../framework/utils/dataLoader.ts';
import { CURRENT_SCENARIO, THRESHOLD, ENV_NAME, LOAD_NAME } from '../../config/k6Config.ts';
import { buildSummary } from '../../framework/k6Summary.ts';

const testNameTag = `Login-${ENV_NAME}-${LOAD_NAME}`;

export const options = {
  scenarios: { login: CURRENT_SCENARIO },
  thresholds: THRESHOLD,
  tags: { testName: testNameTag },
};

export const handleSummary = buildSummary(testNameTag);

export default function () {
  const user = getUserForVu();
  const loginPageData = stepsManager.openLoginPage.execute();
  const loggedInData = stepsManager.submitLogin.execute(
    loginPageData.loginActionUrl,
    user.username,
    user.password,
    loginPageData,
  );
  const getIdentityData = stepsManager.getIdentity.execute(user.username, loggedInData);
  return getIdentityData;
}
