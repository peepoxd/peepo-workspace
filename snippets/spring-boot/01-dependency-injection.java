// ===== Dependency Injection — 3 แบบ =====

// ✅ 1. Constructor Injection (แนะนำ)
// - ใช้ final ได้ → immutable
// - ไม่ต้อง @Autowired ถ้า constructor เดียว
@Service
public class OrderService {
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    public OrderService(PaymentService paymentService,
                        NotificationService notificationService) {
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }
}

// 2. Setter Injection — optional dependency
@Service
public class ReportService {
    private CacheService cacheService;

    @Autowired(required = false)
    public void setCacheService(CacheService cacheService) {
        this.cacheService = cacheService;
    }
}

// ❌ 3. Field Injection — หลีกเลี่ยง (test ยาก)
@Service
public class BadService {
    @Autowired
    private SomeRepository repository;
}


// ===== เลือก Bean เมื่อมีหลาย implementation =====

public interface NotificationService {
    void send(String message);
}

@Service
@Primary  // ตั้งเป็น default
public class EmailNotification implements NotificationService {
    public void send(String message) { /* ส่ง email */ }
}

@Service
public class SmsNotification implements NotificationService {
    public void send(String message) { /* ส่ง SMS */ }
}

// ใช้ @Qualifier เลือกตัวที่ต้องการ
@Service
public class AlertService {
    public AlertService(@Qualifier("smsNotification") NotificationService ns) {
        // ได้ SmsNotification
    }
}
