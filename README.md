# 🎓 Alumni Tracking System

A modern, scalable, and secure **Alumni Tracking & Networking System** designed to bridge the gap between academic institutions and their graduates. This platform enables alumni to maintain up-to-date career profiles, fosters professional networking, and provides institutions with valuable insights into alumni outcomes and career trends.

---

## 🚀 Key Features

- **Alumni Profile Management:** Maintain comprehensive profiles including educational background, current workplace, job titles, industry experience, and professional links (e.g., LinkedIn).
- **Advanced Search & Filtering:** Filter alumni directories by graduation year, department/faculty, current employer, industry sector, and geographical location.
- **Networking & Engagement:** Facilitate meaningful connections, mentorship opportunities, and communications between students, alumni, and faculty.
- **Analytics & Reporting:** Visual dashboards highlighting alumni employment rates, industry distributions, and career trajectories over time.
- **Role-Based Access Control (RBAC):** Distinct permissions and workflows for Students, Alumni, and Institutional Administrators secured with JWT-based authentication.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Node.js** & **Express.js** | High-performance, asynchronous RESTful API architecture |
| **Database** | **PostgreSQL** | Reliable, ACID-compliant relational database management system |
| **Containerization** | **Docker** & **Docker Compose** | Isolated micro-environments for seamless development and deployment |
| **Version Control & CI/CD** | **Git** & **GitHub** | Source control, collaborative workflows, and automated pipelines |

---

## 📁 Project Directory Structure

```text
alumni/
├── docker/                 # Container configs and initialization scripts
│   └── init.sql            # Initial PostgreSQL database schema & seeds
├── src/                    # Node.js backend source code
│   ├── config/             # Environment & database connection configs
│   ├── controllers/        # Request handlers & controllers
│   ├── middlewares/        # Authentication, authorization, and error handlers
│   ├── models/             # Database models and queries
│   ├── routes/             # Express API route definitions
│   ├── services/           # Core business logic
│   └── server.js           # Application entry point
├── .dockerignore           # Files ignored by Docker build context
├── .env.example            # Sample environment variables configuration
├── .gitignore              # Files ignored by Git
├── docker-compose.yml      # Multi-container orchestration (Node.js + PostgreSQL)
├── Dockerfile              # Production-ready container image for the API
├── package.json            # Node.js project manifest and dependencies
└── README.md               # Project documentation
```

---

## ⚙️ Getting Started

### 📋 Prerequisites
Ensure you have the following installed on your local machine:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v18 or higher) & npm (for local non-containerized development)
- [PostgreSQL](https://www.postgresql.org/) (if running locally without Docker)

---

### 📥 1. Clone the Repository

```bash
git clone https://github.com/ecemyakali/alumni.git
cd alumni
```

---

### 🐳 2. Quick Start with Docker (Recommended)

To spin up both the **Node.js API** and the **PostgreSQL database** with persistent storage in isolated containers:

```bash
# Start containers in detached mode
docker compose up --build -d

# Follow container logs
docker compose logs -f
```

The API service will be accessible at `http://localhost:5000`.

---

### 💻 3. Local Development (Without Docker)

If you prefer to run the Node.js server directly on your host machine:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the `.env.example` template to `.env` and fill in your local PostgreSQL credentials:
   ```bash
   cp .env.example .env
   ```

   Example configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # PostgreSQL Connection
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=alumni_db
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   
   # Security
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Start the Application:**
   ```bash
   # Development mode with live reload
   npm run dev

   # Production mode
   npm start
   ```

---

## 🗺️ Roadmap

- [ ] Project initialization with Express.js and ES Modules
- [ ] Docker and Docker Compose environment orchestration
- [ ] PostgreSQL schema modeling and initial database migrations
- [ ] Secure JWT authentication and role-based authorization middleware
- [ ] Alumni profile CRUD operations and file upload support (profile avatars, resumes)
- [ ] Advanced search, filter, and pagination APIs
- [ ] Automated unit and integration testing suite
- [ ] GitHub Actions CI/CD deployment pipelines

---

## 🤝 Contributing

Contributions are welcome! If you would like to contribute:

1. **Fork** the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
