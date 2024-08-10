from backend.app import flask_app
from flask import render_template, redirect, flash, url_for
from flask import request
from backend.app.extensions import UserLogin
from flask_login import current_user, login_user
import sqlalchemy as sa
from backend.app import db
from backend.app.models import User
from flask_login import logout_user
from flask_login import login_required
from urllib.parse import urlsplit


@flask_app.route('/')
@flask_app.route('/home')
@login_required
def homePage():
    # codes
    return render_template('homePage.html', title='Home')


@flask_app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('/home'))
    form = UserLogin()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.username == form.username.data))
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect (url_for('/login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request,args.get('next')
        if not next_page or urlsplit(next_page).netloc != '':
            next_page = url_for('/home')
        return redirect (next_page)
    return render_template('login.html', title='Sign In', form=form)


@flask_app.route('/logout')
def logout():
    logout_user()
    return redirect (url_for('/home'))