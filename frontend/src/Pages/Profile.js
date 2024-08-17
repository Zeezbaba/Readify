import React from 'react';
import '../styles/Profile.css';
import profilePic from '../assets/profile-pic.jpg';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-left">
        <img 
          src={profilePic} 
          alt="Profile" 
          className="profile-picture"
        />
        <h1 className="profile-name">Ariadne Snyder (she/her)</h1>
        <p className="profile-title">Communications Specialist</p>
      </div>
      <div className="profile-right">
        <h2>About Me</h2>
        <h3>Brevity is key</h3>
        <p>
          I am an energetic and passionate college student working towards a 
          communications degree, seeking a summer internship at the next big 
          digital company.
        </p>
        <h3>Education</h3>
        <p>
          2025 Bachelor of Arts in Communications<br />
          Murrayfield School of Marketing<br />
          GPA of 3.60 / 4.00
        </p>
        <h3>Experience</h3>
        <p>
          2023 Communications Intern<br />
          Strategaea Branding
        </p>
      </div>
    </div>
  );
};

export default Profile;