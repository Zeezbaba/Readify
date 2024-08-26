// import React from 'react';
// import '../styles/BookListPage.css';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const BookListPage = () => {
//     return (
//         <div className="booklist-page">
//             <Navbar />
//             <h1>Book List</h1>
//             <p>Your books</p>
//             <Footer />
//         </div>
//     );
// };

// export default BookListPage;

import React from 'react';
import '../styles/BookListPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllBooks } from "../services/api";
import { useEffect, useState } from 'react';
import bookimage from '../assets/bookimage-1.jpg';



const BookListPage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllBooks();
                setBooks(response.data.books);
            } catch (error) {
                console.error('Error fetching home page data:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="booklist-page">
            <Navbar />
            <h1>Book List</h1>
            <p>Your books</p>
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
                    <div className="book-section">
                        <h2>No books added</h2>
                        <img src={bookimage} alt="No books" />
                    </div>
                )}
            </div>

            <Footer />


        </div>
    );
};

export default BookListPage;
