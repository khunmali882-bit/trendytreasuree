const crypto = require('crypto');
const users = require('../../src/data/users.json');

const JWT_SECRET = 'trendytreasure-secret-key';

// Helper functions from authHelper.js
const verifyPassword = async (storedPassword, suppliedPassword) => {
    const [hashedPassword, salt] = storedPassword.split('.');
    if (!hashedPassword || !salt) return false;
    
    // Using synchronous scrypt for simplicity in function if needed, but promisified is better
    // Netlify functions support async/await
    const util = require('util');
    const scrypt = util.promisify(crypto.scrypt);
    const buf = await scrypt(suppliedPassword, Buffer.from(salt, 'hex'), 64);
    return buf.toString('hex') === hashedPassword;
};

const generateToken = (user) => {
    const payload = JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() });
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    return `${Buffer.from(payload).toString('base64')}.${signature}`;
};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const { action } = event.queryStringParameters || {};

        // LOGIN
        if (action === 'login' || event.path.endsWith('/login')) {
            const { email, password } = body;
            const user = users.find(u => u.email === email);

            if (!user) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
            }

            const isMatch = await verifyPassword(user.password, password);
            if (!isMatch) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
            }

            const token = generateToken(user);
            const { password: _, ...userSafe } = user;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Login successful', token, user: userSafe })
            };
        }

        // REGISTER (Read-only on Netlify Functions unless using a DB)
        if (action === 'register' || event.path.endsWith('/register')) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Registration is currently disabled on the live site. Please use an existing test account or contact support to connect a database.' 
                })
            };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Endpoint not found' }) };

    } catch (error) {
        console.error('Auth error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error' }) };
    }
};
