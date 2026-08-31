import { Link } from "react-router";
import { ModeToggle } from "./mode-toggle";
import { BookAIcon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-foreground/60"
        >
          <BookAIcon className="h-5 w-5" />
          <span className="font-mono text-lg font-semibold tracking-tight">
            Bloggr
          </span>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
}
