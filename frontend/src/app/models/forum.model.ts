export interface ForumPost {
  id: number;
  user: string;
  title: string;
  content: string;
  created_at: string;
  upvotes: number;
  show_comments?: boolean;
  comments?: ForumComment[];
}

export interface ForumComment {
  id: number;
  user: string;
  content: string;
  created_at: string;
  upvotes: number;
}
