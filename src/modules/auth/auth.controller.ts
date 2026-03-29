import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './interfaces/auth-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Đăng nhập thành công và trả về access token.' })
  @ApiUnauthorizedResponse({ description: 'Email hoặc mật khẩu không đúng.' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiOkResponse({ description: 'Thu hồi token hiện tại.' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() authUser: AuthUser) {
    return this.authService.logout(authUser);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiOkResponse({ description: 'Thông tin user lấy từ JWT đã xác thực.' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() authUser: AuthUser) {
    return authUser;
  }
}
