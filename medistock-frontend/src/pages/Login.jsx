import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Cross, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@medistock.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #0369a1 0%, #0f172a 60%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #334155',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ textAlignment: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7, #14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'white',
            boxShadow: '0 10px 20px rgba(2, 132, 199, 0.4)'
          }}>
            <Cross size={32} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>MediStock</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>Medical Inventory & Supplier Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '42px' }}
                placeholder="user@medistock.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
            <ShieldCheck size={14} color="#38bdf8" /> Quick Login Demo Profiles:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button onClick={() => handleQuickLogin('admin@medistock.com')} className="btn btn-secondary btn-sm">
              Admin
            </button>
            <button onClick={() => handleQuickLogin('pharmacist@medistock.com')} className="btn btn-secondary btn-sm">
              Pharmacist
            </button>
            <button onClick={() => handleQuickLogin('store_manager@medistock.com')} className="btn btn-secondary btn-sm">
              Store Manager
            </button>
            <button onClick={() => handleQuickLogin('viewer@medistock.com')} className="btn btn-secondary btn-sm">
              Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
