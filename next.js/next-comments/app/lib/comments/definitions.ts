export type Comment = {
  id: number;
  date: string;
  post: string;
  text: string;
  author: Author;
};

export type Author = {
  name: string;
  avatar_url: string;
};

export type CommentRow = {
  id: number;
  date: string;
  post: string;
  text: string;
  author: string;
  avatar_url: string;
};
