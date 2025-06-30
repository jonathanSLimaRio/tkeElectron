import express from "express";
import request from "supertest";

jest.mock("../../auth/AuthMiddleware", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = { id: 42 };
    next();
  },
}));
jest.mock("../../../middlewares/validate", () => ({
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

const mockService = {
  list: jest.fn(),
  search: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
jest.doMock("../MovieService", () => ({
  MovieService: jest.fn(() => mockService),
}));

import movieRouter from "../MovieController";

describe("MovieController", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(movieRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /movies", () => {
    it("200 → lista simples sem query", async () => {
      mockService.list.mockResolvedValue([{ id: 1, title: "X" }]);
      const res = await request(app).get("/movies");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, title: "X" }]);
      expect(mockService.list).toHaveBeenCalledWith(42);
    });

    it("200 → busca com q", async () => {
      mockService.search.mockResolvedValue([{ id: 2, title: "Batman" }]);
      const res = await request(app).get("/movies?q=bat");

      expect(res.status).toBe(200);
      expect(mockService.search).toHaveBeenCalledWith(42, "bat");
    });

    it("500 → erro interno", async () => {
      mockService.list.mockRejectedValue(new Error());
      const res = await request(app).get("/movies");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("GET /movies/:id", () => {
    it("400 → id inválido", async () => {
      const res = await request(app).get("/movies/abc");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("404 → não encontrado", async () => {
      mockService.getById.mockResolvedValue(null);
      const res = await request(app).get("/movies/9");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Movie not found" });
    });

    it("200 → retorna filme", async () => {
      mockService.getById.mockResolvedValue({ id: 3, title: "Matrix" });
      const res = await request(app).get("/movies/3");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 3, title: "Matrix" });
    });

    it("500 → erro ao buscar", async () => {
      mockService.getById.mockRejectedValue(new Error());
      const res = await request(app).get("/movies/7");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("POST /movies", () => {
    const payload = {
      title: "Interstellar",
      year: "2014",
      type: "movie",
      imdbID: "tt0816692",
      posterUrl: "https://...",
    };

    it("201 → cria filme", async () => {
      mockService.create.mockResolvedValue({ id: 10, ...payload });
      const res = await request(app).post("/movies").send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 10, ...payload });
    });

    it("500 → falha ao criar", async () => {
      mockService.create.mockRejectedValue(new Error());
      const res = await request(app).post("/movies").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("PUT /movies/:id", () => {
    const payload = { title: "Updated" };

    it("400 → id inválido", async () => {
      const res = await request(app).put("/movies/xx").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("200 → atualiza filme", async () => {
      mockService.update.mockResolvedValue({ message: "Movie updated" });
      const res = await request(app).put("/movies/5").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Movie updated" });
    });

    it("500 → erro interno", async () => {
      mockService.update.mockRejectedValue(new Error());
      const res = await request(app).put("/movies/5").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("DELETE /movies/:id", () => {
    it("400 → id inválido", async () => {
      const res = await request(app).delete("/movies/zz");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("204 → exclui filme", async () => {
      mockService.delete.mockResolvedValue(undefined);
      const res = await request(app).delete("/movies/6");

      expect(res.status).toBe(204);
    });

    it("500 → falha ao excluir", async () => {
      mockService.delete.mockRejectedValue(new Error());
      const res = await request(app).delete("/movies/6");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });
});
