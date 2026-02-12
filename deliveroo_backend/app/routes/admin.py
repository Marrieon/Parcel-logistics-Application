import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from app.utils.decorators import admin_required
from app.models.parcel import Parcel
from app import db
from app.utils.helpers import send_email, get_full_image_url

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/parcels', methods=['GET'])
@admin_required()
def get_all_parcels():
    """
    Admin route to get all parcel orders, with optional filtering and searching.
    Accepts query parameters: ?status=<status> and ?search=<term>
    """
    query = Parcel.query

    status_filter = request.args.get('status')
    search_term = request.args.get('search')

    if status_filter:
        query = query.filter(Parcel.status == status_filter)
    
    if search_term:
        query = query.filter(Parcel.recipient_name.ilike(f'%{search_term}%'))

    parcels = query.order_by(Parcel.created_at.desc()).all()
    
    output = []
    for parcel in parcels:
        parcel_data = {
            'id': parcel.id,
            'user_id': parcel.user_id,
            'recipient_name': parcel.recipient_name,
            'pickup_location': parcel.pickup_location,
            'destination': parcel.destination,
            'weight': parcel.weight,
            'status': parcel.status,
            'present_location': parcel.present_location,
            'created_at': parcel.created_at.isoformat(),
            'sender_phone': parcel.sender_phone,
            'recipient_phone': parcel.recipient_phone,
            'estimated_cost': parcel.estimated_cost, # Insured Value
            'shipping_cost': parcel.shipping_cost,   # Calculated Cost
            'parcel_image_url': get_full_image_url(parcel.parcel_image_url),
            'proof_of_delivery_image_url': get_full_image_url(parcel.proof_of_delivery_image_url)
        }
        output.append(parcel_data)

    return jsonify({'parcels': output}), 200

@admin_bp.route('/parcels/<int:parcel_id>/status', methods=['PATCH'])
@admin_required()
def update_parcel_status(parcel_id):
    parcel = Parcel.query.get(parcel_id)
    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    new_status = data['status']
    parcel.status = new_status
    db.session.commit()

    try:
        user = parcel.user
        subject = f"Deliveroo Update: Parcel #{parcel.id} Status"
        html_body = (
            f"<div style=\"background:#f3f4f6;padding:24px 0;\">"
            f"<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"border-collapse:collapse;\">"
            f"<tr><td align=\"center\">"
            f"<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"560\" style=\"border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(31,41,55,0.08);\">"
            f"<tr><td style=\"background:#111827;color:#ffffff;padding:18px 24px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:0.3px;\">Deliveroo</td></tr>"
            f"<tr><td style=\"padding:24px;font-family:Arial,sans-serif;color:#1f2937;line-height:1.6;\">"
            f"<p style=\"margin:0 0 12px;font-size:16px;\">Hello {user.username},</p>"
            f"<p style=\"margin:0 0 12px;font-size:15px;\">Your parcel is on the move. The status for order "
            f"<strong>#{parcel.id}</strong> is now <span style=\"display:inline-block;background:#e5f5e0;color:#166534;padding:2px 8px;border-radius:999px;font-weight:700;\">{new_status}</span>.</p>"
            f"<p style=\"margin:0 0 12px;font-size:15px;\">If you have any questions, just reply to this email and our team will help.</p>"
            f"<p style=\"margin:0;font-size:15px;\">Thanks for choosing Deliveroo.</p>"
            f"</td></tr>"
            f"<tr><td style=\"padding:14px 24px;background:#f9fafb;font-family:Arial,sans-serif;color:#6b7280;font-size:12px;text-align:center;\">"
            f"Fast, reliable parcel delivery."
            f"</td></tr>"
            f"</table>"
            f"</td></tr>"
            f"</table>"
            f"</div>"
        )
        send_email(user.email, subject, html_body)
    except Exception as e:
        print(f"Error sending email notification: {e}")

    return jsonify({'message': f'Parcel {parcel.id} status updated to {new_status}'}), 200

@admin_bp.route('/parcels/<int:parcel_id>/location', methods=['PATCH'])
@admin_required()
def update_parcel_location(parcel_id):
    parcel = Parcel.query.get(parcel_id)
    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    data = request.get_json()
    if not data or 'location' not in data:
        return jsonify({'message': 'Location is required'}), 400
    
    new_location = data['location']
    parcel.present_location = new_location
    db.session.commit()

    try:
        user = parcel.user
        subject = f"Deliveroo Update: Parcel #{parcel.id} Location"
        html_body = (
            f"<div style=\"background:#f3f4f6;padding:24px 0;\">"
            f"<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"border-collapse:collapse;\">"
            f"<tr><td align=\"center\">"
            f"<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"560\" style=\"border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(31,41,55,0.08);\">"
            f"<tr><td style=\"background:#111827;color:#ffffff;padding:18px 24px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:0.3px;\">Deliveroo</td></tr>"
            f"<tr><td style=\"padding:24px;font-family:Arial,sans-serif;color:#1f2937;line-height:1.6;\">"
            f"<p style=\"margin:0 0 12px;font-size:16px;\">Hello {user.username},</p>"
            f"<p style=\"margin:0 0 12px;font-size:15px;\">We have a new location update for parcel "
            f"<strong>#{parcel.id}</strong>: <strong>{new_location}</strong>.</p>"
            f"<p style=\"margin:0 0 12px;font-size:15px;\">We are keeping a close eye on your delivery and will share any further changes.</p>"
            f"<p style=\"margin:0;font-size:15px;\">Thanks for choosing Deliveroo.</p>"
            f"</td></tr>"
            f"<tr><td style=\"padding:14px 24px;background:#f9fafb;font-family:Arial,sans-serif;color:#6b7280;font-size:12px;text-align:center;\">"
            f"Fast, reliable parcel delivery."
            f"</td></tr>"
            f"</table>"
            f"</td></tr>"
            f"</table>"
            f"</div>"
        )
        send_email(user.email, subject, html_body)
    except Exception as e:
        print(f"Error sending email notification: {e}")

    return jsonify({'message': f'Parcel {parcel.id} location updated to {new_location}'}), 200

@admin_bp.route('/parcels/<int:parcel_id>/proof', methods=['POST'])
@admin_required()
def upload_proof_of_delivery(parcel_id):
    parcel = Parcel.query.get(parcel_id)
    if not parcel:
        return jsonify({'message': 'Parcel not found'}), 404

    if 'proof_image' not in request.files:
        return jsonify({'message': 'Proof image file is required'}), 400
    
    file = request.files['proof_image']
    if file.filename == '':
        return jsonify({'message': 'No selected file for proof image'}), 400

    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
    
    parcel.proof_of_delivery_image_url = filename
    db.session.commit()

    return jsonify({
        'message': 'Proof of delivery uploaded successfully.',
        'proof_of_delivery_image_url': f"/uploads/{filename}"
    }), 200
