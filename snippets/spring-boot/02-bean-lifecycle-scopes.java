// ===== Bean Lifecycle =====

@Service
public class CacheService {

    @PostConstruct  // เรียกหลังสร้าง bean + ฉีด dependency เสร็จ
    public void init() {
        System.out.println("โหลด cache...");
    }

    @PreDestroy  // เรียกก่อน application ปิด
    public void cleanup() {
        System.out.println("เคลียร์ cache...");
    }
}

// วงจร: Instantiate → Inject Dependencies → @PostConstruct → ใช้งาน → @PreDestroy → Destroy


// ===== Bean Scopes =====

// Singleton (default) — 1 instance ต่อ 1 Spring Container
@Service
@Scope("singleton")  // ไม่ต้องใส่ก็ได้ เป็น default
public class UserService {
    // ทุกที่ที่ inject UserService จะได้ตัวเดียวกัน
}

// Prototype — สร้างใหม่ทุกครั้งที่เรียก
@Component
@Scope("prototype")
public class ShoppingCart {
    private List<String> items = new ArrayList<>();
    // แต่ละ request ได้ cart ใหม่
}

// ⚠️ คำถามสัมภาษณ์:
// Spring Singleton ≠ Java Singleton Pattern
// - Spring Singleton = 1 instance ต่อ 1 Container
// - Java Singleton  = 1 instance ต่อ 1 JVM
//
// Prototype bean: Spring ไม่เรียก @PreDestroy ให้
