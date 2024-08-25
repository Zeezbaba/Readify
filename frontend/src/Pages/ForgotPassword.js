import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getSecurityQuestion } from '../services/api';
import '../styles/ForgotPassword.css'

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getSecurityQuestion(username);
      setSecurityQuestion(response.data.question);
    } catch (error) {
      console.error('User not found');
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    // Logic for resetting the password
  };

  return (
    <div className='recover-password'>
      <header className="login-header">
                <div className="logo">
                <NavLink to="/">READIFY</NavLink>
                </div>
      </header>
      <h2>Forgot Password</h2>
      {!securityQuestion ? (
        <form className="recover-form" onSubmit={handleUsernameSubmit}>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)} 
            required />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      ) : (
        <form className="recover-form" onSubmit={handleAnswerSubmit}>
          <p>Security Question: {securityQuestion}</p>
          <input 
            type="text" 
            id="Answer" 
            name="Answer"
            value={answer}
            placeholder="Answer" 
            onChange={(e) => setAnswer(e.target.value)} 
            required />
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={newPassword}
            placeholder="New Password" 
            onChange={(e) => setNewPassword(e.target.value)} 
            required />
          <button type="submit" className="submit-btn">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;