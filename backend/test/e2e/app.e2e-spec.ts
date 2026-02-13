import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Skip e2e tests if no database is available
    if (!process.env.CENTRAL_DATABASE_URL) {
      return;
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/health (GET)', () => {
    if (!app) return;

    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
      });
  });

  it('/api/auth/register should validate input', () => {
    if (!app) return;

    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({})
      .expect(400);
  });

  it('/api/customers should require authentication', () => {
    if (!app) return;

    return request(app.getHttpServer())
      .get('/api/customers')
      .expect(401);
  });
});
