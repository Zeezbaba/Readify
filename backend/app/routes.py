from backend.app import flask_app, db
from flask import render_template, redirect, url_for, abort
from flask import Flask, request, jsonify, send_from_directory
from backend.app.extensions import UserLogin
from flask_login import current_user, login_user
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import sqlalchemy as sa
# from backend.app import db
from backend.app.models import User, Book, Shelf, UserBook
from flask_login import logout_user
from flask_login import login_required
from urllib.parse import urlsplit
from backend.app.extensions import RegisterUser
from backend.app.utils import search_book_by_title
from flask_cors import CORS
import os
# import requests

CORS(flask_app)


# Serve the React app
@flask_app.route('/')
def serve():
    return send_from_directory(flask_app.static_folder, 'index.html')


@flask_app.route('/<path:path>')
def static_proxy(path):
    """This route allows React Router to handle client-side routing
    """
    return send_from_directory(flask_app.static_folder, path)


# @flask_app.route('/')
@flask_app.route('/home', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def homePage():
    """Display the user's home page with their name or email and recent books."""
    # print(f"User {current_user.username} is requesting the home page")
    # user = current_user  # Get the current authenticated user
    current_user_id = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.id == current_user_id))
    
    # if not user:
    #     return jsonify({'error': 'User not found'}), 404

    user_info = {
        "username": user.username,
        "email": user.email
    }

    # Get the last three books added by the user
    user_books = db.session.execute(
        sa.select(Book)
        .join(UserBook)
        .where(UserBook.user_id == user.id)
        .order_by(UserBook.id.desc())  # Sort by the most recent
        .limit(3)
    ).all()

    if user_books:
        books = [{
            "title": book.title,
            "author": book.author,
            "cover_image": book.cover_image
        } for book, user_book in user_books]
    else:
        books = []

    response = {
        "user": user_info,
        "books": books,
        "books_count": len(books)
    }
    return jsonify(response)

#[x]: Tested
# @flask_app.route('/api/login', methods=['POST'], strict_slashes=False)
# def login():
#     if current_user.is_authenticated:
#         return jsonify({ 'message': 'Already logged in' }), 200

#     # get json input from frontend form
#     form_data = request.get_json()
#     print(form_data)
#     if form_data:
#         # check if user exists then verify password
#         username = form_data.get("username")
#         password = form_data.get("password")
#         remember_me =form_data.get("remember me")

#         user = db.session.scalar(
#             sa.select(User).where(User.username == username))
#         if user is None or not user.check_password(password):
#             return jsonify({ 'error': 'Invalid username or password'}), 401

#         login_user(user, remember=remember_me)
#         return jsonify({ 'message': 'Login successful'})
#     return jsonify({ 'error': 'Invalid form submission' }), 400

# @login.user_loader
# def load_user(user_id):
#     return User.query.get(int(user_id))


@flask_app.route('/login', methods=['POST'], strict_slashes=False)
# @jwt_required()
def login():
    # user_id = get_jwt_identity()
    # if user_id:
    #     return jsonify({ 'message': 'Already logged in' }), 200

    # get json input from frontend form
    form_data = request.get_json()
    print("Received form data:", form_data)  # Debug print
    
    if not form_data:
        return jsonify({'error': 'Invalid form submission'}), 400

    username = form_data.get("username")
    password = form_data.get("password")

    user = db.session.scalar(sa.select(User).where(User.email == username))
        # user = User.query.filter_by(username=request.form['username']).first()
    if user is None:
        print("User not found")  # Debug print
        return jsonify({ 'error': 'Invalid username or password'}), 401

    if not user.check_password(password):
        print("Password check failed")  # Debug print
        return jsonify({'error': 'Invalid username or password'}), 401

        
    return jsonify({'message': 'Login successful', 'access_token': create_access_token(user.id)})
    
    

#[x]: Tested
@flask_app.route('/register', methods=['POST'], strict_slashes=False)
# @jwt_required()
def register():
    """API endpoint for new user registration
    """
    # user_id = get_jwt_identity()
    # if user_id:
    #     return jsonify({ 'message': 'Already logged in' }), 200
    
    # get json input from frontend form
    form = request.get_json()
    if form:
        username = form.get('username')
        email = form.get('email')
        password = form.get('password')
        security_question = form.get('security question')
        security_answer = form.get('security answer')

        # validate input
        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        if db.session.scalar(sa.select(User).where(User.username == username)):
            return jsonify({ 'error': 'User already exists!' }), 409
        
        # create user and set password
        user = User(username=username, email=email, security_question=security_question, security_answer=security_answer)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({ 'message': 'Registration Successful!'}), 201
    
    return jsonify({ 'error': 'No input provided' }), 400


