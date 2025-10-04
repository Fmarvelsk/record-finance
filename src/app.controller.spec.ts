import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API details', () => {
      expect(appController.getHello()).toStrictEqual({
        data: {
          description: 'Record Financial Backend',
          name: 'record-financial-backend',
          version: '0.0.1',
        },
      });
    });
  });
});
