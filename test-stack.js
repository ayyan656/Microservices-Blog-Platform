/**
 * Full-stack API Debugging Script for Blog Microservices
 * Usage: node test-stack.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost'; // NGINX / API Gateway
const API_GATEWAY_PORT = 80; // NGINX port
const API_BASE = `${BASE_URL}:${API_GATEWAY_PORT}/api`;

const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
};

async function run() {
    console.log('==== STARTING FULL STACK TEST ====\n');

    // 1. Test Backend Health Endpoints
    console.log('1️⃣ Checking Backend Health...');
    try {
        const postHealth = await axios.get(`${API_BASE}/posts/health`);
        console.log('Post Service:', postHealth.data);
    } catch (err) {
        console.error('Post Service ERROR:', err.response?.data || err.message);
    }

    try {
        const authHealth = await axios.get(`${API_BASE}/auth/health`);
        console.log('Auth Service:', authHealth.data);
    } catch (err) {
        console.error('Auth Service ERROR:', err.response?.data || err.message);
    }

    try {
        const commentHealth = await axios.get(`${API_BASE}/comments/health`);
        console.log('Comment Service:', commentHealth.data);
    } catch (err) {
        console.error('Comment Service ERROR:', err.response?.data || err.message);
    }

    console.log('\n2️⃣ Testing Login / Signup...');
    let token = null;

    // Try Signup First
    const randomSuffix = Math.floor(Math.random() * 10000);
    const testUser = {
        name: 'Test Administrator',
        email: `admin${randomSuffix}@example.com`,
        password: 'SecurePassword123!'
    };

    try {
        console.log(`Attemping signup for ${testUser.email}...`);
        const signupResp = await axios.post(`${API_BASE}/auth/signup`, testUser);
        console.log('Signup SUCCESS:', signupResp.data);
        token = signupResp.data.token;
    } catch (err) {
        console.warn('Signup FAILED (might already exist):', err.response?.data || err.message);
        // Fallback to login if signup failed (e.g. duplicate email) - though we use random email now
    }

    if (!token) {
        try {
            const loginResp = await axios.post(`${API_BASE}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            console.log('Login SUCCESS:', loginResp.data);
            token = loginResp.data.token;
        } catch (err) {
            console.error('Login FAILED:', err.response?.data || err.message);
        }
    }

    console.log('\n3️⃣ Testing Post Creation...');
    if (!token) {
        console.error('❌ Cannot test post creation without valid admin token.');
    } else {
        try {
            const postResp = await axios.post(
                `${API_BASE}/posts`,
                { title: `Test Post ${randomSuffix}`, content: 'This is a debug test post.' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Post Creation SUCCESS:', postResp.data);

            // 3b. Test Get All Posts (Homepage Load)
            console.log('\n3b. Testing Get All Posts (Homepage)...');
            const allPostsResp = await axios.get(`${API_BASE}/posts`);
            console.log('Get All Posts SUCCESS:', allPostsResp.data.posts.length, 'posts found.');
        } catch (err) {
            console.error('Post Operation FAILED:', err.response?.data || err.message);
            if (err.response?.status === 500) {
                console.error('⚠️ 500 Internal Server Error detected.');
            }
        }
    }

    console.log('\n4️⃣ Testing Unauthorized Post Creation...');
    try {
        await axios.post(`${API_BASE}/posts`, { title: 'Test', content: 'Fail test' });
        console.error('❌ Unauthorized post creation should NOT succeed!');
    } catch (err) {
        console.log('✅ Unauthorized post creation correctly blocked:', err.response?.status);
    }

    console.log('\n5️⃣ Testing Comment Creation (Unauthenticated)...');
    try {
        const commentResp = await axios.post(`${API_BASE}/comments`, {
            postId: 'dummy-post-id',
            content: 'Anonymous comment test'
        });
        console.log('Comment Creation SUCCESS (unauthenticated):', commentResp.data);
    } catch (err) {
        console.error('Comment Creation FAILED:', err.response?.data || err.message);
    }

    console.log('\n==== FULL STACK TEST COMPLETE ====');
}

run();
