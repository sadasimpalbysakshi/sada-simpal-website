import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { useCollections } from "@/lib/catalog";

const linkClass = "text-sm text-[#EDE7E1]/70 transition-colors hover:text-[#EDE7E1]";

const Footer = () => {
  const collections = useCollections();
  return (
  <footer className="bg-[#2E2A27] text-[#EDE7E1]">
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="mb-4 font-display text-3xl font-semibold">{SITE.nameHindi}</h2>
          <p className="mb-6 text-sm leading-relaxed text-[#EDE7E1]/70">
            Handmade crochet, made stitch by stitch by the women of our village in
            Jhansi. Thoughtfully designed, lovingly made — for gifting, for home, for you.
          </p>
          <div className="flex gap-4">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={linkClass}>
              <Instagram className="h-5 w-5" />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={linkClass}>
              <Facebook className="h-5 w-5" />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={linkClass}>
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-6 font-display text-lg text-[#FAF7F2]">Shop</h3>
          <ul className="space-y-3">
            <li><Link to="/shop" className={linkClass}>All Products</Link></li>
            {collections.map((c) => (
              <li key={c.id}>
                <Link to={`/collections/${c.slug}`} className={linkClass}>{c.name}</Link>
              </li>
            ))}
            <li><Link to="/customize-order" className={linkClass}>Custom Orders</Link></li>
            <li><Link to="/bulk-orders" className={linkClass}>Bulk &amp; Corporate Orders</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="mb-6 font-display text-lg text-[#FAF7F2]">Customer Care</h3>
          <ul className="space-y-3">
            <li><Link to="/shipping-returns" className={linkClass}>Shipping &amp; Returns</Link></li>
            <li><Link to="/care-instructions" className={linkClass}>Care Instructions</Link></li>
            <li><Link to="/faqs" className={linkClass}>FAQs</Link></li>
            <li><Link to="/about" className={linkClass}>Our Story</Link></li>
            <li><Link to="/contact" className={linkClass}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 font-display text-lg text-[#FAF7F2]">Get in Touch</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#EDE7E1]/70" />
              <span className="text-sm text-[#EDE7E1]/70">
                {SITE.address[0]}
                <br />
                {SITE.address[1]}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-[#EDE7E1]/70" />
              <a href={`tel:+${SITE.whatsapp}`} className={linkClass}>{SITE.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-[#EDE7E1]/70" />
              <a href={`mailto:${SITE.email}`} className={`${linkClass} break-all`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#3A3531] pt-8 md:flex-row">
        <p className="text-sm text-[#EDE7E1]/60">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="text-sm text-[#EDE7E1]/60 hover:text-[#EDE7E1]">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm text-[#EDE7E1]/60 hover:text-[#EDE7E1]">Terms of Service</Link>
          <Link to="/shipping-returns" className="text-sm text-[#EDE7E1]/60 hover:text-[#EDE7E1]">Refund Policy</Link>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
