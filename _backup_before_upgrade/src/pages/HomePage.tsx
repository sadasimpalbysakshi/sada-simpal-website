

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { collections, products } from "@/data/products";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import ProductSection from "@/components/ProductSection";



const HomePage = () => {
  const instagramReviews = [
    "/style-hub/instagram/review1.jpg",
    "/style-hub/instagram/review2.jpg",
    "/style-hub/instagram/review3.jpg",
    "/style-hub/instagram/review4.jpg",
  ];

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/style-hub/image1.png')" }}
        >
          <div className="absolute inset-0 bg-foreground/30" />
        </div>

        <div className="relative z-10 text-center text-background px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm tracking-[0.3em] uppercase mb-4"
          >
            Handcrafted Warmth & Style
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light mb-6"
          >
            सादा simpal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-light mb-8 max-w-md mx-auto"
          >
            Explore Our Unique Crochet Creations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-wrap justify-center gap-4">
  {/* Explore Collection */}
  <Button
    size="lg"
    variant="outline"
    className="border-[#2E2E2E] text-[#2E2E2E] bg-white/70 hover:bg-[#2E2E2E] hover:text-white"
    onClick={() =>
      document
        .getElementById("collections")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    Explore Collection
  </Button>

  {/* New Arrivals */}
  <Button
    size="lg"
    variant="outline"
    className="border-[#2E2E2E] text-[#2E2E2E] bg-white/70 hover:bg-[#2E2E2E] hover:text-white"
    onClick={() =>
      document
        .getElementById("new-arrivals")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    New Arrivals
  </Button>

  {/* Best Sellers */}
  <Button
    size="lg"
    variant="outline"
    className="border-[#2E2E2E] text-[#2E2E2E] bg-white/70 hover:bg-[#2E2E2E] hover:text-white"
    onClick={() =>
      document
        .getElementById("bestsellers")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    Best Sellers
  </Button>

  {/* Customize Order */}
 <Button
  size="lg"
  className="bg-[#2E2E2E] text-white hover:bg-black"
  asChild
>
  <Link to="/customize-order">Customize Order</Link>
</Button>

</div>

          </motion.div>
        </div>
      </section>

      {/* ================= COLLECTIONS ================= */}
      <section id="collections" className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <h2 className="font-display text-4xl text-center mb-12">
            Our Collections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/collections/${collection.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-sm mb-4">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-xl mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {collection.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BESTSELLERS ================= */}
      <section id="bestsellers">
      <ProductSection
        title="Bestsellers"
        filter={(p) => p.isBestseller}
      />
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section id="new-arrivals">
      <ProductSection
        title="New Arrivals"
        filter={(p) => p.isNewArrival}
      />
      </section>

      {/* ================= PREMIUM REVIEWS ================= */}
      <ReviewsSection />

      {/* ================= INSTAGRAM ================= */}
      <section className="py-24 px-6 lg:px-12 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
            Loved on Instagram
          </h2>

          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...instagramReviews, ...instagramReviews].map((img, i) => (
              <div
                key={i}
                className="min-w-[180px] md:min-w-[220px] overflow-hidden rounded-sm"
              >
                <img
                  src={img}
                  alt="Instagram review"
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <a
              href="https://www.instagram.com/sadasimpalbysakshi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-4 hover:text-primary"
            >
              View more on Instagram →
            </a>
          </div>
        </div>
      </section>

      {/* ================= BRAND STORY ================= */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Our Philosophy
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-6">
            Crafted with Care
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            At Sada Simpal, we believe simplicity is an art form. Our
            crochet pieces are slow-crafted, stitch by stitch, for those
            who value the human touch over the machine.
          </p>
          <Button variant="outline" asChild>
            <Link to="/about">Discover Our Story</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
