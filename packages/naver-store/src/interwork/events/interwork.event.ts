export class RefreshTokenEvent {
  static readonly Key = "api.refresh.token";
  oldToken: string;
}

export class RefreshTokenResposneEvent {
  static readonly Key = "api.refresh.token.response";
  newToken: string;
}
