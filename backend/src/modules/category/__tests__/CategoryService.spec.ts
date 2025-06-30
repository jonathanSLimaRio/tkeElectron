import { prisma } from "../../../prisma/client";
import { CategoryService } from "../CategoryService";
import { CreateCategoryDto } from "../dto/CreateCategoryDto";
import { UpdateCategoryDto } from "../dto/UpdateCategoryDto";

jest.mock("../../../prisma/client", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
    jest.clearAllMocks();
  });

  it("list deve chamar prisma.category.findMany e retornar categorias", async () => {
    const fake = [{ id: 1, name: "Comida" }];
    (prisma.category.findMany as jest.Mock).mockResolvedValue(fake);

    const result = await service.list();
    expect(prisma.category.findMany).toHaveBeenCalledWith();
    expect(result).toEqual(fake);
  });

  it("getById deve chamar findUnique com o id correto", async () => {
    const fake = { id: 2, name: "Bebida" };
    (prisma.category.findUnique as jest.Mock).mockResolvedValue(fake);

    const result = await service.getById(2);
    expect(prisma.category.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
    });
    expect(result).toEqual(fake);
  });

  it("create deve chamar prisma.category.create com os dados corretos", async () => {
    const dto: CreateCategoryDto = { name: "Sobremesa" };
    const fake = { id: 3, name: "Sobremesa" };
    (prisma.category.create as jest.Mock).mockResolvedValue(fake);

    const result = await service.create(dto);
    expect(prisma.category.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(fake);
  });

  it("update deve chamar prisma.category.update com id e dados", async () => {
    const dto: UpdateCategoryDto = { name: "Lanche" };
    const fake = { id: 4, name: "Lanche" };
    (prisma.category.update as jest.Mock).mockResolvedValue(fake);

    const result = await service.update(4, dto);
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: dto,
    });
    expect(result).toEqual(fake);
  });

  it("delete deve chamar prisma.category.delete com o id correto", async () => {
    const fake = { id: 5, name: "Salada" };
    (prisma.category.delete as jest.Mock).mockResolvedValue(fake);

    const result = await service.delete(5);
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(result).toEqual(fake);
  });
});
