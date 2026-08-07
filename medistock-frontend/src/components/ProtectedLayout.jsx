import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Pill,
  Users,
  Boxes,
  ArrowDownUp,
  History,
  AlertTriangle,
  LogOut,
  Cross
} from 'lucide-react';

export const ProtectedLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Medicines', path: '/medicines', icon: Pill },
    { label: 'Suppliers', path: '/suppliers', icon: Users },
    { label: 'Inventory Stock', path: '/inventory', icon: Boxes },
    { label: 'Stock Operations', path: '/stock-management', icon: ArrowDownUp },
    { label: 'Stock History', path: '/stock-history', icon: History },
    { label: 'Low Stock Alerts', path: '/low-stock', icon: AlertTriangle },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7, #14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Cross size={20} />
          </div>
          <div>
            <div className="sidebar-brand">MEDISTOCK</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Pharmacy & Stock</div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #334155' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="navbar">
          <div className="navbar-title">Medical Inventory & Supplier System</div>
          <div className="navbar-user">
            <div className="user-badge">
              <div className="user-avatar">{user?.name ? user.name[0] : 'U'}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.email}</div>
              </div>
              <span className={`role-tag role-${(user?.role || 'PHARMACIST').toLowerCase()}`}>
                {user?.role || 'PHARMACIST'}
              </span>
            </div>
          </div>
        </header>

        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
