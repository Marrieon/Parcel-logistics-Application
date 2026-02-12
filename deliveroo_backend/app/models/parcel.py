from app import db
from sqlalchemy.orm import relationship

class Parcel(db.Model):
    __tablename__ = 'parcels'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_name = db.Column(db.String(100), nullable=False)
    pickup_location = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Pending')
    present_location = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    proof_of_delivery_image_url = db.Column(db.String(255), nullable=True)
    sender_phone = db.Column(db.String(20), nullable=True)
    recipient_phone = db.Column(db.String(20), nullable=True)
    estimated_cost = db.Column(db.Float, nullable=True)
    parcel_image_url = db.Column(db.String(255), nullable=True) # Will store the filename
    shipping_cost = db.Column(db.Float, nullable=True)
    user = relationship('User', back_populates='parcels')

    def __repr__(self):
        return f'<Parcel {self.id}>'