import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ItemRepository } from 'src/item-repository';
import { JwtStrategy } from 'src/authz/jwt.strategy';
import { MockJwtStrategy } from './mock-jwt.strategy';
import { JwtService } from '@nestjs/jwt';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const getToken = (payload: object, secret?: string) => {
    return jwtService.sign(payload, {
      secret: secret ?? process.env.NESTJS_MOCK_JWT_SECRET,
    });
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ItemRepository, JwtService],
    })
      .overrideProvider(JwtStrategy)
      .useClass(MockJwtStrategy)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /items', () => {
    const mockItem = {
      name: 'Item test',
      price: 1000,
    };
    it('should return 201 if request has valid token and permisson.', () => {
      const token = getToken({ permissions: ['create:items'] });

      return request(app.getHttpServer())
        .post('/items')
        .set('Authorization', `Bearer ${token}`)
        .send(mockItem)
        .expect(HttpStatus.CREATED);
    });

    it('should return 400 if request has invalid request body.', () => {
      const token = getToken({ permissions: ['create:items'] });
      const invalidItem = Object.assign(mockItem);
      invalidItem.name = '123456789101';

      return request(app.getHttpServer())
        .post('/items')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidItem)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 if request has invalid token.', () => {
      const token = getToken({ permissions: ['create:items'] }, 'InvalidToken');

      return request(app.getHttpServer())
        .post('/items')
        .set('Authorization', `Bearer ${token}`)
        .send(mockItem)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 if request does not have enough permission.', () => {
      const token = getToken({ permissions: [] });

      return request(app.getHttpServer())
        .post('/items')
        .set('Authorization', `Bearer ${token}`)
        .send(mockItem)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
