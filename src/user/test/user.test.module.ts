import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { ModuleMetadata } from '@nestjs/common';
import { UserController } from '../user.controller';
import { I18nCustomModule } from 'src/i18n-custom/i18n-custom.module';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { testDataSourceOptions } from '../../../db/data.source';

export const UserTestModule: ModuleMetadata = {
  providers: [UserService, UserRepository],
  imports: [
    TypeOrmModule.forRoot({
      ...testDataSourceOptions,
    }),
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    I18nCustomModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  controllers: [UserController],
};
