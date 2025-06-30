import axios from "axios";
import { prisma } from "../../prisma/client";
import { CreateMovieDto } from "./dto/CreateMovieDto";
import { UpdateMovieDto } from "./dto/UpdateMovieDto";
import { SearchOmdbDto } from "./dto/SearchOmdbDto";

export class MovieService {
  async list(userId: number) {
    return prisma.movie.findMany({
      where: { userId },
    });
  }

  async getById(userId: number, id: number) {
    return prisma.movie.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: number, data: CreateMovieDto) {
    return prisma.movie.create({
      data: {
        userId,
        title: data.title,
        year: data.year,
        type: data.type,
        imdbID: data.imdbID,
        posterUrl: data.posterUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(userId: number, id: number, data: UpdateMovieDto) {
    await prisma.movie.updateMany({
      where: { id, userId },
      data: {
        title: data.title,
        year: data.year,
        type: data.type,
        imdbID: data.imdbID,
        posterUrl: data.posterUrl,
        updatedAt: new Date(),
      },
    });

    return { message: "Movie updated" };
  }

  async delete(userId: number, id: number) {
    await prisma.movie.deleteMany({
      where: { id, userId },
    });
  }

  async search(userId: number, query?: string) {
    const where: any = { userId };

    if (query?.trim()) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { imdbID: { contains: query, mode: "insensitive" } },
      ];
    }

    return prisma.movie.findMany({ where });
  }

  async searchOmdb(params: SearchOmdbDto) {
    const { s, type, y, page = 1 } = params;

    const apiKey = process.env.OMDB_API_KEY;
    const baseUrl = process.env.MOVIE_BASE_URL;

    const url =
      `${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(s)}&page=${page}` +
      (type ? `&type=${type}` : "") +
      (y ? `&y=${y}` : "");

    const response = await axios.get(url);
    return response.data;
  }
}
