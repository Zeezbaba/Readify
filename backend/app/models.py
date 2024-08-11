#!/usr/bin/python3
"""" Defines all the models/tables  in the book tracker database""""
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
# from sqlalchemy import Column, String, Integer, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app import login
from backend.app import db
# from typing import Optional



# User class
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
    __tablename__ = 'user'
    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(64), index=True, unique=True)
    email: str = db.Column(db.String(120), index=True, unique=True)
    password_hash: str = db.Column(db.String(256), nullable=True)

    shelves: list['Shelf'] = db.relationship('Shelf', backref='user', lazy=True)
    books: list['UserBook'] = db.relationship('UserBook', backref='user', lazy=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Shelf(Base):



@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))
