import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CUSTOM_ERROR_CODES } from 'src/common/constants';
import { errorApiResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private PARTNER_API_KEY: string;

  constructor(private configService: ConfigService) {
    this.PARTNER_API_KEY = configService.getOrThrow<string>('PARTNER_API_KEY');
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        errorApiResponse({
          message: 'Unauthorized',
          errorCode: CUSTOM_ERROR_CODES.MISSING_AUTH_TOKEN,
          devErrorMessage: 'Missing or invalid Authorization header',
        }),
      );
    }

    const token = authHeader.replace('Bearer ', '');

    if (token !== this.PARTNER_API_KEY) {
      throw new UnauthorizedException(
        errorApiResponse({
          message: 'Unauthorized',
          errorCode: CUSTOM_ERROR_CODES.INVALID_AUTH_TOKEN,
          devErrorMessage: 'Invalid API key',
        }),
      );
    }

    return true;
  }
}
