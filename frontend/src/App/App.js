import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddItems from "../Pages/AddItems";
import Profile from "../Pages/Profile";
import HomePage from "../Pages/HomePage";
import WelcomePage from "../Pages/welcome";
import SignupPage from "../Pages/SignupPage";
import LoginPage from "../Pages/LoginPage";
import BookListPage from "../Pages/BookListPage";
import "./App.css"


const App = () => {
  return (
    <Router>
      <div className="app">
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/book-list" element={<BookListPage />} />
            <Route path="/add-books" element={<AddItems />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;