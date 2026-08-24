import React, { useState } from 'react';
import API from '../api/axiosConfig';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Boxes,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('inventory');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [downloading, setDownloading] = useState(false);

  const reportTypes = [
    { id: 'inventory', title: 'Inventory Catalogue Report', icon: Boxes, desc: 'Complete list of all medicines, quantities, thresholds, and locations', endpoint: '/api/reports/inventory' },
    { id: 'low-stock', title: 'Low Stock Report', icon: AlertTriangle, desc: 'Medicines with current quantity equal to or below minimum stock level', endpoint: '/api/reports/low-stock' },
    { id: 'out-of-stock', title: 'Out of Stock Report', icon: XCircle, desc: 'Medicines with zero stock available', endpoint: '/api/reports/out-of-stock' },
    { id: 'expired', title: 'Expired Medicine Report', icon: XCircle, desc: 'Batches that have passed their expiration date', endpoint: '/api/reports/expired' },
    { id: 'expiring-soon', title: 'Expiring Soon Report', icon: Clock, desc: 'Medicines expiring within the configurable 30-day threshold', endpoint: '/api/reports/expiring-soon' },
    { id: 'stock-movement', title: 'Stock Movement Audit Report', icon: TrendingUp, desc: 'Historical stock IN, OUT, and adjustment transactions with timestamp and user details', endpoint: '/api/reports/stock-movement' },
    { id: 'suppliers', title: 'Supplier Directory & Performance Report', icon: Users, desc: 'Active suppliers, contact information, and supplied medicine counts', endpoint: '/api/reports/suppliers' },
    { id: 'purchases', title: 'Purchase Orders Report', icon: ShoppingCart, desc: 'Purchase order history, fulfillment status, and total order amounts', endpoint: '/api/reports/purchases' }
  ];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const activeReport = reportTypes.find(r => r.id === selectedReport);
      if (!activeReport) return;

      const params = {};
      if (selectedReport === 'stock-movement') {
        if (dateRange.from) params.from = dateRange.from;
        if (dateRange.to) params.to = dateRange.to;
      }

      const response = await API.get(activeReport.endpoint, {
        params,
        responseType: 'blob'
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medistock_${selectedReport}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Failed to generate report download. Please make sure the backend is running.');
    } finally {
      setDownloading(false);
    }
  };

  const activeObj = reportTypes.find(r => r.id === selectedReport);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText color="#0284c7" /> Report Generation & Downloads
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Generate and export real-time CSV reports calculated directly from PostgreSQL database records
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Report Selection Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {reportTypes.map((rep) => {
            const Icon = rep.icon;
            const isSelected = selectedReport === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep.id)}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.08)' : '#ffffff',
                  border: `1px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: isSelected ? 'rgba(2, 132, 199, 0.15)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isSelected ? '#0284c7' : '#64748b'
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? '#0284c7' : '#1e293b' }}>
                    {rep.title.split(' Report')[0]}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>CSV Download</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Report Config Panel */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {activeObj && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {React.createElement(activeObj.icon, { size: 24 })}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{activeObj.title}</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>{activeObj.desc}</p>
                </div>
              </div>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '24px 0' }} />

              {/* Optional Date Range Filter for Stock Movement */}
              {selectedReport === 'stock-movement' && (
                <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                    Date Range Filter (Optional)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: 600 }}>From Date</span>
                      <input
                        type="date"
                        className="input-field"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: 600 }}>To Date</span>
                      <input
                        type="date"
                        className="input-field"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Report Export Details</h4>
                <ul style={{ paddingLeft: '20px', color: '#64748b', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Format: CSV (Comma Separated Values)</li>
                  <li>Data Source: Live PostgreSQL Database</li>
                  <li>Authorization: Validated via JWT Role Claims</li>
                </ul>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
              >
                <Download size={18} />
                {downloading ? 'Generating Report...' : `Download ${activeObj.title} (CSV)`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
