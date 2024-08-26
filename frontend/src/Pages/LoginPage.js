import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser } from '../services/api';
import '../styles/LoginPage.css';

function LoginPage() {
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        rememberMe: false 
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData.email, formData.password, formData.rememberMe);
            if (response.status === 200 && response.data.access_token) {  // Check if login was successful and token is received
                localStorage.setItem('JwtToken', response.data.access_token); // Store JWT in localStorage
                navigate('/home'); // Redirect to the homepage
            } else {
                console.error('Login failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error during login:', error.response?.data?.error || error.message);
        }
    };

    return (
        <div className="login-page">
            <header className="login-header">
                <div className="logo">READIFY</div>
            </header>
            <main className="login-main">
                <h2>Log in to your account</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Enter your email" 
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Enter your password" 
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Log In</button>
                </form>
                <div className="forgot-password">
                    Forgot password? <Link to="/forgot-password">Click here</Link>
                </div>
                <div className="signup-link">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;