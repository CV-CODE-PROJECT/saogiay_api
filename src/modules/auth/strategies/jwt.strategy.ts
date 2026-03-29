import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { AuthUser } from '../interfaces/auth-user.interface';

type JwtPayload = {
  sub: string;
  email: string;
  fullName: string;
  role: UserRole;
  jti: string;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Tài khoản không hợp lệ.');
    }

    const revokedToken = await this.prisma.revokedToken.findUnique({
      where: { jti: payload.jti },
      select: { id: true },
    });

    if (revokedToken) {
      throw new UnauthorizedException('Token đã bị thu hồi.');
    }

    return {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      jti: payload.jti,
      exp: payload.exp,
    };
  }
}
