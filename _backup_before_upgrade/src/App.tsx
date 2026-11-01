// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Routes, Route } from "react-router-dom";
// import { CartProvider } from "@/contexts/CartContext";

// import HomePage from "./pages/HomePage";
// import NotFound from "./pages/NotFound";
// import CollectionPage from "./pages/CollectionPage";
// import ProductPage from "./pages/ProductPage";
// import Layout from "@/components/layout/Layout";
// const queryClient = new QueryClient();

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <CartProvider>
// //       <TooltipProvider>
// //         <Toaster />
// //         <Sonner />

// //         <Routes>
// //   <Route element={<Layout />}>
// //     <Route path="/" element={<HomePage />} />
// //     <Route path="/collections/:slug" element={<CollectionPage />} />
// //     <Route path="/product/:id" element={<ProductPage />} />
// //     <Route path="*" element={<NotFound />} />
// //   </Route>
// // </Routes>


// //       </TooltipProvider>
// //     </CartProvider>
// //   </QueryClientProvider>
// // );

// // export default App;
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <CartProvider>
//       <TooltipProvider>
//         <Header />

//         <div style={{ marginTop: "120px", padding: "20px", color: "black" }}>
//           <h1>APP CONTENT IS HERE</h1>
//           <p>If header is visible, routing/layout was the issue.</p>
//         </div>

//         <Footer />
//       </TooltipProvider>
//     </CartProvider>
//   </QueryClientProvider>
// );

// export default App;



// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Routes, Route } from "react-router-dom";
// import { CartProvider } from "@/contexts/CartContext";

// import Layout from "@/components/layout/Layout";
// import HomePage from "./pages/HomePage";
// import CollectionPage from "./pages/CollectionPage";
// import ProductPage from "./pages/ProductPage";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <CartProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />

//         <Routes>
//           <Route element={<Layout />}>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/collections/:slug" element={<CollectionPage />} />
//             <Route path="/product/:id" element={<ProductPage />} />
//             <Route path="*" element={<NotFound />} />
//           </Route>
//         </Routes>

//       </TooltipProvider>
//     </CartProvider>
//   </QueryClientProvider>
// );

// export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";

import Layout from "@/components/layout/Layout";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import StaticPage from "./pages/StaticPage";
import CustomizeOrder from "./pages/CustomizeOrder";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/page/:slug" element={<StaticPage />} />
            <Route path="/customize-order" element={<CustomizeOrder />} />


              <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            
          <Route path="*" element={<NotFound />} />
        </Route>
</Routes>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
