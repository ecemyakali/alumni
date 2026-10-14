# 📊 Data Design Documentation (DDD)

> **Alumni Tracking System**  
> *Version:* 1.0.0  
> *Architecture:* Model-View-Controller (MVC)  
> *Scope:* Data Architecture, Domain Entities, In-Memory Storage, ER Diagrams, Data Flow Lifecycles, and Relational Database (PostgreSQL) Blueprint  
> 🔗 **Application Overview & Operations Guide:** [README.md](./README.md)

---

## 📑 Table of Contents

1. [Overview & Architectural Context](#1-overview--architectural-context)
2. [Domain Entities & Information Schema](#2-domain-entities--information-schema)
   - [2.1 User (Alumni) Entity](#21-user-alumni-entity)
   - [2.2 Announcement Entity](#22-announcement-entity)
   - [2.3 Entity-Relationship Diagram (ERD)](#23-entity-relationship-diagram-erd)
3. [Storage Implementation & Data Volatility Analysis](#3-storage-implementation--data-volatility-analysis)
   - [3.1 In-Memory Storage Architecture](#31-in-memory-storage-architecture)
   - [3.2 The Forgetting Test (Data Volatility Demonstration)](#32-the-forgetting-test-data-volatility-demonstration)
4. [Model Interface & CRUD Operations Contract](#4-model-interface--crud-operations-contract)
   - [4.1 UserModel CRUD Interface](#41-usermodel-crud-interface)
   - [4.2 AnnouncementModel CRUD Interface](#42-announcementmodel-crud-interface)
5. [Data Flow & Lifecycle across the MVC Architecture](#5-data-flow--lifecycle-across-the-mvc-architecture)
   - [5.1 RESTful JSON API Data Flow](#51-restful-json-api-data-flow)
   - [5.2 Web Interface Form Submission Data Flow](#52-web-interface-form-submission-data-flow)
6. [Relational Database (PostgreSQL) Transition Blueprint](#6-relational-database-postgresql-transition-blueprint)
   - [6.1 Production DDL Schemas](#61-production-ddl-schemas)
   - [6.2 Constraints, Indexing Strategy & Triggers](#62-constraints-indexing-strategy--triggers)
   - [6.3 Persistent Volume Architecture (`postgres_data`)](#63-persistent-volume-architecture-postgres_data)
7. [Validation, Sanitization & Data Integrity Rules](#7-validation-sanitization--data-integrity-rules)
8. [Data Query & Controller Action Matrix](#8-data-query--controller-action-matrix)

---

## 1. Overview & Architectural Context

The **Alumni Tracking System** is architected using the **Model-View-Controller (MVC)** design pattern. In this architecture, the **Model Layer** (`src/models/userModel.js` and `src/models/announcementModel.js`) encapsulates all domain state, entity definitions, validation rules, and data mutation primitives.

### Core Architectural Principles:
* **Decoupled Persistence (Separation of Concerns):** Business controllers (`userController`, `apiUserController`, `announcementController`, `apiAnnouncementController`) interact strictly with model abstractions. Controllers remain agnostic to underlying storage mechanics (whether in-memory heap, JSON files, or PostgreSQL).
* **Single Source of Truth:** Models operate as singleton instances exported across the application, guaranteeing consistent entity state across both Server-Side Rendered (SSR) HTML views and RESTful JSON APIs.
* **Deterministic Contract:** Every mutation and query method enforces consistent return types, standardized timestamp formatting (ISO 8601 UTC), and deterministic primary key increments.

---

## 2. Domain Entities & Information Schema

The application models two primary business domains: **User (Alumni Profile)** and **Announcement (Campus & Alumni Broadcasts)**.

### 2.1 User (Alumni) Entity

Represents an alumnus, student, faculty member, or system administrator registered in the network.

| Attribute | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| **`id`** | `INTEGER` | ❌ No | Auto-increment (`1, 2, ...`) | Unique primary identifier. |
| **`name`** | `VARCHAR(255)` | ❌ No | - | Full name of the graduate. |
| **`email`** | `VARCHAR(255)` | ❌ No | - | Unique electronic mail address. |
| **`department`** | `VARCHAR(255)` | ❌ No | - | Academic department / graduation program. |
| **`graduationYear`** | `INTEGER` | ❌ No | - | Four-digit calendar year of graduation. |
| **`role`** | `VARCHAR(50)` | ❌ No | `'alumni'` | Authorization role (`'alumni'`, `'admin'`). |
| **`createdAt`** | `TIMESTAMP (ISO 8601)` | ❌ No | `CURRENT_TIMESTAMP` | System record creation timestamp. |
| **`updatedAt`** | `TIMESTAMP (ISO 8601)` | ✅ Yes | `null` | Timestamp of last modification. |

#### User JSON Representation:
```json
{
  "id": 1,
  "name": "Ece Yakali",
  "email": "ece@example.com",
  "department": "Computer Engineering",
  "graduationYear": 2024,
  "role": "alumni",
  "createdAt": "2026-10-14T20:00:00.000Z",
  "updatedAt": null
}
```

---

### 2.2 Announcement Entity

Represents broadcast communications, job opportunities, reunion invitations, and institutional updates.

| Attribute | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| **`id`** | `INTEGER` | ❌ No | Auto-increment (`1, 2, ...`) | Unique announcement identifier. |
| **`title`** | `VARCHAR(255)` | ❌ No | - | Headline of the broadcast. |
| **`content`** | `TEXT` | ❌ No | - | Detailed body text of the announcement. |
| **`category`** | `VARCHAR(100)` | ❌ No | `'General'` | Category tag (`Career`, `Event`, `Academic`, `General`). |
| **`author`** | `VARCHAR(255)` | ❌ No | `'Alumni Association'` | Publishing author or committee name. |
| **`priority`** | `VARCHAR(20)` | ❌ No | `'normal'` | Urgency level (`low`, `normal`, `high`, `urgent`). |
| **`createdAt`** | `TIMESTAMP (ISO 8601)` | ❌ No | `CURRENT_TIMESTAMP` | Publication timestamp. |
| **`updatedAt`** | `TIMESTAMP (ISO 8601)` | ✅ Yes | `null` | Timestamp of last content revision. |

#### Announcement JSON Representation:
```json
{
  "id": 1,
  "title": "Annual Alumni Reunion 2026",
  "content": "Join us on campus for our annual networking gala and alumni dinner.",
  "category": "Event",
  "author": "Alumni Office",
  "priority": "high",
  "createdAt": "2026-10-14T20:00:00.000Z",
  "updatedAt": null
}
```

---

### 2.3 Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ANNOUNCEMENT : "publishes / authors"
    USER {
        int id PK
        string name
        string email UK
        string department
        int graduationYear
        string role
        timestamp createdAt
        timestamp updatedAt
    }
    ANNOUNCEMENT {
        int id PK
        string title
        string content
        string category
        string author
        string priority
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## 3. Storage Implementation & Data Volatility Analysis

### 3.1 In-Memory Storage Architecture

In the initial development phase, entities reside within Node.js process heap memory:
```javascript
// Internal memory storage (src/models/userModel.js)
let users = [];

// Internal memory storage (src/models/announcementModel.js)
let announcements = [];
```

#### Lifecycle & Concurrency Characteristics:
* **Storage Location:** Allocations reside strictly inside V8 engine memory heap (`RAM`).
* **Performance:** Sub-millisecond retrieval and insertion with $O(1)$ lookup via array index or $O(N)$ filter by ID.
* **Concurrency:** Single-threaded event loop processes mutations sequentially, preventing standard multi-thread race conditions.
* **Scope:** Singleton reference shared across all incoming HTTP requests during process lifetime.

---

### 3.2 The Forgetting Test (Data Volatility Demonstration)

While in-memory storage offers zero-dependency rapid prototyping, it suffers from **memory volatility (process amnesia)**:

```
[In-Memory Volatility Demonstration]
┌────────────────────────────────────────────────────────┐
│  1. Node.js Express Server / Container Running         │
│     Heap RAM: User ID 1 ("Forgetting Test User")        │
└────────────────────────────────────────────────────────┘
                            │
               docker compose down / kill
                            ▼
┌────────────────────────────────────────────────────────┐
│  2. Container Destroyed / Process Exits                │
│     Heap RAM completely deallocated! All data lost!   │
└────────────────────────────────────────────────────────┘
                            │
               docker compose up -d / restart
                            ▼
┌────────────────────────────────────────────────────────┐
│  3. Fresh Server Process Started                       │
│     Heap RAM reinitialized: users = []                 │
│     💥 "Forgetting Test User" WAS FORGOTTEN!           │
└────────────────────────────────────────────────────────┘
```

#### Empirical Demonstration Commands:
```bash
# 1. Create a record in memory:
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Forgetting Test User","email":"forgetting.test@alumni.edu","department":"Computer Engineering"}'
# Status: 201 Created -> {"id":1,"name":"Forgetting Test User",...}

# 2. Verify existence in RAM:
curl http://localhost:5000/api/users
# Status: 200 OK -> [{"id":1,"name":"Forgetting Test User",...}]

# 3. Teardown container / stop process:
docker compose down

# 4. Rebuild / restart container:
docker compose up -d

# 5. Query records:
curl http://localhost:5000/api/users
# Status: 200 OK -> {"success":true,"count":0,"data":[]}
# Result: The record was lost!
```

> **Pedagogical Conclusion:**  
> In-memory databases cannot provide durability (the **D** in **ACID**). To guarantee persistence beyond container lifecycles, data must be stored on persistent disk volumes backed by a relational database management system (PostgreSQL).

---

## 4. Model Interface & CRUD Operations Contract

Both models implement a uniform, clean CRUD contract providing deterministic inputs and outputs.

### 4.1 UserModel CRUD Interface

```typescript
interface UserModelContract {
  // CREATE
  create(userData: {
    name: string;
    email: string;
    department?: string;
    graduationYear?: number | string;
    role?: string;
  }): User;

  // READ ALL
  findAll(): User[];
  getAll(): User[];

  // READ BY ID
  findById(id: number | string): User | null;
  getById(id: number | string): User | null;

  // READ BY EMAIL
  findByEmail(email: string): User | null;

  // UPDATE
  update(id: number | string, updateData: Partial<User>): User | null;

  // DELETE
  delete(id: number | string): User | null;
  remove(id: number | string): User | null;

  // UTILITIES
  count(): number;
  clear(): void;
}
```

---

### 4.2 AnnouncementModel CRUD Interface

```typescript
interface AnnouncementModelContract {
  // CREATE
  create(data: {
    title: string;
    content: string;
    category?: string;
    author?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }): Announcement;

  // READ ALL
  findAll(): Announcement[];
  getAll(): Announcement[];

  // READ BY ID
  findById(id: number | string): Announcement | null;
  getById(id: number | string): Announcement | null;

  // READ BY CATEGORY
  findByCategory(category: string): Announcement[];

  // UPDATE
  update(id: number | string, updateData: Partial<Announcement>): Announcement | null;

  // DELETE
  delete(id: number | string): Announcement | null;
  remove(id: number | string): Announcement | null;

  // UTILITIES
  count(): number;
  clear(): void;
}
```

---

## 5. Data Flow & Lifecycle across the MVC Architecture

### 5.1 RESTful JSON API Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as API Consumer / Postman / Swagger UI
    participant Router as src/routes/apiUserRoutes.js
    participant Controller as src/controllers/apiUserController.js
    participant Model as src/models/userModel.js
    participant Store as In-Memory Store / PostgreSQL

    Client->>Router: POST /api/users (JSON Payload)
    Router->>Controller: createUser(req, res)
    Note over Controller: Input Validation & Sanitization
    alt Validation Failed (Empty / Missing Required)
        Controller-->>Client: 400 Bad Request { success: false, error: ... }
    else Valid Payload
        Controller->>Model: userModel.create(formData)
        Model->>Store: Append to users array (Auto ID & Timestamp)
        Store-->>Model: New User Entity
        Model-->>Controller: Return created user object
        Controller-->>Client: 201 Created { success: true, user: ... }
    end
```

---

### 5.2 Web Interface Form Submission Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Web Browser User
    participant Router as src/routes/userRoutes.js
    participant Controller as src/controllers/userController.js
    participant Model as src/models/userModel.js
    participant View as src/views/userView.js

    User->>Router: POST /users (Form Data: name, email, department...)
    Router->>Controller: createUser(req, res)
    Controller->>Model: userModel.create(req.body)
    Model-->>Controller: Newly created user record
    Controller->>Model: userModel.getAll()
    Model-->>Controller: Complete users list
    Controller->>View: renderUsersList(users, { message: "User registered..." })
    View-->>Controller: Rendered HTML + Embedded CSS
    Controller-->>User: 201 Created (text/html Web Page)
```

---

## 6. Relational Database (PostgreSQL) Transition Blueprint

To transition from in-memory volatile storage to production-grade persistent storage, the following relational database architecture is defined.

### 6.1 Production DDL Schemas

```sql
-- PostgreSQL 16 Production Schema
-- Database: alumni_db

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    graduation_year INTEGER,
    role VARCHAR(50) DEFAULT 'alumni' CHECK (role IN ('alumni', 'admin', 'faculty', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    author VARCHAR(255) DEFAULT 'Alumni Association',
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 6.2 Constraints, Indexing Strategy & Triggers

1. **Email Uniqueness & Lookup Index:**
   ```sql
   CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));
   ```
2. **Announcement Category & Priority Query Index:**
   ```sql
   CREATE INDEX idx_announcements_category ON announcements (category);
   CREATE INDEX idx_announcements_created_at ON announcements (created_at DESC);
   ```
3. **Automated `updated_at` Timestamp Trigger:**
   ```sql
   CREATE OR REPLACE FUNCTION update_timestamp_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = CURRENT_TIMESTAMP;
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER trg_users_updated_at
       BEFORE UPDATE ON users
       FOR EACH ROW
       EXECUTE FUNCTION update_timestamp_column();

   CREATE TRIGGER trg_announcements_updated_at
       BEFORE UPDATE ON announcements
       FOR EACH ROW
       EXECUTE FUNCTION update_timestamp_column();
   ```

---

### 6.3 Persistent Volume Architecture (`postgres_data`)

In `docker-compose.yml`, persistent disk storage is managed via a Docker Named Volume:

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: alumni_db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: alumni_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  postgres_data:
    driver: local
```

* **Durable Storage:** Container restarts (`docker compose down` ➡️ `docker compose up`) mount `postgres_data` automatically, permanently resolving the **Forgetting Test** volatility problem.

---

## 7. Validation, Sanitization & Data Integrity Rules

| Field | Rule / Constraint | Action on Failure |
| :--- | :--- | :--- |
| **`User.name`** | Non-empty string, min length 2, max length 255. | HTTP `400 Bad Request` |
| **`User.email`** | Valid RFC 5322 format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. | HTTP `400 Bad Request` |
| **`User.graduationYear`** | Numeric integer between `1950` and `2100`. | HTTP `400 Bad Request` |
| **`Announcement.title`** | Non-empty string, min length 3, max length 255. | HTTP `400 Bad Request` |
| **`Announcement.content`** | Non-empty text, min length 5. | HTTP `400 Bad Request` |
| **`Announcement.priority`** | Must match: `'low' \| 'normal' \| 'high' \| 'urgent'`. | Defaults to `'normal'` |

---

## 8. Data Query & Controller Action Matrix

| HTTP Method | Route URI | Controller Method | Model Method | Success Status | Error Status |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **GET** | `/api/users` | `apiUserController.getAllUsers` | `userModel.getAll()` | `200 OK` | - |
| **POST** | `/api/users` | `apiUserController.createUser` | `userModel.create(data)` | `201 Created` | `400 Bad Request` |
| **GET** | `/api/users/:id` | `apiUserController.getUserById` | `userModel.getById(id)` | `200 OK` | `404 Not Found` |
| **PUT/PATCH**| `/api/users/:id` | `apiUserController.updateUser` | `userModel.update(id, data)` | `200 OK` | `404 Not Found` |
| **DELETE** | `/api/users/:id` | `apiUserController.deleteUser` | `userModel.delete(id)` | `200 OK` | `404 Not Found` |
| **GET** | `/users` | `userController.getAllUsers` | `userModel.getAll()` | `200 OK` | - |
| **POST** | `/users` | `userController.createUser` | `userModel.create(data)` | `201 Created` | `400 Bad Request` |
| **GET** | `/users/:id` | `userController.getUserById` | `userModel.getById(id)` | `200 OK` | `404 Not Found` |
| **GET** | `/api/announcements` | `apiAnnouncementController.getAllAnnouncements` | `announcementModel.getAll()` | `200 OK` | - |
| **POST** | `/api/announcements` | `apiAnnouncementController.createAnnouncement` | `announcementModel.create(data)` | `201 Created` | `400 Bad Request` |
| **GET** | `/api/announcements/:id` | `apiAnnouncementController.getAnnouncementById` | `announcementModel.getById(id)`| `200 OK` | `404 Not Found` |
| **PUT/PATCH**| `/api/announcements/:id`| `apiAnnouncementController.updateAnnouncement` | `announcementModel.update(id, data)`| `200 OK` | `404 Not Found` |
| **DELETE** | `/api/announcements/:id`| `apiAnnouncementController.deleteAnnouncement` | `announcementModel.delete(id)` | `200 OK` | `404 Not Found` |
| **GET** | `/announcements` | `announcementController.getAllAnnouncements` | `announcementModel.getAll()` | `200 OK` | - |
| **POST** | `/announcements` | `announcementController.createAnnouncement` | `announcementModel.create(data)` | `201 Created` | `400 Bad Request` |
