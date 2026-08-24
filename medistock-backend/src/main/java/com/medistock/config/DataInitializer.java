package com.medistock.config;

import com.medistock.entity.Inventory;
import com.medistock.entity.Medicine;
import com.medistock.entity.Role;
import com.medistock.entity.Supplier;
import com.medistock.entity.User;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.RoleRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final com.medistock.repository.MessageRepository messageRepository;
    private final com.medistock.repository.ExpiryTrackingRepository expiryTrackingRepository;
    private final com.medistock.repository.PurchaseOrderRepository purchaseOrderRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           SupplierRepository supplierRepository,
                           MedicineRepository medicineRepository,
                           InventoryRepository inventoryRepository,
                           com.medistock.repository.MessageRepository messageRepository,
                           com.medistock.repository.ExpiryTrackingRepository expiryTrackingRepository,
                           com.medistock.repository.PurchaseOrderRepository purchaseOrderRepository,
                           PasswordEncoder passwordEncoder,
                           JdbcTemplate jdbcTemplate) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.messageRepository = messageRepository;
        this.expiryTrackingRepository = expiryTrackingRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    public void run(String... args) throws Exception {
        log.info("Checking data initialization...");

        // Fix database constraints dynamically
        try {
            jdbcTemplate.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_notification_type_check");
            jdbcTemplate.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS chk_notif_type");
            jdbcTemplate.execute("ALTER TABLE expiry_tracking DROP CONSTRAINT IF EXISTS expiry_tracking_status_check");
            jdbcTemplate.execute("ALTER TABLE expiry_tracking DROP CONSTRAINT IF EXISTS chk_expiry_status");
            jdbcTemplate.execute("ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_status_check");
            jdbcTemplate.execute("ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS chk_po_status");
        } catch (Exception e) {
            log.warn("Database constraint adjustment note: {}", e.getMessage());
        }

        // 1. Initialize Roles
        Role adminRole = getOrCreateRole("ADMIN", "System Administrator Role");
        Role pharmacistRole = getOrCreateRole("PHARMACIST", "Pharmacist Role");
        Role storeManagerRole = getOrCreateRole("STORE_MANAGER", "Store Manager Role");
        Role viewerRole = getOrCreateRole("VIEWER", "Staff Viewer Role");
        Role staffRole = getOrCreateRole("STAFF", "Staff Role - Limited Inventory Access");
        Role supplierRole = getOrCreateRole("SUPPLIER", "Supplier Partner Role");

        // 2. Initialize Default Users
        User adminUser = getOrCreateUser("admin@medistock.com", "admin123", "Admin", "User", adminRole);
        User pharmUser = getOrCreateUser("pharmacist@medistock.com", "password123", "Pharmacist", "Staff", pharmacistRole);
        getOrCreateUser("store_manager@medistock.com", "password123", "Store", "Manager", storeManagerRole);
        getOrCreateUser("viewer@medistock.com", "password123", "Staff", "Viewer", viewerRole);
        getOrCreateUser("staff@medistock.com", "password123", "Staff", "Member", staffRole);
        User suppUser = getOrCreateUser("supplier@medistock.com", "password123", "Supplier", "Partner", supplierRole);

        // Seed initial sample messages if MessageRepository is empty
        if (messageRepository.count() == 0) {
            log.info("Seeding initial chat messages...");
            if (adminUser != null && pharmUser != null) {
                com.medistock.entity.Message msg1 = new com.medistock.entity.Message();
                msg1.setSender(pharmUser);
                msg1.setReceiver(adminUser);
                msg1.setSubject("Stock Reorder Request");
                msg1.setContent("Hi Admin, Amoxicillin stock is running low. Should we issue a new Purchase Order?");
                messageRepository.save(msg1);

                com.medistock.entity.Message msg2 = new com.medistock.entity.Message();
                msg2.setSender(adminUser);
                msg2.setReceiver(pharmUser);
                msg2.setSubject("Re: Stock Reorder Request");
                msg2.setContent("Approved! I have created PO-2026-041 with Cipla Distributors.");
                messageRepository.save(msg2);
            }

            if (adminUser != null && suppUser != null) {
                com.medistock.entity.Message msg3 = new com.medistock.entity.Message();
                msg3.setSender(suppUser);
                msg3.setReceiver(adminUser);
                msg3.setSubject("Shipment Dispatched");
                msg3.setContent("Hello Admin, shipment for PO-2026-041 has been dispatched via BlueDart logistics.");
                messageRepository.save(msg3);
            }
        }

        // 3. Initialize Suppliers if empty
        if (supplierRepository.count() == 0) {
            log.info("Seeding initial active suppliers...");
            Supplier cipla = supplierRepository.save(Supplier.builder()
                    .supplierName("Cipla Distributors")
                    .contactPerson("Rajesh Kumar")
                    .email("contact@cipla.com")
                    .phone("9876543210")
                    .address("Plot 14, MIDC Industrial Area")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .country("India")
                    .status("ACTIVE")
                    .build());

            if (suppUser != null && suppUser.getSupplier() == null) {
                suppUser.setSupplier(cipla);
                userRepository.save(suppUser);
            }

            Supplier sunPharma = supplierRepository.save(Supplier.builder()
                    .supplierName("Sun Pharma Ltd")
                    .contactPerson("Anita Sharma")
                    .email("orders@sunpharma.com")
                    .phone("9876543211")
                    .address("Sun House, Goregaon East")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .country("India")
                    .status("ACTIVE")
                    .build());

            Supplier ranbaxy = supplierRepository.save(Supplier.builder()
                    .supplierName("Ranbaxy Supplies")
                    .contactPerson("Vikram Singh")
                    .email("info@ranbaxy.com")
                    .phone("9876543212")
                    .address("Sector 18, Udyog Vihar")
                    .city("Gurugram")
                    .state("Haryana")
                    .country("India")
                    .status("ACTIVE")
                    .build());

            Supplier drReddy = supplierRepository.save(Supplier.builder()
                    .supplierName("Dr. Reddy's Labs")
                    .contactPerson("Priya Nair")
                    .email("supply@drreddys.com")
                    .phone("9876543213")
                    .address("Banjara Hills Road No 3")
                    .city("Hyderabad")
                    .state("Telangana")
                    .country("India")
                    .status("ACTIVE")
                    .build());

            // 4. Initialize Medicines if empty
            if (medicineRepository.count() == 0) {
                log.info("Seeding initial medicines...");
                Medicine amox = medicineRepository.save(Medicine.builder()
                        .medicineCode("MED-1001")
                        .medicineName("Amoxicillin 500mg")
                        .genericName("Amoxicillin")
                        .category("Antibiotics")
                        .manufacturer("Cipla")
                        .unitPrice(new BigDecimal("5.00"))
                        .sellingPrice(new BigDecimal("12.00"))
                        .batchNumber("BATCH-1001")
                        .description("Broad spectrum antibiotic capsule")
                        .supplier(cipla)
                        .build());

                Medicine para = medicineRepository.save(Medicine.builder()
                        .medicineCode("MED-1002")
                        .medicineName("Paracetamol 650mg")
                        .genericName("Paracetamol")
                        .category("Painkillers")
                        .manufacturer("Sun Pharma")
                        .unitPrice(new BigDecimal("2.00"))
                        .sellingPrice(new BigDecimal("6.00"))
                        .batchNumber("BATCH-1002")
                        .description("Fever and pain relief tablet")
                        .supplier(sunPharma)
                        .build());

                Medicine ibup = medicineRepository.save(Medicine.builder()
                        .medicineCode("MED-1003")
                        .medicineName("Ibuprofen 400mg")
                        .genericName("Ibuprofen")
                        .category("Painkillers")
                        .manufacturer("Ranbaxy")
                        .unitPrice(new BigDecimal("3.50"))
                        .sellingPrice(new BigDecimal("8.50"))
                        .batchNumber("BATCH-1003")
                        .description("Nonsteroidal anti-inflammatory tablet")
                        .supplier(ranbaxy)
                        .build());

                Medicine azith = medicineRepository.save(Medicine.builder()
                        .medicineCode("MED-1004")
                        .medicineName("Azithromycin 250mg")
                        .genericName("Azithromycin")
                        .category("Antibiotics")
                        .manufacturer("Dr. Reddy's Labs")
                        .unitPrice(new BigDecimal("15.00"))
                        .sellingPrice(new BigDecimal("30.00"))
                        .batchNumber("BATCH-1004")
                        .description("Macrolide antibiotic tablet")
                        .supplier(drReddy)
                        .build());

                // 5. Initialize Inventory Stock Records
                if (inventoryRepository.count() == 0) {
                    log.info("Seeding initial inventory records...");
                    createInventory(amox, 120, 15, 500, "Shelf A-12");
                    createInventory(para, 5, 20, 500, "Shelf B-04");   // Low stock item (qty < min)
                    createInventory(ibup, 80, 10, 500, "Shelf A-08");
                    createInventory(azith, 0, 10, 500, "Shelf C-01");  // Out of stock (qty = 0)
                }

                // 6. Initialize Expiry Tracking Records
                if (expiryTrackingRepository.count() == 0) {
                    log.info("Seeding initial expiry tracking records...");
                    java.time.LocalDate today = java.time.LocalDate.now();

                    expiryTrackingRepository.save(com.medistock.entity.ExpiryTracking.builder()
                            .medicine(amox)
                            .batchNumber("BATCH-1001")
                            .quantity(120)
                            .expiryDate(today.plusMonths(8))
                            .status(com.medistock.enums.ExpiryStatus.ACTIVE)
                            .build());

                    expiryTrackingRepository.save(com.medistock.entity.ExpiryTracking.builder()
                            .medicine(para)
                            .batchNumber("BATCH-1002")
                            .quantity(5)
                            .expiryDate(today.plusDays(15)) // Expiring soon
                            .status(com.medistock.enums.ExpiryStatus.EXPIRING_SOON)
                            .build());

                    expiryTrackingRepository.save(com.medistock.entity.ExpiryTracking.builder()
                            .medicine(azith)
                            .batchNumber("BATCH-EXP-01")
                            .quantity(10)
                            .expiryDate(today.minusDays(5)) // Expired
                            .status(com.medistock.enums.ExpiryStatus.EXPIRED)
                            .build());
                }
            }
        }

        // Initialize Purchase Orders if empty
        if (purchaseOrderRepository.count() == 0) {
            log.info("Seeding initial monthly purchase orders for procurement tracking...");
            java.time.LocalDate now = java.time.LocalDate.now();
            java.util.List<com.medistock.entity.Supplier> sups = supplierRepository.findAll();
            java.util.List<com.medistock.entity.Medicine> meds = medicineRepository.findAll();

            if (!sups.isEmpty() && !meds.isEmpty()) {
                com.medistock.entity.Supplier s1 = sups.get(0);
                com.medistock.entity.Medicine m1 = meds.get(0);

                com.medistock.entity.PurchaseOrder po1 = com.medistock.entity.PurchaseOrder.builder()
                        .orderNumber("PO-2026-001")
                        .supplier(s1)
                        .orderDate(now.minusDays(5))
                        .expectedDelivery(now.plusDays(2))
                        .status(com.medistock.enums.OrderStatus.RECEIVED)
                        .totalAmount(new BigDecimal("1200.00"))
                        .createdAt(java.time.LocalDateTime.now().minusDays(5))
                        .build();
                po1.addItem(com.medistock.entity.PurchaseOrderItem.builder()
                        .medicine(m1)
                        .quantity(100)
                        .unitPrice(new BigDecimal("5.00"))
                        .subtotal(new BigDecimal("500.00"))
                        .build());
                purchaseOrderRepository.save(po1);

                if (sups.size() > 1 && meds.size() > 1) {
                    com.medistock.entity.Supplier s2 = sups.get(1);
                    com.medistock.entity.Medicine m2 = meds.get(1);

                    com.medistock.entity.PurchaseOrder po2 = com.medistock.entity.PurchaseOrder.builder()
                            .orderNumber("PO-2026-002")
                            .supplier(s2)
                            .orderDate(now.minusDays(2))
                            .expectedDelivery(now.plusDays(3))
                            .status(com.medistock.enums.OrderStatus.SHIPPED)
                            .totalAmount(new BigDecimal("2400.00"))
                            .createdAt(java.time.LocalDateTime.now().minusDays(2))
                            .build();
                    po2.addItem(com.medistock.entity.PurchaseOrderItem.builder()
                            .medicine(m2)
                            .quantity(400)
                            .unitPrice(new BigDecimal("2.00"))
                            .subtotal(new BigDecimal("800.00"))
                            .build());
                    purchaseOrderRepository.save(po2);
                }

                if (sups.size() > 2 && meds.size() > 2) {
                    com.medistock.entity.Supplier s3 = sups.get(2);
                    com.medistock.entity.Medicine m3 = meds.get(2);

                    com.medistock.entity.PurchaseOrder po3 = com.medistock.entity.PurchaseOrder.builder()
                            .orderNumber("PO-2026-003")
                            .supplier(s3)
                            .orderDate(now.minusDays(1))
                            .expectedDelivery(now.plusDays(5))
                            .status(com.medistock.enums.OrderStatus.APPROVED)
                            .totalAmount(new BigDecimal("4500.00"))
                            .createdAt(java.time.LocalDateTime.now().minusDays(1))
                            .build();
                    po3.addItem(com.medistock.entity.PurchaseOrderItem.builder()
                            .medicine(m3)
                            .quantity(150)
                            .unitPrice(new BigDecimal("15.00"))
                            .subtotal(new BigDecimal("2250.00"))
                            .build());
                    purchaseOrderRepository.save(po3);
                }
            }
        }

        log.info("Data initialization complete!");
    }

    private Role getOrCreateRole(String roleName, String description) {
        return roleRepository.findByRoleName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName(roleName)
                        .description(description)
                        .build()));
    }

    private User getOrCreateUser(String email, String password, String firstName, String lastName, Role role) {
        User u = userRepository.findByEmail(email)
                .orElseGet(() -> User.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .phone("9876543210")
                        .status("ACTIVE")
                        .role(role)
                        .build());
        u.setPassword(passwordEncoder.encode(password));
        u.setStatus("ACTIVE");
        u.setRole(role);
        return userRepository.save(u);
    }

    private void createInventory(Medicine medicine, int qty, int min, int max, String location) {
        if (inventoryRepository.findByMedicineId(medicine.getId()).isEmpty()) {
            inventoryRepository.save(Inventory.builder()
                    .medicine(medicine)
                    .quantity(qty)
                    .minimumStock(min)
                    .maximumStock(max)
                    .location(location)
                    .build());
        }
    }
}
