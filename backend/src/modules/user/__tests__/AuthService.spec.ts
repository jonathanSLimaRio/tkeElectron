import { AuthService } from "../AuthService";
import { prisma } from "../../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  const service = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("deve registrar novo usuário com sucesso", async () => {
      const dto = {
        name: "Jonathan",
        login: "jona",
        password: "Senha123!",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPwd");
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: dto.name,
        login: dto.login,
      });

      const result = await service.register(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { login: dto.login },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, name: "Jonathan", login: "jona" });
    });

    it("deve lançar erro se login já estiver em uso", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        service.register({
          name: "X",
          login: "jona",
          password: "Senha123!",
        })
      ).rejects.toThrow("Login already in use");
    });
  });

  describe("login", () => {
    const userMock = {
      id: 2,
      name: "Jonathan",
      login: "jona",
      password: "hashed",
    };

    it("deve retornar token e dados do usuário se login for válido", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token123");

      const dto = { login: "jona", password: "Senha123!" };
      const result = await service.login(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { login: dto.login },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        userMock.password
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: "token123",
        user: {
          id: userMock.id,
          name: userMock.name,
          login: userMock.login,
        },
      });
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ login: "notfound", password: "abc" })
      ).rejects.toThrow("Invalid login");
    });

    it("deve lançar erro se senha for inválida", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ login: "jona", password: "wrong" })
      ).rejects.toThrow("Invalid password");
    });
  });
});
