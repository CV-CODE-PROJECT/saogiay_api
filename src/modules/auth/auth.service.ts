import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    await this.validateUserPassword(user, loginDto.password);

    const jti = randomUUID();
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '8h');
    const accessToken = await this.jwtService.signAsync({
      sub: user!.id,
      email: user!.email,
      fullName: user!.fullName,
      role: user!.role,
      jti,
    });
    const decoded = this.jwtService.decode(accessToken) as { exp: number } | null;

    return {
      accessToken,
      expiresIn,
      user: {
        id: user!.id,
        email: user!.email,
        fullName: user!.fullName,
        role: user!.role,
      },
      meta: {
        jti,
        expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
      },
    };
  }

  async logout(authUser: AuthUser) {
    const expiresAt = new Date(authUser.exp * 1000);

    await this.prisma.revokedToken.upsert({
      where: { jti: authUser.jti },
      update: { expiresAt },
      create: {
        jti: authUser.jti,
        userId: authUser.sub,
        expiresAt,
      },
    });

    return {
      message: 'Đăng xuất thành công.',
    };
  }

  private async validateUserPassword(user: User | null, password: string) {
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    const isMatched = await bcrypt.compare(password, user.passwordHash);
    if (!isMatched) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }
  }
}
