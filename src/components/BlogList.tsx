import { Link } from "react-router";
import TagList from "./TagList";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <li key={post.path} className="flex flex-col border-b-2 pb-2">
          <Link to={`/blog/${post.path}`}>
            <h2 className="text-2xl cursor-pointer hover:underline">
              {post.attributes.title}
            </h2>
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
      ))}
    </ul>
  );
}
