// k6 Load Test - Smoke Test
// Verify system works under minimal load

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% requests < 2s
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Health check
  let res = http.get(`${BASE_URL}/health`);
  check(res, {
    'health status is 200': (r) => r.status === 200,
    'health response is healthy': (r) => r.json('status') === 'healthy',
  });

  // Login
  res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'partner@demo.com',
    password: 'partner123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': (r) => r.json('token') !== undefined,
  });

  const token = res.json('token');
  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  // Get proposals
  res = http.get(`${BASE_URL}/api/proposals`, authHeaders);
  check(res, {
    'proposals status is 200': (r) => r.status === 200,
  });

  // Get dashboard
  res = http.get(`${BASE_URL}/api/dashboard`, authHeaders);
  check(res, {
    'dashboard status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
