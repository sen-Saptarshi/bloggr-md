import { useEffect, useState } from "react";
import { PostList } from "@/components/BlogList";
import { fetchPosts } from "@/lib/posts";
import { SearchComponent } from "@/components/Search";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((allPosts) => {
        setAllPosts(allPosts);
        setFilteredPosts(allPosts); // initialize with all
      })
      .catch((error) => {
        console.error("Error loading posts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (term: string) => {
    const lower = term.toLowerCase();

    const filtered = allPosts.filter((post) => {
      const { title, description, author, tags } = post.attributes;
      return (
        title.toLowerCase().includes(lower) ||
        description.toLowerCase().includes(lower) ||
        author.toLowerCase().includes(lower) ||
        tags.some((tag) => tag.toLowerCase().includes(lower))
      );
    });

    setFilteredPosts(filtered);
  };

  if (loading) {
    return <h1 className="text-center mt-10 text-2xl">Loading...</h1>;
  }

  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto mt-10 px-4">
      <SearchComponent onSearch={handleSearch} />
      <PostList posts={filteredPosts} />
    </div>
  );
}
