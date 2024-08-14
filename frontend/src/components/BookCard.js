import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.cover_image} alt={book.title} />
      <h3>{book.title}</h3>
      <p>By {book.author}</p>
    </div>
  );
};

export default BookCard;