export interface ISqsEventObject {
  eventId: string;
  eventName: string;
}

interface IAssetSeveranceAsset {
  assetId: number;
  name: string;
  artistId: number;
  artistName: string;
}

interface IAssetSeveranceReportingCompany {
  reportingCompanyId: number;
  reportType: "DSP" | string;
  reportingCompanyName: string;
}

interface IAssetSeveranceRightsholder {
  accountHolderId: number;
  accountHolderName: string;
  accountHolderPercentage: number;
}

interface IAssetSeveranceDataObject {
  asset: IAssetSeveranceAsset;
  reportingCompany: IAssetSeveranceReportingCompany;
  rightsholders: IAssetSeveranceRightsholder[];
}

export interface ISqsAssetSeveranceEventObject
  extends ISqsEventObject,
    IAssetSeveranceDataObject {}
