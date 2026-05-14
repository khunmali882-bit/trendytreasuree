import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            console.log('Attempting login to:', `${API_BASE_URL}/login`);
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email.trim().toLowerCase(), 
                    password: formData.password.trim() 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login connection error:', err);
            setError('Connection error. Please check your internet or database settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        required 
                        disabled={loading}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                        required 
                        disabled={loading}
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;
