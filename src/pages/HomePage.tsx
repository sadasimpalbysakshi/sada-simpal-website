import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, Hand, Truck, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collections } from "@/data/products";
import { SITE } from "@/lib/site";
import { formatPrice, withBase } from "@/lib/format";
import ProductSection from "@/components/ProductSection";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import Newsletter from "@/components/Newsletter";
import Seo from "@/components/Seo";

const TRUST = [
  { icon: Hand, title: "Made by village women", text: "100% handmade, stitch by stitch" },
  { icon: Briefcase, title: "Custom & bulk orders", text: "Gifts, weddings, corporate" },
  {
    icon: Truck,
    title: "Ships across India",
    text: `Free above ${formatPrice(SITE.shipping.freeAbove)}`,
  },
  { icon: MessageCircle, title: "Order on WhatsApp", text: "We reply within hours" },
];

const HomePage = () => (
  <div>
    <Seo />

    {/* ================= HERO ================= */}
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden">
      <img
        src={withBase("image1.webp")}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          // fall back to the original PNG if the optimised copy is missing
          const el = e.currentTarget;
          if (!el.dataset.fallback) {
            el.dataset.fallback = "1";
            el.src = withBase("image1.png");
          }
        }}
      />
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative z-10 px-4 text-center text-background">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm uppercase tracking-[0.3em]"
        >
          Handcrafted warmth &amp; style
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 font-display text-5xl font-light md:text-7xl lg:text-8xl"
        >
          {SITE.nameHindi}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-8 max-w-md text-lg font-light md:text-xl"
        >
          Unique crochet creations, made by hand in Jhansi
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
            asChild
          >
            <Link to="/shop">Shop now</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-background bg-transparent text-background hover:bg-background hover:text-foreground"
            asChild
          >
            <Link to="/customize-order">Custom order</Link>
          </Button>
        </motion.div>
      </div>
    </section>

    {/* ================= TRUST BAR ================= */}
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4 lg:px-8">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ================= COLLECTIONS ================= */}
    <section id="collections" className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center font-display text-4xl">Shop by collection</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {collections.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/collections/${c.slug}`} className="group block">
                <div className="mb-3 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-xl">{c.name}</h3>
                <p className="hidden text-sm text-muted-foreground sm:block">{c.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ================= PRODUCTS ================= */}
    <ProductSection title="Bestsellers" filter={(p) => !!p.isBestseller} />
    <ProductSection title="New Arrivals" filter={(p) => !!p.isNewArrival} />

    {/* ================= CUSTOM ORDER BANNER ================= */}
    <section className="bg-primary px-4 py-16 text-center text-primary-foreground">
      <h2 className="mb-3 font-display text-3xl md:text-4xl">Dreaming of something one-of-a-kind?</h2>
      <p className="mx-auto mb-6 max-w-xl text-primary-foreground/80">
        A bouquet in your wedding colours, a toy with your baby's name, a gift set for someone
        special — tell us your idea and we'll crochet it.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          size="lg"
          className="bg-background text-foreground hover:bg-background/90"
          asChild
        >
          <Link to="/customize-order">Start a custom order</Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-background bg-transparent text-background hover:bg-background hover:text-foreground"
          asChild
        >
          <Link to="/bulk-orders">Bulk &amp; corporate orders</Link>
        </Button>
      </div>
    </section>

    {/* ================= REVIEWS ================= */}
    <ReviewsSection />

    {/* ================= BRAND STORY ================= */}
    <section className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Our philosophy
        </p>
        <h2 className="mb-6 font-display text-3xl md:text-4xl">Crafted with care</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          At {SITE.name}, we believe simplicity is an art form. Our crochet pieces are
          slow-crafted, stitch by stitch, by the women of our village — for those who value the human
          touch over the machine.
        </p>
        <Button variant="outline" asChild>
          <Link to="/about">Discover our story</Link>
        </Button>
      </div>
    </section>

    {/* ================= INSTAGRAM ================= */}
    <section className="bg-secondary/40 px-4 py-14 text-center">
      <Instagram className="mx-auto mb-3 h-7 w-7" />
      <h2 className="mb-2 font-display text-3xl">Follow our journey</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Behind-the-scenes, new creations and happy customers on {SITE.instagramHandle}
      </p>
      <Button variant="outline" asChild>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
          Follow on Instagram
        </a>
      </Button>
    </section>

    <Newsletter />
  </div>
);

export default HomePage;
