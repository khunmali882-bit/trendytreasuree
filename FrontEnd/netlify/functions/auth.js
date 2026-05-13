const crypto = require('crypto');
const util = require('util');
const usersData = require('../../src/data/users.json');

const JWT_SECRET = 'trendytreasure-secret-key';
const scrypt = util.promisify(crypto.scrypt);

// Helper functions
const verifyPassword = async (storedPassword, suppliedPassword) => {
    const [hashedPassword, salt] = storedPassword.split('.');
    if (!hashedPassword || !salt) return false;
    const buf = await scrypt(suppliedPassword, Buffer.from(salt, 'hex'), 64);
    return buf.toString('hex') === hashedPassword;
};

const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16);
    const buf = await scrypt(password, salt, 64);
    return `${buf.toString('hex')}.${salt.toString('hex')}`;
};

const generateToken = (user) => {
    const payload = JSON.stringify({ id: user.id || user._id, email: user.email, timestamp: Date.now() });
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

    try {
        const body = JSON.parse(event.body);
        const { action } = event.queryStringParameters || {};
        const isLogin = action === 'login' || event.path.endsWith('/login');
        const isRegister = action === 'register' || event.path.endsWith('/register');

        // MONGODB CONNECTION (Optional)
        let dbUsers = [];
        const MONGODB_URI = process.env.MONGODB_URI;

        if (MONGODB_URI) {
            // If the user adds a MongoDB URI, we could use a real DB here.
            // For now, let's keep it simple and focus on the error they are seeing.
        }

        // LOGIN
        if (isLogin) {
            const { email, password } = body;
            const user = usersData.find(u => u.email === email);

            if (!user) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
            }

            const isMatch = await verifyPassword(user.password, password);
            if (!isMatch) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
            }

            const token = generateToken(user);
            const { password: _, ...userSafe } = user;

            return { statusCode: 200, headers, body: JSON.stringify({ message: 'Login successful', token, user: userSafe }) };
        }

        // REGISTER
        if (isRegister) {
            const { name, email, password } = body;
            
            // Validation
            if (!name || !email || !password) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'All fields are required' }) };
            }

            // Check if user already exists in our static list
            if (usersData.find(u => u.email === email)) {
                return { statusCode: 409, headers, body: JSON.stringify({ error: 'User already exists' }) };
            }

            // For "Real Web" we need a place to save. 
            // If MONGODB_URI is not set, we show a helpful instruction.
            if (!MONGODB_URI) {
                return { 
                    statusCode: 503, 
                    headers, 
                    body: JSON.stringify({ 
                        error: 'Registration requires a Database connection on the live site. Please add MONGODB_URI to your Netlify environment variables.' 
                    }) 
                };
            }

            // TODO: Implement real MongoDB saving here if MONGODB_URI is provided
            return { statusCode: 501, headers, body: JSON.stringify({ error: 'Database integration in progress' }) };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not Found' }) };

    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server Error' }) };
    }
};
