import sqlalchemy as sa
import sqlalchemy.orm as so
from backend.app import db
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional
from flask_login import UserMixin
from backend.app import login


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