import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { useCatalog } from "@/lib/catalog";
import { useCart } from "@/contexts/CartContext";

const Layout = () => {
  useScrollToHash();
  const { pathname } = useLocation();
  const { data: catalog } = useCatalog();
  const { syncWithCatalog, setCartOpen } = useCart();

  // keep prices / availability of items already in the bag up to date
  useEffect(() => {
    if (catalog) syncWithCatalog(catalog.products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog]);

  // start every new page at the top, and close the bag panel when the page changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setCartOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-background focus:p-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {/* Only the page content waits while a page loads — the header, footer and
            bag panel stay mounted, so the bag panel can close cleanly. */}
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
