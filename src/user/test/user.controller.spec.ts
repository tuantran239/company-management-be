import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserTestModule } from './user.test.module';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(UserTestModule).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
