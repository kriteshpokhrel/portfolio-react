export interface PostMeta {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  category: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
}
