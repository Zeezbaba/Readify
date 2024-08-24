import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../services/api';
import '../styles/BookListPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookListPage = () => {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        const loadBooks = async () => {
            const results = await fetchBooks(); // fetch all books
            setBooks(results);
            setFilteredBooks(results);
        };
        loadBooks();
    }, []);

    const handleSearch = (e) => {
        setQuery(e.target.value);
        const filtered = books.filter(book => 
            book.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
            book.author.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

        return (
            <div className="booklist-page">
                <Navbar />
                <h1>Book List</h1>
                <input
                    type="text"
                    placeholder="Search books..."
                    value={query}
                    onChange={handleSearch}
                    className="search-input"
                />
                <div className="book-list">
                    {filteredBooks.length > 0 ? (
                        <ul>
                            {filteredBooks.map((book, index) => (
                                <li key={index}>
                                    <img src={book.coverUrl} alt={`${book.title} cover`} />
                                    <div>
                                        <h3>{book.title}</h3>
                                        <p>{book.author}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No books found</p>
                    )}
                </div>
                <Footer />
            </div>
        );
};