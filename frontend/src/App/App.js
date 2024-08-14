import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "../components/Footer";
import Home from "../Pages/Home";
import Navbar from "../components/Navbar";
import "./App.css"


const App = () => {
  return (
    <Router>
      <div className="app">
        <header>
          <Navbar />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;