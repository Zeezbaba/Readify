import requests
import time

def search_book_by_title(query):
    """function to interact with APIs from Open Library
    where books are search for by title and/or author and also
    includes the cover image URLs
    """
    print("Query Dictionary:", query)
    base_url = 'https://openlibrary.org/search.json?'

    if 'title' in query and 'author' in query:
        # construct search url for that
        search_url = base_url + f"title={query['title']}&author={query['author']}"
    # elif 'title' in query:
    #     search_url = base_url + f"title={query['title']}"
    # elif 'author' in query:
    #     search_url = base_url + f"author={query['author']}"
    # elif 'general' in query:
    #     search_url = base_url + f"q={query['general']}"
    else:
        general = query.get('title') or query.get('author') or query.get('general')
        search_url = base_url + f"q={general}"
    # search_url = base_url + f"q={query['general']}"
    
    # append field and language query
    search_url += f"&fields=title,author_name,first_publish_year,isbn,cover_i,key&lang=en"

    # Add a cache-busting parameter
    search_url += f"&_={int(time.time() * 1000)}"
    print("Constructed Search URL:", search_url)
    print("Constructed Search URL:", search_url)

    
    response = requests.get(search_url)
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


