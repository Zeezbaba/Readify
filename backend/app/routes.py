from backend.app import flask_app, db
from flask import render_template, redirect, flash, url_for
from flask import Flask, request, jsonify, send_from_directory
from backend.app.extensions import UserLogin
from flask_login import current_user, login_user
import sqlalchemy as sa
# from backend.app import db
from backend.app.models import User, Book, Shelf
from flask_login import logout_user
from flask_login import login_required
from urllib.parse import urlsplit
from backend.app.extensions import RegisterUser
from backend.app.utils import search_book_by_title
# import requests

CORS(flask_app)


# Serve the React app
@flask_app.route('/')
def serve():
    return send_from_directory(flask_app.static, 'index.html')


@flask_app.route('/<path:path>')
def static_proxy():
    """This route allows React Router to handle client-side routing
    """
    return send_from_directory(flask_app.static, path)


# @flask_app.route('/')
@flask_app.route('api/home', methods=['GET'])
@login_required
def homePage():
    # codes
    # return render_template('homePage.html', title='Home')
    return jsonify({ 'message': 'Welcome to Readify'})


@flask_app.route('api/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({ 'message': 'Already logged in' }), 200
        # return redirect(url_for('homePage'))
    form = UserLogin()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.username == form.username.data))
        if user is None or not user.check_password(form.password.data):
            # flash('Invalid username or password')
            return jsonify({ 'error': 'Invalid username or password'}), 401
            # return redirect (url_for('login'))
        login_user(user, remember=form.remember_me.data)
        return jsonify({ 'message': 'Login successful'})
        next_page = request.args.get('next')
        if not next_page or urlsplit(next_page).netloc != '':
            next_page = url_for('homePage')
        # return redirect (next_page)
    return jsonify({ 'error': 'Invalid form submission' }), 400
    # return render_template('login.html', title='Sign In', form=form)
#TODO: ALL 'render_template' calls will need to be changed to 'send_from_directory' to integrate with REACT


@flask_app.route('api/register', methods=['GET', 'POST'])
def register():
    """API endpoint for new user registration
    """
    if current_user.is_authenticated:
        # return redirect(url_for('homePage'))
        return jsonify({ 'message': 'Already logged in' }), 200
    form = RegisterUser()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        return jsonify({ 'message': 'Registration Successful!'})
        # flash('Congratulations, you have joined Readify!')
        # return redirect(url_for('login'))
    return jsonify({ 'error': 'Invalid form submission' }), 400
    # return render_template('register.html', title='Register', form=form)


@flask_app.route('api/user/<username>', methods=['GET'])
@login_required
def user(username):
    """User's dashboard
    """
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user is None:
        # flash('User not found')
        # return redirect(url_for('homePage'))
        abort(404, description="User not found")

    # get the user's shelves
    shelves = user.shelves

    # Get the user's books
    page = request.args.get('page', 1, type=int)
    per_page = 10 # Number of books per page

    user_books = db.session.scalars(
        sa.select(Book.title, Book.author, Book.cover_image)
        .join(UserBook)
        .where(UserBook.user_id == user.id)
        .limit(per_page)
        .offset((page - 1) * per_page)
    ).all()

    # Fetch the books associated with the user's books
    # books = [user_books.book for user_book in user_books]
    books = []
    for user_book in user_books:
        book_details = {
            'title': user_book.book.title,
            'author': user_book.book.author,
            'genre': user_book.book.genre,
            'publication_date': user_book.book.publication_date,
            'cover_image': user_book.book.cover_image
        }
        books.append(book_details)
    
    # return render_template('user.html', user=user, shelves=shelves, books=books, page=page)
    return jsonify({ 'user': user.username, 'shelves': shelves, 'books': books, 'page': page})


@flask_app.route('/api/user/shelves', methods=['GET'])
def get_user_shelves():
    """API endpoint to retrieves shelves of a current user
    """
    shelves = current_user.shelves
    # shelves = db.session.scalars(
    #     sa.select(Shelf).where(Shelf.user_id == current_user.id)
    # ).all()

    shelf_list = [{'id': shelf.id, 'name': shelf.name} for shelf in shelves]
    return jsonify({ 'shelves': shelf_list }), 200


@flask_app.route('/api/shelves/create', methods=['POST'])
def create_shelf():
    """API endpoint to create a new shelf for the user
    """
    data = request.json
    shelf_name = data.get('name')

    # validate shelf name
    if not shelf_name:
        return jsonify({ 'error': 'Shelf name is required' }), 400

    # check if a shelf name already exists for the user
    existing_shelf = db.session.scalar(
        sa.select(Shelf).where(Shelf.user_id == current_user.id, Shelf.name == shelf_name))

    if existing_shelf:
        return jsonify({ 'error': 'Shelf with this name already exists' })

    # create a new shelf
    new_shelf = Shelf(name=shelf_name, user_id=current_user.id)
    db.session.add(new_shelf)
    db.session.commit()

    return jsonify({ 'message': 'Shelf created successfully', 'shelf_id': new_shelf.id }), 201


