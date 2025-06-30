import { prisma } from "../../prisma/client";
import { CreateCategoryDto } from "./dto/CreateCategoryDto";
import { UpdateCategoryDto } from "./dto/UpdateCategoryDto";

export class CategoryService {
  async list() {
    return prisma.category.findMany();
  }

  async getById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  async create(data: CreateCategoryDto) {
    return prisma.category.create({ data });
  }

  async update(id: number, data: UpdateCategoryDto) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  }
}
