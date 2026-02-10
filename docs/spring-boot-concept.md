# Spring Boot Concepts — สรุปเตรียมสัมภาษณ์ (Junior + Mid-Level)

> เอกสารภาษาไทย ครอบคลุม concepts ที่ถามบ่อยในสัมภาษณ์ Spring Boot
> Keywords เป็นภาษาอังกฤษ อธิบายเป็นภาษาไทย พร้อม code examples

---

## สารบัญ

### Junior Level (0-2 ปี)

1. [Spring Boot คืออะไร](#1-spring-boot-คืออะไร)
2. [Dependency Injection & IoC](#2-dependency-injection--ioc)
3. [Bean Lifecycle & Scopes](#3-bean-lifecycle--scopes)
4. [Auto-Configuration](#4-auto-configuration)
5. [REST API Development](#5-rest-api-development)
6. [Exception Handling](#6-exception-handling)
7. [Spring Data JPA](#7-spring-data-jpa)
8. [Transaction Management](#8-transaction-management)
9. [Spring Security พื้นฐาน](#9-spring-security-พื้นฐาน)
10. [Testing](#10-testing)
11. [Configuration & Properties](#11-configuration--properties)
12. [Actuator & Monitoring](#12-actuator--monitoring)
13. [Cheat Sheet สรุปท้ายเล่ม](#13-cheat-sheet-สรุปท้ายเล่ม)

### Mid-Level (2-5 ปี)

14. [JWT Authentication](#14-jwt-authentication-spring-security)
15. [Pagination & Sorting](#15-pagination--sorting)
16. [Caching (@Cacheable)](#16-caching-cacheable)
17. [AOP (Aspect-Oriented Programming)](#17-aop-aspect-oriented-programming)
18. [API Versioning](#18-api-versioning)
19. [Mid-Level Cheat Sheet](#19-mid-level-cheat-sheet)

---

## 1. Spring Boot คืออะไร

### Spring Framework vs Spring Boot

| | Spring Framework | Spring Boot |
|---|---|---|
| Configuration | ต้อง config เองเยอะ (XML/Java Config) | Auto-configuration ทำให้อัตโนมัติ |
| Server | ต้องติดตั้ง Tomcat แยก | มี Embedded Tomcat มาในตัว |
| เริ่มต้น | ช้า ต้อง setup เยอะ | เร็ว "convention over configuration" |
| Dependencies | จัดการเอง | Starter POMs จัดให้ |

**สรุป**: Spring Boot = Spring Framework + ลดงาน config + พร้อมใช้งานทันที

### @SpringBootApplication

Annotation หลักที่ใช้เริ่ม application — จริงๆ มันคือ 3 อย่างรวมกัน:

```java
@SpringBootApplication
// เท่ากับ:
// @Configuration        → บอกว่า class นี้เป็น config
// @EnableAutoConfiguration → เปิด auto-configuration
// @ComponentScan        → สแกนหา @Component ใน package นี้และ sub-packages
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### Spring Boot Starters

Starters = ชุด dependencies สำเร็จรูป ไม่ต้องหาเองทีละตัว

| Starter | ได้อะไรมา |
|---------|----------|
| `spring-boot-starter-web` | Tomcat + Spring MVC + Jackson (JSON) |
| `spring-boot-starter-data-jpa` | Hibernate + Spring Data JPA |
| `spring-boot-starter-security` | Spring Security |
| `spring-boot-starter-test` | JUnit + Mockito + MockMvc |
| `spring-boot-starter-actuator` | Health check + Metrics endpoints |

---

## 2. Dependency Injection & IoC

### IoC (Inversion of Control) คืออะไร

ปกติเราสร้าง object เอง:
```java
// ❌ ปกติ — สร้างเอง (tight coupling)
public class OrderService {
    private PaymentService paymentService = new PaymentService();
}
```

IoC = **กลับหัว** — ให้ Spring Container สร้างและจัดการ object แทนเรา:
```java
// ✅ IoC — Spring สร้างให้ (loose coupling)
public class OrderService {
    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService; // Spring ฉีดเข้ามาให้
    }
}
```

**ข้อดี**: เปลี่ยน implementation ได้ง่าย, test ง่าย (mock ได้)

### DI (Dependency Injection) — 3 แบบ

#### 1. Constructor Injection ✅ (แนะนำ)
```java
@Service
public class OrderService {
    private final PaymentService paymentService;

    // Spring ฉีด PaymentService เข้ามาผ่าน constructor
    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
- ใช้ `final` ได้ → immutable, ปลอดภัย
- บังคับใส่ dependency ตอนสร้าง → ไม่มี null
- **ถ้ามี constructor เดียว ไม่ต้องใส่ @Autowired**

#### 2. Setter Injection
```java
@Service
public class OrderService {
    private PaymentService paymentService;

    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
- ใช้เมื่อ dependency เป็น optional

#### 3. Field Injection ❌ (หลีกเลี่ยง)
```java
@Service
public class OrderService {
    @Autowired
    private PaymentService paymentService; // ฉีดตรงเข้า field
}
```
- สั้นดี แต่ test ยาก (ต้องใช้ reflection)
- ไม่ใช้ `final` ได้ → mutable

### Component Annotations — 4 ตัวหลัก

ทั้ง 4 ตัวคือ `@Component` หมด แต่บอก **หน้าที่** ต่างกัน:

```
@Component     → ทั่วไป (ไม่จัดกลุ่ม)
  ├── @Service      → Business Logic Layer
  ├── @Repository   → Data Access Layer (+ แปลง SQL exception ให้)
  └── @Controller   → Web Layer (return view)
      └── @RestController → Web Layer (return JSON)
```

```java
@Repository
public class UserRepository { ... }  // เข้าถึง database

@Service
public class UserService { ... }     // business logic

@RestController
public class UserController { ... }  // รับ HTTP request
```

### @Autowired — วิธีเลือก Bean

ถ้ามีหลาย implementation ของ interface เดียว:

```java
public interface PaymentService { ... }

@Service
public class StripePayment implements PaymentService { ... }

@Service
public class PaypalPayment implements PaymentService { ... }
```

Spring จะสับสน — แก้ได้ 3 วิธี:

```java
// วิธี 1: @Primary — ตั้งตัวหลัก
@Primary
@Service
public class StripePayment implements PaymentService { ... }

// วิธี 2: @Qualifier — เลือกตามชื่อ
@Service
public class OrderService {
    public OrderService(@Qualifier("paypalPayment") PaymentService ps) { ... }
}

// วิธี 3: ตั้งชื่อ parameter ตรงกับ bean name
public OrderService(PaymentService stripePayment) { ... }
```

---

## 3. Bean Lifecycle & Scopes

### Bean Lifecycle — วงจรชีวิต

```
Spring Container เริ่ม
    ↓
1. Instantiation     → สร้าง object
    ↓
2. Populate Properties → ฉีด dependencies
    ↓
3. @PostConstruct    → เรียกหลังสร้างเสร็จ
    ↓
4. Bean พร้อมใช้งาน  → ใช้ได้ตลอด application
    ↓
5. @PreDestroy       → เรียกก่อนทำลาย
    ↓
6. Destruction       → ทำลาย bean
```

```java
@Service
public class UserService {

    @PostConstruct
    public void init() {
        System.out.println("UserService พร้อมใช้งานแล้ว!");
        // โหลด cache, เตรียมข้อมูล, etc.
    }

    @PreDestroy
    public void cleanup() {
        System.out.println("กำลังปิด UserService...");
        // ปิด connection, เคลียร์ resource
    }
}
```

### Bean Scopes — ขอบเขตของ Bean

| Scope | ความหมาย | ใช้เมื่อ |
|-------|----------|---------|
| **singleton** (default) | สร้างครั้งเดียว ใช้ร่วมกันทั้ง app | Service, Repository ทั่วไป |
| **prototype** | สร้างใหม่ทุกครั้งที่เรียก | Object ที่มี state แตกต่างกัน |
| request | สร้างใหม่ทุก HTTP request | Web app เท่านั้น |
| session | สร้างใหม่ทุก HTTP session | Web app เท่านั้น |

```java
@Service
@Scope("singleton")  // default — ไม่ต้องใส่ก็ได้
public class UserService { ... }

@Component
@Scope("prototype")  // สร้างใหม่ทุกครั้ง
public class ShoppingCart { ... }
```

**คำถามสัมภาษณ์ยอดฮิต**: Singleton ของ Spring ≠ Singleton Pattern ของ Java
- Spring Singleton = 1 instance **ต่อ 1 container**
- Java Singleton = 1 instance **ต่อ 1 JVM**

**สำคัญ**: Prototype bean ไม่เรียก `@PreDestroy` — Spring ไม่จัดการ destruction ให้

---

## 4. Auto-Configuration

### ทำงานยังไง

Spring Boot ดูว่ามี library อะไรใน classpath แล้ว **config ให้อัตโนมัติ**:

```
เพิ่ม spring-boot-starter-web ใน pom.xml
    ↓
Spring Boot เห็น Tomcat + Spring MVC ใน classpath
    ↓
Auto-configure: DispatcherServlet, Tomcat, Jackson
    ↓
พร้อมรับ HTTP request ทันที — ไม่ต้อง config อะไร
```

### @Conditional Annotations

Auto-configuration ใช้ conditions ตัดสินใจ:

```java
@Configuration
@ConditionalOnClass(DataSource.class)        // ถ้ามี DataSource ใน classpath
@ConditionalOnMissingBean(DataSource.class)  // และยังไม่มีใครสร้าง DataSource
public class DataSourceAutoConfiguration {
    @Bean
    public DataSource dataSource() {
        return new HikariDataSource();  // สร้าง default DataSource
    }
}
```

| Annotation | เงื่อนไข |
|------------|---------|
| `@ConditionalOnClass` | มี class นี้ใน classpath |
| `@ConditionalOnMissingBean` | ยังไม่มี bean นี้ |
| `@ConditionalOnProperty` | มี property ที่กำหนด |

**หลักการ**: ถ้าเราสร้าง Bean เอง → Spring Boot จะไม่สร้างทับ (เราเขียนเอง = override auto-config)

---

## 5. REST API Development

### @RestController vs @Controller

```java
// @Controller — return ชื่อ view (HTML template)
@Controller
public class PageController {
    @GetMapping("/home")
    public String home() {
        return "home";  // → templates/home.html
    }
}

// @RestController — return data (JSON) ตรงๆ
// @RestController = @Controller + @ResponseBody
@RestController
public class UserController {
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();  // → JSON อัตโนมัติ
    }
}
```

### HTTP Methods — ใช้ให้ถูก

| Method | Annotation | หน้าที่ | ตัวอย่าง |
|--------|------------|---------|---------|
| GET | `@GetMapping` | ดึงข้อมูล | GET /users |
| POST | `@PostMapping` | สร้างใหม่ | POST /users |
| PUT | `@PutMapping` | แก้ไขทั้งหมด | PUT /users/1 |
| PATCH | `@PatchMapping` | แก้ไขบางส่วน | PATCH /users/1 |
| DELETE | `@DeleteMapping` | ลบ | DELETE /users/1 |

### ตัวอย่าง CRUD Controller

```java
@RestController
@RequestMapping("/api/users")  // base path
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/users
    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    // GET /api/users/1
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    // POST /api/users (body = JSON)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)  // return 201
    public User create(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }

    // PUT /api/users/1
    @PutMapping("/{id}")
    public User update(@PathVariable Long id,
                       @Valid @RequestBody UpdateUserRequest request) {
        return userService.update(id, request);
    }

    // DELETE /api/users/1
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)  // return 204
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

### Parameter Annotations

```java
@GetMapping("/search")
public List<User> search(
    @RequestParam String name,              // ?name=John
    @RequestParam(defaultValue = "0") int page,  // ?page=0
    @RequestHeader("Authorization") String token  // Header
) { ... }

@GetMapping("/{id}")
public User getById(@PathVariable Long id) { ... }  // /users/123
```

### Request Validation

```java
public class CreateUserRequest {
    @NotBlank(message = "ชื่อห้ามว่าง")
    private String name;

    @Email(message = "รูปแบบ email ไม่ถูกต้อง")
    private String email;

    @Min(value = 18, message = "อายุต้องมากกว่า 18")
    private int age;

    // getters, setters
}
```

ใช้ `@Valid` ที่ controller:
```java
@PostMapping
public User create(@Valid @RequestBody CreateUserRequest request) { ... }
// ถ้า validate ไม่ผ่าน → return 400 Bad Request อัตโนมัติ
```

### HTTP Status Codes ที่ต้องรู้

| Code | ความหมาย | ใช้เมื่อ |
|------|----------|---------|
| 200 OK | สำเร็จ | GET, PUT, PATCH |
| 201 Created | สร้างสำเร็จ | POST |
| 204 No Content | สำเร็จ ไม่มี body | DELETE |
| 400 Bad Request | request ผิด format | Validation ไม่ผ่าน |
| 401 Unauthorized | ไม่ได้ login | ไม่มี token |
| 403 Forbidden | ไม่มีสิทธิ์ | token มี แต่ไม่มี role |
| 404 Not Found | หาไม่เจอ | resource ไม่มี |
| 500 Internal Server Error | server พัง | exception ไม่ได้ handle |

---

## 6. Exception Handling

### @ControllerAdvice — จัดการ error จุดเดียว

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // จัดการ resource ไม่เจอ
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }

    // จัดการ validation ไม่ผ่าน
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return new ErrorResponse("VALIDATION_ERROR", message);
    }

    // จัดการ error ทั่วไป (safety net)
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneral(Exception ex) {
        return new ErrorResponse("INTERNAL_ERROR", "เกิดข้อผิดพลาดภายใน");
    }
}
```

```java
// Custom exception
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// Error response DTO
public record ErrorResponse(String code, String message) {}
```

```java
// ใช้ใน Service
@Service
public class UserService {
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
```

**Flow**:
```
Request → Controller → Service throws exception
    ↓
@ControllerAdvice จับ exception
    ↓
Return JSON error response + HTTP status ที่เหมาะสม
```

---

## 7. Spring Data JPA

### Entity — กำหนดตาราง

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true)
    private String email;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // constructors, getters, setters
}
```

### Repository — เข้าถึง database

```java
// แค่ extend interface → Spring สร้าง implementation ให้
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring สร้าง query จากชื่อ method อัตโนมัติ!
    List<User> findByName(String name);
    // → SELECT * FROM users WHERE name = ?

    List<User> findByEmailContaining(String keyword);
    // → SELECT * FROM users WHERE email LIKE '%keyword%'

    Optional<User> findByEmail(String email);
    // → SELECT * FROM users WHERE email = ?

    List<User> findByAgeGreaterThan(int age);
    // → SELECT * FROM users WHERE age > ?

    // Custom query ด้วย JPQL
    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword%")
    List<User> searchByName(@Param("keyword") String keyword);

    // Native SQL (ใช้เมื่อ JPQL ไม่พอ)
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List<User> findRecentUsers(@Param("date") LocalDateTime date);
}
```

### JpaRepository ได้อะไรมาบ้าง (ฟรี ไม่ต้องเขียน)

| Method | หน้าที่ |
|--------|---------|
| `save(entity)` | บันทึก (INSERT หรือ UPDATE) |
| `findById(id)` | หาตาม ID |
| `findAll()` | ดึงทั้งหมด |
| `deleteById(id)` | ลบตาม ID |
| `count()` | นับจำนวน |
| `existsById(id)` | เช็คว่ามีไหม |

### Entity Relationships

```java
// User มีหลาย Order (One-to-Many)
@Entity
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();
}

@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String product;

    @ManyToOne(fetch = FetchType.LAZY)  // โหลดเมื่อเรียกใช้เท่านั้น
    @JoinColumn(name = "user_id")
    private User user;
}
```

### Eager vs Lazy Loading

| | Eager | Lazy (แนะนำ) |
|---|---|---|
| โหลดเมื่อ | โหลดทันทีพร้อม parent | โหลดเมื่อเรียกใช้จริง |
| Default | `@ManyToOne`, `@OneToOne` | `@OneToMany`, `@ManyToMany` |
| ข้อดี | ไม่มี LazyInitException | ประหยัด memory, เร็วกว่า |
| ข้อเสีย | โหลดข้อมูลเกินจำเป็น | ต้องอยู่ใน transaction |

**N+1 Problem** — ปัญหาที่ต้องรู้:
```
// ดึง users 10 คน → 1 query
// เข้าถึง orders ของแต่ละคน → 10 queries เพิ่ม!
// รวม = 11 queries (N+1)

// แก้ด้วย JOIN FETCH:
@Query("SELECT u FROM User u JOIN FETCH u.orders")
List<User> findAllWithOrders();
// → 1 query เดียวจบ
```

---

## 8. Transaction Management

### @Transactional พื้นฐาน

```java
@Service
public class TransferService {

    @Transactional  // ถ้า exception → rollback ทั้งหมด
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepository.findById(fromId).orElseThrow();
        Account to = accountRepository.findById(toId).orElseThrow();

        from.debit(amount);   // หักเงิน
        to.credit(amount);    // เพิ่มเงิน

        accountRepository.save(from);
        accountRepository.save(to);
        // ถ้า credit() พัง → debit() ก็ rollback ด้วย ✅
    }
}
```

### Rollback Rules — สำคัญมาก (ถามบ่อย)

| Exception ประเภท | Default | ตัวอย่าง |
|-------------------|---------|---------|
| **RuntimeException** (unchecked) | ✅ Rollback | NullPointerException, IllegalArgumentException |
| **Exception** (checked) | ❌ ไม่ Rollback | IOException, SQLException |

```java
// บังคับ rollback ทุก exception
@Transactional(rollbackFor = Exception.class)
public void process() throws IOException { ... }

// ไม่ rollback บาง exception
@Transactional(noRollbackFor = BusinessWarningException.class)
public void submit() { ... }
```

### Propagation — transaction ซ้อน transaction

| Propagation | พฤติกรรม |
|-------------|---------|
| **REQUIRED** (default) | ใช้ transaction ที่มีอยู่ / สร้างใหม่ถ้าไม่มี |
| REQUIRES_NEW | สร้าง transaction ใหม่เสมอ (หยุด transaction เดิมชั่วคราว) |
| NESTED | สร้าง savepoint ใน transaction เดิม |
| SUPPORTS | ใช้ transaction ถ้ามี / ไม่มีก็ทำงานได้ |

```java
@Service
public class OrderService {

    @Transactional  // transaction หลัก
    public void placeOrder(Order order) {
        orderRepository.save(order);
        notificationService.sendEmail(order);  // ถ้า email พัง?
    }
}

@Service
public class NotificationService {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    // สร้าง transaction แยก → ถ้า email พัง order ไม่ rollback
    public void sendEmail(Order order) { ... }
}
```

### Gotcha — Self-invocation (ถามบ่อย!)

```java
@Service
public class UserService {

    public void processUsers() {
        for (User user : users) {
            updateUser(user);  // ❌ เรียกตัวเอง → @Transactional ไม่ทำงาน!
        }
    }

    @Transactional
    public void updateUser(User user) { ... }
}
```

**ทำไม?** — `@Transactional` ทำงานผ่าน Proxy แต่เรียกตัวเองไม่ผ่าน Proxy

**แก้**: แยก method ไปอีก class หรือ inject ตัวเอง

---

## 9. Spring Security พื้นฐาน

### เพิ่ม Dependency แล้วได้อะไร

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

แค่เพิ่ม dependency → **ทุก endpoint ถูกล็อกทันที** (default: form login, user/generated password)

### SecurityFilterChain — config เอง

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // ปิด CSRF สำหรับ REST API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()  // เปิดให้ทุกคน
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // เฉพาะ ADMIN
                .anyRequest().authenticated()  // ที่เหลือต้อง login
            )
            .httpBasic(Customizer.withDefaults());  // ใช้ Basic Auth

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // hash password
    }
}
```

### JWT Token (แนวคิด)

```
1. User login (POST /auth/login) → ส่ง username + password
2. Server ตรวจสอบ → สร้าง JWT token → ส่งกลับ
3. User แนบ token ใน Header ทุก request:
   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
4. Server ตรวจสอบ token ทุก request ผ่าน Filter
```

JWT มี 3 ส่วน: `Header.Payload.Signature`
- **Header**: algorithm (HS256)
- **Payload**: ข้อมูล user (id, role, expiration)
- **Signature**: ป้องกันการแก้ไข

### Role-Based Access

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")  // ต้องมี ROLE_ADMIN
    @GetMapping("/dashboard")
    public String dashboard() {
        return "Admin Dashboard";
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")  // ADMIN หรือ MANAGER
    @GetMapping("/reports")
    public String reports() { ... }
}
```

---

## 10. Testing

### Test Annotations หลัก

| Annotation | โหลดอะไร | ใช้ทดสอบ | ความเร็ว |
|------------|----------|---------|---------|
| `@SpringBootTest` | ทั้ง Application Context | Integration test | ช้า |
| `@WebMvcTest` | เฉพาะ Controller layer | Controller + MockMvc | เร็ว |
| `@DataJpaTest` | เฉพาะ JPA layer | Repository + H2 DB | เร็ว |

### @WebMvcTest — ทดสอบ Controller (ถามบ่อย)

```java
@WebMvcTest(UserController.class)  // โหลดแค่ UserController
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;  // จำลอง HTTP request

    @MockBean  // mock Service layer
    private UserService userService;

    @Test
    void getUser_ReturnsUser() throws Exception {
        // Given — เตรียมข้อมูล
        User user = new User(1L, "John", "john@test.com");
        when(userService.findById(1L)).thenReturn(user);

        // When & Then — ยิง request + ตรวจสอบ
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John"))
            .andExpect(jsonPath("$.email").value("john@test.com"));
    }

    @Test
    void getUser_NotFound_Returns404() throws Exception {
        when(userService.findById(99L))
            .thenThrow(new ResourceNotFoundException("User not found"));

        mockMvc.perform(get("/api/users/99"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createUser_InvalidInput_Returns400() throws Exception {
        String invalidJson = """
            {"name": "", "email": "not-an-email"}
            """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }
}
```

### @SpringBootTest — Integration Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    void createAndGetUser() throws Exception {
        // Create
        String json = """
            {"name": "John", "email": "john@test.com"}
            """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated());

        // Verify in DB
        Optional<User> user = userRepository.findByEmail("john@test.com");
        assertThat(user).isPresent();
        assertThat(user.get().getName()).isEqualTo("John");
    }
}
```

### Mockito พื้นฐาน

```java
// when().thenReturn() — กำหนดค่า return
when(userService.findAll()).thenReturn(List.of(user1, user2));

// when().thenThrow() — กำหนดให้ throw exception
when(userService.findById(99L)).thenThrow(new ResourceNotFoundException("Not found"));

// verify() — ตรวจว่า method ถูกเรียก
verify(userService, times(1)).findById(1L);
verify(userService, never()).delete(any());
```

---

## 11. Configuration & Properties

### application.properties vs application.yml

```properties
# application.properties — แบน key=value
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret
```

```yaml
# application.yml — เป็นชั้นๆ อ่านง่ายกว่า
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: secret
```

### @Value — ดึงค่า config

```java
@Service
public class EmailService {
    @Value("${app.email.from}")           // ดึงจาก properties
    private String fromEmail;

    @Value("${app.email.from:noreply@test.com}")  // default ถ้าไม่มี
    private String fromEmailWithDefault;
}
```

### @ConfigurationProperties — ดีกว่า @Value (แนะนำ)

```yaml
# application.yml
app:
  email:
    from: noreply@company.com
    max-retries: 3
    enabled: true
```

```java
@Configuration
@ConfigurationProperties(prefix = "app.email")
public class EmailProperties {
    private String from;
    private int maxRetries;
    private boolean enabled;
    // getters, setters
}

// ใช้งาน — inject เข้ามาเลย
@Service
public class EmailService {
    private final EmailProperties emailProperties;

    public EmailService(EmailProperties emailProperties) {
        this.emailProperties = emailProperties;
    }
}
```

**ข้อดีกว่า @Value**: type-safe, IDE autocomplete, จัดกลุ่มได้, validate ได้

### Profiles — config ตาม environment

```
src/main/resources/
├── application.yml            # config กลาง
├── application-dev.yml        # override สำหรับ dev
├── application-prod.yml       # override สำหรับ production
└── application-test.yml       # override สำหรับ test
```

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:devdb     # ใช้ H2 in-memory

# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/mydb
```

เปิดใช้:
```bash
# วิธี 1: ใน application.yml
spring.profiles.active=dev

# วิธี 2: command line
java -jar app.jar --spring.profiles.active=prod

# วิธี 3: environment variable
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
```

### ลำดับความสำคัญ (Priority สูง → ต่ำ)

```
1. Command-line arguments       (--server.port=9090)
2. Environment variables         (SERVER_PORT=9090)
3. application-{profile}.yml
4. application.yml
```

---

## 12. Actuator & Monitoring

### เพิ่ม dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Endpoints ที่ได้

| Endpoint | หน้าที่ |
|----------|---------|
| `/actuator/health` | สถานะ app (UP/DOWN) |
| `/actuator/info` | ข้อมูล app |
| `/actuator/metrics` | ตัวเลขต่างๆ (memory, CPU, request count) |
| `/actuator/beans` | แสดง bean ทั้งหมด |
| `/actuator/env` | แสดง environment properties |

```yaml
# เปิด endpoints (default เปิดแค่ health)
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always  # แสดงรายละเอียด health
```

### Health Check ตัวอย่าง

```
GET /actuator/health

{
    "status": "UP",
    "components": {
        "db": { "status": "UP" },
        "diskSpace": { "status": "UP" }
    }
}
```

---

## 13. Cheat Sheet สรุปท้ายเล่ม

### Annotations ที่ต้องจำ

```
── Class Level ──
@SpringBootApplication    → จุดเริ่มต้น app
@RestController           → REST controller (return JSON)
@Service                  → Business logic
@Repository               → Data access
@Configuration            → Config class
@Entity                   → JPA table mapping

── Method Level ──
@GetMapping               → HTTP GET
@PostMapping              → HTTP POST
@PutMapping               → HTTP PUT
@DeleteMapping            → HTTP DELETE
@Transactional            → จัดการ transaction
@ExceptionHandler         → จัดการ exception
@PostConstruct            → เรียกหลังสร้าง bean
@PreDestroy               → เรียกก่อนทำลาย bean

── Parameter Level ──
@PathVariable             → /users/{id}
@RequestParam             → /users?name=John
@RequestBody              → JSON body
@Valid                    → เปิด validation

── Field Level ──
@Autowired                → ฉีด dependency
@Value("${...}")          → ดึงค่า config
@Id                       → Primary key
@GeneratedValue           → Auto-increment
@Column                   → กำหนดคุณสมบัติ column

── Config Level ──
@EnableWebSecurity        → เปิด security config
@ConfigurationProperties  → bind properties → class
```

### คำถามสัมภาษณ์ยอดฮิต — ตอบสั้นๆ

| คำถาม | คำตอบ |
|-------|-------|
| Spring Boot ต่างจาก Spring? | Auto-config + Embedded server + Starter POMs |
| @SpringBootApplication มีอะไร? | @Configuration + @EnableAutoConfiguration + @ComponentScan |
| Constructor vs Field Injection? | Constructor ดีกว่า — immutable, testable, บังคับใส่ |
| Singleton vs Prototype? | Singleton = 1 ต่อ container, Prototype = ใหม่ทุกครั้ง |
| @Transactional rollback เมื่อไหร่? | RuntimeException = rollback, Checked Exception = ไม่ rollback |
| Self-invocation ปัญหาอะไร? | เรียก @Transactional ในตัวเอง → ไม่ผ่าน proxy → ไม่ทำงาน |
| N+1 Problem? | ดึง parent 1 query + ดึง children N queries → ใช้ JOIN FETCH แก้ |
| @WebMvcTest vs @SpringBootTest? | WebMvc = แค่ controller (เร็ว), SpringBoot = ทั้ง app (ช้า) |
| Eager vs Lazy loading? | Eager = โหลดทันที, Lazy = โหลดเมื่อเรียก (แนะนำ Lazy) |
| JWT คืออะไร? | Token สำหรับ stateless auth: Header.Payload.Signature |

### Application Architecture — Flow ที่ต้องเข้าใจ

```
HTTP Request
    ↓
┌─────────────────────┐
│  Controller Layer    │  ← @RestController
│  (รับ request)       │     @GetMapping, @PostMapping
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│  Service Layer       │  ← @Service, @Transactional
│  (business logic)    │     validation, calculation
└─────────┬───────────┘
          ↓
┌─────────────────────┐
│  Repository Layer    │  ← @Repository
│  (เข้าถึง database)  │     JpaRepository
└─────────┬───────────┘
          ↓
      Database
```

---

# Mid-Level Concepts (2-5 ปี)

> ส่วนนี้ต่อจาก Junior — เพิ่ม concepts ที่ต้องรู้ระดับ Mid-level
> ดู code ตัวอย่างจริงที่ `projects/task-management-api/`

---

## 14. JWT Authentication (Spring Security)

### JWT คืออะไร (ลึกกว่า Junior)

JWT (JSON Web Token) = stateless authentication token ที่มี 3 ส่วน:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huIn0.abc123
│─── Header ────│ │──── Payload ────│ │Sig│

Header:  {"alg": "HS256"}           → algorithm
Payload: {"sub": "john", "exp": ..} → ข้อมูล + หมดอายุ
Signature: HMAC-SHA256(header.payload, secret) → ป้องกันแก้ไข
```

### JWT Flow ใน Spring Security

```
1. POST /api/auth/login → ส่ง username + password
2. Server ตรวจสอบ → สร้าง JWT → return token
3. Client แนบ token ทุก request:
   Authorization: Bearer eyJhb...
4. JwtAuthFilter ดักทุก request → validate → set SecurityContext
```

### JwtTokenProvider — สร้างและตรวจสอบ token

```java
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtTokenProvider(AppProperties appProperties) {
        // สร้าง key จาก Base64 secret
        this.key = Keys.hmacShaKeyFor(
            Decoders.BASE64.decode(appProperties.getSecret()));
        this.expirationMs = appProperties.getExpirationMs();
    }

    // สร้าง token จาก username
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    // ดึง username จาก token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload().getSubject();
    }

    // ตรวจสอบ token ว่า valid ไหม
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

### JwtAuthFilter — ดักทุก request

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    // สืบทอดจาก OncePerRequestFilter → รัน 1 ครั้งต่อ request

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) {

        // 1. ดึง token จาก header
        String token = extractToken(request); // Authorization: Bearer xxx

        // 2. validate + ตั้ง authentication
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // 3. ใส่ authentication เข้า SecurityContext
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response); // ส่งต่อ
    }
}
```

### SecurityConfig — ต่อ filter เข้า chain

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // เปิดใช้ @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
            .csrf(AbstractHttpConfigurer::disable)      // ปิด CSRF (REST API)
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))    // ไม่ใช้ session
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // auth เปิดฟรี
                .anyRequest().authenticated()                  // ที่เหลือต้อง login
            )
            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class) // แทรก filter
            .build();
    }
}
```

### @PreAuthorize — Role-Based Access

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")  // เฉพาะ ADMIN เท่านั้น
public void delete(@PathVariable Long id) { ... }
```

**สำคัญ**: Role ใน Spring Security มี prefix `ROLE_` เสมอ
- เก็บใน DB: `ADMIN` → Spring เห็นเป็น `ROLE_ADMIN`
- ใช้ `hasRole('ADMIN')` ไม่ต้องใส่ prefix

---

## 15. Pagination & Sorting

### ทำไมต้อง Paginate?

- ข้อมูล 10,000 rows → ส่งทีเดียว = ช้า, memory เยอะ
- Paginate = แบ่งส่ง ทีละ 10-20 rows → เร็ว, ประหยัด

### ใช้ Pageable ใน Controller

```java
@GetMapping
public ResponseEntity<PagedResponse<TaskResponse>> getAll(
        @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
    return ResponseEntity.ok(taskService.findAll(pageable));
}

// เรียก: GET /api/v1/tasks?page=0&size=10&sort=createdAt,desc
//        page=0  → หน้าแรก (0-indexed)
//        size=10 → 10 items ต่อหน้า
//        sort=createdAt,desc → เรียงตามวันสร้าง ล่าสุดก่อน
```

### ใช้ Pageable ใน Repository

```java
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Spring Data สร้าง query + pagination ให้อัตโนมัติ
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
    Page<Task> findByAssigneeId(Long assigneeId, Pageable pageable);
}
```

### PagedResponse DTO — ห่อ metadata

```java
public class PagedResponse<T> {
    private List<T> content;      // ข้อมูลจริง
    private int page;             // หน้าปัจจุบัน
    private int size;             // จำนวนต่อหน้า
    private long totalElements;   // ทั้งหมดกี่ rows
    private int totalPages;       // ทั้งหมดกี่หน้า
    private boolean last;         // หน้าสุดท้ายหรือยัง
}
```

### Service — แปลง Page → PagedResponse

```java
public PagedResponse<TaskResponse> findAll(Pageable pageable) {
    Page<Task> page = taskRepository.findAll(pageable);

    List<TaskResponse> content = page.getContent().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());

    return new PagedResponse<>(
            content,
            page.getNumber(),        // หน้าปัจจุบัน
            page.getSize(),          // ขนาดต่อหน้า
            page.getTotalElements(), // ทั้งหมด
            page.getTotalPages(),    // จำนวนหน้า
            page.isLast()            // สุดท้ายไหม
    );
}
```

---

## 16. Caching (@Cacheable)

### ทำไมต้อง Cache?

```
ไม่มี cache: DB ← query ← query ← query (ข้อมูลเดิม ถามซ้ำๆ)
มี cache:    DB ← query (ครั้งแรก) → cache → cache → cache (เร็วขึ้น!)
```

### Spring Cache + Caffeine

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

### เปิดใช้ Cache

```java
@SpringBootApplication
@EnableCaching  // เปิด cache
public class TaskApiApplication { ... }
```

### CacheConfig — ตั้งค่า Caffeine

```java
@Configuration
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager("projects");
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(100)                    // เก็บสูงสุด 100 entries
                .expireAfterWrite(10, TimeUnit.MINUTES)); // หมดอายุ 10 นาที
        return manager;
    }
}
```

### ใช้ Cache Annotations

```java
@Service
public class ProjectService {

