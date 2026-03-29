import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          ...createProductDto,
          costPrice: new Prisma.Decimal(createProductDto.costPrice),
          salePrice: new Prisma.Decimal(createProductDto.salePrice),
          isActive: createProductDto.isActive ?? true,
        },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm.');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          ...(updateProductDto.costPrice !== undefined && {
            costPrice: new Prisma.Decimal(updateProductDto.costPrice),
          }),
          ...(updateProductDto.salePrice !== undefined && {
            salePrice: new Prisma.Decimal(updateProductDto.salePrice),
          }),
        },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
    }
  }

  private handleUniqueConstraint(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('SKU đã tồn tại.');
    }

    throw error;
  }
}
