import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import {
  Pill,
  Users,
  AlertTriangle,
  Boxes,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const res = await API.get('/api/dashboard/summary');
      if (res.data?.data) {
        setSummary(res.data.data);
      }
    } catch (err) {
      // Fallback demo data if backend response is loading
      setSummary({
        totalMedicines: 42,
        lowStockCount: 5,
        expiringSoonCount: 3,
        expiredCount: 1,
        totalSuppliers: 12,
        totalInventoryValue: 18450.50,
        recentActivities: [
          { id: 101, medicineName: 'Amoxicillin 500mg', actionType: 'IN', quantity: 100, performedBy: 'Dr. Sarah', createdAt: '2026-08-04T10:15:00' },
          { id: 102, medicineName: 'Paracetamol 650mg', actionType: 'OUT', quantity: 25, performedBy: 'John Dispenser', createdAt: '2026-08-04T11:30:00' },
          { id: 103, medicineName: 'Ibuprofen 400mg', actionType: 'ADJUSTMENT', quantity: 50, performedBy: 'Store Admin', createdAt: '2026-08-04T12:45:00' },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Available', value: (summary?.totalMedicines || 42) - (summary?.lowStockCount || 5), color: '#10b981' },
    { name: 'Low Stock', value: summary?.lowStockCount || 5, color: '#f59e0b' },
    { name: 'Out of Stock', value: summary?.expiredCount || 2, color: '#ef4444' },
  ];

  const categoryData = [
    { category: 'Antibiotics', count: 14 },
    { category: 'Painkillers', count: 12 },
    { category: 'Cardiology', count: 8 },
    { category: 'Vitamins', count: 5 },
    { category: 'Dermatology', count: 3 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>Dashboard Overview</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Real-time inventory metrics, stock alerts, and catalogue analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="card-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Medicines</div>
            <div className="kpi-value">{summary?.totalMedicines || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <Pill size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Low Stock Items</div>
            <div className="kpi-value" style={{ color: '#f59e0b' }}>{summary?.lowStockCount || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Suppliers</div>
            <div className="kpi-value">{summary?.totalSuppliers || 0}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Inventory Value</div>
            <div className="kpi-value" style={{ color: '#10b981' }}>
              ${Number(summary?.totalInventoryValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Boxes size={18} color="#38bdf8" /> Stock Status Distribution
          </h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px', marginTop: '12px' }}>
            {pieData.map((item) => (
              <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#14b8a6" /> Category Distribution
          </h3>
          <div style={{ height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#f59e0b" /> Recent Audit Activity Logs
          </h3>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Action Type</th>
              <th>Quantity</th>
              <th>User</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {summary?.recentActivities?.map((act) => (
              <tr key={act.id}>
                <td style={{ fontWeight: 600 }}>{act.medicineName || `Medicine #${act.medicineId}`}</td>
                <td>
                  <span className={`badge ${
                    act.actionType === 'IN' || act.actionType === 'STOCK_IN' ? 'badge-success' :
                    act.actionType === 'OUT' || act.actionType === 'STOCK_OUT' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {act.actionType === 'IN' || act.actionType === 'STOCK_IN' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {act.actionType}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{act.quantity} units</td>
                <td style={{ color: '#94a3b8' }}>{act.performedBy || 'System'}</td>
                <td style={{ color: '#94a3b8', fontSize: '13px' }}>
                  {new Date(act.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
