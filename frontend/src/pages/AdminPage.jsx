import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllParcels } from '../features/admin/adminSlice';
import AdminDashboard from '../features/admin/AdminDashboard';
import UpdateStatusModal from '../features/admin/UpdateStatusModal';
import UpdateLocationModal from '../features/admin/UpdateLocationModal';
import UploadProofModal from '../features/admin/UploadProofModal';
const AdminPage = () => {
// State for modals
const [selectedParcel, setSelectedParcel] = useState(null);
const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
const [isProofModalOpen, setIsProofModalOpen] = useState(false);
// State for filtering and searching
const [statusFilter, setStatusFilter] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const dispatch = useDispatch();
// This effect hook triggers a data re-fetch whenever a filter changes
useEffect(() => {
// We use a debounce timer to prevent making an API call on every single keystroke.
// This is a common performance optimization.
const debounceTimer = setTimeout(() => {
dispatch(fetchAllParcels({ statusFilter, searchTerm }));
}, 500); // Wait 500ms after the user stops typing to fetch

// Cleanup function to clear the timer if the component unmounts or a dependency changes
return () => clearTimeout(debounceTimer);
}, [statusFilter, searchTerm, dispatch]);
// Modal handler functions
const handleEditStatus = (parcel) => {
setSelectedParcel(parcel);
setIsStatusModalOpen(true);
};
const handleEditLocation = (parcel) => {
setSelectedParcel(parcel);
setIsLocationModalOpen(true);
};
const handleUploadProof = (parcel) => {
setSelectedParcel(parcel);
setIsProofModalOpen(true);
};
const handleCloseModals = () => {
setSelectedParcel(null);
setIsStatusModalOpen(false);
setIsLocationModalOpen(false);
setIsProofModalOpen(false);
};
return (
<>
<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
<div className="mb-8">
<h1 className="text-3xl font-bold text-secondary">Admin Panel</h1>
<p className="text-base-text mt-2">Manage all parcel delivery orders in the system.</p>
</div>

<AdminDashboard 
      // Pass filter state and setters down to the UI component
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      // Pass modal handlers down
      onEditStatus={handleEditStatus} 
      onEditLocation={handleEditLocation} 
      onUploadProof={handleUploadProof}
    />
  </div>
  
  {/* Modals */}
  <UpdateStatusModal 
    isOpen={isStatusModalOpen} 
    onClose={handleCloseModals} 
    parcel={selectedParcel} 
  />

  <UpdateLocationModal 
    isOpen={isLocationModalOpen} 
    onClose={handleCloseModals} 
    parcel={selectedParcel} 
  />
  
  <UploadProofModal
    isOpen={isProofModalOpen}
    onClose={handleCloseModals}
    parcel={selectedParcel}
  />
</>
);
};
export default AdminPage;