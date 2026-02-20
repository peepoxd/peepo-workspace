# Order Management API

A Spring Boot application with GraalVM Native Image support for fast startup and low memory usage.

## Features

- RESTful API for order management
- H2 database for development
- GraalVM native image compilation
- Docker support for containerization

## Building

### Regular JAR
```bash
./mvnw clean package
```

### Native Image
```bash
./mvnw clean package -Pnative
```

### Docker Native Image
```bash
docker build -t order-management-api .
```

## Running

### Regular JAR
```bash
java -jar target/order-management-api-0.0.1-SNAPSHOT.jar
```

### Native Executable
```bash
./target/order-management-api
```

### Docker
```bash
docker run -p 8080:8080 order-management-api
```

## API Endpoints

- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/status/{status}` - Get orders by status
- `GET /api/orders/customer/{customerName}` - Get orders by customer
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `PATCH /api/orders/{id}/status` - Update order status
- `DELETE /api/orders/{id}` - Delete order

## Order Status Values

- PENDING
- CONFIRMED  
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

## Development

H2 Console available at: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`