import { Link } from "react-router-dom";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Seo from "@/components/Seo";

const FAQS = [
  {
    q: "Are your products really handmade?",
    a: "Yes — every piece is crocheted by hand by the women of our village near Jhansi, stitch by stitch. Small variations are part of what makes each one unique.",
  },
  {
    q: "Can I order a custom design, colour or size?",
    a: "Absolutely. Fill in the custom order form with your idea, and we'll reply with feasibility, price and timeline. You can share reference photos on WhatsApp.",
  },
  {
    q: "How long will my order take?",
    a: `Ready items are dispatched in ${SITE.shipping.dispatchDays} and delivered in about ${SITE.shipping.deliveryDays}. Custom pieces take longer; we'll confirm the date before we start.`,
  },
  {
    q: "Do you take bulk or corporate orders?",
    a: "Yes! We make gifts and return favours in bulk for companies, weddings, festivals and events — in your colours and with your branding where possible. Send us an enquiry on the Bulk & Corporate Orders page and we'll reply with a quote and timeline.",
  },
  {
    q: "Who makes your products?",
    a: "Every piece is crocheted by hand by the women of our village. Buying from us directly supports their work and livelihoods.",
  },
  {
    q: "Do you ship all over India?",
    a: `Yes. Shipping is free above ${formatPrice(SITE.shipping.freeAbove)}, otherwise a flat ${formatPrice(SITE.shipping.flatFee)}.`,
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery and UPI / bank transfer. After you place an order, we confirm it on WhatsApp.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Unused ready-made items can be returned within 7 days. Damaged or wrong items should be reported within 48 hours with photos. Custom orders can't be returned. See our Shipping & Returns page for details.",
  },
  {
    q: "How do I wash my crochet items?",
    a: "Hand wash gently in cool water with mild detergent and dry flat in the shade. More tips are on our Care Instructions page.",
  },
  {
    q: "Are the toys safe for babies?",
    a: "Our toys are made with soft cotton yarn and securely stitched, but they're handmade and may contain small parts, so they should be used with adult supervision.",
  },
  {
    q: "Can I send a gift directly to someone?",
    a: "Yes! Enter your recipient's address at checkout and add a gift message in the order notes.",
  },
  {
    q: "How can I track my order?",
    a: "We'll message you the courier tracking details on WhatsApp or email as soon as your parcel ships.",
  },
];

const FaqPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
    <Seo
      title="FAQs"
      description="Answers about handmade crochet orders, custom designs, shipping, payment, returns and care."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
    <h1 className="font-display text-4xl md:text-5xl mb-3 text-center">
      Frequently Asked Questions
    </h1>
    <p className="mb-10 text-center text-muted-foreground">
      Can't find your answer?{" "}
      <Link to="/contact" className="underline">
        Ask us directly
      </Link>
      .
    </p>
    <Accordion type="single" collapsible>
      {FAQS.map((f, i) => (
        <AccordionItem key={f.q} value={`q${i}`}>
          <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FaqPage;
