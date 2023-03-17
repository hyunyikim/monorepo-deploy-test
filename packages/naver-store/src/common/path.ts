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
export const URL_GET_ORDER_LIST =
  "/v1/pay-order/seller/product-orders/last-changed-statuses";

export const URL_GET_PRODUCT_LIST = "/v1/products/search";

export const URL_GET_CHANNEL_PRODUCT_LIST = (channelId: number) =>
  `/v2/products/channel-products/${channelId}`;

export const URL_GET_ORDER_DETAIL_LIST =
  "/v1/pay-order/seller/product-orders/query";

export const URL_GET_CATEGORIES = "/v1/categories";
