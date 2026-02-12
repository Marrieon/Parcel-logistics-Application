import os
from flask import Flask, send_from_directory # 1. Import send_from_directory
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    UPLOAD_FOLDER = os.path.join(app.root_path, '..', 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    # 2. Correctly define the route to serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    with app.app_context():
        from .routes import auth, parcels, admin
        app.register_blueprint(auth.auth_bp, url_prefix='/api/auth')
        app.register_blueprint(parcels.parcels_bp, url_prefix='/api')
        app.register_blueprint(admin.admin_bp, url_prefix='/admin')

        return app
