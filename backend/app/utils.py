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
    else:
        general = query.get('title') or query.get('author') or query.get('general')
        search_url = base_url + f"q={general}"
    
    # append field and language query
    search_url += f"&fields=title,author_name,first_publish_year,isbn,cover_i,key&lang=en"

    # Add a cache-busting parameter
    search_url += f"&_={int(time.time() * 1000)}"
    print("Constructed Search URL:", search_url)
    # print("Constructed Search URL:", search_url)

    
    response = requests.get(search_url)
    if response.status_code == 200:
        books = response.json().get('docs', [])
        for book in books:
            cover_id = book.get('cover_i')
            if cover_id:
                book['cover_image_url'] = get_cover_image(cover_id)
            # get description
            work_id = book.get('key')
            if work_id:
                book['description'] = get_description(work_id)
            # get genre
            subject_list = book.get('subjects')
            if subject_list:
                book['genre'] = get_genre(subject_list)
                    
        print(books)
        return books
    else:
        return []

def get_cover_image(cover_id="https://via.placeholder.com/128x200?text=No+Cover+Image"):
    """ gets a book cover image
    from the Open Library Works API"""
    if cover_id:
        cover_id = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
    return cover_id

def get_genre(subject_list):
    """ retrieves the first matching genre 
    in the subject list from Open Library Works API"""
    book_genres = [
            "Fantasy",
            "Science Fiction",
            "Mystery",
            "Thriller",
            "Romance",
            "Historical Fiction",
            "Horror",
            "Adventure",
            "Young Adult",
            "Dystopian",
            "Literary Fiction",
            "Magical Realism",
            "Graphic Novels",
            "True Crime",
            "Biography",
            "Memoir",
            "Self-Help",
            "Historical Romance",
            "Science",
            "Psychology",
            "Poetry",
            "Religion & Spirituality",
            "Personal Development",
            "Business & Economics",
    ]
    for item in subject_list:
            for genre in book_genres:
                if genre == item:
                    return genre
    return 'N/A'

def get_description(work_id):
    """ gets a book description /synopsis
    from the Open Library Works API"""
    res = requests.get(f"https://openlibrary.org{work_id}.json")
    if res.status_code == 200:
        book_description = res.json().get('description').get('value', 'N/A')
    return book_description
