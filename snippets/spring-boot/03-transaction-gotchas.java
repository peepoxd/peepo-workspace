// ===== @Transactional — สิ่งที่ต้องรู้ =====

// --- Rollback Rules ---
@Service
public class PaymentService {

    // Default: RuntimeException → rollback, Checked Exception → ไม่ rollback
    @Transactional
    public void processPayment(Order order) {
        deductBalance(order.getAmount());  // ถ้า RuntimeException → rollback ✅
        sendReceipt(order);                // ถ้า IOException → ไม่ rollback ❌
    }

    // บังคับ rollback ทุก exception
    @Transactional(rollbackFor = Exception.class)
    public void processPaymentSafe(Order order) throws Exception {
        deductBalance(order.getAmount());
        sendReceipt(order);  // IOException → rollback ✅
    }
}


// --- Propagation ---
@Service
public class OrderService {

    @Transactional  // REQUIRED (default) — สร้าง transaction ใหม่
    public void placeOrder(Order order) {
        orderRepository.save(order);
        auditService.log("Order placed");     // ใช้ transaction เดียวกัน
        emailService.sendConfirmation(order); // transaction แยก (ดูข้างล่าง)
    }
}

@Service
public class EmailService {

    // REQUIRES_NEW = สร้าง transaction ใหม่แยกจากตัวเรียก
    // ถ้า email พัง → order ไม่ rollback
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendConfirmation(Order order) {
        // ถ้า error ที่นี่ จะ rollback แค่ transaction นี้
    }
}


// --- ⚠️ Self-Invocation Gotcha (ถามบ่อย!) ---
@Service
public class UserService {

    // ❌ เรียก @Transactional จากภายใน class เดียวกัน → ไม่ทำงาน!
    public void processAll() {
        for (User user : users) {
            updateUser(user);  // ❌ ไม่ผ่าน Proxy → @Transactional ถูกข้าม
        }
    }

    @Transactional
    public void updateUser(User user) {
        // ...
    }

    // ✅ แก้: แยก method ไปอีก class
    // หรือ inject ตัวเอง (self-injection)
}


// --- readOnly = true → Optimization ---
@Transactional(readOnly = true)  // บอก Hibernate ว่าไม่ต้อง dirty-checking
public List<User> findAll() {
    return userRepository.findAll();
    // ประหยัด performance เพราะ Hibernate ไม่ต้องตรวจ changes
}
