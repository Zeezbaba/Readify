export const fetchBooks = async (query) => {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
        const data = await response.json();

        return data.docs.slice(0, 3).map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'default-cover.jpg',
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
};
