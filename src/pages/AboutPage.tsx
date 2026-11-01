import { Link } from "react-router-dom";
import { Heart, Users, Hand, Briefcase } from "lucide-react";
import { SITE } from "@/lib/site";
import { withBase } from "@/lib/format";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";

// TODO (owner): add your own words & photos — e.g. a photo of the women at work
// (save it in public/ and show it in the "Made by the women of our village" block).
const VALUES = [
  {
    icon: Hand,
    title: "Made by hand",
    text: "Every stitch is worked by hand — no machines, no shortcuts. That's why no two pieces are exactly alike.",
  },
  {
    icon: Users,
    title: "Made by village women",
    text: "Our pieces are crocheted by the women of our village. Every purchase supports their skill, their income and their independence.",
  },
  {
    icon: Heart,
    title: "Made with love",
    text: "From a baby's first toy to a gift for someone special, each piece is made with the care of a family heirloom.",
  },
];

const AboutPage = () => (
  <div>
    <Seo
      title="Our Story"
      description={`${SITE.name} is a handmade crochet brand made by the women of our village near Jhansi — bouquets, toys, accessories and gifts. Bulk and corporate orders welcome.`}
    />

    <section className="bg-secondary/50 px-4 py-20 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">Our story</p>
      <h1 className="font-display text-4xl md:text-6xl">{SITE.nameHindi}</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{SITE.tagline}.</p>
    </section>

    <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2 lg:px-8">
      <img
        src={withBase("Collections/Hug.webp")}
        alt="Handmade crochet by Sada Simpal"
        className="aspect-[4/5] w-full rounded-sm object-cover"
        loading="lazy"
      />
      <div>
        <h2 className="font-display text-3xl mb-4">Simplicity, stitched with care</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          <strong>Sada Simpal</strong> — “simple and sweet” — began with a single hook, a ball
          of yarn and the belief that the things we keep closest should be made with
          patience.
        </p>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Today we craft soft toys, crochet bouquets that never wilt, accessories, baby and
          kids' pieces, home decor, gifts and apparel from our home in Jhansi, Uttar Pradesh.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Don't see exactly what you imagine? We love bringing ideas to life — in your colours,
          your size, your style.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/customize-order">Start a custom order</Link>
        </Button>
      </div>
    </section>

    {/* ---------- Made by the women of our village ---------- */}
    <section className="bg-secondary/40 px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Users className="mx-auto mb-4 h-9 w-9" />
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          Made by the women of our village
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Behind every piece is a skilled pair of hands. Everything you see here is crocheted
          by the women of our village — homemakers and artisans turning their talent into
          work they are proud of.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          When you buy from {SITE.name}, you're not just taking home something beautiful —
          you're helping a village woman earn, grow and stand on her own. Thank you for being
          part of that.
        </p>
      </div>
    </section>

    <section className="px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="text-center">
            <Icon className="mx-auto mb-4 h-8 w-8" />
            <h3 className="font-display text-2xl mb-2">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ---------- Bulk & corporate ---------- */}
    <section className="bg-primary px-4 py-16 text-primary-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <Briefcase className="mx-auto mb-4 h-9 w-9" />
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          Bulk &amp; corporate orders
        </h2>
        <p className="mb-6 leading-relaxed text-primary-foreground/80">
          Looking for gifts for your team or clients, return favours for a wedding, festive
          hampers or an event? We take bulk and corporate orders — handmade, in your colours,
          and delivered across India. Get in touch and we'll prepare a quote.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
            asChild
          >
            <Link to="/bulk-orders">Send a bulk enquiry</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-background bg-transparent text-background hover:bg-background hover:text-foreground"
            asChild
          >
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>

    <section className="px-4 py-16 text-center">
      <h2 className="font-display text-3xl mb-4">Come say hello</h2>
      <p className="mx-auto mb-6 max-w-md text-muted-foreground">
        Follow our latest creations on Instagram {SITE.instagramHandle} or message us any time.
      </p>
      <Button asChild>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
          Follow on Instagram
        </a>
      </Button>
    </section>
  </div>
);

export default AboutPage;
