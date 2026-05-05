export interface User {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
}
