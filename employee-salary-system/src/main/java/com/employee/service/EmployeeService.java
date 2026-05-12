package com.employee.service;

import com.employee.model.Employee;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class EmployeeService {

    private final Map<Integer, Employee> employeeStore = new ConcurrentHashMap<>();

    public Employee createEmployee(Employee employee) {
        if (employeeStore.containsKey(employee.getId())) {
            throw new IllegalArgumentException("Employee with id " + employee.getId() + " already exists");
        }
        employeeStore.put(employee.getId(), employee);
        return employee;
    }

    public Optional<Employee> getEmployeeById(int id) {
        return Optional.ofNullable(employeeStore.get(id));
    }

    public List<Employee> getAllEmployees() {
        return Collections.unmodifiableList(new ArrayList<>(employeeStore.values()));
    }

    public Employee updateEmployee(Employee employee) {
        if (!employeeStore.containsKey(employee.getId())) {
            throw new IllegalArgumentException("Employee with id " + employee.getId() + " not found");
        }
        employeeStore.put(employee.getId(), employee);
        return employee;
    }

    public boolean deleteEmployee(int id) {
        return employeeStore.remove(id) != null;
    }

    public int getEmployeeCount() {
        return employeeStore.size();
    }
}
