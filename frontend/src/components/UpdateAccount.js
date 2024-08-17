import React from 'react';
import '../styles/UpdateAccount.css';

const UpdateAccount = () => {
  return (
    <div className="update-account">
      <h2>Update Account</h2>
      <form className="update-form">
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" name="bio" rows="4"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input type="password" id="password" name="password" />
        </div>

        <div className="form-group">
          <label htmlFor="profile-image">Profile Image:</label>
          <input type="file" id="profile-image" name="profile-image" />
        </div>

        <button type="submit" className="update-btn">Update</button>
      </form>
    </div>
  );
};

export default UpdateAccount;