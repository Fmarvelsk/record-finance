import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from './coinbase/wallet.service';
import { successApiResponse } from './common/helpers/response.helper';
import { ContractService } from './common/services/contract.service';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private contractService: ContractService,
  ) {}

  getHello() {
    return successApiResponse({
      data: {
        name: 'record-financial-backend',
        description: 'Record Financial Backend',
        version: '0.0.1',
      },
    });
  }

  async getUsers() {
    const users = await this.prisma.accountHolder.findMany({});
    return successApiResponse({
      data: users,
    });
  }

  async getAddresses() {
    const addresses = await this.walletService.getWallets();
    return successApiResponse({
      data: addresses,
    });
  }

  async testSdk() {
    await this.contractService.testSdk();
    return successApiResponse({
      data: [],
    });
  }
}
