import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        securityQuestion: '',
        securityAnswer: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        console.log(formData);
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
                <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
