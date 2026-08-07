-- =========================================================
-- MEDISTOCK — Sample Test Data (PostgreSQL)
-- =========================================================

-- =========================================================
-- ROLES
-- =========================================================
INSERT INTO roles (role_name, description) VALUES
('ADMIN', 'Full system access - manage users, medicines, suppliers, inventory, orders, reports'),
('PHARMACIST', 'Manage medicines, update inventory, create purchase orders, view reports'),
('STORE_MANAGER', 'Manage inventory, stock, view purchase orders, receive deliveries'),
('VIEWER', 'Read-only access - view dashboard, medicines, reports');

-- =========================================================
-- USERS (password is BCrypt encoded for 'password123')
-- =========================================================
INSERT INTO users (first_name, last_name, email, password, phone, status, role_id) VALUES
('Admin', 'User', 'admin@medistock.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9876543210', 'ACTIVE', 1),
('John', 'Pharmacist', 'john@medistock.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9876543211', 'ACTIVE', 2),
('Jane', 'Manager', 'jane@medistock.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9876543212', 'ACTIVE', 3),
('Bob', 'Viewer', 'bob@medistock.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9876543213', 'ACTIVE', 4),
('Alice', 'Smith', 'alice@medistock.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9876543214', 'ACTIVE', 2);

-- =========================================================
-- MEDICINES
-- =========================================================
INSERT INTO medicines (medicine_code, medicine_name, generic_name, category, manufacturer, unit_price, selling_price, batch_number, description) VALUES
('MED001', 'Paracetamol 500mg', 'Acetaminophen', 'Analgesic', 'Cipla Ltd', 2.50, 5.00, 'BATCH-2025-001', 'Pain reliever and fever reducer'),
('MED002', 'Amoxicillin 250mg', 'Amoxicillin', 'Antibiotic', 'Sun Pharma', 8.00, 15.00, 'BATCH-2025-002', 'Broad-spectrum antibiotic'),
('MED003', 'Metformin 500mg', 'Metformin HCl', 'Antidiabetic', 'Dr Reddys', 3.00, 6.50, 'BATCH-2025-003', 'Oral diabetes medicine for type 2 diabetes'),
('MED004', 'Atorvastatin 10mg', 'Atorvastatin Calcium', 'Cardiovascular', 'Ranbaxy', 5.00, 12.00, 'BATCH-2025-004', 'Used to lower cholesterol and triglycerides'),
('MED005', 'Omeprazole 20mg', 'Omeprazole', 'Gastrointestinal', 'Cipla Ltd', 4.00, 9.00, 'BATCH-2025-005', 'Proton pump inhibitor for acid reflux'),
('MED006', 'Cetirizine 10mg', 'Cetirizine HCl', 'Antihistamine', 'Sun Pharma', 1.50, 4.00, 'BATCH-2025-006', 'Antihistamine for allergic reactions'),
('MED007', 'Aspirin 75mg', 'Acetylsalicylic Acid', 'Cardiovascular', 'Bayer', 2.00, 5.50, 'BATCH-2025-007', 'Blood thinner and pain reliever'),
('MED008', 'Ibuprofen 400mg', 'Ibuprofen', 'Analgesic', 'Cipla Ltd', 3.50, 7.00, 'BATCH-2025-008', 'Nonsteroidal anti-inflammatory drug'),
('MED009', 'Azithromycin 500mg', 'Azithromycin', 'Antibiotic', 'Zydus', 12.00, 25.00, 'BATCH-2025-009', 'Macrolide antibiotic'),
('MED010', 'Losartan 50mg', 'Losartan Potassium', 'Cardiovascular', 'Dr Reddys', 6.00, 14.00, 'BATCH-2025-010', 'Used to treat high blood pressure'),
('MED011', 'Pantoprazole 40mg', 'Pantoprazole Sodium', 'Gastrointestinal', 'Sun Pharma', 5.50, 11.00, 'BATCH-2025-011', 'Proton pump inhibitor'),
('MED012', 'Ciprofloxacin 500mg', 'Ciprofloxacin HCl', 'Antibiotic', 'Ranbaxy', 7.00, 16.00, 'BATCH-2025-012', 'Fluoroquinolone antibiotic'),
('MED013', 'Diclofenac 50mg', 'Diclofenac Sodium', 'Analgesic', 'Cipla Ltd', 2.00, 5.00, 'BATCH-2025-013', 'NSAID for pain and inflammation'),
('MED014', 'Amlodipine 5mg', 'Amlodipine Besylate', 'Cardiovascular', 'Zydus', 4.00, 10.00, 'BATCH-2025-014', 'Calcium channel blocker for hypertension'),
('MED015', 'Ranitidine 150mg', 'Ranitidine HCl', 'Gastrointestinal', 'Dr Reddys', 3.00, 7.50, 'BATCH-2025-015', 'H2 blocker for acid reduction');

