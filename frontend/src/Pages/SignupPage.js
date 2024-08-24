import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/SignupPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Use the registerUser service to send the data to the backend
      const response = await registerUser(
        formData.username,
        formData.email,
        formData.password,
        formData.securityQuestion,
        formData.securityAnswer
      );

      if (response.status === 201) {
        navigate('/login'); // Redirect to the login page after successful registration
      } else if (response.status === 409) {
        // Handle conflict error
        console.error('Conflict: The username or email might already be taken.');
      } else {
        console.error('Failed to register. Status code:', response.status);
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
    }
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
          
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            placeholder="Enter your username"
            required 
          />

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

          <label htmlFor="securityQuestion">Security Question</label>
          <input 
            type="text" 
            id="securityQuestion" 
            name="securityQuestion" 
            value={formData.securityQuestion} 
            onChange={handleChange} 
            placeholder="Enter your security question"
            required 
          />

          <label htmlFor="securityAnswer">Security Answer</label>
          <input 
            type="text" 
            id="securityAnswer" 
            name="securityAnswer" 
            value={formData.securityAnswer} 
            onChange={handleChange} 
            placeholder="Enter your security answer"
            required 
          />

          <button type="submit" className="signup-btn">Sign up</button>
          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default SignupPage;