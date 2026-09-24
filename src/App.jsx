import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import BottomNav from './components/layout/BottomNav';
import { ToastProvider } from './hooks/useToast';
import { getClients } from './utils/storage';
import { isLoggedIn, logout } from './pages/Login';

// Pages
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Sessions from './pages/Sessions';
import Payments from './pages/Payments';
import Activity from './pages/Activity';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const Layout = ({ children, onLogout }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/clients/')) {
      const clientId = path.split('/')[2];
      const clients = getClients();
      const client = clients.find((c) => c.id === clientId);
      return {
        title: client ? client.name : 'Client Details',
        breadcrumbs: [
          { name: 'Clients', path: '/clients' },
          { name: client ? client.name : 'Client Details' }
        ]
      };
    }
    const titles = {
      '/dashboard': 'Dashboard',
      '/clients':   'Clients',
      '/sessions':  'Sessions',
      '/payments':  'Payments',
      '/activity':  'Activity',
      '/reports':   'Reports',
      '/settings':  'Settings'
    };
    return { title: titles[path] || 'Dashboard' };
  };

  const { title, breadcrumbs } = getHeaderInfo();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#080B0D' }}>
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar-container">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          onOpenMobile={() => setMobileNavOpen(true)}
          title={title}
          breadcrumbs={breadcrumbs}
        />
        <main style={{ flex: 1, padding: '28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav onMoreClick={() => setMobileNavOpen(true)} />
    </div>
  );
};

export const App = () => {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());

  const handleLoginSuccess = () => setAuthenticated(true);
  const handleLogout = () => { logout(); setAuthenticated(false); };

  if (!authenticated) {
    return (
      <ToastProvider>
        <Login onLoginSuccess={handleLoginSuccess} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/"           element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/clients"    element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/sessions"   element={<Sessions />} />
            <Route path="/payments"   element={<Payments />} />
            <Route path="/activity"   element={<Activity />} />
            <Route path="/reports"    element={<Reports />} />
            <Route path="/settings"   element={<Settings onLogout={handleLogout} />} />
            <Route path="*"           element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
