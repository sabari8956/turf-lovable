import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">
            TurfBook
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              to="/bookings"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/bookings" ? "text-primary" : "text-secondary"
              }`}
            >
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}