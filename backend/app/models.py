#!/usr/bin/python3
"""" Defines all the models/tables  in the book tracker database""""
from flask_sqlalchemy import flask_sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, ForeignKey


Base = declarative_base


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
