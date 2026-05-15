const crypto = require('crypto');
const util = require('util');
const { MongoClient } = require('mongodb');
const usersData = require('../../src/data/users.json');

const JWT_SECRET = 'trendytreasure-secret-key';
const scrypt = util.promisify(crypto.scrypt);

// MongoDB Connection caching
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) return null;

    try {
        const client = await MongoClient.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        const db = client.db('trendytreasure');
        cachedDb = db;
        return db;
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        return null;
    }
}

// Helper functions
const verifyPassword = async (storedPassword, suppliedPassword) => {
    if (!storedPassword) return false;
    const [hashedPassword, salt] = storedPassword.split('.');
    if (!hashedPassword || !salt) {
        // Fallback for old non-salted hashes if any
        return crypto.createHash('sha256').update(suppliedPassword).digest('hex') === storedPassword;
    }
    const buf = await scrypt(suppliedPassword, Buffer.from(salt, 'hex'), 64);
    return buf.toString('hex') === hashedPassword;
};

const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16);
    const buf = await scrypt(password, salt, 64);
    return `${buf.toString('hex')}.${salt.toString('hex')}`;
};

const generateToken = (user) => {
    const payload = JSON.stringify({ 
        id: user.id || user._id, 
        email: user.email, 
        name: user.name,
        timestamp: Date.now() 
    });
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    return `${Buffer.from(payload).toString('base64')}.${signature}`;
};

exports.handler = async (event, context) => {
    // Basic context for Netlify functions
    context.callbackWaitsForEmptyEventLoop = false;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { action } = event.queryStringParameters || {};
        const isLogin = action === 'login' || event.path.endsWith('/login');
        const isRegister = action === 'register' || event.path.endsWith('/register');

        const db = await connectToDatabase();
        const usersCollection = db ? db.collection('users') : null;

        // LOGIN
        if (isLogin) {
            const { email, password } = body;
            if (!email || !password) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email and password are required' }) };
            }

            let user = null;

            // 1. Try MongoDB first
            if (usersCollection) {
                user = await usersCollection.findOne({ email: email.toLowerCase().trim() });
            }

            // 2. Try static JSON fallback
            if (!user) {
                user = usersData.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
            }

            if (!user) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
            }

            const isMatch = await verifyPassword(user.password, password);
            if (!isMatch) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
            }

            const token = generateToken(user);
            const { password: _, ...userSafe } = user;
            if (userSafe._id) userSafe.id = userSafe._id; // Normalize ID

            return { statusCode: 200, headers, body: JSON.stringify({ message: 'Login successful', token, user: userSafe }) };
        }

        // REGISTER
        if (isRegister) {
            const { name, email, password } = body;
            
            if (!name || !email || !password) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name, email, and password are required' }) };
            }

            const normalizedEmail = email.toLowerCase().trim();

            if (!db) {
                return { 
                    statusCode: 503, 
                    headers, 
                    body: JSON.stringify({ 
                        error: 'Registration requires a Database connection on the live site. Please add MONGODB_URI to your Netlify environment variables.' 
                    }) 
                };
            }

            // Check if user already exists in DB
            const existingUser = await usersCollection.findOne({ email: normalizedEmail });
            if (existingUser) {
                return { statusCode: 409, headers, body: JSON.stringify({ error: 'User already exists' }) };
            }

            const hashedPasswordValue = await hashPassword(password);
            const newUser = {
                name,
                email: normalizedEmail,
                password: hashedPasswordValue,
                createdAt: new Date()
            };

            const result = await usersCollection.insertOne(newUser);
            newUser.id = result.insertedId;
            const { password: _, ...userSafe } = newUser;

            return { statusCode: 201, headers, body: JSON.stringify({ message: 'User registered successfully', user: userSafe }) };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Endpoint not found' }) };

    } catch (error) {
        console.error('Auth Function Error:', error);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }) 
        };
    }
};

