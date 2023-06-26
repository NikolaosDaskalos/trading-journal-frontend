export interface MenuItem {
  path: string;
  text: string;
}

export interface UserDTO {
  id?: number;
  name: string;
  lastname: string;
  age: number;
  username: string;
  password?: string;
  email: string;
}

export interface TradeDTO {
  id?: number;
  ticker: string;
  buyDate: Date;
  buyQuantity: number;
  buyPrice: number;
  position: 'LONG' | 'SHORT';
  sellDate?: Date;
  sellQuantity?: number;
  sellPrice?: number;
  profitLoss?: number;
}

export interface AuthDTO {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface dashboardDTO {
  profit: number;
  gainsPerDay: number;
  winRate: number;
  openPositions: number;
}
export interface Alert {
  type?: 'primary' | 'info' | 'success' | 'danger' | 'warning';
  text: string;
}
