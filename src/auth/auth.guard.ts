import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService?: JwtService,
    private authService?: AuthService
  ) {}

  //for stricter auth guard
  //interface JwtPayload {
  // email: string;
  // You can add other properties here if needed
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: any = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    //stricter auth guard
    //  const decoded: JwtPayload = jwt.verify(token, process.env.DEFAULT_SECRET) as JwtPayload;
    // let user = await this.entityManager.findOne(User, {
    //   where: { email: decoded.email },
    // });
    // if (!user) {
    //   return false;
    // } else {
    //   return true;
    // }
    if (!decoded) {
      return false;
    } else {
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
