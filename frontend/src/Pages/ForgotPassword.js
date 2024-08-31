// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { getSecurityQuestion } from '../services/api';
// import '../styles/ForgotPassword.css'

// function ForgotPassword() {
//   const [username, setUsername] = useState('');
//   const [securityQuestion, setSecurityQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [newPassword, setNewPassword] = useState('');

//   const handleUsernameSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await getSecurityQuestion(username);
//       setSecurityQuestion(response.data.question);
//     } catch (error) {
//       console.error('User not found');
//     }
//   };

//   const handleAnswerSubmit = async (e) => {
//     e.preventDefault();
//     // Logic for resetting the password
//   };

//   return (
//     <div className='recover-password'>
//       <header className="login-header">
//                 <div className="logo">
//                 <NavLink to="/">READIFY</NavLink>
//                 </div>
//       </header>
//       <h2>Forgot Password</h2>
//       {!securityQuestion ? (
//         <form className="recover-form" onSubmit={handleUsernameSubmit}>
//           <label htmlFor="username">Username</label>
//           <input 
//             type="text" 
//             id="username"
//             name="username"
//             value={username}
//             placeholder="Enter your username"
//             onChange={(e) => setUsername(e.target.value)} 
//             required />
//           <button type="submit" className="submit-btn">Submit</button>
//         </form>
//       ) : (
//         <form className="recover-form" onSubmit={handleAnswerSubmit}>
//           <p>Security Question: {securityQuestion}</p>
//           <input 
//             type="text" 
//             id="Answer" 
//             name="Answer"
//             value={answer}
//             placeholder="Answer" 
//             onChange={(e) => setAnswer(e.target.value)} 
//             required />
//           <input 
//             type="password" 
//             id="password" 
//             name="password" 
//             value={newPassword}
//             placeholder="New Password" 
//             onChange={(e) => setNewPassword(e.target.value)} 
//             required />
//           <button type="submit" className="submit-btn">Reset Password</button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default ForgotPassword;


import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getSecurityQuestion, verifySecurityAnswer, resetPassword } from '../services/api'; // Import necessary API functions
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState(1); // To handle navigation between stages
  const navigate = useNavigate();

  // Handle Username Submission and Security Question Retrieval
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getSecurityQuestion(username);
      setSecurityQuestion(response.data.question);
      setStage(2); // Move to the security question stage
    } catch (error) {
      console.error('User not found');
    }
  };

  // Handle Answer Submission and Verification
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifySecurityAnswer(username, answer);
      if (response.data.valid) {
        console.log('Setting stage to 3');
        setStage(3);
      } else {
        console.error('Incorrect answer');
      }
    } catch (error) {
      console.error('Error verifying the answer');
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(username, newPassword);
      if (response.status === 200) {
        navigate('/login'); // Navigate to the login page after successful reset
      } else {
        console.error('Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password');
    }
  };

  return (
    <div className='recover-password'>
      <header className="login-header">
        <div className="logo">
          <NavLink to="/">READIFY</NavLink>
        </div>
      </header>

      <h2>Forgot Password</h2>

      {stage === 1 && (
        <form className="recover-form" onSubmit={handleUsernameSubmit}>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}

      {stage === 2 && (
        <form className="recover-form" onSubmit={handleAnswerSubmit}>
          <p>Security Question: {securityQuestion}</p>
          <label htmlFor="answer">Answer</label>
          <input 
            type="text" 
            id="answer" 
            name="answer"
            value={answer}
            placeholder="Answer" 
            onChange={(e) => setAnswer(e.target.value)} 
            required
          />
          <button type="submit" className="submit-btn">Submit Answer</button>
        </form>
      )}

      {stage === 3 && (
        <form className="recover-form" onSubmit={handlePasswordReset}>
          <label htmlFor="newPassword">New Password</label>
          <input 
            type="password" 
            id="newPassword" 
            name="newPassword" 
            value={newPassword}
            placeholder="New Password" 
            onChange={(e) => setNewPassword(e.target.value)} 
            required
          />
          <button type="submit" className="submit-btn">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;