import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../services/api';
import '../styles/Home.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
      // Fetch the books when the component mounts
      fetchBooks('bestsellers')
          .then(data => setBooks(data))
          .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="homepage">
        <h1>WELCOME</h1>
        <div className="cards">
            {books.map((book, index) => (
                <div className="card" key={index}>
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>
                    <img src={book.coverUrl} alt={book.title} />
                    <button>Want to read</button>
                </div>
            ))}
        </div>
    </div>
);
};

export default HomePage;