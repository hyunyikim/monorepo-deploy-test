export class GetAccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
}

export interface GetSellerChannelsResponse {
  channelNo: number;
  channelType: "STOREFARM" | "WINDOW";
  name: string;
}
