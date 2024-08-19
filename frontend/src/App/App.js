import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddItems from "../Pages/AddItems";
import Profile from "../Pages/Profile";
import HomePage from "../Pages/HomePage";
import WelcomePage from "../Pages/welcome";
import SignupPage from "../Pages/SignupPage";
import LoginPage from "../Pages/LoginPage";
import "./App.css"


const App = () => {
  return (
    <Router>
      <div className="app">
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/add-items" element={<AddItems />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;