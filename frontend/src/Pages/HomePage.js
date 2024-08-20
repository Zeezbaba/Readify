import React from 'react';
import '../styles/HomePage.css';
import bookimage from '../assets/bookimage-1.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <h1>WELCOME</h1>
      <div className="book-sections">
        <div className="book-section">
          <h2>Newly Added</h2>
          <p>TheSenior Vice President of Christie's and seasoned auctioneer Lydia Fenet,</p>
          <img src={bookimage} alt="Newly added book" />
          <button>Want to read</button>
        </div>
        <div className="book-section">
          <h2>Suggested</h2>
          <p>A charming holiday baking cookbook brimming with delicious, indulgent recipes,</p>
          <img src={bookimage} alt="Suggested book" />
          <button>Want to read</button>
        </div>
        <div className="book-section">
          <h2>Continue</h2>
          <p>Minimalism is the art of knowing how much is just enough. Digital minimalism</p>
          <img src={bookimage} alt="Continue reading book" />
          <button>Want to read</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;