import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import Swal from 'sweetalert2';

import { fetchParcelById, cancelParcelOrder, selectSelectedParcel, resetSelectedParcel } from '../features/parcels/parcelsSlice';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import UpdateDestinationModal from '../features/parcels/UpdateDestinationModal';
// Corrected and consolidated icon imports
import { 
  FaArrowLeft, FaEdit, FaTimesCircle, FaPhone, FaUser, 
  FaDollarSign, FaWeightHanging, FaShieldAlt, FaCheckCircle 
} from 'react-icons/fa';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const ParcelDetailsPage = () => {
  const { parcelId } = useParams();
  const dispatch = useDispatch();
  const { details: parcel, status, error } = useSelector(selectSelectedParcel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(null);
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/')) {
      return path;
    }
    if (!apiBaseUrl) {
      return `/${path}`;
    }
    const base = apiBaseUrl.replace(/\/+$/, '');
    const trimmedPath = path.replace(/^\/+/, '');
    return `${base}/${trimmedPath}`;
  };

  const buildStreamUrl = (path, token) => {
    if (!token) return null;
    const base = apiBaseUrl.replace(/\/+$/, '');
    const trimmedPath = path.replace(/^\/+/, '');
    const prefix = base ? `${base}/` : '/';
    return `${prefix}${trimmedPath}?jwt=${encodeURIComponent(token)}`;
  };

  useEffect(() => {
    dispatch(fetchParcelById(parcelId));
    return () => {
      dispatch(resetSelectedParcel());
    };
  }, [parcelId, dispatch]);

  useEffect(() => {
    if (!parcelId) return undefined;
    const storedState = JSON.parse(localStorage.getItem('state') || '{}');
    const token = storedState?.auth?.token;
    const streamUrl = buildStreamUrl(`/api/parcels/${parcelId}/stream`, token);
    if (!streamUrl) return undefined;

    const source = new EventSource(streamUrl);
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLiveUpdate((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Failed to parse live update', err);
      }
    };
    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, [parcelId]);

  const handleCancelOrder = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(cancelParcelOrder(parcelId)).unwrap()
          .then(res => Swal.fire('Cancelled!', res.message, 'success'))
          .catch(err => Swal.fire('Error!', err.message, 'error'));
      }
    });
  };
  
  if (status === 'loading' || status === 'idle') {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }

  if (status === 'failed' || !parcel) {
    return <div className="text-center p-10 text-error">Error: {error || 'Could not load parcel details.'}</div>;
  }
  
  const displayParcel = liveUpdate ? { ...parcel, ...liveUpdate } : parcel;
  const { pickup_coordinates, destination_coordinates } = displayParcel.routeDetails || {};
  const positionPickup = pickup_coordinates ? [pickup_coordinates.lat, pickup_coordinates.lon] : null;
  const positionDestination = destination_coordinates ? [destination_coordinates.lat, destination_coordinates.lon] : null;
  const positionCurrent = displayParcel.current_coordinates
    ? [displayParcel.current_coordinates.lat, displayParcel.current_coordinates.lon]
    : null;
  const polyline = positionPickup && positionDestination ? [positionPickup, positionDestination] : [];
  const mapCenter = positionPickup || positionCurrent || positionDestination;

  const isActionable = displayParcel.status !== 'Delivered' && displayParcel.status !== 'Cancelled';

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link to="/dashboard" className="inline-flex items-center text-primary mb-6 hover:underline">
          <FaArrowLeft className="mr-2"/> Back to Dashboard
        </Link>
        
        {/* --- PROOF OF DELIVERY BANNER --- */}
        {parcel.status === 'Delivered' && parcel.proof_of_delivery_image_url && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-6" role="alert">
            <div className="flex">
              <div className="py-1"><FaCheckCircle className="h-6 w-6 mr-4"/></div>
              <div>
                <p className="font-bold">Delivery Confirmed</p>
                <p className="text-sm">Proof of delivery has been uploaded for this order.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h1 className="text-2xl font-bold text-secondary mb-2">Order #{displayParcel.id}</h1>
            <p className="text-lg mb-4">Status: <span className="font-semibold text-primary">{displayParcel.status}</span></p>
            
            {displayParcel.parcel_image_url && (
              <img src={buildImageUrl(displayParcel.parcel_image_url)} alt={`Parcel ${displayParcel.id}`} className="rounded-lg mb-4 w-full h-auto object-cover shadow-inner" />
            )}

            {/* --- PROOF OF DELIVERY IMAGE --- */}
            {displayParcel.proof_of_delivery_image_url && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-secondary mb-2">Proof of Delivery</h3>
                <img src={buildImageUrl(displayParcel.proof_of_delivery_image_url)} alt={`Proof for parcel ${displayParcel.id}`} className="rounded-lg w-full h-auto object-cover shadow-inner" />
              </div>
            )}

            <div className="space-y-4 text-gray-700 mt-4">
              <div className="border-t pt-4">
                <p className="flex items-center"><FaUser className="mr-3 text-primary"/><strong>Recipient:</strong><span className="ml-auto font-medium">{displayParcel.recipient_name}</span></p>
                <p className="flex items-center"><FaPhone className="mr-3 text-primary"/><strong>Recipient Phone:</strong><span className="ml-auto font-medium">{displayParcel.recipient_phone || 'N/A'}</span></p>
                <p className="flex items-center"><FaPhone className="mr-3 text-primary"/><strong>Sender Phone:</strong><span className="ml-auto font-medium">{displayParcel.sender_phone || 'N/A'}</span></p>
              </div>
              <div className="border-t pt-4">
                <p><strong>From:</strong> {displayParcel.pickup_location}</p>
                <p><strong>To:</strong> {displayParcel.destination}</p>
                {displayParcel.present_location && <p><strong>Current Location:</strong> {displayParcel.present_location}</p>}
                {displayParcel.eta_minutes && <p><strong>ETA:</strong> {displayParcel.eta_minutes} min</p>}
              </div>
              <div className="border-t pt-4">
                 <p className="flex items-center"><FaWeightHanging className="mr-3 text-primary"/><strong>Weight:</strong><span className="ml-auto font-medium">{displayParcel.weight} kg</span></p>
                 <p className="flex items-center"><FaShieldAlt className="mr-3 text-primary"/><strong>Insured Value:</strong><span className="ml-auto font-medium">${displayParcel.estimated_cost ? displayParcel.estimated_cost.toFixed(2) : 'N/A'}</span></p>
                 <p className="flex items-center"><FaDollarSign className="mr-3 text-primary"/><strong>Shipping Cost:</strong><span className="ml-auto font-medium">${displayParcel.shipping_cost ? displayParcel.shipping_cost.toFixed(2) : 'N/A'}</span></p>
                 {displayParcel.distance_km && <p><strong>Live Distance:</strong> {displayParcel.distance_km} km</p>}
                 {displayParcel.routeDetails && <p><strong>Route Distance:</strong> {displayParcel.routeDetails.distance_km} km</p>}
              </div>
            </div>

            {isActionable && (
              <div className="mt-8 flex flex-col space-y-4 sm:space-x-0 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button onClick={() => setIsModalOpen(true)}><FaEdit className="mr-2"/>Change Destination</Button>
                <Button onClick={handleCancelOrder}><FaTimesCircle className="mr-2"/>Cancel Order</Button>
              </div>
            )}
          </div>

          {/* Right Column: Map */}
          {mapCenter && (
            <div className="lg:col-span-2 h-80 lg:h-[600px] rounded-lg shadow-md overflow-hidden">
              <MapContainer center={mapCenter} zoom={10} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {positionPickup && <Marker position={positionPickup}></Marker>}
                {positionDestination && <Marker position={positionDestination}></Marker>}
                {positionCurrent && <Marker position={positionCurrent}></Marker>}
                {polyline.length > 0 && <Polyline pathOptions={{ color: 'blue' }} positions={polyline} />}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
      {displayParcel && <UpdateDestinationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} parcel={displayParcel} />}
    </>
  );
};

export default ParcelDetailsPage;
