import axios from 'axios';

// Function to search for books
export const searchBooks = async (searchTerm) => {
    try {
        const response = await axios.get('/api/books/search', {
            params: { search_term: searchTerm }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching for books:', error);
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('An unexpected error occurred.');
        }
    }
};

//addbooks
export const addBook = async (bookData) => {
    try {
        const response = await axios.post('/api/books/add-book', bookData);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('An unexpected error occurred.');
        }
    }
};


export const fetchUserProfile = async (username) => {
    try {
        const response = await axios.get(`/api/user/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};
