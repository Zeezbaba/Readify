const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchBooks = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/books/search?title=${query}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        return data.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            coverUrl: book.cover_image_url,
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
};

//addbooks
export const addBook = async (book) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/addbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });

        const data = await response.json();
        if (response.status === 201) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: 'Failed to add book' };
        }
    } catch (error) {
        console.error('Error adding book:', error);
        return { success: false, message: 'Error adding book' };
    }
};