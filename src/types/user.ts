export enum Role {
  GUEST,
  HOST,
}

export interface User {
  role: Role;
  key: string;
  identity: string;
}
