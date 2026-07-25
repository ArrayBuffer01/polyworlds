export interface User {
  id: number;
  username: string;
  createdAt: Date;
  bio: string | null;
  avatarUrl?: string | null;
}

export interface Feed {
  content: string;
  createdAt: Date;
}
