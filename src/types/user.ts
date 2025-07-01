
export interface User {
  account_id?: string;
  account_name: string;
  real_name?: string;
  email?: string;
  status?: number;
  account_group_id?: string;
  account_group_name?: string;
  phone?: string;
  server_ip?: string; // 服务器IP
  account?: string; // 账号
  token?: string; // 用户令牌
  id?: string; // 用户ID
}

export interface Register {
  account?: string; // 账号
  account_name?: string;
  real_name?: string;
  password: string;
  email?: string;
  id_card?: string;
  phone?: string;
}