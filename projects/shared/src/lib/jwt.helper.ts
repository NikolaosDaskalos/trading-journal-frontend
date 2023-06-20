import jwt_decode, { JwtPayload } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
  const payload: JwtPayload = getTokenPayload(token);
  return payload.exp ? Date.now() > payload.exp * 1000 : false;
}

export function getTokenExp(token: string): number | null {
  const payload: JwtPayload = getTokenPayload(token);
  return payload.exp || null;
}

export function getTokenUsername(token: string) {
  const payload: JwtPayload = getTokenPayload(token);
  return payload.sub || null;
}

export function getTokenPayload(token: string): JwtPayload {
  return jwt_decode(token);
}
