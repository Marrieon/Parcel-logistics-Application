import React, { useState } from 'react';
import ParcelList from '../features/parcels/ParcelList';
import Button from '../components/common/Button';
import CreateParcelModal from '../features/parcels/CreateParcelModal';
import { FaPlus } from 'react-icons/fa';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-4 sm:mb-0">Your Dashboard</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <FaPlus className="mr-2" />
            Create New Order
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-base-text mb-4">My Parcel Orders</h2>
          <ParcelList />
        </div>
      </div>

      <CreateParcelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default DashboardPage;