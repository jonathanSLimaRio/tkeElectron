import { Router } from "express";
import { authenticateToken } from "../auth/AuthMiddleware";
import { MovieService } from "./MovieService";
import { validate } from "../../middlewares/validate";
import { CreateMovieSchema, CreateMovieDto } from "./dto/CreateMovieDto";
import { UpdateMovieSchema, UpdateMovieDto } from "./dto/UpdateMovieDto";
import { logger } from "../../config/logger";
import { SearchOmdbSchema } from "./dto/SearchOmdbDto";
import { SearchOmdbByTitleSchema } from "./dto/SearchOmdbByTitleDto";
import axios from "axios";

const router = Router();
const service = new MovieService();

router.use(authenticateToken);

router.get("/movies", async (req, res) => {
  const userId = req.user!.id;
  const q = req.query.q?.toString().trim();

  logger.info({ userId, q }, "GET /movies");

  try {
    const result = q
      ? await service.search(userId, q)
      : await service.list(userId);
    return res.json(result);
  } catch (err) {
    logger.error({ err, userId, q }, "Erro ao listar filmes");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.post("/movies", validate(CreateMovieSchema), async (req, res) => {
  const userId = req.user!.id;
  const dto: CreateMovieDto = req.body;

  try {
    const movie = await service.create(userId, dto);
    return res.status(201).json(movie);
  } catch (err) {
    logger.error({ err, userId, dto }, "Erro ao criar filme");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.get("/movies/omdb", async (req, res) => {
  const parse = SearchOmdbSchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  try {
    const result = await service.searchOmdb(parse.data);
    return res.json(result);
  } catch (err) {
    logger.error({ err }, "Erro ao buscar filmes no OMDb");
    return res.status(500).json({ error: "Erro ao buscar filmes externos" });
  }
});

router.get("/movies/omdb-title", async (req, res) => {
  const parse = SearchOmdbByTitleSchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  try {
    const { t, y } = parse.data;
    const apiKey = process.env.OMDB_API_KEY;
    const baseUrl = process.env.MOVIE_BASE_URL;

    const url =
      `${baseUrl}?apikey=${apiKey}&t=${encodeURIComponent(t)}` +
      (y ? `&y=${y}` : "");

    const response = await axios.get(url);
    return res.json(response.data);
  } catch (err) {
    logger.error({ err }, "Erro ao buscar filme por título no OMDb");
    return res.status(500).json({ error: "Erro ao buscar filme externo" });
  }
});

router.get("/movies/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);

  if (isNaN(id)) {
    logger.warn({ params: req.params }, "ID inválido");
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const movie = await service.getById(userId, id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    return res.json(movie);
  } catch (err) {
    logger.error({ err, userId, id }, "Erro ao buscar filme");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.put("/movies/:id", validate(UpdateMovieSchema), async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const dto: UpdateMovieDto = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const updated = await service.update(userId, id, dto);
    return res.json(updated);
  } catch (err) {
    logger.error({ err, userId, id, dto }, "Erro ao atualizar filme");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.delete("/movies/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    await service.delete(userId, id);
    return res.status(204).send();
  } catch (err) {
    logger.error({ err, userId, id }, "Erro ao deletar filme");
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
