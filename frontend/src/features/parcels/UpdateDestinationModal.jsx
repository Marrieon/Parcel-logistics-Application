import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { updateParcelDestination } from './parcelsSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { HiX } from 'react-icons/hi';

const UpdateDestinationModal = ({ isOpen, onClose, parcel }) => {
  const [destination, setDestination] = useState(parcel?.destination || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination) {
      setError('Destination is required');
      return;
    }
    setError('');
    setIsLoading(true);
    dispatch(updateParcelDestination({ parcelId: parcel.id, destination }))
      .unwrap()
      .then((result) => {
        Swal.fire('Success!', result.message, 'success');
        onClose();
      })
      .catch((err) => {
        Swal.fire('Error!', err.message || 'Could not update destination.', 'error');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <HiX size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center text-secondary mb-6">Change Destination</h2>
        <p className="text-center text-sm text-gray-500 mb-4">For Parcel Order #{parcel.id}</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <Input name="destination" placeholder="New Destination Address" value={destination} onChange={(e) => setDestination(e.target.value)} error={error} />
            <Button type="submit" isLoading={isLoading} fullWidth>
              Update Destination
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateDestinationModal;