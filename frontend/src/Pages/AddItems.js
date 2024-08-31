// import React, { useState } from 'react';
// import { searchBooks, addBook } from '../services/api';
// import '../styles/AddItems.css';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import debounce from 'lodash.debounce';

// const AddItems = () => {
//     const [query, setQuery] = useState('');
//     const [books, setBooks] = useState([]);
//     const [selectedBook, setSelectedBook] = useState(null);
//     const [manualEntry, setManualEntry] = useState({
//         title: '',
//         author: '',
//         description: '',
//         cover_image_url: ''
//     });
//     const [message, setMessage] = useState('');

//     const handleSearch = debounce(async (e) => {
//         e.preventDefault();
//         console.log("Search triggered");
//         const results = await searchBooks(query);
//         setBooks(results);
//     }, 500);

//     const handleSelectBook = (book) => {
//         setSelectedBook(book);
//     };

//     const handleManualChange = (e) => {
//         const { name, value } = e.target;
//         setManualEntry({
//             ...manualEntry,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         const bookToAdd = selectedBook || manualEntry;

//         console.log(bookToAdd);
        
//         if (!bookToAdd.title) {
//             setMessage('Please select or enter a book to add.');
//             return;
//         }

//         const result = await addBook({
//             ...bookToAdd,
//             cover_image_url: bookToAdd.cover_image_url
//         });

//         if (result.success) {
//             setMessage(result.message);
//             setSelectedBook(null);
//             setBooks([]);
//             setQuery('');
//             setManualEntry({ title: '', author: '', description: '', cover_image_url: '' });
//         } else {
//             setMessage(result.message);
//         }
//     };

//     return (
//         <div className="additems-page">
//             <Navbar />
//             <h1>Add Books</h1>
//             <form onSubmit={handleSearch}>
//                 <div>
//                     <label>Search for a book:</label>
//                     <input
//                         type="text"
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         required
//                     />
//                     <button type="submit">Search</button>
//                 </div>
//             </form>
                
//             <div>
//                 {books.length > 0 && (
//                     <ul>
//                         {books.map((book, index) => (
//                             <li key={index}>
//                                 <div onClick={() => handleSelectBook(book)}>
//                                     <img src={book.cover_image} alt={`${book.title} cover`} />
//                                     <p>{book.title}</p>
//                                     <p>{book.author}</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             {selectedBook && (
//                 <div>
//                     <h3>Selected Book:</h3>
//                     <p>{selectedBook.title}</p>
//                     <p>{selectedBook.author}</p>
//                     <img src={selectedBook.cover_image_url} alt={`${selectedBook.title} cover`} />
//                     <button onClick={handleSubmit}>Add this Book</button>
//                 </div>
//             )}

//             <div className="manual-entry-section">
//                 <h2>Or Enter Book Manually</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <label>Title:</label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={manualEntry.title}
//                             onChange={handleManualChange}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label>Authors:</label>
//                         <input
//                             type="text"
//                             name="author"
//                             value={manualEntry.author}
//                             onChange={handleManualChange}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label>Description:</label>
//                         <textarea
//                             name="description"
//                             value={manualEntry.description}
//                             onChange={handleManualChange}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label>Cover Image URL:</label>
//                         <input
//                             type="text"
//                             name="cover_image_url"
//                             value={manualEntry.cover_image_url}
//                             onChange={handleManualChange}
//                             required
//                         />
//                     </div>
//                     <button type="submit">Add Manually Entered Book</button>
//                 </form>
//             </div>

//             {message && <p>{message}</p>}
//             <Footer />
//         </div>
//     );
// }

// export default AddItems;

import React, { useState } from 'react';
import { searchBooks, addBook } from '../services/api';
import '../styles/AddItems.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import debounce from 'lodash.debounce';

const AddItems = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [manualEntry, setManualEntry] = useState({
        title: '',
        author: '',
        description: '',
        cover_image_url: ''
    });
    const [message, setMessage] = useState('');

    // Debounced search function
    const debouncedSearchBooks = debounce(async () => {
        try {
            const results = await searchBooks(query);
            setBooks(results);
        } catch (error) {
            console.error('Error during search:', error);
            setMessage('An error occurred while searching.');
        }
    }, 500);

    // Handle search, separate preventDefault from debounce
    const handleSearch = (e) => {
        e.preventDefault();  // Prevent form from reloading the page
        if (query.trim() === '') {
            setMessage('Please enter a search term.');
            return;
        }
        debouncedSearchBooks();  // Trigger debounced search
    };

    const handleSelectBook = (book) => {
        setSelectedBook(book);
    };

    const handleManualChange = (e) => {
        const { name, value } = e.target;
        setManualEntry({
            ...manualEntry,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookToAdd = selectedBook || manualEntry;

        if (!bookToAdd.title) {
            setMessage('Please select or enter a book to add.');
            return;
        }

        try {
            const result = await addBook({
                ...bookToAdd,
                cover_image_url: bookToAdd.cover_image_url,
            });

            if (result.success) {
                setMessage(result.message);
                setSelectedBook(null);
                setBooks([]);
                setQuery('');
                setManualEntry({ title: '', author: '', description: '', cover_image_url: '' });
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error('Error adding book:', error);
            setMessage('An error occurred while adding the book.');
        }
    };

    return (
        <div className="additems-page">
            <Navbar />
            <h1>Add Books</h1>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Search for a book:</label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />
                    <button type="submit">Search</button>
                </div>
            </form>

            <div>
                {books.length > 0 && (
                    <ul>
                        {books.map((book, index) => (
                            <li key={index}>
                                <div onClick={() => handleSelectBook(book)}>
                                    <img src={book.cover_image} alt={`${book.title} cover`} />
                                    <p>{book.title}</p>
                                    <p>{book.author}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedBook && (
                <div>
                    <h3>Selected Book:</h3>
                    <p>{selectedBook.title}</p>
                    <p>{selectedBook.author}</p>
                    <img src={selectedBook.cover_image_url} alt={`${selectedBook.title} cover`} />
                    <button onClick={handleSubmit}>Add this Book</button>
                </div>
            )}

            <div className="manual-entry-section">
                <h2>Or Enter Book Manually</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={manualEntry.title}
                            onChange={handleManualChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Authors:</label>
                        <input
                            type="text"
                            name="author"
                            value={manualEntry.author}
                            onChange={handleManualChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={manualEntry.description}
                            onChange={handleManualChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Cover Image URL:</label>
                        <input
                            type="text"
                            name="cover_image_url"
                            value={manualEntry.cover_image_url}
                            onChange={handleManualChange}
                            required
                        />
                    </div>
                    <button type="submit">Add Manually Entered Book</button>
                </form>
            </div>

            {message && <p>{message}</p>}
            <Footer />
        </div>
    );
};

export default AddItems;