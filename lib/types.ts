export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  memo: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  memo?: string | null;
  is_favorite?: boolean;
};
