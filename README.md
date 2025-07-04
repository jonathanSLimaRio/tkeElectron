````md
# 🎬 Movie App Electron (Fullstack Desktop App)

A fullstack desktop app for searching, favoriting, and managing movies using:

- 💻 **Frontend**: Angular + Angular Material + Electron
- 🔐 **Backend**: Node.js + Express + Prisma + JWT
- 🗄️ **Database**: MySQL (via Docker)

---

## 🚀 Features

- User authentication with login/register (JWT)
- Search movies using the OMDb API
- View and favorite movies locally
- Quick access to movie’s Wikipedia page
- Full **CRUD for movies is implemented on the backend**
- Category management (CRUD)
- Interactive Swagger documentation

⚠️ **Movie creation/edit/delete is not yet implemented on the frontend**.

---

## 🧰 Requirements

- [Node.js](https://nodejs.org/)
- [Docker + Docker Compose](https://www.docker.com/)
- [Angular CLI](https://angular.io/cli) → `npm install -g @angular/cli`

> Electron is included as a project dependency.

---

## 🧪 Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/your-user/movie-app-electron.git
cd movie-app-electron
```
````

### 2. Start backend and database (Docker)

```bash
docker-compose up -d
```

This will start:

- 🐬 MySQL on `localhost:3306`
- 🚀 Node.js backend on `http://localhost:3000`

> Swagger UI available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### 3. Sync Prisma schema to the database

```bash
docker exec -it backend sh
npx prisma migrate dev --name init
```

This command will create the required tables in the MySQL database.

---

### 4. Run the desktop app (Electron)

> Make sure the backend is running at `http://localhost:3000`.

```bash
npm install
npm run electron:build
```

This will compile the Angular app and start it with Electron.

---

## 🗂️ Project Structure

```
movie-app-electron/
├── backend/           # Node.js + Prisma backend
├── electron/          # Electron startup (main.js, preload.js)
├── src/               # Angular frontend
├── docker-compose.yml
└── README.md
```

---

## 🔐 Authentication

- User registration and login with strong password rules
- JWT token stored locally
- HTTP interceptor for authenticated requests

---

## 📚 API & Documentation

- Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Health Check:

  - API: `http://localhost:3000/health`
  - DB: `http://localhost:3000/health/db`

---

## ✅ Development Checklist

- [x] User login & registration
- [x] JWT authentication
- [x] Movie search (OMDb API)
- [x] Local favorites management
- [x] Wikipedia link integration
- [x] CRUD for movies (backend only)
- [x] CRUD for categories
- [x] Swagger API docs
- [x] Electron integration
- [x] GPT Integration
- [❌] View Details was not implemented because it was removed from the API, so I added an implementation using ChatGPT.
- [ ] Movie creation/editing from frontend ❌ _(not implemented yet)_

---

## 🧪 Testing

```bash
cd backend
npm run test
```

> Uses Jest for unit testing core features.

---

## 👨‍💻 Author

Developed by **Jonathan Lima**
Project for a fullstack technical challenge.

---

## 🔮 Suggestions for Improvement

- Add movie creation UI in the frontend
- Enable movie editing and deletion from the dashboard
- Allow persistent favorites using the backend
- Add support for user avatars or movie poster uploads

---

## Docker with Prisma
1. Access the backend container:
docker exec -it backend sh

2. Inside the container, generate the initial migration:
npx prisma migrate dev --name init
ℹ️ Why this may be necessary:
Even though your backend is running inside Docker and Prisma is configured, the error:

The table `users` does not exist in the current database.
means that no migration has been applied yet, or the tables were not created in the MySQL database. This usually happens when:

You didn’t run npx prisma migrate dev at least once

You reset or rebuilt the database container, which erased the schema
You only ran prisma generate, which builds the client but doesn’t modify the database
By running npx prisma migrate dev --name init, you’ll:
Create the migrations folder with SQL for your schema
Apply the schema to the MySQL database (creating the tables)
Allow your backend code to finally interact with the database

## 📄 License

This project is for educational and technical evaluation purposes only.

```

```
