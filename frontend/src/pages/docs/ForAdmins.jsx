import React from 'react';

const ForAdmins = () => {
  return (
    <article className="prose prose-lg max-w-none text-base-text">
      <h1 className="text-secondary">Administrator's Guide</h1>
      <p className="lead">
        The Admin Panel provides centralized control over the entire platform, enabling efficient management of all user orders and delivery logistics.
      </p>

      <h2>The Admin Dashboard</h2>
      <p>
        Accessible via the "Admin Panel" link in the navbar (visible only to admins), the dashboard is your command center.
      </p>
      <ul>
        <li><strong>Comprehensive View:</strong> See every order from every user in a single, responsive table.</li>
        <li><strong>Powerful Search:</strong> Instantly find any order by searching for the recipient's name.</li>
        <li><strong>Status Filtering:</strong> Use the dropdown to filter the entire list by status (e.g., to see all "In Transit" parcels at once).</li>
      </ul>

      <h2>Order Management Workflow</h2>
      <p>
        As a parcel progresses through its journey, you can update its status directly from the dashboard:
      </p>
      <ol>
        <li><strong>Update Status:</strong> Change a parcel's status from "Pending" to "In Transit", or "Delivered". Each update triggers an automated email notification to the customer.</li>
        <li><strong>Update Location:</strong> Provide real-time updates on the parcel's current whereabouts (e.g., "At sorting facility," "Out for delivery"). This also sends an email notification.</li>
        <li><strong>Upload Proof of Delivery:</strong> This is the crucial final step. After changing a status to "Delivered", the "Upload Proof" button will appear. Upload a photo to confirm the delivery, which then becomes visible to the customer on their order details page.</li>
      </ol>
    </article>
  );
};

export default ForAdmins;