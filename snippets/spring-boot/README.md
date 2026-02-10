# Spring Boot Code Snippets

ตัวอย่าง code แยกตาม concept — อ่านประกอบ `docs/spring-boot-concept.md`

| File | Concept |
|------|---------|
| `01-dependency-injection.java` | DI 3 แบบ, @Primary, @Qualifier |
| `02-bean-lifecycle-scopes.java` | @PostConstruct, @PreDestroy, Singleton vs Prototype |
| `03-transaction-gotchas.java` | Rollback rules, Propagation, Self-invocation |
| `04-jpa-relationships.java` | OneToMany, ManyToMany, N+1 Problem |
| `05-testing-patterns.java` | @WebMvcTest, @DataJpaTest, @SpringBootTest, Mockito |

> ไฟล์เหล่านี้เป็น **ตัวอย่างอ่าน** ไม่สามารถ compile ได้ตรงๆ
> ดู project ที่รันได้จริงที่ `projects/spring-boot-demo/`
