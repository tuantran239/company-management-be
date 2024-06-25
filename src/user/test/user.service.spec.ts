import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserTestModule } from './user.test.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(UserTestModule).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