    @Cacheable(value = "projects", key = "#id")
    // ครั้งแรก → query DB → เก็บ cache
    // ครั้งถัดไป → return จาก cache เลย (ไม่ query DB)
    public ProjectResponse findById(Long id) {
        return toResponse(projectRepository.findById(id).orElseThrow());
    }

    @CacheEvict(value = "projects", key = "#id")
    // ลบ cache เมื่อ update → ครั้งถัดไปจะ query DB ใหม่
    public ProjectResponse update(Long id, CreateProjectRequest request) { ... }

    @CacheEvict(value = "projects", key = "#id")
    // ลบ cache เมื่อ delete
    public void delete(Long id) { ... }
}
```

### Cache Annotations สรุป

| Annotation | ทำอะไร |
|------------|--------|
| `@Cacheable` | อ่านจาก cache ถ้ามี / query แล้วเก็บ cache ถ้าไม่มี |
| `@CacheEvict` | ลบ cache (ใช้เมื่อ update/delete) |
| `@CachePut` | query ใหม่เสมอ แล้วอัพเดท cache |

**ข้อควรระวัง**: Cache = eventual consistency → ข้อมูลอาจเก่าได้ไม่เกิน expiry time

---

## 17. AOP (Aspect-Oriented Programming)

### AOP คืออะไร

AOP = แยก "concern ที่ตัดข้าม" ออกจาก business logic

```
ปกติ: ทุก method ต้องเขียน log เอง
  public void createTask() {
      log.info("START createTask");     // ← ซ้ำทุก method
      // ... business logic ...
      log.info("END createTask 50ms");  // ← ซ้ำทุก method
  }

