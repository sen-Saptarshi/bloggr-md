interface PostData {
  title: string;
  date: string;
  author: string;
  tags: string[];
  description: string;
}

interface Post {
  attributes: PostData;
  body: string;
  path: string;
  /** Estimated minutes to read, derived from the body's word count. */
  readingTime: number;
}
