import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";

/**
 * Policy page text. Edit freely – each page is a list of sections.
 * NOTE: these are sensible starting drafts, not legal advice. Please review
 * them (and ideally have them checked) before launch, and make sure they
 * match what you actually do.
 */
export type PolicySection = { heading: string; body: string[]; list?: string[] };
export type Policy = { title: string; intro: string; updated: string; sections: PolicySection[] };

const updated = "1 November 2026";

export const POLICIES: Record<string, Policy> = {
  "shipping-returns": {
    title: "Shipping & Returns",
    intro:
      "Every piece is handmade, so we take a little time to craft and pack your order with care.",
    updated,
    sections: [
      {
        heading: "Shipping",
        body: [
          `We ship across India. Orders are made and dispatched within ${SITE.shipping.dispatchDays}, and typically arrive in ${SITE.shipping.deliveryDays} after dispatch, depending on your location.`,
          `Shipping is free on orders of ${formatPrice(SITE.shipping.freeAbove)} and above. Below that, a flat fee of ${formatPrice(SITE.shipping.flatFee)} applies.`,
          "You'll receive your tracking details on WhatsApp or email as soon as your parcel ships.",
        ],
      },
      {
        heading: "Custom & made-to-order pieces",
        body: [
          "Custom orders take longer — we'll confirm the timeline with you before we begin. As these are made specially for you, they cannot be returned or exchanged unless they arrive damaged.",
        ],
      },
      {
        heading: "Returns & exchanges",
        body: [
          "We want you to love what you receive. If something isn't right, tell us within 7 days of delivery.",
        ],
        list: [
          "Standard (ready-made) items can be returned within 7 days if they are unused, unwashed and in original packaging.",
          "If your item arrives damaged or incorrect, message us within 48 hours of delivery with photos or an unboxing video and we'll replace it or refund you.",
          "Return shipping for change-of-mind returns is paid by the customer.",
          "Custom orders, hair accessories and personal-use items cannot be returned for hygiene reasons.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Approved refunds are issued to your original payment method (or by UPI/bank transfer for cash-on-delivery orders) within 5–7 working days of us receiving the returned item.",
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "You can cancel an order before we start making it. Message us on WhatsApp as soon as possible — once crafting has begun, we may not be able to cancel.",
        ],
      },
    ],
  },

  "care-instructions": {
    title: "Care Instructions",
    intro: "A little care keeps your crochet looking beautiful for years.",
    updated,
    sections: [
      {
        heading: "Washing",
        body: ["Hand wash gently in cool water with a mild detergent. Do not wring, twist or machine wash."],
      },
      {
        heading: "Drying",
        body: ["Press gently in a towel to remove water, then dry flat in the shade. Avoid direct sunlight and hanging, which can stretch the stitches."],
      },
      {
        heading: "Do's & don'ts",
        body: [],
        list: [
          "Do not bleach or use harsh chemicals.",
          "Do not iron directly. If needed, steam gently from a distance.",
          "Bouquets and decor: keep dry and dust lightly with a soft brush.",
          "Soft toys: spot-clean with a damp cloth. Supervise young children and check small parts regularly.",
          "Store folded in a breathable cotton bag, away from moisture.",
        ],
      },
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    intro: `${SITE.name} respects your privacy. This page explains what we collect and why.`,
    updated,
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order, send a custom-order request, contact us, leave a review or subscribe to our newsletter, we collect the details you give us: your name, phone number, email address, delivery address and the content of your message or order.",
        ],
      },
      {
        heading: "How we use it",
        body: ["We use your information only to:"],
        list: [
          "process, make, ship and support your orders",
          "reply to your questions and custom-order requests",
          "send you updates or offers if you subscribed (you can unsubscribe at any time)",
          "improve our website and keep it secure",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We never sell your data. We share your name, phone number and address with our courier partners only so your parcel can be delivered. Our website and order data are stored with Supabase, a trusted database provider.",
        ],
      },
      {
        heading: "Cookies & storage",
        body: [
          "We use your browser's local storage to remember the items in your bag. We do not use it to track you across other websites.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask us to access, correct or delete your personal data at any time by emailing ${SITE.email}.`,
        ],
      },
    ],
  },

  "terms-of-service": {
    title: "Terms of Service",
    intro: `By using this website and placing an order with ${SITE.name}, you agree to these terms.`,
    updated,
    sections: [
      {
        heading: "Handmade products",
        body: [
          "Each item is handcrafted, so small variations in size, shape, colour and stitch pattern are natural and part of the charm. Photos are indicative and screens may show colours slightly differently.",
        ],
      },
      {
        heading: "Orders & pricing",
        body: [
          "All prices are in Indian Rupees (INR) and include applicable taxes. An order is confirmed once we acknowledge it on WhatsApp or email. We may decline or cancel an order if an item is unavailable or there is a pricing error, in which case you will be refunded in full.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "We accept Cash on Delivery and UPI/bank transfer. For prepaid orders, production begins once payment is received.",
        ],
      },
      {
        heading: "Shipping, returns & refunds",
        body: ["These are governed by our Shipping & Returns policy."],
      },
      {
        heading: "Safety",
        body: [
          "Soft toys and accessories are handmade and may contain small parts. They are not suitable for unsupervised use by very young children. Please inspect items regularly.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `All designs, photographs and content on this website belong to ${SITE.name}. Please do not copy or reproduce them without written permission.`,
        ],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms? Email ${SITE.email}.`],
      },
    ],
  },
};