AOP: เขียน log ที่เดียว ใช้ได้ทุก method
  @Aspect → LoggingAspect ← "ตัดข้าม" ทุก service method
```

### Logging Aspect ตัวอย่าง

```java
@Aspect
@Component
public class LoggingAspect {

    @Around("execution(* com.demo.taskapi.service.*.*(..))")
    // ครอบทุก method ใน service package
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String method = joinPoint.getSignature().getName();

        log.info(">>> START {}", method);
        long start = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed(); // เรียก method จริง
            long elapsed = System.currentTimeMillis() - start;
            log.info("<<< END {} ({}ms)", method, elapsed);
            return result;
        } catch (Throwable ex) {
            log.error("!!! EXCEPTION {} : {}", method, ex.getMessage());
            throw ex;
        }
    }
}
```

### AOP Terminology

| คำศัพท์ | ความหมาย | ตัวอย่าง |
|---------|----------|---------|
| **Aspect** | class ที่รวม advice + pointcut | `LoggingAspect` |
| **Advice** | code ที่จะทำ (action) | `@Around`, `@Before`, `@After` |
| **Pointcut** | กำหนดว่า advice ทำที่ method ไหน | `execution(* service.*.*(..))` |
| **Join Point** | จุดที่ aspect ตัดเข้ามา | method call, exception throw |

### Advice Types

```java
@Before("execution(* service.*.*(..))")
// ทำก่อน method จริง

