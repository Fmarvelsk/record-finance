import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { RecordNFTSDK } from 'record-financial-nft-sdk'
// import canonicalize from 'canonicalize';
// import * as crypto from 'crypto';
// import { IJson } from '../interfaces';

@Injectable()
export class ContractService {
  private recordNftContractAddress: string;
  private rpcUrl: string;
  private recordSDK: RecordNFTSDK;

  constructor(private configService: ConfigService) {
    this.recordNftContractAddress = <string>(
      configService.getOrThrow('RECORD_NFT_CONTRACT_ADDRESS')
    );
    this.rpcUrl = <string>(
      configService.getOrThrow('AVALANCHE_L1_RPC_URL')
    );

    const provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.recordSDK = new RecordNFTSDK(this.recordNftContractAddress, provider);
    void this.testSdk();
  }

  async testSdk() {
    const symbol = await this.recordSDK.symbol()
    console.log({symbol});
  }
}
