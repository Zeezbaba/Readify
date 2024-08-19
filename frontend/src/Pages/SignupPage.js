import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        securityQuestion: '',
        securityAnswer: '',
    });

    const navigate = useNavigate();

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
        navigate('/home-page');
    };

    return (
        <div className="signup-page">
            <header className="signup-header">
                <div className="logo">READIFY</div>
            </header>
            <main className="signup-main">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h1>Create an account</h1>
                    <p>Let's get started!</p>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Enter your name" 
                    />

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email" 
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Enter your password" 
                    />

                    <label htmlFor="securityQuestion">Security Question</label>
                    <input 
                        type="text" 
                        id="securityQuestion" 
                        name="securityQuestion" 
                        value={formData.securityQuestion} 
                        onChange={handleChange} 
                        placeholder="Enter your security question" 
                    />

                    <label htmlFor="securityAnswer">Security Answer</label>
                    <input 
                        type="text" 
                        id="securityAnswer" 
                        name="securityAnswer" 
                        value={formData.securityAnswer} 
                        onChange={handleChange} 
                        placeholder="Enter your security answer" 
                    />

                    <button type="submit" className="signup-btn">Sign up</button>
                    <p className="login-link">
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </form>
            </main>

        </div>
    );
};

export default SignupPage;