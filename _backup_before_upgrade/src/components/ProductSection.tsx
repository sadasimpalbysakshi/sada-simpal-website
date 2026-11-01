// import { Link } from "react-router-dom";
// import { products } from "@/data/products";
// import { ArrowRight } from "lucide-react";

// type Props = {
//   title: string;
//   filter: (product: any) => boolean;
// };

// const ProductSection = ({ title, filter }: Props) => {
//   const filteredProducts = products
//     .filter(filter)
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt ?? "").getTime() -
//         new Date(a.createdAt ?? "").getTime()
//     )
//     .slice(0, 6);

//   if (filteredProducts.length === 0) return null;

//   return (
//     <section className="py-20 px-4 lg:px-8 bg-secondary/30">
//       <div className="container mx-auto">
//         <div className="flex items-center justify-between mb-12">
//           <h2 className="font-display text-3xl md:text-4xl">
//             {title}
//           </h2>

//           <button
//             onClick={() =>
//               document
//                 .getElementById("collections")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
//           >
//             View All <ArrowRight className="h-4 w-4" />
//           </button>
//         </div>

//         <div className="flex gap-6 overflow-x-auto scrollbar-hide">
//           {filteredProducts.map((product) => (
//             <Link
//               key={product.id}
//               to={`/product/${product.id}`}
//               className="group min-w-[180px] md:min-w-[240px]"
//             >
//               <div className="aspect-[3/4] overflow-hidden rounded-sm mb-3 bg-muted">
//                 <img
//                   src={product.images[0]}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//               </div>
//               <h3 className="font-medium text-sm mb-1">
//                 {product.name}
//               </h3>
//               <p className="text-muted-foreground text-sm">
//                 ₹{product.price.toLocaleString("en-IN")}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductSection;

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  title: string;
  filter: (product: any) => boolean;
};

const ProductSection = ({ title, filter }: Props) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = products
    .filter(filter)
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime()
    )
    .slice(0, 10);
    console.log(title, filteredProducts.length);


  // ✅ Auto-scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollBy({ left: 260, behavior: "smooth" });

      // loop back to start
      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 10
      ) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-20 px-4 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-none">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl">
            {title}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 border rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 border rounded-full hover:bg-muted"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
{/* Slider */}
<div
  ref={sliderRef}
  className="flex gap-6 overflow-x-auto scroll-smooth px-2"
>
  {filteredProducts.map((product) => (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      className="w-[240px] flex-shrink-0"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-sm mb-3 bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <h3 className="font-medium text-sm mb-1">
        {product.name}
      </h3>
      <p className="text-muted-foreground text-sm">
        ₹{product.price.toLocaleString("en-IN")}
      </p>
    </Link>
  ))}
</div>

      </div>
    </section>
  );
};

export default ProductSection;
