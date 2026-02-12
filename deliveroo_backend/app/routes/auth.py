from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, create_refresh_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration route.
    Requires username, email, and password.
    """
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing username, email, or password'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409 # 409 Conflict

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409

    # Create a new user and hash the password
    new_user = User(username=username, email=email)
    new_user.set_password(password)

    # Add to database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # --- START OF DEBUGGING LINES ---
    print("--- LOGIN ATTEMPT ---", flush=True)
    print(f"INCOMING PAYLOAD: {data}", flush=True)
    # --- END OF DEBUGGING LINES ---

    if not data or not data.get('email') or not data.get('password'):
        print("DEBUG: Payload was missing email or password.", flush=True)
        return jsonify({'message': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data.get('email')).first()
    
    # --- MORE DEBUGGING ---
    print(f"DEBUG: User found in database for email '{data.get('email')}': {user}", flush=True)
    # --- END OF DEBUGGING ---

    if user and user.check_password(data.get('password')):
        print("DEBUG: Password check successful.", flush=True)
        additional_claims = {"is_admin": user.is_admin}
        access_token = create_access_token(
            identity=str(user.id), additional_claims=additional_claims
        )
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    print("DEBUG: Password check FAILED or user was not found.", flush=True)
    return jsonify({'message': 'Invalid credentials'}), 401