import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { detectClient, UsageService } from './usage.service';

/**
 * Records every tenant-authenticated API call for the platform console.
 * Requests without a tenant (login, public webhooks, health) are ignored.
 */
@Injectable()
export class UsageInterceptor implements NestInterceptor {
  constructor(private readonly usage: UsageService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const start = Date.now();
    const request = context.switchToHttp().getRequest();

    const record = (status: number) => {
      const tenantId: string | undefined = request.tenant?.id;
      if (!tenantId) return;
      this.usage.record({
        tenantId,
        route: `${request.method} ${request.route?.path ?? 'unmatched'}`.slice(0, 200),
        authMethod: request.authMethod ?? 'api_key',
        client: detectClient(request.headers ?? {}),
        status,
        durationMs: Date.now() - start,
      });
    };

    return next.handle().pipe(
      tap(() => record(context.switchToHttp().getResponse().statusCode)),
      catchError((error) => {
        record(error instanceof HttpException ? error.getStatus() : 500);
        return throwError(() => error);
      }),
    );
  }
}
