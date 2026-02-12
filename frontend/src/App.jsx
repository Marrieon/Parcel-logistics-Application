import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Spinner from './components/common/Spinner';
import PrivateRoute from './utils/PrivateRoute';
import Footer from './components/layout/Footer';
import AdminRoute from './utils/AdminRoute';
import WhatsAppButton from './components/common/WhatsAppButton';
import DocsLayout from './components/layout/DocsLayout';
const GettingStarted = React.lazy(() => import('./pages/docs/GettingStarted'));
const ManagingParcels = React.lazy(() => import('./pages/docs/ManagingParcels'));
const ForAdmins = React.lazy(() => import('./pages/docs/ForAdmins'));
const Faq = React.lazy(() => import('./pages/docs/Faq'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ParcelDetailsPage = React.lazy(() => import('./pages/ParcelDetailsPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <Navbar />
      <main className="bg-neutral min-h-screen">
        <Suspense fallback={<div className="h-screen"><Spinner /></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/docs" element={<DocsLayout />}>
            <Route path="getting-started" element={<GettingStarted />} />
            <Route path="managing-parcels" element={<ManagingParcels />} />
            <Route path="for-admins" element={<ForAdmins />} />
            <Route path="faq" element={<Faq />} />
            <Route index element={<Navigate to="getting-started" replace />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/parcels/:parcelId" element={<ParcelDetailsPage />} />
              <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} /></Route>
              
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </Router>
  );
}

export default App;