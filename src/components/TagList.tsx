export default function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {tags.map((tag) => {
        return (
          <span
            key={tag}
            className="bg-primary/10 text-foreground/70 text-sm px-2 rounded-full"
          >
            # {tag}
          </span>
        );
      })}
    </div>
  );
}
