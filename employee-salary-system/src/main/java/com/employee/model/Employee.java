package com.employee.model;

import java.util.Objects;

public class Employee {

    private int id;
    private String name;
    private double salary;
    private String designation;

    public Employee() {
    }

    public Employee(int id, String name, double salary, String designation) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.designation = designation;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return id == employee.id
                && Double.compare(employee.salary, salary) == 0
                && Objects.equals(name, employee.name)
                && Objects.equals(designation, employee.designation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, salary, designation);
    }

    @Override
    public String toString() {
        return "Employee{id=" + id
                + ", name='" + name + '\''
                + ", salary=" + salary
                + ", designation='" + designation + '\'' + '}';
    }
}
