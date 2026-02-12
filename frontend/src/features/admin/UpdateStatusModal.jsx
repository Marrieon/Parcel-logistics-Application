import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { updateParcelStatus } from './adminSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { HiX } from 'react-icons/hi';

const UpdateStatusModal = ({ isOpen, onClose, parcel }) => {
  const [status, setStatus] = useState(parcel?.status || 'Pending');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const statusOptions = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(updateParcelStatus({ parcelId: parcel.id, status }))
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
        <h2 className="text-xl font-bold text-center text-secondary mb-4">Update Status for Order #{parcel.id}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">New Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <Button type="submit" isLoading={isLoading} fullWidth>Update Status</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateStatusModal;