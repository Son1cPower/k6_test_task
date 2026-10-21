import { SharedArray } from 'k6/data';
import exec from 'k6/execution';
import { DATA_DIR } from '../../config/k6Config.ts';

function loadJson(fileName: string) {
  return new SharedArray<any>(fileName, function () {
    const path = `../../${DATA_DIR}/${fileName}`;
    const raw = open(path);
    if (!raw) throw new Error(`File ${path} not found or empty`);
    return JSON.parse(raw);
  });
}

const users = loadJson('users.json');

export function getUserForVu() {
  return users[Math.max(exec.vu.idInTest - 1, 0) % users.length];
}