@flask_app.route('api/books/search', methods=['GET', 'POST'])
@login_required
def search_books():
    """API endpoint for book search
    """
    # books = []
    # if request.method == 'POST':
    search_term = request.json.get('search_term', '')
    # print(search_term)

    query = {}
    if search_term:
        if ' by ' in search_term.lower():
            title, author = map(str.strip, search_term.lower().split(' by ', 1))
            query['title'] = title
            query['author'] = author
        else:
            query['general'] = search_term
    # print("Query Dictionary in route:", query)
    books = search_book_by_title(query)
    return jsonify(books)


@flask_app.route('api/books/add-book', methods=['POST'])
@login_required
def add_book():
    """API endpoint for users to add books
    into their collections
    """
    # if request.method == 'POST':
    data = request.json
    title = request.form.get('title')
    author = request.form.get('author')
    genre = request.form.get('genre')
    isbn = request.form.get('isbn')
    publication_date = request.form.get('publication_date')
    cover_image = request.form.get('cover_image')
    description = request.form.get('description')

    # validate inputs
    if not title or not author:
        # flash('Title and Author are required!')
        return jsonify({ 'error': 'Title and Author are required!' }), 400

    # check if book already exists
    book = db.session.scalar(sa.select(Book).where(Book.isbn == isbn))

    if not book:
        # if book doesnt exist, create it
        book = Book(
            title=title,
            author=author,
            genre=genre,
            isbn=isbn,
            publication_date=publication_date,
            cover_image=cover_image,
            description=description
        )

        db.session.add(book)
        db.session.commit()

    # add the book to user selected shelf
    user_book = UserBook(user_id=current_user.id, book_id=book.id, shelf_id=shelf_id)
    db.session.add(user_book)
    db.session.commit()

    # flash('Book added successfully!')
    # return redirect(url_for('user', username=current_user.username))
    # return render_template('add_book.html', title='Add Book')
    return jsonify({ 'message': 'Book added successfully!' })


@flask_app.route('api/books/edit/<int:book_id>', methods=['PUT'])
@login_required
def edit_book(book_id):
    """API endpoint for updating book details in a user's collection.
    """
    book = db.session.get(Book, book_id)
    if not book:
        # flash('Book not found!')
        # return redirect(url_for('user', username=current_user.username))
        abort(404, description="Book not found")

    # if request.method == 'POST':
    data = request.json
    book.title = request.form.get('title')
    book.author = request.form.get('author')
    book.genre = request.form.get('genre')
    book.isbn = request.form.get('isbn')
    book.publication_date = request.form.get('publication_date')
    book.cover_image = request.form.get('cover_image')
    book.description = request.form.get('description')

    db.session.commit()
    # flash('Book updated successfully!')
    # return redirect(url_for('user', username=current_user.username))
    # return render_template('edit_book.html', title='Edit Book', book=book)
    return jsonify({ 'message': 'Book updated successfully!'})


@flask_app.route('api/books/delete/<int:book_id>', methods=['DELETE'])
@login_required
def delete_book(book_id):
    """API endpoint to delete a book from the user's collection.
    """
    user_book = db.session.scalar(
        sa.select(UserBook).where(UserBook.user_id == current_user.id, UserBook.book_id == book_id)
    )

    if user_book:
        db.session.delete(user_book)
        db.session.commit()
        # flash('Book deleted successfully')
        return jsonify({ 'message': 'Book deleted successfully'})
    else:
        return jsonify({ 'error': 'Book not found!'}), 404
        # flash('Book not found!')
        # return redirect(url_for('user', username=current_user.username))


@flask_app.route('api/books/genre/<genre>', methods=['GET'])
@login_required
def books_by_genre(genre):
    """Displays books by genre
    """
    books = current_user.get_book_by_genre(genre)
    return jsonify({ 'genre': genre, 'books': books})
    # return render_template('books_by_genre.html', genre=genre, books=books)


@flask_app.route('api/books/recent', methods=['GET'])
@login_required
def recent_books():
    """Displays most recent books added to the database
    """
    recent_books = Book.get_recent_books()
    return jsonify({ 'books': recent_books})
    # return render_template('recent_books.html', books=recent_books)


@flask_app.route('api/logout', methods=['POST'])
def logout():
    logout_user()
    #return redirect (url_for('homePage'))
    return jsonify({ 'message': 'Logged out successfully'})