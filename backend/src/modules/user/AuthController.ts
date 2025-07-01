import { Router } from "express";
import jwt from 'jsonwebtoken';
import { AuthService } from "./AuthService";
import { authenticateToken } from "../auth/AuthMiddleware";
import { validate } from "../../middlewares/validate";
import { RegisterSchema, RegisterDto } from "./dto/RegisterDto";
import { LoginSchema, LoginDto } from "./dto/LoginDto";
import { logger } from "../../config/logger";

const router = Router();
const service = new AuthService();

router.post("/register", validate(RegisterSchema), async (req, res) => {
  const dto: RegisterDto = req.body;
  logger.info({ dto }, "POST /register");

  try {
    const user = await service.register(dto);
    logger.info({ userId: user.id }, "Usuário registrado com sucesso");

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
      },
    });
  } catch (e: any) {
    logger.error({ err: e, dto }, "Falha ao registrar usuário");
    return res.status(400).json({ error: e.message });
  }
});

router.post("/login", validate(LoginSchema), async (req, res) => {
  const dto: LoginDto = req.body;
  logger.info({ dto: { login: dto.login } }, "POST /login");

  try {
    const result = await service.login(dto);
    logger.info({ userId: result.user.id }, "Login bem-sucedido");
    return res.json(result);
  } catch (e: any) {
    logger.error({ err: e, dto: { login: dto.login } }, "Falha no login");
    return res.status(400).json({ error: e.message });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  const userId = req.user!.id;
  logger.info({ userId }, "POST /logout");
  return res
    .status(200)
    .json({ message: `User ${userId} logged out (token discard)` });
});

export default router;