-- =========================================================
-- SUPPLIERS
-- =========================================================
INSERT INTO suppliers (supplier_name, contact_person, email, phone, address, city, state, country, status) VALUES
('Cipla Distributors', 'Rajesh Kumar', 'rajesh@cipla.com', '9800000001', '123 Pharma Street', 'Mumbai', 'Maharashtra', 'India', 'ACTIVE'),
('Sun Pharma Supply', 'Priya Sharma', 'priya@sunpharma.com', '9800000002', '456 Medical Ave', 'Ahmedabad', 'Gujarat', 'India', 'ACTIVE'),
('Dr Reddys Wholesale', 'Vikram Singh', 'vikram@drreddys.com', '9800000003', '789 Health Road', 'Hyderabad', 'Telangana', 'India', 'ACTIVE'),
('Ranbaxy Logistics', 'Amit Patel', 'amit@ranbaxy.com', '9800000004', '321 Care Lane', 'Gurugram', 'Haryana', 'India', 'ACTIVE'),
('Zydus Healthcare', 'Neha Gupta', 'neha@zydus.com', '9800000005', '654 Wellness Blvd', 'Ahmedabad', 'Gujarat', 'India', 'ACTIVE'),
('Bayer Medical India', 'Suresh Nair', 'suresh@bayer.com', '9800000006', '987 Innovation Park', 'Bengaluru', 'Karnataka', 'India', 'INACTIVE');

-- =========================================================
-- INVENTORY
-- =========================================================
INSERT INTO inventory (medicine_id, quantity, minimum_stock, maximum_stock, location) VALUES
(1, 5000, 500, 10000, 'Warehouse A - Shelf 1'),
(2, 3000, 300, 8000, 'Warehouse A - Shelf 2'),
(3, 4500, 400, 9000, 'Warehouse A - Shelf 3'),
(4, 2000, 200, 5000, 'Warehouse B - Shelf 1'),
(5, 3500, 350, 7000, 'Warehouse B - Shelf 2'),
(6, 6000, 600, 12000, 'Warehouse B - Shelf 3'),
(7, 2500, 250, 6000, 'Warehouse C - Shelf 1'),
(8, 1800, 200, 4000, 'Warehouse C - Shelf 2'),
(9, 1200, 150, 3000, 'Warehouse C - Shelf 3'),
(10, 2200, 200, 5000, 'Warehouse D - Shelf 1'),
(11, 80, 300, 6000, 'Warehouse D - Shelf 2'),
(12, 1500, 150, 3500, 'Warehouse D - Shelf 3'),
(13, 50, 500, 8000, 'Warehouse E - Shelf 1'),
(14, 2800, 300, 6000, 'Warehouse E - Shelf 2'),
(15, 100, 200, 4000, 'Warehouse E - Shelf 3');

-- =========================================================
-- STOCK LOGS
-- =========================================================
INSERT INTO stock_logs (medicine_id, action_type, quantity, previous_quantity, new_quantity, performed_by, remarks) VALUES
(1, 'IN', 5000, 0, 5000, 'admin@medistock.com', 'Initial stock entry'),
(2, 'IN', 3000, 0, 3000, 'admin@medistock.com', 'Initial stock entry'),
(3, 'IN', 4500, 0, 4500, 'admin@medistock.com', 'Initial stock entry'),
(4, 'IN', 2000, 0, 2000, 'admin@medistock.com', 'Initial stock entry'),
(5, 'IN', 3500, 0, 3500, 'admin@medistock.com', 'Initial stock entry'),
(1, 'OUT', 200, 5200, 5000, 'john@medistock.com', 'Dispensed to ward 3'),
(2, 'OUT', 150, 3150, 3000, 'john@medistock.com', 'Dispensed to pharmacy counter'),
(3, 'ADJUSTMENT', 4500, 4600, 4500, 'jane@medistock.com', 'Stock correction after audit'),
(6, 'IN', 6000, 0, 6000, 'jane@medistock.com', 'New shipment received'),
(7, 'IN', 2500, 0, 2500, 'jane@medistock.com', 'New shipment received'),
(8, 'OUT', 300, 2100, 1800, 'john@medistock.com', 'Dispensed to OPD'),
(9, 'IN', 1200, 0, 1200, 'admin@medistock.com', 'Restocking order received'),
(10, 'IN', 2200, 0, 2200, 'admin@medistock.com', 'Restocking order received'),
(11, 'OUT', 500, 580, 80, 'john@medistock.com', 'Monthly distribution'),
(13, 'OUT', 600, 650, 50, 'john@medistock.com', 'Bulk dispensing for camp');

