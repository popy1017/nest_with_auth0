import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // メタデータに格納したPermissionを取得
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // トークンに含まれるPermissionを取得
    const userPermissions = context.switchToHttp().getRequest()
      .user.permissions;

    if (!routePermissions) {
      return true;
    }

    // 要求したPermissionがトークンに含まれているかチェック
    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions.includes(routePermission),
      );

    return hasPermission();
  }
}
