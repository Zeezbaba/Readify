import React, { useEffect, useState } from 'react';
import '../styles/HomePage.css';
import bookimage from '../assets/bookimage-1.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getHomePageData } from '../services/api';

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching home page data...");
        const response = await getHomePageData();
        console.log(response);
        setUserData(response.data.user);
        setBooks(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error fetching home page data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <Navbar />
      <h1>WELCOME{userData ? `, ${userData.username || userData.email}` : ''}</h1>
      
      <div className="user-info">
        <p>Books added: {books.length > 0 ? books.length : '0'}</p>
      </div>
      
      <div className="book-sections">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} className="book-section">
              <h2>{book.title}</h2>
              <p>{book.author}</p>
              <img src={book.cover_image || bookimage} alt={book.title} />
              <button>Want to read</button>
            </div>
          ))
        ) : (
          <div className="no-books-section">
            <h2>No books added</h2>
            <img src={bookimage} alt="No books" />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;