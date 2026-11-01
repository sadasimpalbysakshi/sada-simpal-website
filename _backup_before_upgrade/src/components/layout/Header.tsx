import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import logo from "@/assets/logo.jpeg";

// import "/Users/kishan7448/style-hub/src/App.css"; 

// const navigation = [
//   { name: 'Home', href: '/' },
//   {
//     name: 'Shop',
//     href: '/shop',
//     children: [
//       { name: 'All Products', href: '/shop' },
//       { name: 'Kids Wear', href: '/shop?category=shirts' },
//       { name: 'Tops', href: '/shop?category=tops' },
//       { name: 'Bouquet', href: '/collections/bouquet' }
// ,
//       { name: 'Hair Accessories', href: '/shop?category=bottoms' },
//       { name: 'Coaster', href: '/shop?category=outerwear' },
//       { name: 'Cuddle Corner', href: '/shop?category=cuddle Corner' },
//       { name: 'Mens Wear', href: '/shop?category=Mens' },
//       { name: 'Key Chains', href: '/shop?category=Mens' },
//       { name: 'Chrochet Scarf', href: '/shop?category=Mens' }


//     ],
//   },
//   { name: 'About', href: '/about' },
//   { name: 'Blog', href: '/blog' },
//   { name: 'Contact', href: '#contact' }


// ,
// ];

type NavChild =
  | { name: string; href: string }
  | { name: string; action: "scroll" };

const scrollToCollections = () => {
  const section = document.getElementById("collections");
  section?.scrollIntoView({ behavior: "smooth" });
};

const navigation :{name: string;
  href: string;
  children?: NavChild[];}[]= [
  { name: "Home", href: "/" },
  {
    name: "Shop",
    href: "#",
    children: [
      { name: "All Products", action: "scroll" },
      { name: "Kids Wear", href: "/collections/kids-wear" },
      { name: "Womens Wear", href: "/collections/womens-wear" },
      { name: "Bouquet", href: "/collections/bouquet" },
      { name: "Hair Accessories", href: "/collections/hair-accessories" },
      { name: "Home Decor", href: "/collections/Home-Decor" },
      { name: "Cuddle Corner", href: "/collections/cuddle-corner" },
      { name: "Mens Wear", href: "/collections/mens-wear" },
      { name: "Key Chains", href: "/collections/key-chains" },
      { name: "Crochet Scarf", href: "/collections/scarf" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];





const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems, toggleCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
   <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">





      <nav className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center">
  <img
  src={logo}
  alt="Sada Simpal Logo"
  className={cn(
    "h-14 lg:h-20 w-auto transition-all duration-300",
    isScrolled ? "opacity-100" : "opacity-95"
  )}
/>

</Link>


          {/* Desktop Navigation */}
          <div className="flex items-center space-x-6">




            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* {item.href === '#contact' ? (
          <a
            href="#contact"
            className="flex items-center gap-1 text-sm font-medium text-black hover:text-primary transition-colors"
          >
            {item.name}
          </a>
        ) : (
       
         <Link
  to={item.href}
  className={cn(
    "relative text-sm font-medium tracking-wide text-foreground transition-all duration-300",
    "after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
    location.pathname === item.href
      ? "after:w-full text-primary"
      : "hover:text-primary"
  )}
>
  {item.name}
</Link>


        )}
 */}

 {item.href.startsWith("#") ? (
  <a
    href={item.href}
    className="relative text-sm font-medium tracking-wide text-foreground"
  >
    {item.name}
  </a>
) : (
  <Link
    to={item.href}
    className="relative text-sm font-medium tracking-wide text-foreground"
  >
    {item.name}
  </Link>
)}



                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg py-2"
                    >
                      {item.children.map((child) =>
  "action" in child ? (
    <button
      key={child.name}
      onClick={() => {
        const section = document.getElementById("collections");
        section?.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }}
      className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
    >
      {child.name}
    </button>
  ) : (
    <Link
      key={child.name}
      to={child.href}
      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
    >
      {child.name}
    </Link>
  )
)}

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-black hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/account"
              className="p-2 text-black hover:text-primary transition-colors hidden sm:block"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={toggleCart}
              className="p-2 text-black hover:text-primary transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-black lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-200"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.href === '#contact' ? (
  <a
    href="#contact"
    className="block px-4 py-3 text-base font-medium text-black hover:bg-muted transition-colors"
    onClick={() => setIsMobileMenuOpen(false)}
  >
    {item.name}
  </a>
) : (
  <Link
    to={item.href}
    className="block px-4 py-3 text-base font-medium text-black hover:bg-muted transition-colors"
  >
    {item.name}
  </Link>
)}


                    {item.children && (
                      <div className="pl-8 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-black hover:text-black transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  to="/account"
                  className="block px-4 py-3 text-base font-medium text-black hover:bg-muted transition-colors"
                >
                  Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
