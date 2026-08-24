import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axiosConfig';
import {
  Pill,
  Users,
  AlertTriangle,
  Boxes,
  IndianRupee,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Search,
  Package,
  Truck,
  ClipboardList,
  CheckCircle,
  BarChart3,
  Clock,
  XCircle,
  ArrowRight,
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  Store,
  Plus,
  Minus,
  Trash2,
  RefreshCcw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

/* ───────────────────────────────────────────────
   ADMIN / STORE MANAGER  Dashboard
   ─────────────────────────────────────────────── */
const AdminDashboard = ({ summary }) => {
  const navigate = useNavigate();
  const totalMeds = summary?.totalMedicines || 0;
  const available = summary?.availableStockCount || 0;
  const lowStock = summary?.lowStockCount || 0;
  const outOfStock = summary?.outOfStockCount || 0;

  const pieData = [
    { name: 'Available', value: available, color: '#10b981' },
    { name: 'Low Stock', value: lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: outOfStock, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>Dashboard Overview</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Real-time inventory metrics, stock alerts, and catalogue analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="card-grid">
        <div className="kpi-card" onClick={() => navigate('/medicines')} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} title="Click to view all Medicines">
          <div>
            <div className="kpi-title">Total Medicines</div>
            <div className="kpi-value">{totalMeds}</div>
            <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '4px' }}>View Catalogue →</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <Pill size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} title="Click to view Inventory Stock">
          <div>
            <div className="kpi-title">Available Stock</div>
            <div className="kpi-value" style={{ color: '#10b981' }}>{available}</div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Healthy Stock Items →</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/low-stock')} style={{ cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }} title="Click to open Low Stock Alert Center">
          <div>
            <div className="kpi-title">Low Stock Items</div>
            <div className="kpi-value" style={{ color: '#f59e0b' }}>{lowStock}</div>
            <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', fontWeight: 600 }}>Action Required →</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/out-of-stock')} style={{ cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }} title="Click to open Out of Stock Alert Center">
          <div>
            <div className="kpi-title">Out of Stock</div>
            <div className="kpi-value" style={{ color: '#ef4444' }}>{outOfStock}</div>
            <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 600 }}>Critical Reorders →</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <XCircle size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/suppliers')} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} title="Click to view Suppliers">
          <div>
            <div className="kpi-title">Total Suppliers</div>
            <div className="kpi-value">{summary?.totalSuppliers || 0}</div>
            <div style={{ fontSize: '11px', color: '#14b8a6', marginTop: '4px' }}>View Directory →</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} title="Click to view Inventory Stock Valuation">
          <div>
            <div className="kpi-title">Total Inventory Value</div>
            <div className="kpi-value" style={{ color: '#10b981' }}>
              ₹{Number(summary?.totalInventoryValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Full Inventory Audit →</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <a href="/medicines" style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(2, 132, 199, 0.05))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', color: '#38bdf8', fontWeight: 700, fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          <Pill size={20} /> Manage Medicines <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </a>
        <a href="/stock-management" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', color: '#34d399', fontWeight: 700, fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          <Package size={20} /> Stock Operations <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </a>
        <a href="/suppliers" style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', color: '#a78bfa', fontWeight: 700, fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          <Users size={20} /> View Suppliers <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </a>
        <a href="/expiry" style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', color: '#fbbf24', fontWeight: 700, fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          <Calendar size={20} /> Expiry Tracking <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </a>
        <a href="/user-management" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', color: '#f87171', fontWeight: 700, fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          <Shield size={20} /> User Management <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </a>
        <a href="/supplier-catalogue" style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', color: '#c084fc', fontWeight: 700, fontSize: '14px',
          transition: 'all 0.2s ease'
        }}>
          <Store size={20} /> Supplier Catalogue <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </a>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Boxes size={18} color="#38bdf8" /> Stock Status Distribution
          </h3>
          {pieData.length > 0 ? (
            <>
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
            </>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              No stock data available
            </div>
          )}
        </div>

        {/* Summary Stats Panel */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#14b8a6" /> Inventory Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '14px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Total Stock Units</span>
              <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '16px' }}>{(summary?.totalStockQuantity || 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '14px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Active Suppliers</span>
              <span style={{ fontWeight: 800, color: '#14b8a6', fontSize: '16px' }}>{summary?.totalSuppliers || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '14px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Expiring Soon</span>
              <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: '16px' }}>{summary?.expiringSoonCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '14px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Expired</span>
              <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '16px' }}>{summary?.expiredCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '14px 16px', borderRadius: '10px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Pending Orders</span>
              <span style={{ fontWeight: 800, color: '#a78bfa', fontSize: '16px' }}>{summary?.pendingOrdersCount || 0}</span>
            </div>
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
            {(summary?.recentActivities || []).length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No recent activity</td></tr>
            ) : (
              summary.recentActivities.map((act) => (
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
                    {act.createdAt ? new Date(act.createdAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ───────────────────────────────────────────────
   PHARMACIST Dashboard – Monthly Purchases & Spend Tracker
   ─────────────────────────────────────────────── */
const PharmacistDashboard = ({ summary }) => {
  const navigate = useNavigate();
  const [medSearch, setMedSearch] = useState('');
  const [medResults, setMedResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Purchase Order tracking state
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poLoading, setPoLoading] = useState(false);
  const [poFilter, setPoFilter] = useState('ALL');
  const [monthlySalesTotal, setMonthlySalesTotal] = useState(0);

  // Quick Restock PO Modal
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedMedId, setSelectedMedId] = useState('');
  const [poQuantity, setPoQuantity] = useState(50);
  const [poUnitPrice, setPoUnitPrice] = useState(5.00);
  const [poNotes, setPoNotes] = useState('');
  const [poSubmitting, setPoSubmitting] = useState(false);

  const purchasesThisMonth = summary?.purchasesThisMonth || purchaseOrders.length || 0;
  const spendThisMonth = Number(summary?.spendThisMonth || purchaseOrders.reduce((sum, po) => sum + (po.status !== 'CANCELLED' ? Number(po.totalAmount || 0) : 0), 0));
  const totalMedicines = summary?.totalMedicines || 0;
  const available = summary?.availableStockCount || 0;
  const lowStock = summary?.lowStockCount || 0;

  useEffect(() => {
    fetchPurchaseOrders();
    fetchMonthlySales();
    fetchSuppliersAndMedicines();
  }, []);

  const fetchPurchaseOrders = async () => {
    setPoLoading(true);
    try {
      const res = await API.get('/api/purchase-orders', { params: { size: 50, sortDir: 'DESC' } });
      if (res.data?.data?.content) {
        setPurchaseOrders(res.data.data.content);
      }
    } catch (e) {
      console.warn('Purchase orders fetch error:', e);
    } finally {
      setPoLoading(false);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      const res = await API.get('/api/sales', { params: { size: 50 } });
      if (res.data?.data?.content) {
        const total = res.data.data.content
          .filter(s => s.status !== 'CANCELLED')
          .reduce((acc, s) => acc + Number(s.totalAmount || 0), 0);
        setMonthlySalesTotal(total);
      }
    } catch (e) {
      console.warn('Sales fetch error:', e);
    }
  };

  const fetchSuppliersAndMedicines = async () => {
    try {
      const supRes = await API.get('/api/suppliers/active');
      if (supRes.data?.data) setSuppliers(supRes.data.data);
      const medRes = await API.get('/api/medicines', { params: { size: 100 } });
      if (medRes.data?.data?.content) setAllMedicines(medRes.data.data.content);
    } catch (e) {}
  };

  const handleCreateRestockPO = async (e) => {
    e.preventDefault();
    if (!selectedSupplier || !selectedMedId || poQuantity <= 0) {
      alert('Please select a supplier, medicine, and valid quantity');
      return;
    }
    setPoSubmitting(true);
    try {
      await API.post('/api/purchase-orders', {
        supplierId: Number(selectedSupplier),
        expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        notes: poNotes || 'Pharmacist Restock Order',
        items: [
          {
            medicineId: Number(selectedMedId),
            quantity: Number(poQuantity),
            unitPrice: Number(poUnitPrice)
          }
        ]
      });
      alert('Purchase order created successfully! It will now be tracked.');
      setIsPoModalOpen(false);
      setSelectedSupplier('');
      setSelectedMedId('');
      setPoNotes('');
      fetchPurchaseOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create purchase order');
    } finally {
      setPoSubmitting(false);
    }
  };

  // Filtered PO list
  const filteredOrders = purchaseOrders.filter(po => {
    if (poFilter === 'ALL') return true;
    return po.status === poFilter;
  });

  // Calculate status breakdown
  const pendingCount = purchaseOrders.filter(p => p.status === 'PENDING').length;
  const approvedCount = purchaseOrders.filter(p => p.status === 'APPROVED').length;
  const shippedCount = purchaseOrders.filter(p => p.status === 'SHIPPED').length;
  const receivedCount = purchaseOrders.filter(p => p.status === 'RECEIVED').length;

  // Inline medicine search
  const handleMedSearch = async (query) => {
    setMedSearch(query);
    if (query.length < 2) { setMedResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await API.get('/api/medicines', { params: { search: query, page: 0, size: 6 } });
      setMedResults(res.data?.data?.content || []);
    } catch {
      setMedResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Mock comparison chart data for spend vs sales
  const comparisonData = [
    { month: 'May', RestockSpend: 8500, SalesRevenue: 14200 },
    { month: 'Jun', RestockSpend: 11200, SalesRevenue: 19800 },
    { month: 'Jul', RestockSpend: 9400, SalesRevenue: 16500 },
    { month: 'Aug (Current)', RestockSpend: spendThisMonth || 8100, SalesRevenue: monthlySalesTotal || 15400 },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={24} color="#38bdf8" /> Pharmacist Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Monthly restock procurement tracking, supplier spend, and inventory analytics</p>
        </div>
        <button
          onClick={() => setIsPoModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: '14px',
            padding: '10px 18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)'
          }}
        >
          <ShoppingCart size={18} /> + Create Restock PO
        </button>
      </div>

      {/* ── Row 1: Procurement & Financial KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Purchases This Month */}
        <div className="kpi-card" onClick={() => navigate('/supplier-orders')} style={{ borderLeft: '4px solid #8b5cf6', cursor: 'pointer' }} title="View Purchase Orders">
          <div>
            <div className="kpi-title">Purchases This Month</div>
            <div className="kpi-value" style={{ color: '#a78bfa' }}>{purchasesThisMonth} Orders</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              {receivedCount} Received · {shippedCount} In Transit · {pendingCount} Pending
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Spend This Month */}
        <div className="kpi-card" onClick={() => navigate('/supplier-orders')} style={{ borderLeft: '4px solid #ec4899', cursor: 'pointer' }} title="View Procurement Spend">
          <div>
            <div className="kpi-title">Restock Spend This Month</div>
            <div className="kpi-value" style={{ color: '#f472b6' }}>
              ₹{spendThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Procured from {suppliers.length || 4} verified suppliers
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <IndianRupee size={24} />
          </div>
        </div>

        {/* Counter Sales Revenue */}
        <div className="kpi-card" onClick={() => navigate('/sales')} style={{ borderLeft: '4px solid #10b981', cursor: 'pointer' }} title="Open POS & Sales">
          <div>
            <div className="kpi-title">Counter Sales Revenue</div>
            <div className="kpi-value" style={{ color: '#34d399' }}>
              ₹{monthlySalesTotal > 0 ? monthlySalesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '15,400.00'}
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Positive Retail Margin
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="kpi-card" onClick={() => navigate('/low-stock')} style={{ borderLeft: '4px solid #f59e0b', cursor: 'pointer' }} title="Open Low Stock Alert Center">
          <div>
            <div className="kpi-title">Low Stock Reorders</div>
            <div className="kpi-value" style={{ color: '#fbbf24' }}>{lowStock} Items</div>
            <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px' }}>
              {lowStock > 0 ? 'Requires immediate restock' : 'All stock above threshold'}
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Purchase Order Tracking & Restock Manager ── */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Truck size={20} color="#8b5cf6" /> Monthly Procurement & Restock Orders Tracker
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Track status from supplier dispatch to hospital inventory delivery</p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '6px', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #334155' }}>
            {['ALL', 'PENDING', 'APPROVED', 'SHIPPED', 'RECEIVED'].map((st) => (
              <button
                key={st}
                onClick={() => setPoFilter(st)}
                style={{
                  background: poFilter === st ? '#38bdf8' : 'transparent',
                  color: poFilter === st ? '#0f172a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st} {st === 'PENDING' && pendingCount > 0 ? `(${pendingCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* PO Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Order Spend (₹)</th>
                <th>Status & Tracking</th>
              </tr>
            </thead>
            <tbody>
              {poLoading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Loading monthly purchase orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No purchase orders matching filter "{poFilter}"</td></tr>
              ) : (
                filteredOrders.map((po) => (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 700, color: '#a78bfa' }}>{po.orderNumber}</td>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{po.supplierName || `Supplier #${po.supplierId}`}</td>
                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>{po.orderDate || (po.createdAt ? po.createdAt.split('T')[0] : '—')}</td>
                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>{po.expectedDelivery || 'Within 7 Days'}</td>
                    <td style={{ fontWeight: 800, color: '#f472b6', fontSize: '14px' }}>
                      ₹{Number(po.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${
                        po.status === 'RECEIVED' ? 'badge-success' :
                        po.status === 'SHIPPED' ? 'badge-info' :
                        po.status === 'APPROVED' ? 'badge-warning' : 'badge-neutral'
                      }`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {po.status === 'RECEIVED' && <CheckCircle size={13} />}
                        {po.status === 'SHIPPED' && <Truck size={13} />}
                        {po.status === 'APPROVED' && <Clock size={13} />}
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row 3: Spend vs Sales Analytics Chart & Live Medicine Search ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Restock Spend vs Sales Bar Chart */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#ec4899" /> Monthly Spend vs Sales Revenue (₹)
          </h3>
          <div style={{ height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="RestockSpend" fill="#ec4899" name="Restock Spend (₹)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="SalesRevenue" fill="#10b981" name="Sales Revenue (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', marginTop: '12px', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ec4899' }} /> Restock Spend
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }} /> Sales Revenue
            </span>
          </div>
        </div>

        {/* Medicine Search & Stock Lookup */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="#38bdf8" /> Instant Medicine & Stock Lookup
          </h3>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search medicine name, generic name..."
              value={medSearch}
              onChange={(e) => handleMedSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '42px' }}
            />
          </div>
          {searchLoading && <div style={{ color: '#94a3b8', fontSize: '13px', padding: '8px 0' }}>Searching catalogue...</div>}
          {medResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {medResults.map((med) => (
                <div key={med.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#0f172a', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '13.5px' }}>{med.medicineName}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                      {med.category || 'General'} · Unit Price: ₹{med.unitPrice} · Selling: ₹{med.sellingPrice}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: '13.5px',
                    color: (med.quantity || 0) < 20 ? '#fbbf24' : '#34d399'
                  }}>
                    {med.quantity ?? 0} units
                  </div>
                </div>
              ))}
            </div>
          )}
          {medSearch.length >= 2 && !searchLoading && medResults.length === 0 && (
            <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>No matching medicines found</div>
          )}
          {medSearch.length < 2 && (
            <div style={{ color: '#64748b', fontSize: '12.5px', textAlign: 'center', padding: '24px 0' }}>
              Type medicine or generic name to verify live stock level
            </div>
          )}
        </div>
      </div>

      {/* ── Create Restock PO Modal ── */}
      {isPoModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
            width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="#8b5cf6" /> Create Restock Purchase Order
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
              Issue a restock order to supplier. Order will automatically be tracked on your dashboard.
            </p>

            <form onSubmit={handleCreateRestockPO} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Select Supplier *</label>
                <select
                  required
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="input-field"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.supplierName} ({s.city || 'India'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Select Medicine *</label>
                <select
                  required
                  value={selectedMedId}
                  onChange={(e) => {
                    setSelectedMedId(e.target.value);
                    const found = allMedicines.find(m => String(m.id) === e.target.value);
                    if (found && found.unitPrice) setPoUnitPrice(found.unitPrice);
                  }}
                  className="input-field"
                >
                  <option value="">-- Choose Medicine --</option>
                  {allMedicines.map(m => (
                    <option key={m.id} value={m.id}>{m.medicineName} ({m.category}) - Stock: {m.quantity || 0}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Unit Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={poUnitPrice}
                    onChange={(e) => setPoUnitPrice(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>Estimated Total Spend:</span>
                <span style={{ fontWeight: 800, color: '#f472b6', fontSize: '16px' }}>
                  ₹{(Number(poQuantity || 0) * Number(poUnitPrice || 0)).toFixed(2)}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Order Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent antibiotic restock"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPoModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={poSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                >
                  {poSubmitting ? 'Submitting...' : 'Issue Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


/* ───────────────────────────────────────────────
   STAFF Dashboard (VIEWER / STAFF)
   ─────────────────────────────────────────────── */
const StaffDashboard = ({ summary }) => {
  const navigate = useNavigate();
  const [medSearch, setMedSearch] = useState('');
  const [medResults, setMedResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const totalMedicines = summary?.totalMedicines || 0;
  const available = summary?.availableStockCount || 0;
  const lowStock = summary?.lowStockCount || 0;

  const handleMedSearch = async (query) => {
    setMedSearch(query);
    if (query.length < 2) { setMedResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await API.get('/api/medicines', { params: { search: query, page: 0, size: 8 } });
      setMedResults(res.data?.data?.content || []);
    } catch {
      setMedResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={24} color="#38bdf8" /> Staff Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Medicine inventory overview and quick lookup</p>
      </div>

      {/* Summary Cards */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="kpi-card" onClick={() => navigate('/medicines')} style={{ borderLeft: '4px solid #0284c7', cursor: 'pointer' }} title="View Medicine Catalogue">
          <div>
            <div className="kpi-title">Total Medicines</div>
            <div className="kpi-value">{totalMedicines}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <Pill size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/inventory')} style={{ borderLeft: '4px solid #10b981', cursor: 'pointer' }} title="View Inventory Stock">
          <div>
            <div className="kpi-title">Available Stock</div>
            <div className="kpi-value" style={{ color: '#34d399' }}>{available}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('/low-stock')} style={{ borderLeft: '4px solid #f59e0b', cursor: 'pointer' }} title="View Low Stock Items">
          <div>
            <div className="kpi-title">Low Stock Items</div>
            <div className="kpi-value" style={{ color: '#fbbf24' }}>{lowStock}</div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Medicine Search / List */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} color="#38bdf8" /> Medicine Search
        </h3>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search medicines by name or category..."
            value={medSearch}
            onChange={(e) => handleMedSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px' }}
          />
        </div>
        {searchLoading && <div style={{ color: '#94a3b8', fontSize: '13px', padding: '8px 0' }}>Searching...</div>}
        {medResults.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {medResults.map((med) => (
              <div key={med.id} style={{
                background: '#0f172a', padding: '16px', borderRadius: '12px',
                border: '1px solid #334155', transition: 'transform 0.15s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '14px', marginBottom: '4px' }}>{med.medicineName}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{med.category || 'General'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${(med.quantity || 0) < 20 ? 'badge-warning' : 'badge-success'}`}>
                    {(med.quantity || 0) < 20 ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                    {(med.quantity || 0) < 20 ? 'Low Stock' : 'In Stock'}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: '#f8fafc' }}>{med.quantity ?? 0} units</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {medSearch.length >= 2 && !searchLoading && medResults.length === 0 && (
          <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No medicines found matching your search.</div>
        )}
        {medSearch.length < 2 && (
          <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>Type at least 2 characters to search for medicines</div>
        )}
      </div>

      {/* Recent Activity (read-only) */}
      <div className="table-container">
        <div className="table-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#f59e0b" /> Recent Inventory Activity
          </h3>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Action Type</th>
              <th>Quantity</th>
              <th>Performed By</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {(summary?.recentActivities || []).length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No recent activity</td></tr>
            ) : (
              summary.recentActivities.map((act) => (
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
                  <td style={{ color: '#94a3b8', fontSize: '13px' }}>{act.createdAt ? new Date(act.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ───────────────────────────────────────────────
   SUPPLIER Dashboard Component
   ─────────────────────────────────────────────── */
const SupplierDashboard = ({ supplierData }) => {
  const profile = supplierData?.supplierProfile || {};
  const medicines = supplierData?.suppliedMedicines || [];
  const orders = supplierData?.purchaseOrders || [];
  const totalRev = Number(supplierData?.totalRevenueSupplied || 0);
  const fulfillment = supplierData?.fulfillmentRate || 100;

  return (
    <>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={24} color="#f59e0b" /> Supplier Portal & Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Vendor profile, assigned purchase orders, supplied medicine inventory, and fulfillment metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/supplier-orders" className="btn btn-primary">
            <Truck size={16} /> Open Dispatch Portal
          </a>
          <a href="/messages" className="btn btn-secondary">
            <MessageSquare size={16} /> Message Admin
          </a>
        </div>
      </div>

      {/* ── Row 1: Profile & Performance KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Supplier Profile Card */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#14b8a6" /> Supplier Profile
            </h3>
            <span className="badge badge-success">{profile.status || 'ACTIVE'}</span>
          </div>

          <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>{profile.supplierName || 'Cipla Distributors'}</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>Contact: {profile.contactPerson || 'Rajesh Kumar'}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
              <div><strong style={{ color: '#cbd5e1' }}>Email:</strong> <div style={{ color: '#94a3b8' }}>{profile.email || 'contact@cipla.com'}</div></div>
              <div><strong style={{ color: '#cbd5e1' }}>Phone:</strong> <div style={{ color: '#94a3b8' }}>{profile.phone || '9876543210'}</div></div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: '#cbd5e1' }}>Address:</strong>
                <div style={{ color: '#94a3b8' }}>
                  {profile.address ? `${profile.address}, ${profile.city}, ${profile.state}, ${profile.country}` : 'MIDC Area, Mumbai, Maharashtra, India'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
            <div>
              <div className="kpi-title">Supplied Medicines</div>
              <div className="kpi-value">{supplierData?.totalSuppliedMedicines || medicines.length}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
              <Pill size={22} />
            </div>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div>
              <div className="kpi-title">Assigned POs</div>
              <div className="kpi-value" style={{ color: '#fbbf24' }}>{supplierData?.totalOrdersCount || orders.length}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <ClipboardList size={22} />
            </div>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
            <div>
              <div className="kpi-title">Revenue Supplied</div>
              <div className="kpi-value" style={{ color: '#34d399', fontSize: '18px' }}>
                ₹{totalRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <IndianRupee size={22} />
            </div>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <div>
              <div className="kpi-title">Fulfillment Rate</div>
              <div className="kpi-value" style={{ color: '#a78bfa' }}>{fulfillment}%</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
              <CheckCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Supplied Medicines Table ── */}
      <div className="table-container" style={{ marginBottom: '28px' }}>
        <div className="table-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={18} color="#38bdf8" /> Authorized Supplied Medicines
          </h3>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>Medicines supplied by this vendor and authorized inventory status</span>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine Code & Name</th>
              <th>Category</th>
              <th>Batch #</th>
              <th>Unit Price</th>
              <th>Authorized Stock Qty</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No supplied medicines linked to this supplier.</td></tr>
            ) : (
              medicines.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{m.medicineName}</div>
                    <div style={{ fontSize: '12px', color: '#38bdf8' }}>{m.medicineCode} {m.genericName ? `• ${m.genericName}` : ''}</div>
                  </td>
                  <td><span className="badge badge-info">{m.category || 'General'}</span></td>
                  <td style={{ color: '#94a3b8', fontSize: '13px' }}>{m.batchNumber || '-'}</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>₹{m.unitPrice}</td>
                  <td>
                    <span className={`badge ${(m.quantity || 0) < 20 ? 'badge-warning' : 'badge-success'}`}>
                      {m.quantity ?? 0} units in stock
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Row 3: Active Purchases / PO Table ── */}
      <div className="table-container" style={{ marginBottom: '28px' }}>
        <div className="table-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={18} color="#a78bfa" /> Assigned Purchase Orders & Status
          </h3>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No purchase orders assigned to this supplier.</td></tr>
            ) : (
              orders.map((po) => (
                <tr key={po.id}>
                  <td style={{ fontWeight: 700, color: '#a78bfa' }}>{po.orderNumber}</td>
                  <td style={{ color: '#94a3b8' }}>{po.orderDate ? new Date(po.orderDate).toLocaleDateString() : '—'}</td>
                  <td style={{ fontWeight: 700 }}>₹{Number(po.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge ${
                      po.status === 'RECEIVED' ? 'badge-success' :
                      po.status === 'SHIPPED' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <a href="/supplier-orders" className="btn btn-secondary btn-sm">
                      View / Dispatch
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ───────────────────────────────────────────────
   MAIN DASHBOARD – role-based switch
   ─────────────────────────────────────────────── */
export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = user?.role || 'PHARMACIST';

  useEffect(() => {
    if (role === 'SUPPLIER') {
      fetchSupplierDashboard();
    } else {
      fetchDashboardSummary();
    }
  }, [role]);

  const fetchDashboardSummary = async () => {
    try {
      const res = await API.get('/api/dashboard/summary');
      if (res.data?.data) {
        setSummary(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Unable to load dashboard data. Make sure the backend is running.');
      setSummary({
        totalMedicines: 0,
        availableStockCount: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        totalStockQuantity: 0,
        expiringSoonCount: 0,
        expiredCount: 0,
        totalSuppliers: 0,
        totalInventoryValue: 0,
        purchasesThisMonth: 0,
        spendThisMonth: 0,
        recentActivities: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierDashboard = async () => {
    try {
      const res = await API.get('/api/dashboard/supplier');
      if (res.data?.data) {
        setSupplierData(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Supplier dashboard fetch error:', err);
      setError('Unable to load supplier dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #334155',
            borderTopColor: '#38bdf8', borderRadius: '50%', margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '14px 20px',
          color: '#f87171',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
      {(() => {
        switch (role) {
          case 'ADMIN':
          case 'STORE_MANAGER':
            return <AdminDashboard summary={summary} />;
          case 'PHARMACIST':
            return <PharmacistDashboard summary={summary} />;
          case 'VIEWER':
          case 'STAFF':
            return <StaffDashboard summary={summary} />;
          case 'SUPPLIER':
            return <SupplierDashboard supplierData={supplierData} />;
          default:
            return <PharmacistDashboard summary={summary} />;
        }
      })()}
    </>
  );
};
