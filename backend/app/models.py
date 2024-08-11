#!/usr/bin/python3
"""" Defines all the models/tables  in the book tracker database""""
from flask_sqlalchemy import flask_sqlalchemy
from flask_login import UserMixin
from sqlalchemy import Column, String, Integer, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app import login
from backend.app import db



# User class
class Users(Base):
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
    id: int = Column(Integer, primary_key=true)
    username: str = Column(String(50), nullable=False, unique=True)
    email: str = Column(String(120), nullable=False, unique=True)
    password_hash: str = Column(String(128), nullable=False, unique=True)

    shelves: list['Shelf'] = db 


class Shelf(Base):
from typing import Optional


class User(UserMixin, db.Model):
    id = so.mapped_column(sa.Integer, primary_key=True)
    username = so.mapped_column(sa.String(64), index=True, unique=True)
    email = so.mapped_column(sa.String(120), index=True, unique=True)
    password_hash = so.mapped_column(sa.String(256), nullable=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))