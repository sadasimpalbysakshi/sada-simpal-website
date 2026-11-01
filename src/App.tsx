import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import HomePage from "./pages/HomePage";
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const CustomizeOrder = lazy(() => import("./pages/CustomizeOrder"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
import NotFound from "./pages/NotFound";

// NOTE: <CartProvider> and <HashRouter> live in main.tsx.
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="/customize-order" element={<CustomizeOrder />} />
          <Route path="/bulk-orders" element={<BulkOrders />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/shipping-returns" element={<PolicyPage slug="shipping-returns" />} />
          <Route path="/care-instructions" element={<PolicyPage slug="care-instructions" />} />
          <Route path="/privacy-policy" element={<PolicyPage slug="privacy-policy" />} />
          <Route path="/terms-of-service" element={<PolicyPage slug="terms-of-service" />} />

          {/* old links from the previous version of the site */}
          <Route path="/page/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/page/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/page/shop-all" element={<Navigate to="/shop" replace />} />
          <Route path="/page/faqs" element={<Navigate to="/faqs" replace />} />
          <Route path="/page/shipping-&-returns" element={<Navigate to="/shipping-returns" replace />} />
          <Route path="/page/care-instructions" element={<Navigate to="/care-instructions" replace />} />
          <Route path="/page/privacy-policy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/page/terms-of-service" element={<Navigate to="/terms-of-service" replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
