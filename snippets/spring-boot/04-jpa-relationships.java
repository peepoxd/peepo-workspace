// ===== JPA Relationships =====

// --- One-to-Many / Many-to-One ---
@Entity
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // department มีหลาย employees
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();

    // helper method — รักษา consistency ทั้ง 2 ฝั่ง
    public void addEmployee(Employee emp) {
        employees.add(emp);
        emp.setDepartment(this);
    }
}

@Entity
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // หลาย employees อยู่ใน 1 department
    @ManyToOne(fetch = FetchType.LAZY)  // ← LAZY = โหลดเมื่อเรียกใช้
    @JoinColumn(name = "department_id")
    private Department department;
}


// --- Many-to-Many ---
@Entity
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "student_course",  // ตาราง join
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}


// ===== N+1 Problem =====

// ❌ N+1: ดึง 10 departments → 1 query, แต่ละ department ดึง employees → 10 queries = 11 total
List<Department> depts = departmentRepository.findAll();
for (Department d : depts) {
    d.getEmployees().size();  // trigger LAZY loading → 1 query ต่อ department
}

// ✅ แก้ด้วย JOIN FETCH — 1 query เดียวจบ
@Query("SELECT d FROM Department d JOIN FETCH d.employees")
List<Department> findAllWithEmployees();

// ✅ หรือใช้ @EntityGraph
@EntityGraph(attributePaths = {"employees"})
List<Department> findAll();
