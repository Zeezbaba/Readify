import React, { useState } from 'react';
import '../styles/Profile.css';
import defaultProfilePic from '../assets/profile-pic.jpg';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Profile = () => {
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [uploadedProfilePic, setUploadedProfilePic] = useState(null);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleProfilePicChange = (e) => {
    setUploadedProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmitBio = (e) => {
    e.preventDefault();
    // Call API to update bio here
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Call API to update password here
  };

  const handleSubmitProfilePic = (e) => {
    e.preventDefault();
    // Call API to update profile picture here
  };

  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    datasets: [
        {
            label: 'Books Added',
            data: [2, 1, 0, 3, 0, 2, 0, 1, 0, 0, 0, 0, 0],
            backgroundColor: '#6CE5E8',
        },
    ],
};

const options = {
    scales: {
        x: {
            beginAtZero: true,
        },
        y: {
            beginAtZero: true,
            max: 6,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
    },
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img
          src={uploadedProfilePic || defaultProfilePic}
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

        <div className="dashboard">
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Unique Items</h3>
                    <p>2</p>
                </div>
                <div className="summary-card">
                    <h3>Total Copies</h3>
                    <p>2</p>
                </div>
            </div>

            <div className="dashboard-chart">
                <h3>Books added this month</h3>
                <Bar data={data} options={options} />
            </div>
        </div>

        {/* Bio Update Form */}
        <div className="update-section">
          <h2>Update Bio</h2>
          <form onSubmit={handleSubmitBio}>
            <textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="Update your bio here..."
              rows="5"
            />
            <button type="submit">Update Bio</button>
          </form>
        </div>

        {/* Password Change Form */}
        <div className="update-section">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmitPassword}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
            <button type="submit">Change Password</button>
          </form>
        </div>

        {/* Profile Picture Update Form */}
        <div className="update-section">
          <h2>Update Profile Picture</h2>
          <form onSubmit={handleSubmitProfilePic}>
            <input
              type="file"
              onChange={handleProfilePicChange}
              accept="image/*"
            />
            <button type="submit">Update Picture</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;