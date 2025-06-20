import { Link } from "react-router";
import TagList from "./TagList";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => {
        const postDate = new Date(post.attributes.date);
        const isNew =
          (new Date().getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24) <
          7;

        return (
          <li key={post.path} className="flex flex-col border-b-2 pb-2">
            <Link to={`/blog/${post.path}`} className="flex items-center">
              <h2 className="text-2xl cursor-pointer hover:underline">
                {post.attributes.title}
              </h2>
              {isNew && (
                <div className="ml-2 bg-primary text-secondary text-xs rounded-full px-2">
                  Latest
                </div>
              )}
            </Link>
            <p className="text-foreground/60 selection:bg-amber-500">
              {post.attributes.description}
            </p>
            <div className="mt-2">
              <p className="text-sm">
                {post.attributes.date} ·{" "}
                <span className="font-semibold">{post.attributes.author}</span>
              </p>
              <TagList tags={post.attributes.tags} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