@After("execution(* service.*.*(..))")
// ทำหลัง method จริง (ไม่ว่าสำเร็จหรือ error)

@AfterReturning("execution(* service.*.*(..))")
// ทำหลัง method สำเร็จ

@AfterThrowing("execution(* service.*.*(..))")
// ทำหลัง method throw exception

@Around("execution(* service.*.*(..))")
// ครอบทั้ง before + after → ยืดหยุ่นที่สุด
```

**ใช้จริง**: Logging, Performance monitoring, Audit trail, Security checks

---

## 18. API Versioning

### ทำไมต้อง Version API?

เมื่อ API เปลี่ยน structure → client เดิมพัง → ต้องมี version เพื่อ backward compatibility

### วิธี Version API (3 แบบ)

| วิธี | ตัวอย่าง | ข้อดี | ข้อเสีย |
|------|---------|-------|---------|
| **URI Path** ✅ | `/api/v1/tasks` | เห็นชัด, เข้าใจง่าย | URL ยาว |
| Header | `X-API-Version: 1` | URL สะอาด | ซ่อนจากผู้ใช้ |
| Query Param | `/api/tasks?version=1` | ง่าย | ไม่ค่อย RESTful |

### ตัวอย่าง URI Versioning (แนะนำ)

```java
// Version 1
@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController { ... }

