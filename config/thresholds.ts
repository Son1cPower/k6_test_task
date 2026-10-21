export const thresholdsConfig = {
  smoke: {
    http_req_failed: ['rate==0'],
    checks: ['rate==1'],
  },
  common: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
  burst: {
    workflow_success_rate: ['rate>0.95'],
    workflow_execution_duration: ['p(95)<10000'],
    'http_req_duration{name:POST /execution/jobs}': ['p(95)<40000'],
    'http_req_duration{name:GET /execution/jobs/{id}}': ['p(95)<5000'],
    http_req_failed: ['rate<0.05'],
  },
};
