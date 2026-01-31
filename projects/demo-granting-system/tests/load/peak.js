// k6 Load Test - Peak Traffic Simulation
// Simulate end-of-month peak traffic (from idea.txt scenario)

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Custom metrics
const proposalCreated = new Counter('proposals_created');
const loginDuration = new Trend('login_duration');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 200 },  // Spike to 200 users (3x traffic)
    { duration: '2m', target: 200 },  // Stay at 200 users
    { duration: '1m', target: 50 },   // Ramp down to 50
    { duration: '1m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% requests < 5s during peak
    http_req_failed: ['rate<0.05'],    // Error rate < 5%
    login_duration: ['p(95)<3000'],    // Login < 3s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const USERS = [
  { email: 'partner@demo.com', password: 'partner123' },
  { email: 'academic@demo.com', password: 'academic123' },
  { email: 'approver@demo.com', password: 'approver123' },
];

export default function () {
  const user = USERS[Math.floor(Math.random() * USERS.length)];

  group('Authentication', () => {
    const start = Date.now();
    const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    loginDuration.add(Date.now() - start);

    check(res, {
      'login successful': (r) => r.status === 200,
    });

    if (res.status !== 200) return;

    const token = res.json('token');
    const authHeaders = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    group('Dashboard', () => {
      const dashRes = http.get(`${BASE_URL}/api/dashboard`, authHeaders);
      check(dashRes, {
        'dashboard loaded': (r) => r.status === 200,
      });
    });

    group('Proposals', () => {
      // List proposals
      let res = http.get(`${BASE_URL}/api/proposals`, authHeaders);
      check(res, {
        'proposals list loaded': (r) => r.status === 200,
      });

      // Create proposal (10% of requests)
      if (Math.random() < 0.1 && user.email === 'partner@demo.com') {
        res = http.post(`${BASE_URL}/api/proposals`, JSON.stringify({
          projectName: `โครงการทดสอบ Load Test ${Date.now()}`,
          description: 'โครงการทดสอบภาระงานระบบ'.repeat(5),
          budget: Math.floor(Math.random() * 1000000) + 100000,
          duration: Math.floor(Math.random() * 12) + 1,
          objectives: ['ทดสอบระบบ', 'วัดประสิทธิภาพ'],
          targetGroup: 'ทีมพัฒนา',
        }), authHeaders);

        if (res.status === 201) {
          proposalCreated.add(1);
        }
      }
    });

    group('Reports', () => {
      const res = http.get(`${BASE_URL}/api/reports`, authHeaders);
      check(res, {
        'reports loaded': (r) => r.status === 200,
      });
    });
  });

  sleep(Math.random() * 2 + 1); // Random 1-3 second think time
}
