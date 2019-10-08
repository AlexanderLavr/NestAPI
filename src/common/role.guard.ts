import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { getRole } from '../help/base.servis';



@Injectable()

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
 async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    let token = await getRole(request.headers.authorization)
    if(token.isAdmin == roles[0]) {
      return true
    }
  }
}
