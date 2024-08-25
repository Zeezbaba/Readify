// import axios from 'axios';

// const baseURL = 'http://localhost:5000/api';

// export const fetchUserProfile = async (username) => {
//     try {
//         const response = await axios.get(`/api/user/${username}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         throw error;
//     }
// };

// //Function to login
// export const loginUser = async (credentials) => {
//     try {
//         const response = await axios.post(`${baseURL}/login`, credentials);
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

// //Function to register
// export const registerUser = async (userData) => {
//     try {
//         const response = await axios.post(`${baseURL}/register`, userData);
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

// export default api;

import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Login service
export const loginUser = async (username, password, rememberMe) => {
    return axios.post(`${API_URL}/login`, {
      username,
      password,
      "remember me": rememberMe
    });
  };


  
  // Registration service
export const registerUser = async (username, email, password, securityQuestion, securityAnswer) => {
  return axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
    "security question": securityQuestion,
    "security answer": securityAnswer
  });
};
  
  // Forgot password - get security question
export const getSecurityQuestion = async (username) => {
    return axios.post(`${API_URL}/user/forgot-password`, { username });
  };
  
  // Password recovery - reset password
export const resetPassword = async (username, answer, newPassword) => {
    return axios.post(`${API_URL}/user/recover-password`, {
      username,
      answer,
      newPassword
    });
  };

  // Fetch home page data (user info and recent books)
  export const getHomePageData = async () => {
    const token = localStorage.getItem('JwtToken');
    console.log("token:", token);
    return axios.get(`${API_URL}/home`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

// Function to search for books
export const searchBooks = async (searchTerm) => {
    return axios.post(`${API_URL}/books/search`, { 'search term': searchTerm }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

// Function to add a book
export const addBook = async (bookData) => {
    return axios.post(`${API_URL}/books/add-book`, { bookData });
};


export const getUser = async (username) => {
    return axios.get(`${API_URL}/user/${username}`);
};