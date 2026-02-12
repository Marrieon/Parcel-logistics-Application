import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { updateParcelLocation } from './adminSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { HiX } from 'react-icons/hi';

const UpdateLocationModal = ({ isOpen, onClose, parcel }) => {
  const [location, setLocation] = useState(parcel?.present_location || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      setError('Location cannot be empty');
      return;
    }
    setError('');
    setIsLoading(true);
    dispatch(updateParcelLocation({ parcelId: parcel.id, location }))
      .unwrap()
      .then((result) => {
        Swal.fire('Success!', result.message, 'success');
        onClose();
      })
      .catch((err) => Swal.fire('Error!', err.message, 'error'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><HiX size={24} /></button>
        <h2 className="text-xl font-bold text-center text-secondary mb-4">Update Location for Order #{parcel.id}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input name="location" placeholder="New Location" value={location} onChange={(e) => setLocation(e.target.value)} error={error} />
            <Button type="submit" isLoading={isLoading} fullWidth>Update Location</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateLocationModal;