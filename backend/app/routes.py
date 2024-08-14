from backend.app import flask_app, db
from flask import render_template, redirect, flash, url_for
from flask import request
from backend.app.extensions import UserLogin
from flask_login import current_user, login_user
import sqlalchemy as sa
# from backend.app import db
from backend.app.models import User, Book
from flask_login import logout_user
from flask_login import login_required
from urllib.parse import urlsplit
from backend.app.extensions import RegisterUser
from backend.app.utils import search_book_by_title
# import requests


@flask_app.route('/')
@flask_app.route('/home')
@login_required
def homePage():
    # codes
    return render_template('homePage.html', title='Home')


@flask_app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('homePage'))
    form = UserLogin()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.username == form.username.data))
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect (url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or urlsplit(next_page).netloc != '':
            next_page = url_for('homePage')
        return redirect (next_page)
    return render_template('login.html', title='Sign In', form=form)
#TODO: ALL 'render_template' calls will need to be changed to 'send_from_directory' to integrate with REACT


@flask_app.route('/register', methods=['GET', 'POST'])
def register():
    """view function for new user registration
    """
    if current_user.is_authenticated:
        return redirect(url_for('homePage'))
    form = RegisterUser()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you have joined Readify!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@flask_app.route('/user/<username>')
@login_required
def user(username):
    """User's dashboard
    """
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user is None:
        flash('User not found')
        return redirect(url_for('homePage'))

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
    
    return render_template('user.html', user=user, shelves=shelves, books=books, page=page)


@flask_app.route('/books/search', methods=['GET', 'POST'])
@login_required
def search_books():
    """view function for book search
    """
    books = []
    if request.method == 'POST':
        search_term = request.form.get('search_term')
        print(search_term)

        query = {}
        if search_term:
            if ' by ' in search_term.lower():
                title, author = map(str.strip, search_term.lower().split(' by ', 1))
                query['title'] = title
                query['author'] = author
            else:
                query['general'] = search_term
        print("Query Dictionary in route:", query)
        books = search_book_by_title(query)

    return render_template('search_books.html', title='Search books', books=books)


@flask_app.route('/books/add-book', methods=['GET', 'POST'])
@login_required
def add_book():
    """view function for users to add books
    into their collections
    """
    if request.method == 'POST':
        title = request.form.get('title')
        author = request.form.get('author')
        genre = request.form.get('genre')
        isbn = request.form.get('isbn')
        publication_date = request.form.get('publication_date')
        cover_image = request.form.get('cover_image')
        description = request.form.get('description')

        # validate inputs
        if not title or not author:
            flash('Title and Author are required!')
            return redirect(url_for('add_book'))

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

        user_book = UserBook(user_id=current_user.id, book_id=book.id)
        db.session.add(user_book)
        db.session.commit()

        flash('Book added successfully!')
        return redirect(url_for('user', username=current_user.username))
    return render_template('add_book.html', title='Add Book')


@flask_app.route('/books/edit/<int:book_id>', methods=['GET', 'POST'])
@login_required
def edit_book(book_id):
    """route for updating book details in a user's collection.
    """
    book = db.session.get(Book, book_id)
    if not book:
        flash('Book not found!')
        return redirect(url_for('user', username=current_user.username))

    if request.method == 'POST':
        book.title = request.form.get('title')
        book.author = request.form.get('author')
        book.genre = request.form.get('genre')
        book.isbn = request.form.get('isbn')
        book.publication_date = request.form.get('publication_date')
        book.cover_image = request.form.get('cover_image')
        book.description = request.form.get('description')

        db.session.commit()
        flash('Book updated successfully!')
        return redirect(url_for('user', username=current_user.username))
    return render_template('edit_book.html', title='Edit Book', book=book)


@flask_app.route('/books/delete/<int:book_id>', methods=['POST'])
@login_required
def delete_book(book_id):
    """route to delete a book from the user's collection.
    """
    user_book = db.session.scalar(
        sa.select(UserBook).where(UserBook.user_id == current_user.id, UserBook.book_id == book_id)
    )

    if user_book:
        db.session.delete(user_book)
        db.session.commit()
        flash('Book deleted successfully')
    else:
        flash('Book not found!')
    return redirect(url_for('user', username=current_user.username))


@flask_app.route('/books/genre/<genre>', methods=['GET'])
@login_required
def books_by_genre(genre):
    """Displays books by genre
    """
    books = current_user.get_book_by_genre(genre)
    return render_template('books_by_genre.html', genre=genre, books=books)


@flask_app.route('/books/recent', methods=['GET'])
@login_required
def recent_books():
    """Displays most recent books added to the database
    """
    recent_books = Book.get_recent_books()
    return render_template('recent_books.html', books=recent_books)


@flask_app.route('/logout')
def logout():
    logout_user()
    return redirect (url_for('homePage'))