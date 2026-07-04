export interface Comment {
  name: string;
  text: string;
  date: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  author?: string;
  date: string;
  updatedAt?: string;
  readTime?: number;
  tags?: string[];
  likes?: number;
  comments?: Comment[];
  cover?: string;
  description?: string;
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt?: string;
  author?: string;
  date: string;
  readTime?: number;
  tags?: string[];
  cover?: string;
}

export type PostPayload = Partial<
  Pick<
    Post,
    "title" | "excerpt" | "content" | "author" | "readTime" | "tags" | "cover"
  >
>;
