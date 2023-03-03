import { config } from "./configuration";

export const URL_REQUEST_ACCESS_TOKEN = (
  clientId: string,
  timestamp: number,
  clientSecretSign: string,
  accountId = config.naver.auth.accountId
) => {
  let url = `/v1/oauth2/token?client_id=${clientId}&timestamp=${timestamp}&client_secret_sign=${clientSecretSign}&grant_type=client_credentials&type=SELLER`;
  if (accountId) url += `&account_id=${accountId}`;
  return url;
};

export const URL_GET_SELLER_CHANNELS = "/v1/seller/channels";
