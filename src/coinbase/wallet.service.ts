import { CdpClient } from '@coinbase/cdp-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
  private cdp: CdpClient;
  private logger = new Logger(WalletService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKeyName: string = configService.getOrThrow('CDP_API_KEY_NAME');
    const privateKey: string = configService.getOrThrow('CDP_API_PRIVATE_KEY');
    const walletSecret: string = configService.getOrThrow('CDP_API_WALLET_SECRET');

    const cdp = new CdpClient({
      apiKeyId: apiKeyName,
      apiKeySecret: privateKey,
      walletSecret: walletSecret,
      debugging: true,
    });
    this.cdp = cdp;

    // (async () => {
    //   // const evmAccount = await cdp.evm.createAccount();
    //   // console.log('cdp account:', evmAccount);
    //   const accounts = await cdp.evm.listAccounts();
    //   console.log('cdp accounts:', ...accounts.accounts);
    // })();
  }

  async createNewWallet() {}

  async getWallets() {
    // return await Wallet.listWallets();
  }

  async getAddressByWalletId(walletId: string) {
    // const resp = await Wallet.fetch(walletId);
    // console.log(resp);
    // return resp;
  }
}
