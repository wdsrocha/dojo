import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { ProblemsModule } from './problems/problems.module';
import { QueueModule } from './queue/queue.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ExceptionsLoggerFilter } from './utils/exceptions-logger.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CORS_ORIGIN: Joi.string().default('*'),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(2000),
        ADMIN_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        REDIS_TLS: Joi.boolean().default(false),
        REDIS_URL: Joi.string().required(),
        URI_CLIENT_EMAIL: Joi.string().required(),
        URI_CLIENT_PASSWORD: Joi.string().required(),
        CODEFORCES_CLIENT_USERNAME: Joi.string().required(),
        CODEFORCES_CLIENT_PASSWORD: Joi.string().required(),
      }),
    }),
    AuthenticationModule,
    QueueModule,
    DatabaseModule,
    SubmissionsModule,
    ProblemsModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: ExceptionsLoggerFilter }],
})
export class AppModule {}
