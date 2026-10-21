export const loadConfigs = {
  smoke: {
    executor: { executor: 'per-vu-iterations', vus: 1, iterations: 1 },
  },

  testload: {
    executor: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 3 },
        { duration: '20s', target: 3 },
        { duration: '10s', target: 0 },
      ],
    },
  },

  burst: {
    executor: { executor: 'per-vu-iterations', vus: 100, iterations: 1, maxDuration: '20m' },
  },

  burstRamp: {
    executor: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '2m',
    },
  },

  burstRate: {
    executor: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 500,
      stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 0 },
      ],
    },
  },

  load: {
    executor: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },

  stress: {
    executor: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 25 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '3m', target: 100 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },

  soak: {
    executor: { executor: 'constant-vus', vus: 5, duration: '1h' },
  },
};
