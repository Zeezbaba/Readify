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
            return redirect (url_for('/login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or urlsplit(next_page).netloc != '':
            next_page = url_for('homePage')
        return redirect (next_page)
    return render_template('login.html', title='Sign In', form=form)


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
        return redirect(url_for(homePage))

    # get the user's shelves
    shelves = user.shelves

    # Get the user's books
    user_books = db.session.scalars(
        sa.select(UserBook).where(UserBook.user_id == user.id)).all()

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
    
    return render_template('user.html', user=user, shelves=shelves, books=books)


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