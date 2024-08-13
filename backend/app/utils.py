import requests


def search_book_by_title(title):
    """function to interact with APIs from Open Library
    where books are search for by title and also
    includes the cover image URLs
    """
    response = requests.get(f"https://openlibrary.org/search.json?title={title}")
    if response.status_code == 200:
        books = response.json().get('docs', [])
        for book in books:
            cover_id = book.get('cover_i')
            if cover_id:
                book['cover_image_url'] = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
            else:
                book['cover_image_url'] = "https://via.placeholder.com/128x200?text=No+Cover+Image"
        return books
    else:
        return []