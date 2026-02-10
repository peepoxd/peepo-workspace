// ===== Testing Patterns =====

// --- @WebMvcTest — ทดสอบ Controller เท่านั้น (เร็ว) ---
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean  // mock Service → ไม่เรียก DB จริง
    private ProductService productService;

    @Test
    void getProduct_Success() throws Exception {
        // Given — เตรียมข้อมูล mock
        Product p = new Product(1L, "Laptop", 25000.0);
        when(productService.findById(1L)).thenReturn(p);

        // When & Then — ยิง request + ตรวจผล
        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())                     // HTTP 200
            .andExpect(jsonPath("$.name").value("Laptop"))   // ชื่อถูก
            .andExpect(jsonPath("$.price").value(25000.0));   // ราคาถูก
    }

    @Test
    void getProduct_NotFound() throws Exception {
        when(productService.findById(99L))
            .thenThrow(new ResourceNotFoundException("Not found"));

        mockMvc.perform(get("/api/products/99"))
            .andExpect(status().isNotFound());  // HTTP 404
    }

    @Test
    void createProduct_ValidationFails() throws Exception {
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name": "", "price": -1}
                """))
            .andExpect(status().isBadRequest());  // HTTP 400
    }
}


// --- @DataJpaTest — ทดสอบ Repository (ใช้ H2) ---
@DataJpaTest
class ProductRepositoryTest {

    @Autowired
    private ProductRepository repository;

    @Test
    void findByName_ReturnsProduct() {
        // Given
        repository.save(new Product("Laptop", 25000.0));

        // When
        Optional<Product> found = repository.findByName("Laptop");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getPrice()).isEqualTo(25000.0);
    }
}


// --- @SpringBootTest — Integration Test (ช้า แต่ครอบคลุม) ---
@SpringBootTest
@AutoConfigureMockMvc
class ProductIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository repository;

    @Test
    void fullCrudFlow() throws Exception {
        // CREATE
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name": "Mouse", "price": 500}
                """))
            .andExpect(status().isCreated());

        // VERIFY in DB
        assertThat(repository.findByName("Mouse")).isPresent();
    }
}


// --- Mockito Cheat Sheet ---
// when(...).thenReturn(value)      → กำหนด return value
// when(...).thenThrow(exception)   → กำหนดให้ throw
// verify(mock, times(1)).method()  → ตรวจว่าเรียก 1 ครั้ง
// verify(mock, never()).method()   → ตรวจว่าไม่เคยเรียก
// any(), anyLong(), anyString()    → match argument อะไรก็ได้
