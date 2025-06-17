import { Markdown } from "./Markdown";
import TagList from "./TagList";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="max-w-2xl mx-auto mt-8 px-4">
      <h1>{post.attributes.title}</h1>
      <p className="text-sm text-foreground/60">
        {post.attributes.date} ·{" "}
        <span className="font-semibold">{post.attributes.author}</span>
      </p>
      <TagList tags={post.attributes.tags} />
      <Markdown content={post.body} />
    </article>
  );
}
