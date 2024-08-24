import React, { useState } from 'react';
import { getSecurityQuestion } from '../services/api';

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
    <div>
      <h2>Forgot Password</h2>
      {!securityQuestion ? (
        <form onSubmit={handleUsernameSubmit}>
          <input placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <form onSubmit={handleAnswerSubmit}>
          <p>Security Question: {securityQuestion}</p>
          <input placeholder="Answer" onChange={(e) => setAnswer(e.target.value)} required />
          <input placeholder="New Password" type="password" onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;