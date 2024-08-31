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
export const loginUser = async (email, password, rememberMe) => {
    return axios.post(`${API_URL}/login`, {
      email,
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
// export const getSecurityQuestion = async (username) => {
//     return axios.post(`${API_URL}/user/forgot-password`, { username });
//   };
  
//   // Password recovery - reset password
// export const resetPassword = async (username, answer, newPassword) => {
//     return axios.post(`${API_URL}/user/recover-password`, {
//       username,
//       answer,
//       newPassword
//     });
//   };


// Forgot password - get security question
export const getSecurityQuestion = async (username) => {
  return axios.post(`${API_URL}/user/forgot-password`, { username });
};

// Verify security answer
export const verifySecurityAnswer = async (username, answer) => {
  return axios.post(`${API_URL}/user/verify-answer`, {
    username,
    answer
  });
};

// Password recovery - reset password
export const resetPassword = async (username, newPassword) => {
  return axios.post(`${API_URL}/user/recover-password`, {
    username,
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
export const searchBooks = async (query) => {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error('No token found, user is not authenticated.');
  }

  const response = await fetch(`/books/search?search_term=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Search failed');
  }

  const data = await response.json();
  return data;
};

// export const searchBooks = async (query) => {
//   const response = await fetch(`/books/search?search_term=${encodeURIComponent(query)}`, {
//       method: 'GET',
//       headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`  // add your JWT token if necessary
//       }
//   });
//   const data = await response.json();
//   return data;
// };
  
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

// import { useHistory } from 'react-router-dom';  // Assuming you're using react-router

// Logout service
export const logoutUser = async () => {
  try {
    // Call the logout endpoint
    await axios.post(`${API_URL}/logout`);
    
    // Remove token from localStorage
    localStorage.removeItem('JwtToken');
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

