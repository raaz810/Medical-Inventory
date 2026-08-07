import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axiosConfig';
import { ToastContext } from '../context/ToastContext';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { Boxes, Search, AlertTriangle, CheckCircle, Sliders, ArrowDownUp, MapPin, Edit3 } from 'lucide-react';

export const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Threshold modal
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [thresholdForm, setThresholdForm] = useState({
    minimumStock: 10,
    maximumStock: 500,
    location: 'Main Pharmacy',
  });

  const toast = useContext(ToastContext);

  useEffect(() => {
    fetchInventory();
  }, [search, page, size]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/inventory', {
        params: { search, page, size, sortBy: 'medicine.medicineName', sortDir: 'ASC' }
      });
      const data = res.data.data;
      setInventory(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load inventory stock levels');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenThreshold = (item) => {
    setSelectedItem(item);
    setThresholdForm({
      minimumStock: item.minimumStock || 10,
      maximumStock: item.maximumStock || 500,
      location: item.location || 'Main Pharmacy Shelf A',
    });
    setIsThresholdModalOpen(true);
  };

  const handleSaveThresholds = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await API.put(`/api/inventory/medicine/${selectedItem.medicineId}/thresholds`, null, {
        params: {
          minimumStock: thresholdForm.minimumStock,
          maximumStock: thresholdForm.maximumStock,
          location: thresholdForm.location,
        }
      });
      toast.success('Inventory thresholds and storage location updated!');
      setIsThresholdModalOpen(false);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update thresholds');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>Stock & Inventory Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Monitor current stock quantities, reorder thresholds, and shelf locations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search inventory by medicine name or code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="input-field"
            style={{ paddingLeft: '42px' }}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Available Qty</th>
              <th>Min / Max Threshold</th>
              <th>Status</th>
              <th>Storage Location</th>
              <th style={{ textAlign: 'right' }}>Configure</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Loading inventory...</td></tr>
            ) : inventory.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No inventory records found.</td></tr>
            ) : (
              inventory.map((item) => {
                const isLow = item.isLowStock || (item.quantity < item.minimumStock);
                const isOut = item.quantity === 0;

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{item.medicineName}</div>
                      <div style={{ fontSize: '12px', color: '#38bdf8' }}>{item.medicineCode}</div>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{item.category || 'General'}</td>
                    <td>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: isOut ? '#ef4444' : (isLow ? '#f59e0b' : '#10b981') }}>
                        {item.quantity} units
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '13px' }}>
                      Min: {item.minimumStock} | Max: {item.maximumStock}
                    </td>
                    <td>
                      <span className={`badge ${isOut ? 'badge-danger' : (isLow ? 'badge-warning' : 'badge-success')}`}>
                        {isOut ? <AlertTriangle size={14} /> : (isLow ? <AlertTriangle size={14} /> : <CheckCircle size={14} />)}
                        {isOut ? 'Out of Stock' : (isLow ? 'Low Stock Alert' : 'In Stock')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#cbd5e1' }}>
                        <MapPin size={14} color="#14b8a6" /> {item.location || 'Main Shelf'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleOpenThreshold(item)} className="btn btn-secondary btn-sm" title="Edit Min/Max & Location">
                        <Sliders size={14} /> Configure
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          pageSize={size}
          onPageSizeChange={(s) => { setSize(s); setPage(0); }}
        />
      </div>

      {/* Threshold Modal */}
      <Modal isOpen={isThresholdModalOpen} onClose={() => setIsThresholdModalOpen(false)} title="Configure Stock Thresholds">
        <form onSubmit={handleSaveThresholds} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#0f172a', padding: '14px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ fontWeight: 700, color: '#38bdf8' }}>{selectedItem?.medicineName}</div>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Current Stock: {selectedItem?.quantity} units</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Minimum Reorder Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={thresholdForm.minimumStock}
                onChange={(e) => setThresholdForm({ ...thresholdForm, minimumStock: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Maximum Stock Capacity
              </label>
              <input
                type="number"
                min="1"
                required
                value={thresholdForm.maximumStock}
                onChange={(e) => setThresholdForm({ ...thresholdForm, maximumStock: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Pharmacy Shelf / Storage Location
            </label>
            <input
              type="text"
              required
              value={thresholdForm.location}
              onChange={(e) => setThresholdForm({ ...thresholdForm, location: e.target.value })}
              className="input-field"
              placeholder="e.g. Main Pharmacy Shelf B3"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsThresholdModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Configuration</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
