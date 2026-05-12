package com.employee.service;

import com.employee.model.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeServiceTest {

    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService();
    }

    // --- CREATE tests ---

    @Test
    @DisplayName("Should create a new employee successfully")
    void createEmployee_success() {
        Employee employee = new Employee(1, "Alice", 75000.0, "Software Engineer");

        Employee created = employeeService.createEmployee(employee);

        assertNotNull(created);
        assertEquals(1, created.getId());
        assertEquals("Alice", created.getName());
        assertEquals(75000.0, created.getSalary());
        assertEquals("Software Engineer", created.getDesignation());
    }

    @Test
    @DisplayName("Should throw exception when creating employee with duplicate id")
    void createEmployee_duplicateId_throwsException() {
        Employee employee1 = new Employee(1, "Alice", 75000.0, "Software Engineer");
        employeeService.createEmployee(employee1);

        Employee employee2 = new Employee(1, "Bob", 80000.0, "Manager");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> employeeService.createEmployee(employee2)
        );
        assertEquals("Employee with id 1 already exists", exception.getMessage());
    }

    @Test
    @DisplayName("Should create multiple employees with different ids")
    void createEmployee_multipleEmployees() {
        Employee emp1 = new Employee(1, "Alice", 75000.0, "Software Engineer");
        Employee emp2 = new Employee(2, "Bob", 80000.0, "Manager");
        Employee emp3 = new Employee(3, "Charlie", 65000.0, "Analyst");

        employeeService.createEmployee(emp1);
        employeeService.createEmployee(emp2);
        employeeService.createEmployee(emp3);

        assertEquals(3, employeeService.getEmployeeCount());
    }

    // --- READ tests ---

    @Test
    @DisplayName("Should get employee by id when employee exists")
    void getEmployeeById_exists() {
        Employee employee = new Employee(1, "Alice", 75000.0, "Software Engineer");
        employeeService.createEmployee(employee);

        Optional<Employee> result = employeeService.getEmployeeById(1);

        assertTrue(result.isPresent());
        assertEquals("Alice", result.get().getName());
        assertEquals(75000.0, result.get().getSalary());
        assertEquals("Software Engineer", result.get().getDesignation());
    }

    @Test
    @DisplayName("Should return empty optional when employee does not exist")
    void getEmployeeById_notFound() {
        Optional<Employee> result = employeeService.getEmployeeById(999);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should return all employees")
    void getAllEmployees_returnsAll() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));
        employeeService.createEmployee(new Employee(2, "Bob", 80000.0, "Manager"));

        List<Employee> employees = employeeService.getAllEmployees();

        assertEquals(2, employees.size());
    }

    @Test
    @DisplayName("Should return empty list when no employees exist")
    void getAllEmployees_empty() {
        List<Employee> employees = employeeService.getAllEmployees();

        assertNotNull(employees);
        assertTrue(employees.isEmpty());
    }

    @Test
    @DisplayName("Should return unmodifiable list from getAllEmployees")
    void getAllEmployees_unmodifiable() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));

        List<Employee> employees = employeeService.getAllEmployees();

        assertThrows(UnsupportedOperationException.class, () -> employees.add(
                new Employee(2, "Bob", 80000.0, "Manager")
        ));
    }

    // --- UPDATE tests ---

    @Test
    @DisplayName("Should update an existing employee successfully")
    void updateEmployee_success() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));

        Employee updated = new Employee(1, "Alice", 90000.0, "Senior Software Engineer");
        Employee result = employeeService.updateEmployee(updated);

        assertEquals(90000.0, result.getSalary());
        assertEquals("Senior Software Engineer", result.getDesignation());
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent employee")
    void updateEmployee_notFound_throwsException() {
        Employee employee = new Employee(999, "Ghost", 50000.0, "Unknown");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> employeeService.updateEmployee(employee)
        );
        assertEquals("Employee with id 999 not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should update employee name")
    void updateEmployee_nameChange() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));

        Employee updated = new Employee(1, "Alice Johnson", 75000.0, "Software Engineer");
        employeeService.updateEmployee(updated);

        Optional<Employee> result = employeeService.getEmployeeById(1);
        assertTrue(result.isPresent());
        assertEquals("Alice Johnson", result.get().getName());
    }

    @Test
    @DisplayName("Should reflect updated values when fetched after update")
    void updateEmployee_verifyGetReflectsChanges() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));

        employeeService.updateEmployee(new Employee(1, "Alice", 95000.0, "Tech Lead"));

        Optional<Employee> fetched = employeeService.getEmployeeById(1);
        assertTrue(fetched.isPresent());
        assertEquals(95000.0, fetched.get().getSalary());
        assertEquals("Tech Lead", fetched.get().getDesignation());
    }

    // --- DELETE tests ---

    @Test
    @DisplayName("Should delete an existing employee successfully")
    void deleteEmployee_success() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));

        boolean deleted = employeeService.deleteEmployee(1);

        assertTrue(deleted);
        assertTrue(employeeService.getEmployeeById(1).isEmpty());
    }

    @Test
    @DisplayName("Should return false when deleting non-existent employee")
    void deleteEmployee_notFound() {
        boolean deleted = employeeService.deleteEmployee(999);

        assertFalse(deleted);
    }

    @Test
    @DisplayName("Should decrease employee count after deletion")
    void deleteEmployee_decreasesCount() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));
        employeeService.createEmployee(new Employee(2, "Bob", 80000.0, "Manager"));

        assertEquals(2, employeeService.getEmployeeCount());

        employeeService.deleteEmployee(1);

        assertEquals(1, employeeService.getEmployeeCount());
    }

    @Test
    @DisplayName("Should not affect other employees when one is deleted")
    void deleteEmployee_doesNotAffectOthers() {
        employeeService.createEmployee(new Employee(1, "Alice", 75000.0, "Software Engineer"));
        employeeService.createEmployee(new Employee(2, "Bob", 80000.0, "Manager"));

        employeeService.deleteEmployee(1);

        assertTrue(employeeService.getEmployeeById(1).isEmpty());
        assertTrue(employeeService.getEmployeeById(2).isPresent());
        assertEquals("Bob", employeeService.getEmployeeById(2).get().getName());
    }

    // --- Employee model tests ---

    @Test
    @DisplayName("Should verify Employee equals and hashCode")
    void employee_equalsAndHashCode() {
        Employee emp1 = new Employee(1, "Alice", 75000.0, "Software Engineer");
        Employee emp2 = new Employee(1, "Alice", 75000.0, "Software Engineer");

        assertEquals(emp1, emp2);
        assertEquals(emp1.hashCode(), emp2.hashCode());
    }

    @Test
    @DisplayName("Should verify Employee not equal with different fields")
    void employee_notEqual() {
        Employee emp1 = new Employee(1, "Alice", 75000.0, "Software Engineer");
        Employee emp2 = new Employee(2, "Bob", 80000.0, "Manager");

        assertNotEquals(emp1, emp2);
    }

    @Test
    @DisplayName("Should verify Employee toString format")
    void employee_toString() {
        Employee employee = new Employee(1, "Alice", 75000.0, "Software Engineer");

        String str = employee.toString();

        assertTrue(str.contains("Alice"));
        assertTrue(str.contains("75000.0"));
        assertTrue(str.contains("Software Engineer"));
    }

    @Test
    @DisplayName("Should verify Employee setters work correctly")
    void employee_setters() {
        Employee employee = new Employee();
        employee.setId(10);
        employee.setName("Dave");
        employee.setSalary(60000.0);
        employee.setDesignation("Intern");

        assertEquals(10, employee.getId());
        assertEquals("Dave", employee.getName());
        assertEquals(60000.0, employee.getSalary());
        assertEquals("Intern", employee.getDesignation());
    }
}
