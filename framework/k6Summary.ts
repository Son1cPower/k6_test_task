//@ts-ignore
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export function buildSummary(testName: string) {
  return function handleSummary(data: any) {
    const allChecks: any[] = [];

    function collectChecks(group: any) {
      if (group.checks) group.checks.forEach((check: any) => allChecks.push(check));
      if (group.groups) Object.values(group.groups).forEach((subGroup: any) => collectChecks(subGroup));
    }

    if (data.root_group) collectChecks(data.root_group);

    let output = '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    output += '  CHECK DETAILS\n';
    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

    const checks = data.metrics.checks;
    if (checks && checks.values) {
      const passes = checks.values.passes || 0;
      const fails = checks.values.fails || 0;
      const total = passes + fails;
      const rate = total > 0 ? ((passes / total) * 100).toFixed(2) : '0.00';

      output += `  Total Checks: ${total}\n`;
      output += `  ✓ Passed: ${passes} (${rate}%)\n`;
      output += `  ✗ Failed: ${fails} (${(100 - parseFloat(rate)).toFixed(2)}%)\n\n`;
    }

    allChecks.forEach((check: any) => {
      const passed = check.passes || 0;
      const failed = check.fails || 0;
      const total = passed + failed;
      const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
      const status = failed === 0 ? '✓' : '✗';
      const padding = '.'.repeat(Math.max(2, 70 - check.name.length));
      output += `  ${status} ${check.name} ${padding} ${passed}/${total} (${rate}%)\n`;
    });

    output += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return {
      stdout: textSummary(data, { indent: ' ', enableColors: true }) + output,
      [`results/${testName}-${timestamp}.json`]: JSON.stringify(data, null, 2),
    };
  };
}
