import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  OnModuleDestroy,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import Redis from 'ioredis';
import { defer, lastValueFrom, Observable } from 'rxjs';

const TTL_SECONDS = 24 * 60 * 60;
// Must outlast the slowest in-flight request (provider calls can take tens of
// seconds); a crashed request holds the key for this long.
const LOCK_TTL_SECONDS = 120;

interface Stored {
  fingerprint: string;
  status: number;
  body: unknown;
}

/**
 * Honours an `Idempotency-Key` header on mutating requests: the first
 * response is stored for 24 hours and replayed for retries with the same key,
 * body and endpoint; a concurrent retry gets 409 and a reused key with a
 * different body gets 422. Requests without the header pass straight through.
 * Keys are scoped to the tenant and the route. Apply with
 * @UseInterceptors(IdempotencyInterceptor) on endpoints that move money.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor, OnModuleDestroy {
  private readonly logger = new Logger(IdempotencyInterceptor.name);
  private readonly redis: Redis;

  constructor(config: ConfigService) {
    this.redis = new Redis(config.get<string>('REDIS_URL')!, { lazyConnect: true, maxRetriesPerRequest: 2 });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const header: string | undefined = request.headers['idempotency-key'];
    if (!header || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      return next.handle();
    }
    if (header.length > 255) {
      throw new UnprocessableEntityException('Idempotency-Key must be at most 255 characters');
    }

    const scope = request.tenant?.id ?? request.ip ?? 'anonymous';
    const route = `${request.method} ${request.route?.path ?? request.path}`;
    const key = `idem:${createHash('sha256').update(`${scope}|${route}|${header}`).digest('hex')}`;
    const fingerprint = createHash('sha256')
      .update(JSON.stringify({ body: request.body ?? null, params: request.params ?? null }))
      .digest('hex');

    return defer(async () => {
      const cached = await this.redis.get(key);
      if (cached) {
        const stored = JSON.parse(cached) as Stored;
        if (stored.fingerprint !== fingerprint) {
          throw new UnprocessableEntityException('This Idempotency-Key was already used with a different request');
        }
        response.status(stored.status);
        response.setHeader('Idempotent-Replayed', 'true');
        return stored.body;
      }

      const locked = await this.redis.set(`${key}:lock`, '1', 'EX', LOCK_TTL_SECONDS, 'NX');
      if (!locked) {
        throw new ConflictException('A request with this Idempotency-Key is still being processed');
      }

      try {
        const body = await lastValueFrom(next.handle(), { defaultValue: undefined });
        const stored: Stored = { fingerprint, status: response.statusCode, body };
        await this.redis
          .set(key, JSON.stringify(stored, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)), 'EX', TTL_SECONDS)
          .catch((error) => this.logger.warn(`Could not store idempotent response: ${error}`));
        return body;
      } finally {
        await this.redis.del(`${key}:lock`).catch(() => undefined);
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit().catch(() => undefined);
  }
}
