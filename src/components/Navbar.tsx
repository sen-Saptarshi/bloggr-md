import { Link } from "react-router";
import { ModeToggle } from "./mode-toggle";
import { BookAIcon } from "lucide-react";

export default function Navbar() {
  return (
    <>
      <div className="flex items-center justify-between px-2 py-2 mx-auto max-w-200 sticky top-0 z-50 bg-background/50 backdrop-blur-md">
        <Link to="/">
          <div className="text-3xl font-bold font-mono flex items-center">
            <BookAIcon className="w-10 h-10" />
            <h1>Blogs</h1>
          </div>
        </Link>
        <ModeToggle />
      </div>
    </>
  );
}
