import { isTokenExpired } from './jwt.helper';

export class User {
  constructor(
    public username: string,
    private _accessToken: string,
    private _refreshToken: string
  ) {}

  get accessToken() {
    if (!isTokenExpired(this._accessToken)) {
      return this._accessToken;
    } else {
      return null;
    }
  }

  get refreshToken() {
    if (!isTokenExpired(this._refreshToken)) {
      return this._refreshToken;
    } else {
      return null;
    }
  }
}