// Version 2 (ในอนาคต)
@RestController
@RequestMapping("/api/v2/tasks")
public class TaskControllerV2 { ... }
```

**หลักการ**: เพิ่ม version ใหม่ = คง version เก่าไว้ → client เดิมไม่พัง

---

## 19. Mid-Level Cheat Sheet

### Annotations เพิ่มจาก Junior

```
── Security ──
@EnableWebSecurity      → เปิด security config
@EnableMethodSecurity   → เปิด @PreAuthorize
@PreAuthorize           → role-based access control

── Cache ──
@EnableCaching          → เปิด cache
@Cacheable              → อ่านจาก cache / เก็บ cache
@CacheEvict             → ลบ cache
@CachePut               → อัพเดท cache

── AOP ──
@Aspect                 → ประกาศ aspect class
@Around                 → ครอบ method (before + after)
@Before                 → ทำก่อน method
@After                  → ทำหลัง method

── Config ──
@ConfigurationProperties → bind properties → class (type-safe)
```

### Mid-Level Architecture Flow

```
HTTP Request
    ↓
┌─────────────────────────┐
│  JwtAuthFilter          │  ← ตรวจ JWT token ทุก request
│  (OncePerRequestFilter) │     validate → set SecurityContext
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│  Controller Layer        │  ← @RestController
│  (รับ request)           │     @PreAuthorize, Pageable
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│  AOP Layer (cross-cut)   │  ← @Aspect (ตัดข้าม)
│  (logging, audit)        │     @Around service methods
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│  Service Layer           │  ← @Service, @Cacheable
│  (business logic)        │     @Transactional, @CacheEvict
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│  Repository Layer        │  ← @Repository
│  (เข้าถึง database)      │     Page<T>, Pageable
└─────────┬───────────────┘
          ↓
      Database
