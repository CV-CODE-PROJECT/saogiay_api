import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { InventoryItemDto } from './inventory-item.dto';

export class CreateTransactionDto {
  @ApiPropertyOptional({ example: 'PN-20260328-001' })
  @IsOptional()
  @IsString()
  referenceNo?: string;

  @ApiPropertyOptional({ example: 'Nhập từ nhà cung cấp A' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: [InventoryItemDto],
  })
  @Type(() => InventoryItemDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items!: InventoryItemDto[];
}
