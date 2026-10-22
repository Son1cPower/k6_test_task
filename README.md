# Performance Tests

## Overview

k6 + TypeScript performance tests.

---

## Installation

1. **Clone the repository and create local config and credentials (git-ignored):**

```bash
cp config/envConfigs.example.ts -> config/envConfigs.ts
cp testData/exercise/users.example.json -> testData/exercise/users.json
```

2. **Install Docker:**

Option A – Docker Desktop (Windows / macOS):

- Install from https://www.docker.com/products/docker-desktop/ and start it

Option B – Colima (macOS, without Docker Desktop):

```bash
brew install colima docker docker-compose
colima start
```

3. **Start InfluxDB + Grafana + k6:**

```bash
docker compose up -d
```

- Grafana: http://localhost:3000 → Dashboards → K6

4. **Install k6 locally (optional, if needed local development):**

Make sure you have the following installed before starting:

- macOS: `brew install node` and `brew install k6`
- Windows: `winget install OpenJS.NodeJS.LTS` and `winget install GrafanaLabs.k6 --version 1.8.2`

You can verify installations with:

```bash
node -v
npm -v
k6 version
docker --version
docker compose version
```

**Run npm install:**

```bash
npm ci
```

---

## Running Tests

### Docker (results go to Grafana)

**Smoke:**

```bash
docker exec -it k6 k6 run tests/scenarios/workflowExecutionScenario.ts
```

**Task 1 – 100 concurrent workflow executions:**

```bash
docker exec -it k6 k6 run -e LOAD=burst -e THRESHOLD=burst tests/scenarios/workflowExecutionScenario.ts
```

**Same with async job loading:**

```bash
docker exec -it k6 k6 run -e LOAD=burst -e THRESHOLD=burst -e ASYNC_LOADING=true tests/scenarios/workflowExecutionScenario.ts
```

### Local

```bash
k6 run tests/scenarios/workflowExecutionScenario.ts
```

### Cloud Execution

Run tests in **Grafana Cloud k6**:

1. Create a free account at https://grafana.com/auth/sign-up and create a stack.
2. Open **Testing & synthetics → Performance** in your stack to activate k6.
3. Get token from https://{GRAFANA_ACCOUNT_NAME}.grafana.net/a/k6-app/settings/api-token

```bash
k6 cloud login --token <YOUR_GRAFANA_API_KEY> --stack <GRAFANA_ACCOUNT_NAME>
k6 cloud run -e LOAD=burst -e THRESHOLD=burst tests/scenarios/workflowExecutionScenario.ts
```

## Debug Mode

```bash
k6 run --http-debug=full tests/scenarios/workflowExecutionScenario.ts
```

---

## Environment Variables

| Variable        | Description                                                                          | Default    |
| --------------- | ------------------------------------------------------------------------------------ | ---------- |
| `ENV`           | Environment from `config/envConfigs.ts`                                              | `exercise` |
| `LOAD`          | Load model (smoke / testload / burst / burstRamp / burstRate / load / stress / soak) | `smoke`    |
| `THRESHOLD`     | Pass/fail criteria (smoke / burst / common)                                          | `smoke`    |
| `ASYNC_LOADING` | Create jobs with `asyncLoading=true`                                                 | `false`    |

---

## AI Assistance

[Claude Code] (Anthropic) was used as an assistant:

- Code review
- Complex functions
- Consultations
