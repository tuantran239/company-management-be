import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data.source';
import configuration from './common/config';

import { ThrottlerModule } from '@nestjs/throttler';

import { APP_PIPE } from '@nestjs/core';
import 'dotenv/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { BodyValidationPipe } from './common/pipe/body-validation.pipe';
import { DatabaseModule } from './database/database.module';
import { I18nCustomModule } from './i18n-custom/i18n-custom.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { InitModule } from './init/init.module';

import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    I18nCustomModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    InitModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: BodyValidationPipe,
    },
  ]
})
export class AppModule {}
