# Hirely

A full-stack job platform built with **Spring Boot** (backend) and **React + TanStack Start** (frontend).

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA, PostgreSQL
- **Frontend**: React 19, TanStack Router, TailwindCSS 4, Radix UI, Vite

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+

### Backend

```sh
cd Hirely
mvn spring-boot:run
```

### Frontend

```sh
cd Frontend
npm install
npm run dev
```

## Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `MAIL_USERNAME` | SMTP email |
| `MAIL_PASSWORD` | SMTP app password |
| `JWT_SECRET_BASE64` | Base64-encoded JWT signing key (≥256 bits) |
| `VITE_API_URL` | Backend API base URL |
