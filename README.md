# 🎓 Alumni Tracking System

A modern, scalable, and secure **Alumni Tracking & Networking System** designed to bridge the gap between academic institutions and their graduates. This platform enables alumni to maintain up-to-date career profiles, fosters professional networking, and provides institutions with valuable insights into alumni outcomes and career trends.

---

## 📖 API Documentation (Swagger UI)

Interactive Swagger UI documentation is available for inspecting all endpoints, request/response models, and testing live API calls directly from your web browser:

* **Interactive Swagger UI:** [http://localhost:5000/api/swagger/](http://localhost:5000/api/swagger/) *(or [http://localhost:3000/api/swagger/](http://localhost:3000/api/swagger/))*
* **Alternative Docs URL:** [http://localhost:5000/api/docs/](http://localhost:5000/api/docs/)
* **OpenAPI 3.0 JSON Spec:** [http://localhost:5000/api/swagger.json](http://localhost:5000/api/swagger.json)

> [!IMPORTANT]
> **API Documentation Rule:** Whenever a new route is created or modified in the project, it must always be registered and documented in the Swagger specification (`src/config/swagger.js`) and listed in this documentation.

---

## 🛣️ API Endpoints Summary

| Method | Endpoint | Description | Request Format |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/swagger` | Interactive Swagger UI API documentation | - |
| **GET** | `/api/swagger.json` | OpenAPI 3.0 specification in JSON format | - |
| **GET** | `/api/health` | System health check (status, uptime, timestamp) | - |
| **GET** | `/api/users` | List all registered users (in-memory) | - |
| **POST** | `/api/users` | Create a new user | Form (`x-www-form-urlencoded`) or JSON |
| **GET** | `/api/users/:id` | Get single user details by numeric ID | - |
| **PUT** | `/api/users/:id` | Update all or multiple user details | Form (`x-www-form-urlencoded`) or JSON |
| **PATCH**| `/api/users/:id` | Partially update user fields | JSON or Form |
| **DELETE**| `/api/users/:id`| Remove a user from in-memory storage | - |
| **GET** | `/` | Root endpoint (`ok` or `temporary one main page` in browser) | - |
| **GET** | `/hello` | Basic greeting (`Hello, World!`) | - |
| **GET** | `/hello/:name` | Dynamic personalized greeting (`Hello, {Name}!`) | - |
| **GET** | `/sum/:n1/:n2` | Calculates the sum of two numbers | - |
| **GET** | `/about` | Temporary about page (`temp. about page`) | - |
| **GET** | `/alumni` | Alumni base status route (`ok`) | - |

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Node.js** & **Express.js** | High-performance, asynchronous RESTful API architecture |
| **Documentation** | **Swagger / OpenAPI 3.0** | Interactive API exploration and testing interface (`swagger-ui-express`) |
| **Database** | **PostgreSQL** | Reliable, ACID-compliant relational database management system |
| **Containerization** | **Docker** & **Docker Compose** | Isolated micro-environments for development and production deployment |
| **API Testing** | **Postman** & **Newman** | Comprehensive test suites and collection automation |
| **Version Control & CI/CD** | **Git** & **GitHub** | Source control, collaborative workflows, and automated pipelines |

---

## 🏛️ Architecture: Model-View-Controller (MVC) Pattern

The **Alumni Tracking System** is engineered using the industry-standard **Model-View-Controller (MVC)** architectural design pattern. This pattern establishes a clean **Separation of Concerns (SoC)** by decoupling data persistence, application processing logic, and presentation interfaces into distinct, specialized layers.

```mermaid
graph TD
  subgraph Client["Client Tier"]
    Browser["Web Browser / Client App"]
    Postman["Postman / Newman Test Suites"]
    SwaggerUI["Swagger UI (/api/swagger)"]
  end

  subgraph Server["Express.js Server (Node.js)"]
    subgraph RouterLayer["Routing & Dispatching Layer (src/routes/)"]
      App["src/app.js (Middleware & Router Assembler)"]
      MasterRouter["src/routes/index.js (Central Aggregator)"]
      UserRoutes["src/routes/userRoutes.js"]
      HealthRoutes["src/routes/healthRoutes.js"]
      WhiteboardRoutes["src/routes/whiteboardRoutes.js"]
    end

    subgraph ControllerLayer["Controller Layer (src/controllers/)"]
      UserController["src/controllers/userController.js"]
      HealthController["src/controllers/healthController.js"]
      WhiteboardController["src/controllers/whiteboardController.js"]
    end

    subgraph ModelLayer["Model Layer (src/models/ & docker/)"]
      UserModel["src/models/userModel.js (In-Memory Entity Manager)"]
      PostgresDB[("PostgreSQL Database / docker/init.sql")]
    end

    subgraph ViewLayer["View & Presentation Layer"]
      JSONView["JSON Response Payloads (res.json)"]
      HTMLView["HTML / Plain Text Responses (res.send)"]
      SwaggerView["Interactive Swagger UI Documentation"]
    end
  end

  Browser -->|HTTP Request| App
  Postman -->|HTTP Request| App
  SwaggerUI -->|HTTP Request| App

  App --> MasterRouter
  MasterRouter --> UserRoutes
  MasterRouter --> HealthRoutes
  MasterRouter --> WhiteboardRoutes

  UserRoutes --> UserController
  HealthRoutes --> HealthController
  WhiteboardRoutes --> WhiteboardController

  UserController -->|Query / Mutate Entity| UserModel
  UserModel -.->|Persistent Storage / Seeds| PostgresDB

  UserController -->|Format Response| JSONView
  HealthController -->|Format Response| JSONView
  WhiteboardController -->|Format HTML / String| HTMLView

  JSONView -->|HTTP 200 / 201 / 400 / 404 Response| Client
  HTMLView -->|HTTP 200 Response| Client
  SwaggerView -->|Visual API Specification| Browser
```

---

### 📂 MVC Directory & Component Breakdown

The codebase is organized into modular directories reflecting each layer of the MVC pattern:

| MVC Layer | Directory / Folder | Core Files | Responsibility |
| :--- | :--- | :--- | :--- |
| **Model (M)** | `src/models/`<br>`docker/` | `userModel.js`<br>`init.sql` | Encapsulates business data structures, entity state, CRUD manipulation, and database schemas. |
| **View (V)** | Presentation Layer<br>`src/config/` | `swagger.js`<br>`swagger.json`<br>JSON responses | Formats and delivers data to clients. In our REST API, this includes JSON payloads, Swagger UI documentation, and HTML views. |
| **Controller (C)** | `src/controllers/` | `userController.js`<br>`healthController.js`<br>`whiteboardController.js` | Receives client HTTP requests, validates input parameters, invokes Model operations, and formats the output View. |
| **Router / Dispatcher** | `src/routes/` | `index.js`<br>`userRoutes.js`<br>`healthRoutes.js`<br>`whiteboardRoutes.js` | Directs incoming HTTP requests (HTTP method + URI path) to the designated Controller handler. |
| **Infrastructure & Core** | Root & `src/` | `app.js`<br>`index.js` | Configures Express middlewares (JSON parser, URL-encoded parser), binds port listeners, and registers Swagger UI. |

---

### 🔍 In-Depth Layer Walkthrough: Directories, Folders & Files

#### 1. 🗄️ Model Layer (`src/models/` & `docker/`)
The **Model** represents the application's domain data, data structures, and the operations allowed upon that data.
* **`src/models/userModel.js`**:
  * **Entity State:** Maintains the in-memory array of user objects (`users = []`).
  * **Data Access Operations:** Implements CRUD helper functions decoupled from HTTP logic:
    * `getAll()`: Retrieves all registered user records.
    * `getById(id)`: Searches for a user matching a numeric identifier.
    * `create(userData)`: Generates auto-incrementing IDs, appends creation timestamps (`createdAt`), and saves the record.
    * `update(id, updateData)`: Merges new field values, preserves immutable IDs, and tracks modification timestamps (`updatedAt`).
    * `delete(id)`: Removes a user from the collection and returns the deleted record.
    * `count()`: Reports the total number of stored users.
* **`docker/init.sql`**:
  * Defines the relational PostgreSQL schema (`users` table with primary keys, constraints, and timestamps) and initial seed data for persistent database operations.

#### 2. 🖥️ View & Presentation Layer (`src/config/` & API Serializers)
In a modern headless RESTful backend, the **View** layer is responsible for formatting data into standardized representations for client applications (browsers, mobile applications, and API consumers):
* **RESTful JSON Presentation (`res.json`)**: Every controller serializes Model data into uniform JSON responses accompanied by semantic HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
* **Interactive API Documentation View (`src/config/swagger.js` & `swagger.json`)**:
  * Powered by `swagger-ui-express` and OpenAPI 3.0.
  * Served at `/api/swagger` and `/api/docs` to provide a visual, interactive GUI where human users and developers can inspect schemas, parameters, and execute live requests.
* **HTML & Plain Text Views**: Browser-oriented endpoints (`/`, `/main`, `/about`, `/hello`) serving direct textual or HTML view representations.

#### 3. 🎮 Controller Layer (`src/controllers/`)
The **Controller** acts as the intermediary between the incoming HTTP request, the Model layer, and the View layer. It contains no direct routing logic and no database engine specifics:
* **`src/controllers/userController.js`**:
  * `createUser(req, res)`: Validates incoming request payloads from `req.body` (JSON or form-urlencoded), triggers `userModel.create()`, and returns HTTP `201 Created`.
  * `getAllUsers(req, res)`: Fetches data via `userModel.getAll()` and formats the JSON list response.
  * `getUserById(req, res)`: Extracts `req.params.id`, queries `userModel.getById()`, and responds with `200 OK` or `404 Not Found`.
  * `updateUser(req, res)`: Processes `PUT` (full update) and `PATCH` (partial update) requests, validates non-empty payloads, applies mutations via `userModel.update()`, and responds accordingly.
  * `deleteUser(req, res)`: Removes a user via `userModel.delete()` and returns confirmation metadata with HTTP `200 OK` or `404 Not Found`.
* **`src/controllers/healthController.js`**:
  * `getHealth(req, res)`: Computes server health metrics (`uptime`, system timestamp, status string) and formats the response.
* **`src/controllers/whiteboardController.js`**:
  * Contains request handlers for classroom routes (`getRoot`, `getHello`, `getHelloNamed`, `getSum`, `getMain`, `getAbout`, `getAlumni`), handling URL parameter parsing and response rendering.

#### 4. 🚦 Routing & Dispatching Layer (`src/routes/`)
Decouples URL route matching from business logic, ensuring that URL changes do not impact controller or model implementation:
* **`src/routes/userRoutes.js`**: Registers routes for User management (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`) and maps them to `userController`.
* **`src/routes/healthRoutes.js`**: Registers `GET /api/health` and `GET /health` mapped to `healthController.getHealth`.
* **`src/routes/whiteboardRoutes.js`**: Registers introductory educational routes mapped to `whiteboardController`.
* **`src/routes/index.js`**: Central aggregator that combines all modular sub-routers and serves the OpenAPI specification endpoints (`/api/swagger.json`, `/swagger.json`).

#### 5. ⚙️ Application Entry Point & Infrastructure
* **`src/app.js`**: Configures the Express instance, attaches global middlewares (`express.json()`, `express.urlencoded()`), mounts Swagger UI, and binds the central router.
* **`index.js`**: Main executable script that initializes the HTTP listeners on both port `5000` (default) and port `3000` (alternate).
* **`test/routes.test.js`**: Comprehensive automated test suite (19/19 tests) asserting that all MVC components coordinate seamlessly.

---

### 🔄 MVC Request-Response Lifecycle Example

To illustrate the MVC flow during execution, consider a client submitting **`POST /api/users`**:

1. **Client Request:** The client sends an HTTP `POST` request to `http://localhost:5000/api/users` with payload `{ "name": "Ece Yakali", "email": "ece@example.com" }`.
2. **Listener & Middleware (`index.js` -> `src/app.js`):** The server receives the request; Express body-parser middleware parses the request body into `req.body`.
3. **Router Dispatch (`src/routes/index.js` -> `src/routes/userRoutes.js`):** The router matches `POST /api/users` and passes execution to `userController.createUser`.
4. **Controller Processing (`src/controllers/userController.js`):** The controller validates that the payload is non-empty.
5. **Model Mutation (`src/models/userModel.js`):** The controller calls `userModel.create(req.body)`. The model assigns an ID, appends timestamps, stores the record, and returns the entity.
6. **View Formatting (`res.status(201).json(...)`):** The controller packages the newly created entity into a standardized JSON response view.
7. **Client Response:** Express transmits the HTTP 201 response back to the client.

---

## 📁 Project Directory Structure

```text
alumni/
├── docker/                             # Containerization and database assets
│   └── init.sql                        # Initial PostgreSQL schema & seed data (Model layer)
├── postman/                            # Postman workspace environment and collection files
├── src/                                # Application source code (MVC Architecture)
│   ├── config/                         # Environment & API documentation configurations
│   │   └── swagger.js                  # OpenAPI 3.0 specification definition (View layer)
│   ├── controllers/                    # Controller Layer (Request orchestration & business flow)
│   │   ├── healthController.js         # System health & uptime metric handler
│   │   ├── userController.js           # User CRUD request & response coordinator
│   │   └── whiteboardController.js     # Classroom introductory routes & calculation handlers
│   ├── models/                         # Model Layer (Data structures & entity manipulation)
│   │   └── userModel.js                # User entity data store & CRUD operations
│   ├── routes/                         # Router Layer (HTTP verb & URL route definitions)
│   │   ├── healthRoutes.js             # Routes for /api/health
│   │   ├── index.js                    # Aggregated master router & Swagger JSON endpoints
│   │   ├── userRoutes.js               # Routes for /api/users (POST, GET, PUT, PATCH, DELETE)
│   │   └── whiteboardRoutes.js         # Routes for classroom endpoints (/, /hello, /sum, etc.)
│   └── app.js                          # Express application configuration & middleware setup
├── test/                               # Automated test suites (Node.js native test runner)
│   └── routes.test.js                  # 19 automated tests validating all endpoints & MVC layers
├── .dockerignore                       # Files excluded from Docker container build
├── .env.example                        # Sample environment variable template
├── .gitignore                          # Git tracking exclusion list
├── alumni.postman_collection.json      # Exported Postman collection for automated API testing
├── docker-compose.yml                  # Multi-container orchestration (Node.js API + PostgreSQL)
├── Dockerfile                          # Production-ready container image for the Node.js API
├── index.js                            # Server entry point (listens on ports 5000 & 3000)
├── package.json                        # Node.js project manifest & scripts
├── swagger.json                        # OpenAPI 3.0 static specification file
└── README.md                           # Comprehensive project documentation
```

---

## ⚙️ Getting Started

### 📋 Prerequisites
Ensure you have the following installed on your machine:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18 or higher) & npm
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Postman](https://www.postman.com/) (installed for manual and collection testing)

---

### 📥 1. Clone the Repository

```bash
git clone https://github.com/ecemyakali/alumni.git
cd alumni
```

---

### 💻 2. Local Development (Without Docker)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Server:**
   ```bash
   # Development mode with auto-reload (Node.js native watch mode)
   npm run dev

   # Production start
   npm start
   ```
   *The server starts listening on both `http://localhost:5000` and `http://localhost:3000`.*

3. **Run Automated Tests:**
   ```bash
   npm test
   ```
   *Executes all 19 automated test cases covering health checks, user CRUD, routing, and Swagger specs.*

---

### 🐳 3. Quick Start with Docker

To spin up both the **Node.js API** and the **PostgreSQL database** in isolated containers:

```bash
# Start containers in detached mode
docker compose up --build -d

# Follow container logs
docker compose logs -f
```

The API service will be accessible at `http://localhost:3000` / `http://localhost:5000`.

---

## 🧪 Postman & Automated API Testing

A complete Postman collection is maintained in the root directory:
* **`alumni.postman_collection.json`**

You can:
1. **Import in Postman:** Click **Import** in Postman Desktop and select `alumni.postman_collection.json` to immediately access all pre-configured requests with automated test assertions.
2. **Run via Newman CLI:**
   ```bash
   npx newman run alumni.postman_collection.json
   ```

---

## 🗺️ Roadmap

- [x] Project initialization with Express.js
- [x] Docker and Docker Compose environment orchestration (`Dockerfile`, `docker-compose.yml`)
- [x] Introductory routes (`/`, `/hello`, `/hello/:name`, `/sum/:n1/:n2`, `/about`, `/alumni`)
- [x] System health check endpoint (`GET /api/health`)
- [x] In-memory user management CRUD operations (`POST`, `GET`, `PUT`, `PATCH`, `DELETE /api/users`)
- [x] Interactive Swagger UI documentation (`GET /api/swagger`)
- [x] Automated unit and integration testing suite (19/19 tests passing)
- [ ] PostgreSQL schema modeling and persistent database integration
- [ ] JWT authentication and role-based authorization middleware
- [ ] Advanced alumni search, filter, and pagination APIs
- [ ] GitHub Actions CI/CD deployment pipelines

---

## 🤝 Contributing

1. **Fork** the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Ensure new routes are added to `src/config/swagger.js` and `README.md`
4. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a **Pull Request**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
