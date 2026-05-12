package com.employee.controller;

import com.employee.model.Employee;
import com.employee.service.EmployeeService;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    public void startServer(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/helloworld", this::handleHelloWorld);
        server.createContext("/employees", this::handleEmployees);
        server.createContext("/employees/", this::handleEmployeeById);

        server.setExecutor(null);
        server.start();
        System.out.println("Employee Salary System started on port " + port);
        System.out.println("Endpoints:");
        System.out.println("  GET    /helloworld       - Hello World");
        System.out.println("  GET    /employees         - List all employees");
        System.out.println("  POST   /employees         - Create an employee");
        System.out.println("  GET    /employees/{id}    - Get employee by id");
        System.out.println("  PUT    /employees/{id}    - Update employee by id");
        System.out.println("  DELETE /employees/{id}    - Delete employee by id");
    }

    private void handleHelloWorld(HttpExchange exchange) throws IOException {
        sendResponse(exchange, 200, "Hello, World!");
    }

    private void handleEmployees(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();

        switch (method) {
            case "GET" -> {
                List<Employee> employees = employeeService.getAllEmployees();
                sendResponse(exchange, 200, toJson(employees));
            }
            case "POST" -> {
                String body = readRequestBody(exchange);
                try {
                    Employee employee = parseEmployee(body);
                    Employee created = employeeService.createEmployee(employee);
                    sendResponse(exchange, 201, toJson(created));
                } catch (IllegalArgumentException e) {
                    sendResponse(exchange, 400, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
            default -> sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    private void handleEmployeeById(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String idStr = path.substring("/employees/".length());

        int id;
        try {
            id = Integer.parseInt(idStr);
        } catch (NumberFormatException e) {
            sendResponse(exchange, 400, "{\"error\":\"Invalid employee id\"}");
            return;
        }

        String method = exchange.getRequestMethod();

        switch (method) {
            case "GET" -> {
                var employee = employeeService.getEmployeeById(id);
                if (employee.isPresent()) {
                    sendResponse(exchange, 200, toJson(employee.get()));
                } else {
                    sendResponse(exchange, 404, "{\"error\":\"Employee not found\"}");
                }
            }
            case "PUT" -> {
                String body = readRequestBody(exchange);
                try {
                    Employee employee = parseEmployee(body);
                    employee.setId(id);
                    Employee updated = employeeService.updateEmployee(employee);
                    sendResponse(exchange, 200, toJson(updated));
                } catch (IllegalArgumentException e) {
                    sendResponse(exchange, 400, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
            case "DELETE" -> {
                boolean deleted = employeeService.deleteEmployee(id);
                if (deleted) {
                    sendResponse(exchange, 200, "{\"message\":\"Employee deleted\"}");
                } else {
                    sendResponse(exchange, 404, "{\"error\":\"Employee not found\"}");
                }
            }
            default -> sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private Employee parseEmployee(String json) {
        int id = extractIntField(json, "id");
        String name = extractStringField(json, "name");
        double salary = extractDoubleField(json, "salary");
        String designation = extractStringField(json, "designation");
        return new Employee(id, name, salary, designation);
    }

    private String extractStringField(String json, String field) {
        String key = "\"" + field + "\"";
        int idx = json.indexOf(key);
        if (idx == -1) return "";
        int colonIdx = json.indexOf(":", idx);
        int startQuote = json.indexOf("\"", colonIdx + 1);
        int endQuote = json.indexOf("\"", startQuote + 1);
        return json.substring(startQuote + 1, endQuote);
    }

    private int extractIntField(String json, String field) {
        String value = extractNumericString(json, field);
        return value.isEmpty() ? 0 : Integer.parseInt(value);
    }

    private double extractDoubleField(String json, String field) {
        String value = extractNumericString(json, field);
        return value.isEmpty() ? 0.0 : Double.parseDouble(value);
    }

    private String extractNumericString(String json, String field) {
        String key = "\"" + field + "\"";
        int idx = json.indexOf(key);
        if (idx == -1) return "";
        int colonIdx = json.indexOf(":", idx);
        int start = colonIdx + 1;
        while (start < json.length() && json.charAt(start) == ' ') start++;
        int end = start;
        while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.')) end++;
        return json.substring(start, end);
    }

    private String toJson(Employee e) {
        return "{\"id\":" + e.getId()
                + ",\"name\":\"" + e.getName() + "\""
                + ",\"salary\":" + e.getSalary()
                + ",\"designation\":\"" + e.getDesignation() + "\"}";
    }

    private String toJson(List<Employee> employees) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < employees.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(toJson(employees.get(i)));
        }
        sb.append("]");
        return sb.toString();
    }

    public static void main(String[] args) throws IOException {
        EmployeeService service = new EmployeeService();
        EmployeeController controller = new EmployeeController(service);
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
        controller.startServer(port);
    }
}
