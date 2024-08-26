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

// //Search books
// export const searchBooks = async (searchTerm) => {
//     try {
//       const response = await axios.post(`/books/search?q=${encodeURIComponent(searchTerm)}`);
//       return response.data.books;
//     } catch (error) {
//         throw error.response.data;
//     }
//   };

// //addbooks
// export const addBook = async (bookData) => {
//     try {
//         const response = await axios.post(`${baseURL}/login/books/add-book`, bookData);
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

// //export default api;


// import axios from 'axios';

// const baseURL = 'http://localhost:5000/api';

// Fetch User Profile
// export const fetchUserProfile = async (username) => {
//     try {
//         const response = await axios.get(`${baseURL}/user/${username}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         throw error.response?.data || new Error('Network error');
//     }
// };

// // Function to login
// export const loginUser = async (credentials) => {
//     try {
//         const response = await axios.post(`${baseURL}/login`, credentials);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || new Error('Network error');
//     }
// };

// // Function to register
// export const registerUser = async (userData) => {
//     try {
//         const response = await axios.post(`${baseURL}/register`, userData);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || new Error('Network error');
//     }
// };

// // Search books
// export const searchBooks = async (searchTerm) => {
//     try {
//         const response = await axios.get(`${baseURL}/books/search?q=${encodeURIComponent(searchTerm)}`);
//         return response.data.books;
//     } catch (error) {
//         throw error.response?.data || new Error('Network error');
//     }
// };


// // Add book
// export const addBook = async (bookData) => {
//     try {
//         const response = await axios.post(`${baseURL}/books/add-book`, bookData);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || new Error('Network error');
//     }
// };


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

// // Function to search for books
// export const searchBooks = async (searchTerm) => {
//     return axios.post(`${API_URL}/books/search`, { 'search term': searchTerm }, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// };

// Function to add a book
// export const addBook = async (bookData) => {
//     return axios.post(`${API_URL}/books/add-book`, { bookData });
// };


// Function to search for books
// export const searchBooks = async (searchTerm) => {
//     try {
//         const response = await axios.get(`${API_URL}/books/search`, {
//             params: { search_term: searchTerm },
//             headers: { 'Content-Type': 'application/json' }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error searching for books:', error);
//         return [];
//     }
// };

// Function to add a book (either selected or manual)
// export const addBook = async (bookData) => {
//     try {
//         const token = localStorage.getItem('JwtToken');
//         const response = await axios.post(`${API_URL}/books/add-items`, bookData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error adding the book:', error);
//         return { success: false, message: 'Failed to add the book' };
//     }
// };

// Function to add a book
// export const addBook = async (bookData) => {
//     const token = localStorage.getItem('JwtToken');
//     console.log(bookData)
//     return axios.post(`${API_URL}/books/add-items`,
//       bookData, // This is the request body
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//   };

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
    console.log(bookData);
    const  token = localStorage.getItem('JwtToken');
    
    return axios.post(`${API_URL}/books/add-book`, bookData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
      });
  };
  

export const getAllBooks = async () => {
    const token = localStorage.getItem('JwtToken');
    return axios.get(`${API_URL}/books/recent`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  
export async function getUser(username) {
  try {
    const response = await axios.get(`/user/${username}`);
  
    if (response.status === 200) {
      const userData = response.data;
        // Process the user data as needed
      console.log('User Data:', userData);
      return userData;
    } else {
      throw new Error(`Error fetching user data. Status: ${response.status}`);
    }
  } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  }


export const getUserProfile = async () => {
  const token = localStorage.getItem('JwtToken');
  return axios.get(`${API_URL}/user/profile`, {
    headers: {
        Authorization: `Bearer ${token}`
      }
  });
};

export const updateUserProfile = async (profileData) => {
    const token = localStorage.getItem('JwtToken');
    return axios.put(`${API_URL}/user/profile`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};