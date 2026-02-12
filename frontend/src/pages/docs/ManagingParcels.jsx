import React from 'react';

const ManagingParcels = () => {
  return (
    <article className="prose prose-lg max-w-none text-base-text">
      <h1 className="text-secondary">Managing Your Parcels</h1>
      <p className="lead">
        From creation to final delivery, your dashboard gives you complete control and visibility over your parcels. Here's a detailed walkthrough of the process.
      </p>

      <h2>Creating a New Order</h2>
      <p>
        We've designed a simple, step-by-step process to ensure accuracy and transparency before you commit.
      </p>
      <ol>
        <li><strong>Initiate Order:</strong> Click the "Create New Order" button on your dashboard.</li>
        <li><strong>Enter Details:</strong> Fill in the recipient's information, your contact number, and the parcel's insured value.</li>
        <li><strong>Get a Quote:</strong> Provide the pickup/destination addresses and the parcel's weight. Click "Get Shipping Quote" to see the dynamically calculated cost.</li>
        <li><strong>Proceed to Payment:</strong> Once you're happy with the quote, upload a photo of your parcel and click "Proceed to Payment" to open the secure payment form.</li>
        <li><strong>Secure Payment:</strong> Enter your card details via our Stripe-powered payment portal. Your financial data is fully encrypted and never stored on our servers.</li>
        <li><strong>Confirmation:</strong> After successful payment, your order is officially created and added to your dashboard.</li>
      </ol>

      <h2>Tracking and Details</h2>
      <p>
        Click on any parcel card on your dashboard to access its dedicated details page. This page is your single source of truth for that delivery, featuring:
      </p>
      <ul>
        <li>A live map visualizing the delivery route.</li>
        <li>A comprehensive summary of all order details.</li>
        <li>
          <strong>Proof of Delivery:</strong> Once the delivery is marked as complete by our team, a confirmation banner and the uploaded proof of delivery photo will appear here, giving you ultimate peace of mind.
        </li>
      </ul>
    </article>
  );
};

export default ManagingParcels;