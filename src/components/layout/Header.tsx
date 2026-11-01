import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCollections } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpeg";
import SearchDialog from "./SearchDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const buildMenu = (collections: { slug: string; name: string }[]) => [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
  ...collections.map((c) => ({ to: `/collections/${c.slug}`, label: c.name })),
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact Us" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-[13px] font-medium tracking-wide transition-colors hover:text-primary",
    isActive ? "text-primary underline underline-offset-8" : "text-foreground"
  );

const Header = () => {
  const MENU = buildMenu(useCollections());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const location = useLocation();

  // close menus when the route changes
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      {/* Announcement bar */}
      <div className="bg-primary px-4 py-2 text-center text-xs tracking-wide text-primary-foreground">
        Free shipping on orders above {formatPrice(SITE.shipping.freeAbove)} · Handmade with love in Jhansi
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label={`${SITE.name} home`}>
          <img src={logo} alt={SITE.name} className="h-12 w-auto lg:h-14" />
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:text-primary"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={toggleCart}
            className="relative p-2 hover:text-primary"
            aria-label={`Open bag, ${totalItems} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Desktop menu row */}
      <div className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-2 px-8 py-3">
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">{SITE.nameHindi}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col divide-y divide-border">
            {MENU.map((l) => (
              <Link key={l.to} to={l.to} className="py-3 text-base font-medium">
                {l.label}
              </Link>
            ))}
            <Link to="/customize-order" className="py-3 text-base text-muted-foreground">
              Custom Orders
            </Link>
            <Link to="/bulk-orders" className="py-3 text-base text-muted-foreground">
              Bulk &amp; Corporate Orders
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