@flask_app.route('/user/forgot-password', methods=['POST'])
def forgot_password():
    """Initiates the password recovery process
    """
    data = request.json
    username = data.get('username')

    # Fetch the user by username
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if not user:
        return jsonify({ 'error': 'User not found' }), 404
    
    # Provide the security question for the user
    return jsonify({ 'question': user.security_question}), 200

#[x]: Tested 
@flask_app.route('/user/<username>', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def user(username):
    """User's dashboard
    """
    user_identity = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user is None or user.username != user_identity:
        # flash('User not found')
        # return redirect(url_for('homePage'))
        abort(404, description="User not found")

    # get the user's shelves
    # shelves = [ shelf.to_dict() for shelf in current_user.shelves]
    shelves = [{'id': shelf.id, 'name': shelf.name} for shelf in user.shelves]

    # Get the user's books
    page = request.args.get('page', 1, type=int)
    per_page = 10 # Number of books per page

    user_books = db.session.scalars(
        sa.select(UserBook)
        .join(Book)
        .where(UserBook.user_id == user.id)
        .limit(per_page)
        .offset((page - 1) * per_page)
    ).all()

    # Fetch the books associated with the user's books
    # books = [user_books.book for user_book in user_books]
    # books = []
    # for user_book in user_books:
    book = [{
            'title': user_book.book.title,
            'author': user_book.book.author,
            'genre': user_book.book.genre,
            'publication_date': user_book.book.publication_date,
            'cover_image': user_book.book.cover_image
        } for user_book in user_books]
    
    # return render_template('user.html', user=user, shelves=shelves, books=books, page=page)
    return jsonify({ 'user': user.username, 'shelves': shelves, 'books': books, 'page': page})

@flask_app.route('/user/update-security-question', methods=['POST'])
# @login_required
@jwt_required()
def update_security_question():
    """API endpoint for user to update security question
    that will be required for password recovery
    """
    data = request.json
    user_identity = get_jwt_identity()

    user = db.session.scalar(sa.select(User).where(User.username == user_identity))

    user.security_question = data['question']
    user.security_answer = generate_password_hash(data['answer'])

    db.session.commit()
    return jsonify({ 'message': 'Security question updated successfully' }), 200

@flask_app.route('/user/security-question/<username>', methods=['GET'])
def get_security_question(username):
    """Gets the user security question
    """
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if not user:
        return jsonify({ 'error': 'User not found' }), 404

    return jsonify({ 'question': user.security_question })


@flask_app.route('/user/recover-password', methods=['POST'])
def recover_password():
    """password recovery
    """
    data = request.json
    user = db.session.scalar(sa.select(User).where(User.username == data['username']))
    if not user:
        return jsonify({ 'error': 'User not found' }), 404
    
    if not user.check_security_answer(data['answer']):
        return jsonify({ 'error': 'Security answer does not match' }), 401
    
    user.set_password(data['newPassword'])
    db.session.commit()

    return jsonify({ 'message': 'Password reset successfully' }), 200

#[x] Tested
@flask_app.route('/user/shelves', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def get_user_shelves():
    """API endpoint to retrieves shelves of a current user
    """
    user_identity = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.username == user_identity))
    # shelves = db.session.scalars(
    #     sa.select(Shelf).where(Shelf.user_id == current_user.id)
    # ).all()

    shelf_list = [{'id': shelf.id, 'name': shelf.name} for shelf in shelves]
    return jsonify({ 'shelves': shelf_list }), 200

#[x]: Tested
@flask_app.route('/shelves/create', methods=['POST'], strict_slashes=False)
# @login_required
@jwt_required()
def create_shelf():
    """API endpoint to create a new shelf for the user
    """
    data = request.json
    shelf_name = data.get('name')
    user_identity = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.username == user_identity))

    # validate shelf name
    if not shelf_name:
        return jsonify({ 'error': 'Shelf name is required' }), 400

    # check if a shelf name already exists for the user
    existing_shelf = db.session.scalar(
        sa.select(Shelf).where(Shelf.user_id == user.id, Shelf.name == shelf_name))

    if existing_shelf:
        return jsonify({ 'error': 'Shelf with this name already exists' })

    # create a new shelf
    new_shelf = Shelf(name=shelf_name, user_id=user.id)
    db.session.add(new_shelf)
    db.session.commit()

    return jsonify({ 'message': 'Shelf created successfully', 'shelf_id': new_shelf.id }), 201

