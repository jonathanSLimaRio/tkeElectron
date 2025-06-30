import express from "express";
import request from "supertest";
import { AuthService } from "../AuthService";
import authRouter from "../AuthController";

// Mock do middleware de validação
jest.mock("../../../middlewares/validate", () => ({
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

// Mock do middleware de autenticação
jest.mock("../../auth/AuthMiddleware", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = { id: 99 }; // simula usuário autenticado
    next();
  },
}));

describe("AuthController", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(authRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("201 → registra usuário com sucesso", async () => {
      const expectedUser = { id: 5, name: "N", login: "L" };

      jest
        .spyOn(AuthService.prototype, "register")
        .mockResolvedValue(expectedUser as any);

      const res = await request(app)
        .post("/register")
        .send({ name: "N", login: "L", password: "Pwd1!" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expectedUser);
    });

    it("400 → falha ao registrar usuário", async () => {
      jest
        .spyOn(AuthService.prototype, "register")
        .mockRejectedValue(new Error("fail"));

      const res = await request(app)
        .post("/register")
        .send({ name: "N", login: "L", password: "Pwd1!" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "fail" });
    });
  });

  describe("POST /login", () => {
    it("200 → login bem-sucedido", async () => {
      const loginResult = {
        token: "tok",
        user: { id: 7, name: "U", login: "u" },
      };

      jest
        .spyOn(AuthService.prototype, "login")
        .mockResolvedValue(loginResult as any);

      const res = await request(app)
        .post("/login")
        .send({ login: "u", password: "Pwd1!" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(loginResult);
    });

    it("400 → falha no login", async () => {
      jest
        .spyOn(AuthService.prototype, "login")
        .mockRejectedValue(new Error("bad"));

      const res = await request(app)
        .post("/login")
        .send({ login: "u", password: "Pwd1!" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "bad" });
    });
  });

  describe("POST /logout", () => {
    it("200 → logout retorna mensagem", async () => {
      const res = await request(app).post("/logout");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: "User 99 logged out (token discard)",
      });
    });
  });
});
