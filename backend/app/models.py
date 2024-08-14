#!/usr/bin/python3
""" Defines all the models/tables  in the book tracker database"""
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
# from sqlalchemy import Column, String, Integer, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app import login
from backend.app import db
from typing import Optional
from datetime import date



class User(UserMixin, db.Model):
    """Stores user information. Each entry is a user
    Attributes:
            id (int): The unique identifier for each user.
            username (str): Unique username, chosen by the user.
            email (str): Unique user email.
            password_hash (str): User account password, hashed
            shelves (list[]): A User's shelves
            books (list[UserBook]): All of a user's saved books
    """
    __allow_unmapped__ = True  # Allow legacy annotations
    id: db.Mapped[int] = db.Column(db.Integer, primary_key=True)
    username: db.Mapped[str] = db.Column(db.String(64), index=True, unique=True)
    email: str = db.Column(db.String(120), index=True, unique=True)
    password_hash: str = db.Column(db.String(256), nullable=True)

    shelves: db.Mapped[list['Shelf']] = db.relationship('Shelf', backref='user', lazy=True)
    books: list['UserBook'] = db.relationship('UserBook', backref='user', lazy=True)

    def __repr__(self):
        """ String representaion of User instance
        """
        return '<User: {}>'.format(self.username)

    def set_password(self, password: str) -> None:
        """Generates a hashed password and stores it in the `password_hash` attribute.

        Args:
            password (str): The plaintext password to be hashed and stored.
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password:str) -> bool:
        """ Checks if password provided at login matches the stored hashed password.

        Returns:
                bool: True if passsword matches, else False
        """
        return check_password_hash(self.password_hash, password)

    def get_book_by_genre(self, genre):
        """Retrieve all books belonging to
        a specified genre
        """
        return db.session.scalars(
            sa.select(Book)
            .join(UserBook)
            .where(UserBook.user_id == self.id)
            .where(Book.genre.ilike(f"%{genre}%"))
        ).all()

class Shelf(UserMixin, db.Model):
    """ Representation of a user's shelf
    Attributes:
            id (int): Unique identifier for the shelf
            name (str): Name of the shelf
            user_id (int): Unique id of the user the shelf belongs to 
    """
    __allow_unmapped__ = True  # Allow legacy annotations
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id', name='fk_shelf_user_id'))

    def __repr__(self):
        """ String representaion of User instance
        """
        return '<{} Shelf>'.format(self.name)

        #TODO: Add relevant functions (add shelf etc)

class Book(UserMixin, db.Model):
    """ A book in the application
    Attributes:
            id (int): Unique id of book
            title (str): Name of  book
            author (str): Name of book's author
            genre (str): The genre the book belongs to
            publication_date (date): Initial date the book was published
            isbn (str): ISBN of the book. Unique
            cover_image (str): URL of book's cover image
            description (str): Description / synopsis of the book
            users (lis[UserBook]): relationship list of all users that have this book
    """
    __allow_unmapped__ = True  # Allow legacy annotations
    id: int = db.Column(db.Integer, primary_key=True)
    title: str = db.Column(db.String(128), index=True, nullable=False)
    author: str = db.Column(db.String(128), index=True, nullable=False)
    isbn: str = db.Column(db.String(128), index=True, nullable=False)
    publication_date: Optional[date] = db.Column(db.Date, nullable=True)
    genre: str = db.Column(db.String(100), nullable=True)
    cover_image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    users = db.relationship('UserBook', backref='book', lazy=True)

    def __repr__(self):
        """ String representaion of Book instance
        """
        return '<Book: {} by {}>'.format(self.title, self.author)
    # TODO: Add relevant functions for books

    @staticmethod
    def get_recent_books(limit=10):
        """Retrieve the most recent books
        added to the database
        """
        return db.select.scalars(
            sa.select(Book)
            .order_by(Book.id.desc())
            .limit(limit)
        ).all()


class UserBook(UserMixin, db.Model):
    """table of the many-to-many relationship between users and books, 
    with an optional shelf association.

    Attributes:
        id (int): The unique identifier for the user-book relationship.
        user_id (int): The ID of the user who owns this book.
        book_id (int): The ID of the book.
        shelf_id (Optional[int]): The ID of the shelf where the book is placed, or None if not specified.
    """
    __allow_unmapped__ = True  # Allow legacy annotations
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='fk_user_book_user_id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id', name='fk_book_id'), nullable=False)
    shelf_id = db.Column(db.Integer, db.ForeignKey('shelf.id', name='fk_shelf_id'), nullable=True)  

    def __repr__(self):
        return f'<UserBook: User {self.user_id} - Book {self.book_id}>'  #TODO: repr of userbooks


@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))
