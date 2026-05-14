import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: formData.name.trim(), 
                    email: formData.email.trim().toLowerCase(), 
                    password: formData.password.trim() 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Signup connection error:', err);
            setError('Connection error. Please check your internet or database settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        required 
                        disabled={loading}
                    />
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
