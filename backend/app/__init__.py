from flask import Flask
from backend.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate


flask_app = Flask(__name__)
flask_app.config.from_object(Config)

db = SQLAlchemy(flask_app)
login = LoginManager(flask_app)
login.login_view = 'login'
migrate = Migrate(flask_app, db)

from . import routes