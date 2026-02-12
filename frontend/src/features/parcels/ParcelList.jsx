import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // 1. Import the Link component
import { fetchUserParcels, selectAllParcels, selectParcelsStatus, selectParcelsError } from './parcelsSlice';
import Spinner from '../../components/common/Spinner';
import { FaBox, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const ParcelList = () => {
  const dispatch = useDispatch();
  const parcels = useSelector(selectAllParcels);
  const status = useSelector(selectParcelsStatus);
  const error = useSelector(selectParcelsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserParcels());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <Spinner />;
  } else if (status === 'succeeded') {
    if (parcels.length === 0) {
      content = <p className="text-center text-gray-500">You haven't created any parcel orders yet.</p>;
    } else {
      content = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcels.map((parcel) => (
            // 2. Wrap the entire card div in a Link component
            <Link to={`/parcels/${parcel.id}`} key={parcel.id} className="h-full">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-secondary">Order #{parcel.id}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${
                      parcel.status === 'Delivered' ? 'bg-success' : 
                      parcel.status === 'Cancelled' ? 'bg-error' : 'bg-yellow-500'
                  }`}>
                    {parcel.status}
                  </span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center"><FaBox className="mr-2 text-primary"/> To: <strong>{parcel.recipient_name}</strong></p>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary"/> 
                    <span className="truncate">{parcel.pickup_location}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-400 my-2">
                    <FaArrowRight />
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-error"/> 
                    <span className="truncate">{parcel.destination}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  } else if (status === 'failed') {
    content = <p className="text-center text-error">Error: {error}</p>;
  }

  return <div>{content}</div>;
};

export default ParcelList;