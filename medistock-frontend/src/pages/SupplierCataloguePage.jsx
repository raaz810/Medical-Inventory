import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import {
  Store, ShoppingCart, Search, Package, Truck, Plus, Minus, Trash2,
  CheckCircle, IndianRupee, AlertTriangle, Calendar, ArrowRight, X,
  ClipboardList, Clock, Pill, RefreshCcw, Eye, LayoutGrid, List
} from 'lucide-react';

export const SupplierCataloguePage = () => {
  const { user } = useContext(AuthContext);
  const toast = useContext(ToastContext);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [medSearch, setMedSearch] = useState('');
  const [activeTab, setActiveTab] = useState('CATALOGUE'); // 'CATALOGUE' | 'HISTORY'
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' | 'GRID'

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [submittingCart, setSubmittingCart] = useState(false);

  // Direct Purchase Modal State
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [directMed, setDirectMed] = useState(null);
  const [directQty, setDirectQty] = useState(50);
  const [directUnitPrice, setDirectUnitPrice] = useState(5.00);
  const [directDeliveryDate, setDirectDeliveryDate] = useState('');
  const [directNotes, setDirectNotes] = useState('');
  const [submittingDirect, setSubmittingDirect] = useState(false);

  useEffect(() => {
    fetchSuppliers();
    fetchAllMedicines();
    const d = new Date(Date.now() + 7 * 86400000);
    setExpectedDelivery(d.toISOString().split('T')[0]);
    setDirectDeliveryDate(d.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedSupplierId) {
      const sup = suppliers.find(s => String(s.id) === String(selectedSupplierId));
      setSelectedSupplier(sup || null);
      fetchSupplierMedicines(selectedSupplierId);
      fetchSupplierOrders(selectedSupplierId);
    } else {
      setSelectedSupplier(null);
      setMedicines([]);
      setSupplierOrders([]);
    }
  }, [selectedSupplierId]);

  const fetchSuppliers = async () => {
    try {
      const res = await API.get('/api/suppliers/active');
      const list = res.data?.data || [];
      setSuppliers(list);
      if (list.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(String(list[0].id));
      }
    } catch (err) {
      toast.error('Failed to load active suppliers');
    }
  };

  const fetchAllMedicines = async () => {
    try {
      const res = await API.get('/api/medicines', { params: { size: 100 } });
      setAllMedicines(res.data?.data?.content || []);
    } catch (e) {}
  };

  const fetchSupplierMedicines = async (supplierId) => {
    setLoadingMeds(true);
    try {
      const res = await API.get('/api/medicines', {
        params: { supplierId: Number(supplierId), size: 100 }
      });
      const data = res.data?.data;
      if (data?.content) {
        setMedicines(data.content);
      } else if (Array.isArray(data)) {
        setMedicines(data);
      } else {
        setMedicines([]);
      }
    } catch (err) {
      toast.error('Failed to load supplier catalogue');
    } finally {
      setLoadingMeds(false);
    }
  };

  const fetchSupplierOrders = async (supplierId) => {
    setLoadingOrders(true);
    try {
      const res = await API.get('/api/purchase-orders', {
        params: { supplierId: Number(supplierId), size: 50, sortDir: 'DESC' }
      });
      const data = res.data?.data;
      if (data?.content) {
        setSupplierOrders(data.content);
      } else if (Array.isArray(data)) {
        setSupplierOrders(data);
      } else {
        setSupplierOrders([]);
      }
    } catch (err) {
      toast.error('Failed to load purchase history');
    } finally {
      setLoadingOrders(false);
    }
  };

  const displayedMedicines = (medicines.length > 0 ? medicines : allMedicines).filter(m => {
    if (!medSearch) return true;
    const q = medSearch.toLowerCase();
    return (
      (m.medicineName || '').toLowerCase().includes(q) ||
      (m.genericName || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q) ||
      (m.medicineCode || '').toLowerCase().includes(q)
    );
  });

  // Direct 1-Click Purchase Handlers
  const handleOpenDirectBuy = (med) => {
    setDirectMed(med);
    setDirectUnitPrice(med.unitPrice || 5.00);
    setDirectQty(50);
    setDirectNotes(`Procurement order from ${selectedSupplier?.supplierName || 'supplier'}`);
    setIsDirectModalOpen(true);
  };

  const handleConfirmDirectOrder = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId || !directMed || directQty <= 0) {
      toast.error('Please specify a valid quantity.');
      return;
    }

    setSubmittingDirect(true);
    try {
      const res = await API.post('/api/purchase-orders', {
        supplierId: Number(selectedSupplierId),
        expectedDeliveryDate: directDeliveryDate,
        notes: directNotes || 'Direct purchase order',
        items: [
          {
            medicineId: Number(directMed.id),
            quantity: Number(directQty),
            unitPrice: Number(directUnitPrice)
          }
        ]
      });
      const poNum = res.data?.data?.orderNumber || 'PO';
      toast.success(`Purchase Order ${poNum} created successfully for ₹${(Number(directQty) * Number(directUnitPrice)).toFixed(2)}!`);
      setIsDirectModalOpen(false);
      fetchSupplierOrders(selectedSupplierId);
      fetchSupplierMedicines(selectedSupplierId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit purchase order.');
    } finally {
      setSubmittingDirect(false);
    }
  };

  // Status Change Handler
  const handleUpdateOrderStatus = async (poId, status) => {
    try {
      await API.put(`/api/purchase-orders/${poId}/status`, null, { params: { status } });
      toast.success(`Order status updated to ${status}! ${status === 'RECEIVED' ? 'Inventory stock has been automatically updated.' : ''}`);
      fetchSupplierOrders(selectedSupplierId);
      fetchSupplierMedicines(selectedSupplierId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Cart Handlers
  const addToCart = (med) => {
    const existing = cart.find(c => c.medicineId === med.id);
    if (existing) {
      setCart(cart.map(c => c.medicineId === med.id ? { ...c, quantity: c.quantity + 50 } : c));
    } else {
      setCart([...cart, {
        medicineId: med.id,
        medicineName: med.medicineName,
        medicineCode: med.medicineCode,
        category: med.category,
        unitPrice: med.unitPrice || 5.00,
        quantity: 50,
        currentStock: med.quantity || 0,
      }]);
    }
    toast.success(`Added ${med.medicineName} to purchase cart`);
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(c => c.medicineId !== medicineId));
  };

  const updateCartQty = (medicineId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart(cart.map(c => c.medicineId === medicineId ? { ...c, quantity: newQty } : c));
  };

  const updateCartPrice = (medicineId, newPrice) => {
    setCart(cart.map(c => c.medicineId === medicineId ? { ...c, unitPrice: Number(newPrice) } : c));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitCartPurchaseOrder = async () => {
    if (cart.length === 0) {
      toast.error('Add at least one medicine to the cart');
      return;
    }
    if (!selectedSupplierId) {
      toast.error('Please select a supplier first');
      return;
    }
    setSubmittingCart(true);
    try {
      await API.post('/api/purchase-orders', {
        supplierId: Number(selectedSupplierId),
        expectedDeliveryDate: expectedDelivery,
        notes: orderNotes || `Bulk purchase order from ${selectedSupplier?.supplierName || 'supplier'}`,
        items: cart.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      });
      toast.success('Bulk purchase order created successfully!');
      setCart([]);
      setIsCartOpen(false);
      setOrderNotes('');
      fetchSupplierOrders(selectedSupplierId);
      fetchSupplierMedicines(selectedSupplierId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create purchase order');
    } finally {
      setSubmittingCart(false);
    }
  };

  const isInCart = (medId) => cart.some(c => c.medicineId === medId);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Store color="#8b5cf6" size={28} /> Supplier Medicine Catalogue & Direct Procurement
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Select any pharmaceutical vendor to browse supplied catalogue medicines, place direct or bulk purchase orders, and monitor purchase order fulfillment history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: cart.length > 0 ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : '#1e293b',
              border: '1px solid #334155',
              color: cart.length > 0 ? 'white' : '#94a3b8',
              fontWeight: 700,
              fontSize: '13.5px',
              padding: '10px 18px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: cart.length > 0 ? '0 4px 14px rgba(139, 92, 246, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ShoppingCart size={18} />
            Bulk Cart ({cart.length})
            {cart.length > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#ef4444', color: 'white',
                fontSize: '11px', fontWeight: 800,
                width: '22px', height: '22px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0f172a'
              }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Supplier Selector Bar & Vendor Details Card */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="#8b5cf6" /> Select Supplier:
            </label>
            <select
              value={selectedSupplierId}
              onChange={(e) => { setSelectedSupplierId(e.target.value); setMedSearch(''); }}
              className="input-field"
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '10px',
                padding: '10px 16px',
                fontWeight: 700,
                fontSize: '14px',
                flex: 1
              }}
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.supplierName} ({s.city || s.state || 'India'}) — {s.status}
                </option>
              ))}
            </select>
          </div>

          {selectedSupplier && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#94a3b8', alignItems: 'center' }}>
              <span><strong>Contact Person:</strong> <span style={{ color: '#f8fafc' }}>{selectedSupplier.contactPerson || '—'}</span></span>
              <span><strong>Phone:</strong> <span style={{ color: '#38bdf8' }}>{selectedSupplier.phone || '—'}</span></span>
              <span><strong>Email:</strong> <span style={{ color: '#a78bfa' }}>{selectedSupplier.email || '—'}</span></span>
              <span className="badge badge-success" style={{ fontSize: '11.5px' }}>{selectedSupplier.status}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs: Supplier Medicine Catalogue vs Purchase History */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#1e293b', padding: '6px', borderRadius: '12px', border: '1px solid #334155' }}>
          <button
            onClick={() => setActiveTab('CATALOGUE')}
            style={{
              background: activeTab === 'CATALOGUE' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'transparent',
              color: activeTab === 'CATALOGUE' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <Pill size={16} /> Supplier Medicine Catalogue ({displayedMedicines.length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            style={{
              background: activeTab === 'HISTORY' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'transparent',
              color: activeTab === 'HISTORY' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <ClipboardList size={16} /> Purchase History ({supplierOrders.length})
          </button>
        </div>

        {activeTab === 'CATALOGUE' && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search catalogue medicines..."
                value={medSearch}
                onChange={(e) => setMedSearch(e.target.value)}
                className="input-field"
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  paddingLeft: '38px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                  fontSize: '13px',
                  borderRadius: '10px'
                }}
              />
            </div>

            <div style={{ display: 'flex', background: '#1e293b', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
              <button
                onClick={() => setViewMode('TABLE')}
                style={{
                  background: viewMode === 'TABLE' ? '#334155' : 'transparent',
                  border: 'none', color: viewMode === 'TABLE' ? '#38bdf8' : '#64748b',
                  padding: '6px 8px', borderRadius: '6px', cursor: 'pointer'
                }}
                title="Table View"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                style={{
                  background: viewMode === 'GRID' ? '#334155' : 'transparent',
                  border: 'none', color: viewMode === 'GRID' ? '#38bdf8' : '#64748b',
                  padding: '6px 8px', borderRadius: '6px', cursor: 'pointer'
                }}
                title="Grid Cards View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: SUPPLIER MEDICINE CATALOGUE */}
      {activeTab === 'CATALOGUE' && (
        <>
          {loadingMeds ? (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Loading {selectedSupplier?.supplierName}'s medicine catalogue...</div>
            </div>
          ) : displayedMedicines.length === 0 ? (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
              <Package size={48} color="#64748b" style={{ display: 'block', margin: '0 auto 16px auto', opacity: 0.5 }} />
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>No Medicines Found</div>
              <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
                {medSearch ? `No medicines matching "${medSearch}" in this supplier's catalogue.` : 'This supplier has no medicines listed in the catalogue.'}
              </div>
            </div>
          ) : viewMode === 'TABLE' ? (
            /* Table View */
            <div className="table-container" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Medicine Name & Code</th>
                    <th>Category</th>
                    <th>Manufacturer</th>
                    <th>Buy Price (₹)</th>
                    <th>Sell Price (₹)</th>
                    <th>Current Hospital Stock</th>
                    <th style={{ textAlign: 'right' }}>Procurement Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMedicines.map((m) => {
                    const inCart = isInCart(m.id);
                    const isLow = (m.quantity || 0) < (m.minimumStock || 20);
                    const isOut = (m.quantity || 0) === 0;
                    return (
                      <tr key={m.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{m.medicineName}</div>
                          <div style={{ fontSize: '12px', color: '#38bdf8' }}>{m.medicineCode} {m.genericName ? `• ${m.genericName}` : ''}</div>
                        </td>
                        <td><span className="badge badge-info">{m.category || 'General'}</span></td>
                        <td style={{ color: '#94a3b8' }}>{m.manufacturer || '—'}</td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>₹{m.unitPrice}</td>
                        <td style={{ fontWeight: 700, color: '#38bdf8' }}>₹{m.sellingPrice}</td>
                        <td>
                          <span className={`badge ${isOut ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                            {isOut ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                            {isOut ? 'Out of Stock (0)' : isLow ? `Low (${m.quantity})` : `${m.quantity || 0} in stock`}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenDirectBuy(m)}
                              style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                border: 'none',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <ShoppingCart size={13} /> Buy from Supplier
                            </button>
                            <button
                              onClick={() => addToCart(m)}
                              style={{
                                background: inCart ? '#059669' : '#334155',
                                border: 'none',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Add to Bulk Purchase Cart"
                            >
                              {inCart ? <CheckCircle size={13} /> : <Plus size={13} />}
                              {inCart ? 'In Cart' : 'Cart'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {displayedMedicines.map((med) => {
                const inCart = isInCart(med.id);
                const isLow = (med.quantity || 0) < (med.minimumStock || 20);
                const isOut = (med.quantity || 0) === 0;
                return (
                  <div key={med.id} style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>{med.medicineName}</div>
                          <div style={{ fontSize: '12px', color: '#38bdf8' }}>{med.medicineCode} {med.genericName ? `• ${med.genericName}` : ''}</div>
                        </div>
                        <span className="badge badge-info">{med.category || 'General'}</span>
                      </div>

                      <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                          <span>Manufacturer:</span>
                          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{med.manufacturer || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                          <span>Purchase Unit Price:</span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>₹{med.unitPrice || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                          <span>Selling Unit Price:</span>
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>₹{med.sellingPrice || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', alignItems: 'center' }}>
                          <span>Current Hospital Stock:</span>
                          <span className={`badge ${isOut ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                            {isOut ? 'Out of Stock (0)' : isLow ? `Low (${med.quantity})` : `${med.quantity || 0} units`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        onClick={() => handleOpenDirectBuy(med)}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                          border: 'none',
                          color: 'white',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingCart size={14} /> Buy from Supplier
                      </button>
                      <button
                        onClick={() => addToCart(med)}
                        style={{
                          background: inCart ? '#059669' : '#334155',
                          border: 'none',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {inCart ? <CheckCircle size={14} /> : <Plus size={14} />}
                        {inCart ? 'In Cart' : 'Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: PURCHASE ORDER HISTORY */}
      {activeTab === 'HISTORY' && (
        <div className="table-container" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Total Amount (₹)</th>
                <th>Fulfillment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '28px', color: '#94a3b8' }}>Loading purchase order history...</td></tr>
              ) : supplierOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <ClipboardList size={36} style={{ display: 'block', margin: '0 auto 10px auto', opacity: 0.5 }} />
                    No purchase orders recorded with {selectedSupplier?.supplierName || 'this supplier'} yet.
                  </td>
                </tr>
              ) : (
                supplierOrders.map((po) => (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 800, color: '#a78bfa' }}>{po.orderNumber}</td>
                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>
                      {po.orderDate ? new Date(po.orderDate).toLocaleDateString() : (po.createdAt ? po.createdAt.split('T')[0] : '—')}
                    </td>
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {po.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(po.id, 'APPROVED')}
                            className="btn btn-sm btn-secondary"
                            style={{ fontSize: '11px', color: '#fbbf24' }}
                          >
                            Approve PO
                          </button>
                        )}
                        {po.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(po.id, 'RECEIVED')}
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: '11px', background: '#10b981' }}
                          >
                            Receive & Restock
                          </button>
                        )}
                        {po.status === 'RECEIVED' && (
                          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>✓ Stock Updated</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* DIRECT PURCHASE ORDER MODAL */}
      {isDirectModalOpen && directMed && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
            width: '100%', maxWidth: '500px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={20} color="#8b5cf6" /> Buy Medicine from Supplier
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', margin: 0 }}>
                  Supplier: <strong style={{ color: '#a78bfa' }}>{selectedSupplier?.supplierName}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsDirectModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmDirectOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '10px', border: '1px solid #334155' }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '14px' }}>{directMed.medicineName}</div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>{directMed.medicineCode} • {directMed.category || 'General'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Quantity to Buy *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={directQty}
                    onChange={(e) => setDirectQty(e.target.value)}
                    className="input-field"
                    style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
                  />
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {[20, 50, 100].map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setDirectQty(q)}
                        style={{
                          background: '#0f172a', border: '1px solid #334155', color: '#94a3b8',
                          borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer'
                        }}
                      >
                        +{q}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Unit Purchase Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={directUnitPrice}
                    onChange={(e) => setDirectUnitPrice(e.target.value)}
                    className="input-field"
                    style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
                  />
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>Total Purchase Cost:</span>
                <span style={{ fontWeight: 800, color: '#f472b6', fontSize: '17px' }}>
                  ₹{(Number(directQty || 0) * Number(directUnitPrice || 0)).toFixed(2)}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Expected Delivery Date</label>
                <input
                  type="date"
                  value={directDeliveryDate}
                  onChange={(e) => setDirectDeliveryDate(e.target.value)}
                  className="input-field"
                  style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Order Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent stock reorder"
                  value={directNotes}
                  onChange={(e) => setDirectNotes(e.target.value)}
                  className="input-field"
                  style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsDirectModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDirect}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                >
                  {submittingDirect ? 'Submitting...' : 'Confirm & Issue PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK PURCHASE CART SLIDE-OVER MODAL */}
      {isCartOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={20} color="#8b5cf6" /> Bulk Purchase Order Cart
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <ShoppingCart size={40} color="#64748b" style={{ display: 'block', margin: '0 auto 12px auto' }} />
                <p style={{ fontWeight: 600, color: '#cbd5e1' }}>Your purchase cart is empty</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Add medicines from the catalogue to create a bulk purchase order.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cart.map((item) => (
                    <div key={item.medicineId} style={{
                      background: '#0f172a', border: '1px solid #334155', borderRadius: '10px',
                      padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '13.5px' }}>{item.medicineName}</div>
                        <div style={{ fontSize: '11.5px', color: '#38bdf8' }}>{item.medicineCode} • Stock: {item.currentStock}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.medicineId, item.quantity - 10)}
                          style={{ background: '#334155', border: 'none', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' }}
                        >-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQty(item.medicineId, parseInt(e.target.value) || 0)}
                          style={{ width: '50px', textAlign: 'center', background: '#1e293b', border: '1px solid #475569', color: 'white', borderRadius: '4px', padding: '3px' }}
                        />
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.medicineId, item.quantity + 10)}
                          style={{ background: '#334155', border: 'none', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' }}
                        >+</button>
                      </div>

                      <div style={{ fontWeight: 700, color: '#f472b6', fontSize: '14px', minWidth: '70px', textAlign: 'right' }}>
                        ₹{(item.quantity * item.unitPrice).toFixed(2)}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.medicineId)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Total Order Value:</span>
                  <span style={{ fontWeight: 800, color: '#f472b6', fontSize: '18px' }}>₹{cartTotal.toFixed(2)}</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Expected Delivery Date</label>
                  <input
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="input-field"
                    style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Order Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Standard monthly replenishment order"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="input-field"
                    style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitCartPurchaseOrder}
                    disabled={submittingCart}
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                  >
                    {submittingCart ? 'Submitting PO...' : `Submit PO (₹${cartTotal.toFixed(2)})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
