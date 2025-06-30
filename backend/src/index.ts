import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Swagger docs at http://localhost:3000/api-docs");
  console.log("Health endpoint at http://localhost:3000/health");
  console.log("Health DB endpoint at http://localhost:3000/health/db");
});
