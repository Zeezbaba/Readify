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
//     const [message, setMessage] = useState('');

//     const handleSearch = debounce(async (e) => {
//         e.preventDefault();
//         const results = await searchBooks(query);
//         setBooks(results);
//     }, 500);

//     const handleSelectBook = (book) => {
//         setSelectedBook(book);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!selectedBook) {
//             setMessage('Please select a book to add.');
//             return;
//         }

//         const result = await addBook(selectedBook);

//         if (result.success) {
//             setMessage(result.message);
//             setSelectedBook(null);
//             setBooks([]);
//             setQuery('');
//         } else {
//             setMessage(result.message);
//         }
//     };

//     return (
//         <div className="additems-page">
//             <Navbar />
//             <h1>Add Items</h1>
//             <form onSubmit={handleSearch}>
//             <div>
//                 <label>Search for a book:</label>
//                     <input
//                         type="text"
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         required
//                     />
//                     <button type="submit">Search</button>
//             </div>
//             </form>
                
//             <div>
//                 {books.length > 0 && (
//                     <ul>
//                         {books.map((book, index) => (
//                             <li key={index}>
//                                 <div onClick={() => handleSelectBook(book)}>
//                                     <img src={book.coverUrl} alt={`${book.title} cover`} />
//                                     <p>{book.title}</p>
//                                     <p>{book.author}</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//                 {selectedBook && (
//                 <div>
//                     <h3>Selected Book:</h3>
//                     <p>{selectedBook.title}</p>
//                     <p>{selectedBook.author}</p>
//                     <img src={selectedBook.coverUrl} alt={`${selectedBook.title} cover`} />
//                     <button onClick={handleSubmit}>Add this Book</button>
//                 </div>
//             )}

//             {message && <p>{message}</p>}
//             <Footer />
//         </div>
//     );
// }

// export default AddItems;