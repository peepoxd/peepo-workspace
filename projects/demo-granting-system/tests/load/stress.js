// k6 Load Test - Stress Test
// Find breaking point and verify graceful degradation

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100
    { duration: '5m', target: 100 },  // Stay at 100
    { duration: '2m', target: 200 },  // Ramp up to 200
    { duration: '5m', target: 200 },  // Stay at 200
    { duration: '2m', target: 300 },  // Ramp up to 300
    { duration: '5m', target: 300 },  // Stay at 300
    { duration: '2m', target: 400 },  // Ramp up to 400
    { duration: '5m', target: 400 },  // Stay at 400
    { duration: '5m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<10000'], // 99% requests < 10s (even under stress)
    http_req_failed: ['rate<0.10'],     // Error rate < 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Health check (should always work - graceful degradation)
  let res = http.get(`${BASE_URL}/health`);
  check(res, {
    'health check works': (r) => r.status === 200,
  });

  // Login
  res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'partner@demo.com',
    password: 'partner123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 200) {
    const token = res.json('token');
    const authHeaders = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    // Dashboard (cached - should be fast)
    res = http.get(`${BASE_URL}/api/dashboard`, authHeaders);
    check(res, {
      'dashboard responds': (r) => r.status === 200 || r.status === 503,
    });

    // Proposals
    res = http.get(`${BASE_URL}/api/proposals`, authHeaders);
    check(res, {
      'proposals responds': (r) => r.status === 200 || r.status === 503,
    });
  } else {
    // Check for graceful degradation (429 or 503)
    check(res, {
      'graceful degradation': (r) => r.status === 429 || r.status === 503 || r.status === 200,
    });
  }

  sleep(0.5);
}
