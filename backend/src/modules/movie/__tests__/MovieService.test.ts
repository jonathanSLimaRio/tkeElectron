import { prisma } from "../../../prisma/client";
import { MovieService } from "../MovieService";
import { CreateMovieDto } from "../dto/CreateMovieDto";
import { UpdateMovieDto } from "../dto/UpdateMovieDto";

jest.mock("../../../prisma/client", () => ({
  prisma: {
    movie: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const service = new MovieService();

describe("MovieService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("list deve buscar filmes por usuário", async () => {
    (prisma.movie.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const result = await service.list(7);
    expect(prisma.movie.findMany).toHaveBeenCalledWith({ where: { userId: 7 } });
    expect(result).toEqual([{ id: 1 }]);
  });

  it("getById deve buscar um filme específico", async () => {
    (prisma.movie.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
    const result = await service.getById(7, 2);
    expect(result).toEqual({ id: 2 });
  });

  it("create deve criar um novo filme", async () => {
    const dto: CreateMovieDto = {
      title: "New",
      year: "2023",
      type: "movie",
      imdbID: "tt1234567",
      posterUrl: "https://...",
    };
    (prisma.movie.create as jest.Mock).mockResolvedValue({ id: 3, ...dto });

    const result = await service.create(9, dto);
    expect(result).toEqual({ id: 3, ...dto });
    expect(prisma.movie.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 9, ...dto }),
    });
  });

  it("update deve modificar filme existente", async () => {
    const dto: UpdateMovieDto = { title: "Updated" };
    (prisma.movie.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    const result = await service.update(4, 10, dto);
    expect(result).toEqual({ message: "Movie updated" });
  });

  it("delete deve remover filme", async () => {
    (prisma.movie.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
    await service.delete(2, 99);
    expect(prisma.movie.deleteMany).toHaveBeenCalledWith({
      where: { id: 99, userId: 2 },
    });
  });

  it("search deve buscar por título ou imdbID", async () => {
    (prisma.movie.findMany as jest.Mock).mockResolvedValue([]);
    await service.search(42, "matrix");
    expect(prisma.movie.findMany).toHaveBeenCalledWith({
      where: {
        userId: 42,
        OR: [
          { title: { contains: "matrix", mode: "insensitive" } },
          { imdbID: { contains: "matrix", mode: "insensitive" } },
        ],
      },
    });
  });
});
