import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // TODO: Implementar validação real de autenticação (ex: JWT)
    next(); // Libera todas as requisições (apenas para desenvolvimento)
  }
} 