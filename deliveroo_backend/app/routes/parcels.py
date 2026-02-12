from flask import Blueprint, request, jsonify, current_app, Response, stream_with_context
import requests
import os
import stripe
import time
import json
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.parcel import Parcel
from app.models.user import User
from app import db
from app.utils.helpers import send_email, get_full_image_url

parcels_bp = Blueprint('parcels', __name__)
@parcels_bp.route('/parcels', methods=['POST'])
@jwt_required()
def create_parcel():
    """
    Handles creation of a new parcel order, including a file upload.
    Expects multipart/form-data.
    """
    current_user_id = int(get_jwt_identity())
    
    if 'parcel_image' not in request.files:
        return jsonify({'message': 'Parcel image file is required'}), 400
    
    file = request.files['parcel_image']
    if file.filename == '':
        return jsonify({'message': 'No selected file for parcel image'}), 400

    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    data = request.form
    required_fields = [
        'recipient_name', 'pickup_location', 'destination', 'weight', 
        'sender_phone', 'recipient_phone', 'estimated_cost', 'shipping_cost'
    ]
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields in form data'}), 400

    try:
        weight = float(data.get('weight'))
        estimated_cost = float(data.get('estimated_cost')) # This is the "insured value"
        shipping_cost = float(data.get('shipping_cost')) # This is the quoted cost from the frontend
    except (ValueError, TypeError):
        return jsonify({'message': 'Weight, insured value, and shipping cost must be valid numbers.'}), 400

    new_parcel = Parcel(
        user_id=current_user_id,
        recipient_name=data.get('recipient_name'),
        pickup_location=data.get('pickup_location'),
        destination=data.get('destination'),
        weight=weight,
        sender_phone=data.get('sender_phone'),
        recipient_phone=data.get('recipient_phone'),
        estimated_cost=estimated_cost,   # Insured Value
        shipping_cost=shipping_cost,     # Calculated Quote
        parcel_image_url=filename
    )

    db.session.add(new_parcel)
    db.session.commit()

    return jsonify({'message': 'Parcel order created successfully', 'parcel_id': new_parcel.id}), 201

def get_full_image_url(filename):
    """Helper to construct the full URL for an image."""
    if not filename:
        return None
   
   
    return f"/uploads/{filename}"


def geocode_location(location, api_key):
    if not location:
        return None
    try:
        geocode_url = f"https://api.geoapify.com/v1/geocode/search?text={location}&apiKey={api_key}"
        response = requests.get(geocode_url, timeout=8)
        response.raise_for_status()
        data = response.json()
        coords = data['features'][0]['geometry']['coordinates']
        return {"lon": coords[0], "lat": coords[1]}
    except (requests.exceptions.RequestException, KeyError, IndexError):
        return None


def route_details_from_coords(origin, destination, api_key):
    if not origin or not destination:
        return None
    try:
        routing_url = (
            f"https://api.geoapify.com/v1/routing"
            f"?waypoints={origin['lat']},{origin['lon']}|{destination['lat']},{destination['lon']}"
            f"&mode=drive&apiKey={api_key}"
        )
        response = requests.get(routing_url, timeout=8)
        response.raise_for_status()
        data = response.json()
        details = data['features'][0]['properties']
        return {
            "distance_km": round(details['distance'] / 1000, 2),
            "eta_minutes": max(1, int(details['time'] / 60)),
        }
    except (requests.exceptions.RequestException, KeyError, IndexError):
        return None


@parcels_bp.route('/parcels', methods=['GET'])
@jwt_required()
def get_user_parcels():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    parcels = user.parcels

    output = []
    for parcel in parcels:
        parcel_data = {
            'id': parcel.id,
            'recipient_name': parcel.recipient_name,
            'pickup_location': parcel.pickup_location,
            'destination': parcel.destination,
            'weight': parcel.weight,
            'status': parcel.status,
            'present_location': parcel.present_location,
            'created_at': parcel.created_at.isoformat(),
            'sender_phone': parcel.sender_phone,
            'recipient_phone': parcel.recipient_phone,
            'estimated_cost': parcel.estimated_cost,
            'shipping_cost': parcel.shipping_cost,
            'parcel_image_url': get_full_image_url(parcel.parcel_image_url),
            'proof_of_delivery_image_url': get_full_image_url(parcel.proof_of_delivery_image_url)
        }
        output.append(parcel_data)

    return jsonify({'parcels': output}), 200


