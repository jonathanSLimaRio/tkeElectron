// src/modules/category/__tests__/CategoryController.spec.ts
import express from "express";
import request from "supertest";

// Mock do AuthMiddleware e do validator
jest.mock("../../auth/AuthMiddleware", () => ({
  authenticateToken: (_req: any, _res: any, next: any) => next(),
}));
jest.mock("../../../middlewares/validate", () => ({
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

// --- Mock da service ---
// Precisamos usar doMock para evitar hoisting do jest.mock e garantir que mockService
// já esteja definido quando o factory rodar.
const mockService = {
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
jest.doMock("../CategoryService", () => ({
  CategoryService: jest.fn(() => mockService),
}));

// Agora que o CategoryService está mockado, importamos o router
import categoryRouter from "../CategoryController";

describe("CategoryController", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    // Pulamos o middleware de autenticação e validação graças aos mocks acima
    app.use(categoryRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /categories", () => {
    it("200 → lista de categorias", async () => {
      mockService.list.mockResolvedValue([{ id: 1, name: "X" }]);
      const res = await request(app).get("/categories");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: "X" }]);
      expect(mockService.list).toHaveBeenCalled();
    });

    it("500 → erro interno", async () => {
      mockService.list.mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/categories");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("GET /categories/:id", () => {
    it("400 → id inválido", async () => {
      const res = await request(app).get("/categories/abc");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("404 → não encontrado", async () => {
      mockService.getById.mockResolvedValue(null);
      const res = await request(app).get("/categories/2");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Categoria não encontrada" });
    });

    it("200 → retorna a categoria", async () => {
      mockService.getById.mockResolvedValue({ id: 2, name: "Y" });
      const res = await request(app).get("/categories/2");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 2, name: "Y" });
    });

    it("500 → falha ao buscar", async () => {
      mockService.getById.mockRejectedValue(new Error());
      const res = await request(app).get("/categories/10");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("POST /categories", () => {
    const payload = { name: "Nova" };

    it("201 → cria categoria", async () => {
      mockService.create.mockResolvedValue({ id: 5, ...payload });
      const res = await request(app).post("/categories").send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 5, ...payload });
      expect(mockService.create).toHaveBeenCalledWith(payload);
    });

    it("500 → falha ao criar", async () => {
      mockService.create.mockRejectedValue(new Error());
      const res = await request(app).post("/categories").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("PUT /categories/:id", () => {
    const payload = { name: "Atualizada" };

    it("400 → id inválido", async () => {
      const res = await request(app).put("/categories/zz").send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("200 → atualiza", async () => {
      mockService.update.mockResolvedValue({ id: 7, ...payload });
      const res = await request(app).put("/categories/7").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 7, ...payload });
      expect(mockService.update).toHaveBeenCalledWith(7, payload);
    });

    it("500 → falha ao atualizar", async () => {
      mockService.update.mockRejectedValue(new Error());
      const res = await request(app).put("/categories/7").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("DELETE /categories/:id", () => {
    it("400 → id inválido", async () => {
      const res = await request(app).delete("/categories/xy");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("204 → exclui", async () => {
      mockService.delete.mockResolvedValue(undefined);
      const res = await request(app).delete("/categories/8");

      expect(res.status).toBe(204);
      expect(mockService.delete).toHaveBeenCalledWith(8);
    });

    it("500 → falha ao deletar", async () => {
      mockService.delete.mockRejectedValue(new Error());
      const res = await request(app).delete("/categories/8");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });
});
