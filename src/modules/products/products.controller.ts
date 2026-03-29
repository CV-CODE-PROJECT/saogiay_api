import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ description: 'Tạo sản phẩm thành công.' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiOkResponse({ description: 'Danh sách sản phẩm.' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  @ApiOkResponse({ description: 'Thông tin chi tiết sản phẩm.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Cập nhật sản phẩm thành công.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
}
