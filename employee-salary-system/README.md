# Employee Salary System

A Java CRUD application for managing employee salary records, built using Java's built-in `HttpServer` — no external frameworks required.

## Employee Fields

| Field       | Type     | Description              |
|-------------|----------|--------------------------|
| id          | int      | Unique employee identifier |
| name        | String   | Employee full name        |
| salary      | double   | Employee salary           |
| designation | String   | Job title / designation   |

## REST Endpoints

| Method | Path              | Description               |
|--------|-------------------|---------------------------|
| GET    | `/helloworld`     | Returns "Hello, World!"   |
| GET    | `/employees`      | List all employees        |
| POST   | `/employees`      | Create a new employee     |
| GET    | `/employees/{id}` | Get employee by id        |
| PUT    | `/employees/{id}` | Update employee by id     |
| DELETE | `/employees/{id}` | Delete employee by id     |

## Prerequisites

- Java 17 or later
- Maven 3.8+

## Build & Run

```bash
cd employee-salary-system

# Compile and run tests
mvn clean test

# Package
mvn clean package

# Run the server
java -cp target/classes com.employee.controller.EmployeeController
```

The server starts on **port 8080**.

## Example Requests

```bash
# Create an employee
curl -X POST http://localhost:8080/employees \
  -d '{"id": 1, "name": "Alice", "salary": 75000.0, "designation": "Software Engineer"}'

# Get all employees
curl http://localhost:8080/employees

# Get employee by id
curl http://localhost:8080/employees/1

# Update employee
curl -X PUT http://localhost:8080/employees/1 \
  -d '{"name": "Alice", "salary": 90000.0, "designation": "Senior Software Engineer"}'

# Delete employee
curl -X DELETE http://localhost:8080/employees/1
```

## Running Tests

```bash
mvn test
```

The test suite includes 20 JUnit 5 tests covering:
- **Create**: successful creation, duplicate id handling, multiple employees
- **Read**: get by id, get all, not found, empty list, unmodifiable list
- **Update**: successful update, not found, name change, verify persistence
- **Delete**: successful deletion, not found, count verification, isolation
- **Model**: equals/hashCode, toString, setters
