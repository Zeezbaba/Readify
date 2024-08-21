from flask import Flask
from backend.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
import os


flask_app = Flask(__name__, static_folder='static', static_url_path='/static')
flask_app.config.from_object(Config)
CORS(flask_app)

db = SQLAlchemy(flask_app)
login = LoginManager(flask_app)
login.login_view = 'login'
migrate = Migrate(flask_app, db)

from . import routes