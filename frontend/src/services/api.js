import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

export const fetchUserProfile = async (username) => {
    try {
        const response = await axios.get(`/api/user/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};


//const api = axios.create({
    //baseURL: 'http://localhost:5000/api',
    //headers: {
        //'Content-Type': 'application/json',
    //},
//});

//Function to login
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${baseURL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

//Function to register
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${baseURL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

//Search books
export const searchBooks = async (searchTerm) => {
    try {
      const response = await axios.post(`/books/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data.books;
    } catch (error) {
        throw error.response.data;
    }
  };

//addbooks
export const addBook = async (bookData) => {
    try {
        const response = await axios.post(`${baseURL}/login/books/add-book`, bookData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

//export default api;