#[x]: Tested
@flask_app.route('/books/search', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def search_books():
    """API endpoint for book search
    """
    # books = []
    # if request.method == 'POST':
    search_term = request.json.get('search term', '')
    # search_term = request.args.get('q', '')
    # print(search_term)

    query = {}
    if search_term:
        if 'by' in search_term.lower():
            title, author = map(str.strip, search_term.lower().split(' by ', 1))
            query['title'] = title
            query['author'] = author
        else:
            query['general'] = search_term
    print("Query Dictionary in route.py:", query)
    books = search_book_by_title(query)
    return jsonify(books)

#[x]: Tested
@flask_app.route('/books/add-book', methods=['POST'], strict_slashes=False)
@login_required
def add_book():
    """API endpoint for users to add books
    into their shelve
    """
    # if request.method == 'POST':
    data = request.json
    user_identity = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.username == user_identity))

    title = data.get('title')
    author = data.get('author')
    genre = data.get('genre')
    isbn = data.get('isbn')
    publication_date = data.get('publication_date')
    cover_image = data.get('cover_image')
    description = data.get('description')
    shelf_id = data.get('shelf_id')

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
    user_book = UserBook(user_id=user.id, book_id=book.id, shelf_id=shelf_id)
    db.session.add(user_book)
    db.session.commit()

    # flash('Book added successfully!')
    # return redirect(url_for('user', username=current_user.username))
    # return render_template('add_book.html', title='Add Book')
    return jsonify({ 'message': 'Book added successfully!' })


@flask_app.route('/books/edit/<int:book_id>', methods=['PUT'], strict_slashes=False)
# @login_required
@jwt_required()
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
    book.title = data.get('title')
    book.author = data.get('author')
    book.genre = data.get('genre')
    book.isbn = data.get('isbn')
    book.publication_date = data.get('publication_date')
    book.cover_image = data.get('cover_image')
    book.description = data.get('description')

    db.session.commit()
    # flash('Book updated successfully!')
    # return redirect(url_for('user', username=current_user.username))
    # return render_template('edit_book.html', title='Edit Book', book=book)
    return jsonify({ 'message': 'Book updated successfully!'})


@flask_app.route('/books/delete/<int:book_id>', methods=['DELETE'], strict_slashes=False)
# @login_required
@jwt_required()
def delete_book(book_id):
    """API endpoint to delete a book from the user's collection.
    """
    user_identity = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.username == user_identity))
    user_book = db.session.scalar(
        sa.select(UserBook).where(UserBook.user_id == user.id, UserBook.book_id == book_id)
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

@flask_app.route('/books/view/<int:book_id>', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def view_single_book(book_id):
    """API endpoint for to view a  book on a single page"""
    user_identity = get_jwt_identity()
    user = db.session.scalar(sa.select(User).where(User.username == user_identity))     
    user_book, book = db.session.scalar(
        sa.select(UserBook, Book)
        .join(Book, UserBook.book_id == Book.id)
        .where(UserBook.user_id == user.id)
    )

    if user_book and book:
        # create json payload for display
        book_view = {
            "user_id": user_book.user_id,
            "title": book.title,
            "shelf": user_book.shelf_id, 
            "author": book.author, 
            "publication date": book.publication_date, 
            "genre": book.genre, 
            "isbn": book.isbn, 
            "cover image": book.cover_image, 
            "description": book.description, 
        }
        return jsonify(book_view)
    else:
        return jsonify({ 'error': 'Book not found' }), 404
    

@flask_app.route('/books/genre/<genre>', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def books_by_genre(genre):
    """Displays books by genre
    """
    user_id = get_jwt_identity()
    books = user_id.get_book_by_genre(genre)
    return jsonify({ 'genre': genre, 'books': books})
    # return render_template('books_by_genre.html', genre=genre, books=books)


@flask_app.route('/books/recent', methods=['GET'], strict_slashes=False)
# @login_required
@jwt_required()
def recent_books():
    """Displays the most recent books added to the system."""
    recent_books = Book.get_recent_books(limit=3)  # Fetch last 3 books in the system

    books_data = [{
        "title": book.title,
        "author": book.author,
        "cover_image": book.cover_image
    } for book in recent_books]

    return jsonify({
        "books": books_data,
        "books_count": len(books_data)
    })


@flask_app.route('/logout', methods=['POST'], strict_slashes=False)
def logout():
    # logout_user()
    #return redirect (url_for('homePage'))
    return jsonify({ 'message': 'Logged out successfully'})