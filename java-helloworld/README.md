# Java Hello World Server

A simple HTTP server using Java's built-in `com.sun.net.httpserver.HttpServer` — no external frameworks required.

## Endpoint

| Method | Path           | Response       |
|--------|----------------|----------------|
| GET    | `/helloworld`  | `Hello, World!` (200 OK) |

## Prerequisites

- Java 17 or later

## Build & Run

```bash
# Compile
javac -d out src/HelloWorldServer.java

# Run
java -cp out HelloWorldServer
```

The server starts on **port 8080**. Visit [http://localhost:8080/helloworld](http://localhost:8080/helloworld).
