import React from 'react';
import '../styles/BookListPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookListPage = () => {
    return (
        <div className="booklist-page">
            <Navbar />
            <h1>Book List</h1>
            <Footer />
        </div>
    );
};

export default BookListPage;
