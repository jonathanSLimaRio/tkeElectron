import { Router } from "express";
import { authenticateToken } from "../auth/AuthMiddleware";
import { CategoryService } from "./CategoryService";
import { validate } from "../../middlewares/validate";
import {
  CreateCategorySchema,
  CreateCategoryDto,
} from "./dto/CreateCategoryDto";
import {
  UpdateCategorySchema,
  UpdateCategoryDto,
} from "./dto/UpdateCategoryDto";
import { logger } from "../../config/logger";

const router = Router();
const service = new CategoryService();

router.use(authenticateToken);

router.get("/categories", async (req, res) => {
  logger.info("GET /categories");
  try {
    const categories = await service.list();
    return res.json(categories);
  } catch (error) {
    logger.error({ error }, "Falha ao listar categorias");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.get("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    logger.warn({ params: req.params }, "ID de categoria inválido");
    return res.status(400).json({ error: "ID inválido" });
  }

  logger.info({ id }, "GET /categories/:id");
  try {
    const category = await service.getById(id);
    if (!category) {
      logger.info({ id }, "Categoria não encontrada");
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    return res.json(category);
  } catch (error) {
    logger.error({ error, id }, "Falha ao buscar categoria");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.post("/categories", validate(CreateCategorySchema), async (req, res) => {
  const dto: CreateCategoryDto = req.body;
  logger.info({ dto }, "POST /categories");
  try {
    const created = await service.create(dto);
    return res.status(201).json(created);
  } catch (error) {
    logger.error({ error, dto }, "Falha ao criar categoria");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.put(
  "/categories/:id",
  validate(UpdateCategorySchema),
  async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      logger.warn({ params: req.params }, "ID de categoria inválido");
      return res.status(400).json({ error: "ID inválido" });
    }

    const dto: UpdateCategoryDto = req.body;
    logger.info({ id, dto }, "PUT /categories/:id");

    try {
      const updated = await service.update(id, dto);
      return res.json(updated);
    } catch (error) {
      logger.error({ error, id, dto }, "Falha ao atualizar categoria");
      return res.status(500).json({ error: "Erro interno" });
    }
  }
);

router.delete("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    logger.warn({ params: req.params }, "ID de categoria inválido");
    return res.status(400).json({ error: "ID inválido" });
  }

  logger.info({ id }, "DELETE /categories/:id");
  try {
    await service.delete(id);
    return res.status(204).send();
  } catch (error) {
    logger.error({ error, id }, "Falha ao deletar categoria");
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
