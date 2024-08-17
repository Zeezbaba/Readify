import React, { useState } from 'react';
import UpdateAccount from './UpdateAccount';
import '../styles/Profile.css';

const Profile = () => {
  const [showUpdateAccount, setShowUpdateAccount] = useState(false);

  const handleMouseEnter = () => {
    setShowUpdateAccount(true);
  };

  const handleMouseLeave = () => {
    setShowUpdateAccount(false);
  };

  return (
    <div
      className="profile-dashboard"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="dashboard-menu">
        <ul>
          <li>Dashboard</li>
          <li>Update Account</li>
        </ul>
      </div>
      {showUpdateAccount && <UpdateAccount />}
    </div>
  );
};

export default Profile;