-- =========================================================
-- PURCHASE ORDERS
-- =========================================================
INSERT INTO purchase_orders (supplier_id, order_number, order_date, expected_delivery, status, total_amount) VALUES
(1, 'PO-2025-001', '2025-06-01', '2025-06-15', 'RECEIVED', 25000.00),
(2, 'PO-2025-002', '2025-06-10', '2025-06-25', 'RECEIVED', 48000.00),
(3, 'PO-2025-003', '2025-07-01', '2025-07-15', 'APPROVED', 32000.00),
(4, 'PO-2025-004', '2025-07-10', '2025-07-25', 'PENDING', 18500.00),
(5, 'PO-2025-005', '2025-07-15', '2025-07-30', 'PENDING', 42000.00),
(1, 'PO-2025-006', '2025-07-20', '2025-08-05', 'CANCELLED', 15000.00);

-- =========================================================
-- PURCHASE ORDER ITEMS
-- =========================================================
INSERT INTO purchase_order_items (purchase_order_id, medicine_id, quantity, unit_price, subtotal) VALUES
(1, 1, 5000, 2.50, 12500.00),
(1, 6, 5000, 1.50, 7500.00),
(1, 8, 2000, 3.50, 7000.00),
(2, 2, 3000, 8.00, 24000.00),
(2, 5, 3000, 4.00, 12000.00),
(2, 11, 2000, 5.50, 11000.00),
(3, 3, 4000, 3.00, 12000.00),
(3, 10, 2000, 6.00, 12000.00),
(3, 15, 2000, 3.00, 6000.00),
(4, 4, 1500, 5.00, 7500.00),
(4, 12, 1000, 7.00, 7000.00),
(4, 7, 2000, 2.00, 4000.00),
(5, 9, 1500, 12.00, 18000.00),
(5, 14, 2000, 4.00, 8000.00),
(5, 13, 4000, 2.00, 8000.00);

-- =========================================================
-- EXPIRY TRACKING
-- =========================================================
INSERT INTO expiry_tracking (medicine_id, expiry_date, batch_number, quantity, status) VALUES
(1, '2027-06-15', 'BATCH-2025-001', 5000, 'SAFE'),
(2, '2026-12-20', 'BATCH-2025-002', 3000, 'SAFE'),
(3, '2026-09-10', 'BATCH-2025-003', 4500, 'EXPIRING_SOON'),
(4, '2027-03-25', 'BATCH-2025-004', 2000, 'SAFE'),
(5, '2026-08-05', 'BATCH-2025-005', 3500, 'EXPIRING_SOON'),
(6, '2027-11-30', 'BATCH-2025-006', 6000, 'SAFE'),
(7, '2026-07-01', 'BATCH-2025-007', 2500, 'EXPIRED'),
(8, '2026-08-15', 'BATCH-2025-008', 1800, 'EXPIRING_SOON'),
(9, '2027-05-20', 'BATCH-2025-009', 1200, 'SAFE'),
(10, '2027-08-10', 'BATCH-2025-010', 2200, 'SAFE'),
(11, '2026-06-01', 'BATCH-2025-011', 80, 'EXPIRED'),
(12, '2027-01-15', 'BATCH-2025-012', 1500, 'SAFE'),
(13, '2026-05-20', 'BATCH-2025-013', 50, 'EXPIRED'),
(14, '2027-09-30', 'BATCH-2025-014', 2800, 'SAFE'),
(15, '2026-07-25', 'BATCH-2025-015', 100, 'EXPIRED');

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
INSERT INTO notifications (title, message, notification_type, status) VALUES
('Low Stock Alert: Pantoprazole', 'Pantoprazole 40mg stock is below minimum level. Current: 80, Minimum: 300', 'LOW_STOCK', 'UNREAD'),
('Low Stock Alert: Diclofenac', 'Diclofenac 50mg stock is below minimum level. Current: 50, Minimum: 500', 'LOW_STOCK', 'UNREAD'),
('Low Stock Alert: Ranitidine', 'Ranitidine 150mg stock is below minimum level. Current: 100, Minimum: 200', 'LOW_STOCK', 'UNREAD'),
('Expiry Alert: Aspirin', 'Aspirin 75mg batch BATCH-2025-007 has expired on 2026-07-01', 'EXPIRY_ALERT', 'UNREAD'),
('Expiry Alert: Pantoprazole', 'Pantoprazole 40mg batch BATCH-2025-011 has expired on 2026-06-01', 'EXPIRY_ALERT', 'READ'),
('Expiry Alert: Diclofenac', 'Diclofenac 50mg batch BATCH-2025-013 expired on 2026-05-20', 'EXPIRY_ALERT', 'READ'),
('Expiring Soon: Metformin', 'Metformin 500mg batch BATCH-2025-003 expires on 2026-09-10', 'EXPIRY_ALERT', 'UNREAD'),
('Expiring Soon: Omeprazole', 'Omeprazole 20mg batch BATCH-2025-005 expires on 2026-08-05', 'EXPIRY_ALERT', 'UNREAD'),
('Purchase Order Received', 'Purchase Order PO-2025-001 from Cipla Distributors has been received', 'PURCHASE_ALERT', 'READ'),
('Purchase Order Approved', 'Purchase Order PO-2025-003 from Dr Reddys Wholesale has been approved', 'PURCHASE_ALERT', 'UNREAD');
