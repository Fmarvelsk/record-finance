import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletService } from './coinbase/wallet.service';
import configuration from './config/configuration';
import { SqsModule } from './sqs/sqs.module';
import { ContractService } from './common/services/contract.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {},
    }),
    SqsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContractService, WalletService],
})
export class AppModule {}
