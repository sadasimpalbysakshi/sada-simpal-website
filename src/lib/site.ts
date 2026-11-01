/**
 * ONE place for every business detail used across the site.
 * Edit here and the header, footer, checkout, WhatsApp links, policies,
 * contact page etc. all update together.
 */
export const SITE = {
  name: "Sada Simpal",
  nameHindi: "सादा simpal",
  byline: "by Sakshi",
  tagline: "Handcrafted crochet, made with love in Jhansi",
  // Your website address (used for SEO, share links, sitemap).
  url: "https://sadasimpalbysakshi.in",

  // ---- Contact (NOTE: your old code had 3 different WhatsApp numbers.
  // I used the one already shown publicly in the footer. Change if wrong.) ----
  whatsapp: "917388198240", // country code + number, no "+" or spaces
  phoneDisplay: "+91 73881 98240",
  email: "sadasimpalbysakshi@gmail.com",
  address: ["Chirgaon, Jhansi", "Uttar Pradesh 284301, India"],
  instagram: "https://www.instagram.com/sadasimpalbysakshi/",
  instagramHandle: "@sadasimpalbysakshi",
  facebook: "https://www.facebook.com/profile.php?id=61585877428311",

  // ---- Shipping & payment rules (edit to match what you actually do) ----
  shipping: {
    freeAbove: 999, // free shipping on orders at or above this amount (₹)
    flatFee: 60, // otherwise this flat fee (₹)
    dispatchDays: "2–4 business days", // handmade: time to make & pack
    deliveryDays: "4–7 business days", // courier transit
  },
  payments: {
    codEnabled: true,
    codNote: "Pay in cash when your parcel arrives.",
    upiEnabled: true,
    upiId: "", // e.g. "sakshi@upi" – shown after checkout when set
    upiNote: "We'll share UPI / bank details on WhatsApp to confirm your order.",
  },
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${SITE.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
