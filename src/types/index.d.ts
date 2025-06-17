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
}
