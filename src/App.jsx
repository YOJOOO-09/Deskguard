import { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ActiveSession from './pages/ActiveSession';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [page, setPage] = useState('login');
  const [activeDesk, setActiveDesk] = useState(null);

  const handleNavigate = (target) => {
    if (target === 'scan' || target === 'profile') return;
    setPage(target);
  };

  switch (page) {
    case 'dashboard':
      return <StudentDashboard onNavigate={handleNavigate} onActiveDesk={setActiveDesk} />;
    case 'session':
      return <ActiveSession onNavigate={handleNavigate} desk={activeDesk} onEndSession={() => setActiveDesk(null)} />;
    case 'admin':
      return <AdminDashboard onNavigate={handleNavigate} />;
    case 'login':
    default:
      return <Login onLogin={() => setPage('dashboard')} onAdminLogin={() => setPage('admin')} />;
  }
}
