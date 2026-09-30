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

## 📁 Project Directory Structure

```text
alumni/
├── docker/                         # Container configs and initialization scripts
│   └── init.sql                    # Initial PostgreSQL database schema & seeds
├── src/                            # Backend source code
│   ├── config/                     # Environment, database & Swagger configs
│   │   └── swagger.js              # OpenAPI 3.0 specification definition
│   ├── controllers/                # Request handlers & controllers
│   ├── middlewares/                # Authentication, authorization & error handlers
│   ├── models/                     # Database models and queries
│   ├── routes/                     # Express API route definitions
│   ├── services/                   # Core business logic
│   └── app.js                      # Express application, routes & middlewares
├── test/                           # Automated test suites (Node.js test runner)
│   └── routes.test.js              # Unit and integration tests for all endpoints
├── .dockerignore                   # Files ignored by Docker build context
├── .env.example                    # Sample environment variables configuration
├── .gitignore                      # Files ignored by Git
├── alumni.postman_collection.json  # Complete Postman collection with test scripts
├── docker-compose.yml              # Multi-container orchestration (Node.js + PostgreSQL)
├── Dockerfile                      # Production-ready container image for the API
├── index.js                        # Server entry point (listens on ports 5000 & 3000)
├── package.json                    # Node.js project manifest, dependencies & scripts
└── README.md                       # Project documentation
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
