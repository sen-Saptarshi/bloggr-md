import { useEffect, useState } from "react";
import { useParams } from "react-router"; // or other router
import { getPostBySlug } from "../lib/posts";
import { PostDetail } from "@/components/BlogComp";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <p className="mt-20 text-center text-muted-foreground">Loading...</p>
    );
  if (!post)
    return (
      <p className="mt-20 text-center text-muted-foreground">Post not found</p>
    );

  return <PostDetail post={post} />;
}
