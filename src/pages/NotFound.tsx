import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const NotFound = () => (
  <div className="px-4 py-28 text-center">
    <Seo title="Page not found" noindex />
    <p className="mb-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
    <h1 className="font-display text-4xl md:text-5xl mb-4">We couldn't find that page</h1>
    <p className="mb-8 text-muted-foreground">
      It may have moved, or the link might be wrong.
    </p>
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link to="/" className="rounded-sm bg-primary px-6 py-3 text-sm text-primary-foreground">
        Back to home
      </Link>
      <Link to="/shop" className="rounded-sm border border-border px-6 py-3 text-sm">
        Browse the shop
      </Link>
    </div>
  </div>
);

export default NotFound;