@parcels_bp.route('/parcels/<int:parcel_id>', methods=['GET'])
@jwt_required()
def get_parcel_details(parcel_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    parcel = Parcel.query.get(parcel_id)

    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    if parcel.user_id != current_user_id and not user.is_admin:
        return jsonify({'message': 'Access forbidden: You do not own this parcel'}), 403

    parcel_data = {
        'id': parcel.id,
        'recipient_name': parcel.recipient_name,
        'pickup_location': parcel.pickup_location,
        'destination': parcel.destination,
        'weight': parcel.weight,
        'status': parcel.status,
        'present_location': parcel.present_location,
        'created_at': parcel.created_at.isoformat(),
        'sender_phone': parcel.sender_phone,
        'recipient_phone': parcel.recipient_phone,
        'estimated_cost': parcel.estimated_cost,
        'shipping_cost': parcel.shipping_cost,
        'parcel_image_url': get_full_image_url(parcel.parcel_image_url),
        'proof_of_delivery_image_url': get_full_image_url(parcel.proof_of_delivery_image_url)
    }
    return jsonify(parcel_data), 200


@parcels_bp.route('/parcels/<int:parcel_id>/destination', methods=['PATCH'])
@jwt_required()
def change_parcel_destination(parcel_id):
    current_user_id = int(get_jwt_identity())
    parcel = Parcel.query.get(parcel_id)

    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    if parcel.user_id != current_user_id:
        return jsonify({'message': 'Access forbidden: You do not own this parcel'}), 403
    
    if parcel.status == 'Delivered':
        return jsonify({'message': 'Cannot change destination of a delivered parcel'}), 400

    data = request.get_json()
    if not data or 'destination' not in data:
        return jsonify({'message': 'New destination is required'}), 400
    
    parcel.destination = data['destination']
    db.session.commit()

    return jsonify({'message': 'Parcel destination updated successfully'}), 200

@parcels_bp.route('/parcels/<int:parcel_id>/cancel', methods=['PATCH'])
@jwt_required()
def cancel_parcel_order(parcel_id):
    current_user_id = int(get_jwt_identity())
    parcel = Parcel.query.get(parcel_id)

    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    if parcel.user_id != current_user_id:
        return jsonify({'message': 'Access forbidden: You do not own this parcel'}), 403
    
    if parcel.status == 'Delivered':
        return jsonify({'message': 'Cannot cancel a delivered parcel'}), 400
    
    parcel.status = 'Cancelled'
    db.session.commit()

    return jsonify({'message': 'Parcel order has been cancelled'}), 200

@parcels_bp.route('/parcels/<int:parcel_id>/route', methods=['GET'])
@jwt_required()
def get_parcel_route_details(parcel_id):
    """
    Gets route details (distance, duration) for a parcel from Geoapify.
    Protected route.
    """
    current_user_id = int(get_jwt_identity())
    
    # We need to query the user to check if they are an admin
    user = User.query.get(current_user_id)
    parcel = Parcel.query.get(parcel_id)

    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    # Security check: Allow access only if the user owns the parcel OR is an admin
    if parcel.user_id != current_user_id and not user.is_admin:
        return jsonify({'message': 'Access forbidden'}), 403

    api_key = current_app.config['GEOAPIFY_API_KEY']
    
    # --- Step 1: Geocode Pickup and Destination Locations ---
    try:
        # Geocode pickup location
        geocode_pickup_url = f"https://api.geoapify.com/v1/geocode/search?text={parcel.pickup_location}&apiKey={api_key}"
        pickup_response = requests.get(geocode_pickup_url)
        pickup_response.raise_for_status() # Raises an exception for bad status codes (4xx or 5xx)
        pickup_data = pickup_response.json()
        pickup_coords = pickup_data['features'][0]['geometry']['coordinates']

        # Geocode destination location
        geocode_dest_url = f"https://api.geoapify.com/v1/geocode/search?text={parcel.destination}&apiKey={api_key}"
        dest_response = requests.get(geocode_dest_url)
        dest_response.raise_for_status()
        dest_data = dest_response.json()
        dest_coords = dest_data['features'][0]['geometry']['coordinates']

    except (requests.exceptions.RequestException, IndexError, KeyError) as e:
        print(f"Error during geocoding: {e}")
        return jsonify({'message': 'Could not find coordinates for the provided locations. Please check the addresses.'}), 400

    # --- Step 2: Get Route Details ---
    try:
        # Note: Geoapify uses lon,lat format
        lon1, lat1 = pickup_coords
        lon2, lat2 = dest_coords
        
        routing_url = f"https://api.geoapify.com/v1/routing?waypoints={lat1},{lon1}|{lat2},{lon2}&mode=drive&apiKey={api_key}"
        routing_response = requests.get(routing_url)
        routing_response.raise_for_status()
        routing_data = routing_response.json()
        
        route_details = routing_data['features'][0]['properties']
        distance_meters = route_details['distance']
        duration_seconds = route_details['time']

    except (requests.exceptions.RequestException, IndexError, KeyError) as e:
        print(f"Error during routing: {e}")
        return jsonify({'message': 'Could not calculate the route between the locations.'}), 500

    return jsonify({
        'distance_km': round(distance_meters / 1000, 2),
        'duration_minutes': max(1, int(duration_seconds / 60)),
        'pickup_coordinates': {'lat': lat1, 'lon': lon1},
        'destination_coordinates': {'lat': lat2, 'lon': lon2},
    }), 200


@parcels_bp.route('/parcels/<int:parcel_id>/stream', methods=['GET'])
@jwt_required()
def stream_parcel_updates(parcel_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    parcel = Parcel.query.get(parcel_id)

    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    if parcel.user_id != current_user_id and not user.is_admin:
        return jsonify({'message': 'Access forbidden'}), 403

    api_key = current_app.config['GEOAPIFY_API_KEY']
    last_payload = {}
    last_destination = None
    destination_coords = None

    def event_stream():
        nonlocal last_payload, last_destination, destination_coords
        while True:
            db.session.expire_all()
            parcel = Parcel.query.get(parcel_id)
            if not parcel:
                yield "event: end\ndata: {}\n\n"
                break

            payload = {
                "status": parcel.status,
                "present_location": parcel.present_location,
            }

            if api_key and parcel.present_location:
                current_coords = geocode_location(parcel.present_location, api_key)
                if current_coords:
                    payload["current_coordinates"] = current_coords

                if parcel.destination:
                    if parcel.destination != last_destination:
                        destination_coords = geocode_location(parcel.destination, api_key)
                        last_destination = parcel.destination
                    if destination_coords and current_coords:
                        route_details = route_details_from_coords(current_coords, destination_coords, api_key)
                        if route_details:
                            payload.update(route_details)

            if payload != last_payload:
                yield f"data: {json.dumps(payload)}\n\n"
                last_payload = payload
            else:
                yield ": keepalive\n\n"

            time.sleep(2)

    response = Response(stream_with_context(event_stream()), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['X-Accel-Buffering'] = 'no'
    return response

    return jsonify({
        'message': 'Route details retrieved successfully',
        'pickup_coordinates': {'lon': lon1, 'lat': lat1},
        'destination_coordinates': {'lon': lon2, 'lat': lat2},
        'distance_km': round(distance_meters / 1000, 2),
        'duration_minutes': round(duration_seconds / 60)
    }), 200

@parcels_bp.route('/contact', methods=['POST'])
def handle_contact_form():
    """
    Public endpoint to handle contact form submissions.
    """
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'message': 'Name, email, and message are required.'}), 400

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    admin_email = current_app.config['MAIL_USERNAME']
    subject = f"New Contact Form Message from {name}"
    html_body = f"""
        <h2>New Message via Deliveroo Contact Form</h2>
        <p><strong>From:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <hr>
        <h3>Message:</h3>
        <p>{message}</p>
    """

    try:
        send_email(to=admin_email, subject=subject, template=html_body)
        return jsonify({'message': 'Your message has been sent successfully!'}), 200
    except Exception as e:
        print(f"Error sending contact email: {e}")
        return jsonify({'message': 'Sorry, there was an error sending your message. Please try again later.'}), 500
   

# ... (all other imports)

@parcels_bp.route('/quote', methods=['POST'])
def get_shipping_quote():
    data = request.get_json()
    if not data or not data.get('weight') or not data.get('pickup_location') or not data.get('destination'):
        return jsonify({'message': 'Weight, pickup, and destination are required'}), 400

    try:
        weight = float(data['weight'])
    except (ValueError, TypeError):
        return jsonify({'message': 'Weight must be a valid number'}), 400

    api_key = current_app.config['GEOAPIFY_API_KEY']
    
    try:
        pickup_loc = data['pickup_location']
        dest_loc = data['destination']
        geocode_pickup_url = f"https://api.geoapify.com/v1/geocode/search?text={pickup_loc}&apiKey={api_key}"
        pickup_response = requests.get(geocode_pickup_url).json()
        pickup_coords = pickup_response['features'][0]['geometry']['coordinates']

        geocode_dest_url = f"https://api.geoapify.com/v1/geocode/search?text={dest_loc}&apiKey={api_key}"
        dest_response = requests.get(geocode_dest_url).json()
        dest_coords = dest_response['features'][0]['geometry']['coordinates']
    except (requests.exceptions.RequestException, IndexError, KeyError):
        return jsonify({'message': 'Could not calculate route. Please check addresses.'}), 400

    try:
        lon1, lat1 = pickup_coords
        lon2, lat2 = dest_coords
        routing_url = f"https://api.geoapify.com/v1/routing?waypoints={lat1},{lon1}|{lat2},{lon2}&mode=drive&apiKey={api_key}"
        routing_data = requests.get(routing_url).json()
        distance_km = routing_data['features'][0]['properties']['distance'] / 1000
    except (requests.exceptions.RequestException, IndexError, KeyError):
        return jsonify({'message': 'Could not calculate distance between the locations.'}), 500

    BASE_FEE = 5.0
    PRICE_PER_KM = 0.75
    PRICE_PER_KG = 1.50
    distance_cost = distance_km * PRICE_PER_KM
    weight_cost = weight * PRICE_PER_KG
    total_cost = BASE_FEE + distance_cost + weight_cost

    return jsonify({
        'message': 'Quote calculated successfully',
        'distance_km': round(distance_km, 2),
        'calculated_cost': round(total_cost, 2)
    }), 200



@parcels_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment():
    try:
        data = request.get_json()
        if not data or 'cost' not in data:
            return jsonify(error={'message': 'Missing payment amount'}), 400
        
        # Set your secret key
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

        # Create a PaymentIntent with the order amount and currency
        # The amount is in the smallest currency unit (e.g., cents for USD)
        amount_in_cents = int(float(data['cost']) * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency='usd', # Change this to your desired currency
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        return jsonify({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    

@parcels_bp.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = current_app.config['STRIPE_WEBHOOK_SECRET']
    
    # This is a placeholder for a real webhook.
    # In a full production app, you would verify the signature and handle events
    # like 'payment_intent.succeeded' to finalize orders.
    print("--- WEBHOOK RECEIVED ---")
    print(payload)
    print("----------------------")
    
    return jsonify(status='success'), 200
