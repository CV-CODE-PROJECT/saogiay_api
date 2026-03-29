import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryTransactionType, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  getImports() {
    return this.getTransactionsByType(InventoryTransactionType.IMPORT);
  }

  getExports() {
    return this.getTransactionsByType(InventoryTransactionType.EXPORT);
  }

  createImport(authUser: AuthUser, dto: CreateTransactionDto) {
    return this.createTransaction(authUser, dto, InventoryTransactionType.IMPORT);
  }

  createExport(authUser: AuthUser, dto: CreateTransactionDto) {
    return this.createTransaction(authUser, dto, InventoryTransactionType.EXPORT);
  }

  private async getTransactionsByType(type: InventoryTransactionType) {
    return this.prisma.inventoryTransaction.findMany({
      where: { type },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                name: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async createTransaction(
    authUser: AuthUser,
    dto: CreateTransactionDto,
    type: InventoryTransactionType,
  ) {
    const productIds = [...new Set(dto.items.map((item) => item.productId))];
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Có sản phẩm không tồn tại hoặc đã ngưng hoạt động.');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    if (type === InventoryTransactionType.EXPORT) {
      for (const item of dto.items) {
        const product = productMap.get(item.productId)!;
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm ${product.name} không đủ tồn kho để xuất.`,
          );
        }
      }
    }

    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.inventoryTransaction.create({
        data: {
          type,
          note: dto.note,
          referenceNo: dto.referenceNo,
          totalAmount: new Prisma.Decimal(totalAmount),
          createdById: authUser.sub,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              lineTotal: new Prisma.Decimal(item.quantity * item.unitPrice),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment:
                type === InventoryTransactionType.IMPORT
                  ? item.quantity
                  : -item.quantity,
            },
          },
        });
      }

      return transaction;
    });
  }
}
