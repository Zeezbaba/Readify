import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser } from '../services/api';
import '../styles/LoginPage.css';

// function LoginPage() {
//     const navigate = useNavigate(); // Initialize useNavigate
//     const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  
//     const handleChange = (e) => {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//         const response = await loginUser(formData.username, formData.password, formData.rememberMe);
//         console.log(response.data.message);
//         if (response.status === 200) { // Check if login was successful
//           navigate('/home'); // Redirect to the homepage
//         }
//       } catch (error) {
//         console.error(error.response?.data?.error || 'Error during login');
//       }
//     };


function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData.username, formData.password, formData.rememberMe);
            if (response.status === 200) {
                navigate('/home'); // Redirect to the homepage
            } else {
                console.error('Login failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
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
                            name="username" 
                            value={formData.username} 
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