import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InventoryService } from './inventory.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiOperation({ summary: 'Lấy danh sách phiếu nhập' })
  @ApiOkResponse({ description: 'Danh sách giao dịch nhập hàng.' })
  @Get('imports')
  getImports() {
    return this.inventoryService.getImports();
  }

  @ApiOperation({ summary: 'Tạo phiếu nhập hàng' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiOkResponse({ description: 'Tạo phiếu nhập và cộng tồn kho thành công.' })
  @Post('imports')
  createImport(
    @CurrentUser() authUser: AuthUser,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.inventoryService.createImport(authUser, createTransactionDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách phiếu xuất' })
  @ApiOkResponse({ description: 'Danh sách giao dịch xuất hàng.' })
  @Get('exports')
  getExports() {
    return this.inventoryService.getExports();
  }

  @ApiOperation({ summary: 'Tạo phiếu xuất hàng' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiOkResponse({ description: 'Tạo phiếu xuất và trừ tồn kho thành công.' })
  @Post('exports')
  createExport(
    @CurrentUser() authUser: AuthUser,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.inventoryService.createExport(authUser, createTransactionDto);
  }
}
