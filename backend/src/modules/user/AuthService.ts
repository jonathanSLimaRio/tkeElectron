// src/modules/user/AuthService.ts
import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDto } from "./dto/RegisterDto";
import { LoginDto } from "./dto/LoginDto";
import { logger } from "../../config/logger";

export class AuthService {
  async register(data: RegisterDto) {
    logger.debug({ data }, "AuthService.register");
    const existing = await prisma.user.findUnique({
      where: { login: data.login },
    });
    if (existing) {
      logger.warn({ login: data.login }, "Login já em uso");
      throw new Error("Login already in use");
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        login: data.login,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    logger.debug({ userId: user.id }, "Usuário criado no banco");
    return user;
  }

  async login(data: LoginDto) {
    logger.debug({ login: data.login }, "AuthService.login");
    const user = await prisma.user.findUnique({ where: { login: data.login } });
    if (!user) {
      logger.warn({ login: data.login }, "Login inválido");
      throw new Error("Invalid login");
    }
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      logger.warn({ userId: user.id }, "Senha inválida");
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    logger.debug({ userId: user.id }, "Token JWT gerado");
    return {
      token,
      user: { id: user.id, name: user.name, login: user.login },
    };
  }
}
