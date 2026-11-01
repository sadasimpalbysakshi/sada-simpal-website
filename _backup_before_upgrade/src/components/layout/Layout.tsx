// import { ReactNode } from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import CartSidebar from './CartSidebar';
// import { useScrollToHash } from '@/hooks/useScrollToHash';

// // interface LayoutProps {
// //   children: ReactNode;
// // }

// // const Layout = ({ children }: LayoutProps) => {

// //   useScrollToHash(); // 👈 ADD THIS


// //   return (
// //     <div className="min-h-screen flex flex-col">
// //       <Header />
// //       <main className="flex-1 pt-16 lg:pt-20">
// //   {children}
// // </main>

// //       <Footer />
// //       <CartSidebar />
// //     </div>
// //   );
// // };

// // export default Layout;
// import { Outlet } from "react-router-dom";

// const Layout = () => {
//   useScrollToHash();

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1 pt-16 lg:pt-20">
//         <Outlet />
//       </main>
//       <Footer />
//       <CartSidebar />
//     </div>
//   );
// };

// export default Layout;

import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import { Outlet } from "react-router-dom";
import { useScrollToHash } from "@/hooks/useScrollToHash";

const Layout = () => {
  useScrollToHash();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout;
