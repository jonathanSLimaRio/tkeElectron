import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Movie API",
    version: "1.0.0",
    description: "API documentation for Movie App",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterUser: {
        type: "object",
        properties: {
          name: { type: "string" },
          login: { type: "string" },
          password: { type: "string" },
        },
        required: ["login", "password"],
      },
      LoginUser: {
        type: "object",
        properties: {
          login: { type: "string" },
          password: { type: "string" },
        },
        required: ["login", "password"],
      },
      Movie: {
        type: "object",
        properties: {
          title: { type: "string" },
          year: { type: "string" },
          type: { type: "string" }, // "movie", "series", etc
          imdbID: { type: "string" },
          posterUrl: { type: "string" },
        },
        required: ["title"],
      },
    },
  },
  paths: {
    "/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterUser" },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "400": { description: "User already exists or validation failed" },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginUser" },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "400": { description: "Invalid credentials" },
        },
      },
    },
    "/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Logoff simulated (token required)" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/movies": {
      get: {
        tags: ["Movie"],
        summary: "List or search user's movies",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "q",
            in: "query",
            description: "Search by title or imdbID",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Movie list" },
        },
      },
      post: {
        tags: ["Movie"],
        summary: "Create a movie",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Movie" },
            },
          },
        },
        responses: {
          "201": { description: "Movie created" },
          "400": { description: "Validation failed" },
        },
      },
    },
    "/movies/{id}": {
      get: {
        tags: ["Movie"],
        summary: "Get movie by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Movie details" },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Movie"],
        summary: "Update a movie",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Movie" },
            },
          },
        },
        responses: {
          "200": { description: "Updated" },
          "400": { description: "Validation failed" },
        },
      },
      delete: {
        tags: ["Movie"],
        summary: "Delete movie",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Deleted" },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerDocument));
}