```

### คำถามสัมภาษณ์ Mid-Level

| คำถาม | คำตอบ |
|-------|-------|
| JWT เก็บที่ไหน? | Client side (localStorage/cookie) — server เป็น stateless |
| JWT หมดอายุแล้วทำไง? | Return 401 → client ต้อง login ใหม่ หรือใช้ refresh token |
| @Cacheable vs @CachePut? | Cacheable = อ่าน cache ถ้ามี, CachePut = query ใหม่เสมอ |
| Cache Invalidation ทำยังไง? | @CacheEvict เมื่อ update/delete |
| AOP ใช้ทำอะไรได้บ้าง? | Logging, Audit, Security, Transaction, Performance monitoring |
| Pagination ทำไมต้อง 0-indexed? | Spring Data convention — page=0 = หน้าแรก |
| API Versioning วิธีไหนดีสุด? | URI path (/v1/) → เห็นชัด, debug ง่าย, เป็นมาตรฐาน |
| DTO ทำไมต้องแยก Create/Update? | Create อาจบังคับทุก field, Update อาจ partial update ได้ |

### Project Structure ที่ Mid-Level ควรรู้

```
com.demo.taskapi/
├── config/           → SecurityConfig, CacheConfig, AppProperties
├── security/         → JwtTokenProvider, JwtAuthFilter, UserDetailsServiceImpl
├── controller/       → AuthController, ProjectController, TaskController
├── service/          → AuthService, ProjectService, TaskService
├── repository/       → UserRepository, ProjectRepository, TaskRepository
├── entity/           → User, Project, Task + Enums
├── dto/              → request/response DTOs (แยก Create/Update/Response)
│   ├── auth/         → LoginRequest, RegisterRequest, AuthResponse
│   ├── project/      → CreateProjectRequest, ProjectResponse
│   └── task/         → CreateTaskRequest, UpdateTaskRequest, TaskResponse
├── exception/        → GlobalExceptionHandler + custom exceptions
├── aspect/           → LoggingAspect (AOP)
└── TaskApiApplication.java
```

---

*สร้างเมื่อ: 2026-02-07*
*ระดับ: Junior (0-2 ปี) + Mid-Level (2-5 ปี)*
*ภาษา: ไทย (keywords อังกฤษ)*
