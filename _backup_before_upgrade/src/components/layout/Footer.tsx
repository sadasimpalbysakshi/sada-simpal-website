import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2E2A27] text-[#EDE7E1]">

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-3xl font-semibold mb-4">सादा simpal</h2>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              At Sada Simpal, we find elegance in simplicity. Our crochet is hand-finished for those who appreciate the quiet luxury of a handmade garment. Thoughtfully designed. Ethically made. Purposefully worn.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/sadasimpalbysakshi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61585877428311"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
             <a
  href="https://api.whatsapp.com/send/?phone=919335487009&text&type=phone_number&app_absent=0&utm_source=ig"
  target="_blank"
  rel="noopener noreferrer"
  className="text-background/70 hover:text-background transition-colors"
  aria-label="Chat on WhatsApp"
>
  <MessageCircle className="h-5 w-5" />
</a>
            </div>
          </div>

          {/* Quick Links */}
<div>
  <h3 className="font-display text-lg mb-6 text-[#FAF7F2]">Quick Links</h3>
  <ul className="space-y-3">
    {['Shop All', 'New Arrivals', 'Bestsellers', 'About Us', 'Blog'].map(
      (link) => (
        <li key={link}>
          <Link
            to={`/page/${link.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-background/70 hover:text-background text-sm transition-colors"
          >
            {link}
          </Link>
        </li>
      )
    )}
  </ul>
</div>


          {/* Customer Care */}
          {/* Customer Care */}
<div>
  <h3 className="font-display text-lg mb-6 text-[#FAF7F2]">
    Customer Care
  </h3>
  <ul className="space-y-3">
    {[
      'Shipping & Returns',
      'Size Guide',
      'Care Instructions',
      'FAQs',
      'Contact Us',
    ].map((link) => (
      <li key={link}>
        <Link
          to={`/page/${link.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-background/70 hover:text-background text-sm transition-colors"
        >
          {link}
        </Link>
      </li>
    ))}
  </ul>
</div>

<div id="contact" className="scroll-mt-32">

  <h3 className="font-display text-lg font-semibold mb-4">
    Get in Touch
  </h3>
  <ul className="space-y-4">
    <li className="flex items-start gap-3">
      <MapPin className="h-5 w-5 text-background/70 mt-0.5" />
      <span className="text-background/70 text-sm">
        Chirgaon, Jhansi,
        <br />
        Uttar Pradesh 284301, India
      </span>
    </li>

    <li className="flex items-center gap-3">
      <Phone className="h-5 w-5 text-background/70" />
      <a
        href="tel:+917388198240"
        className="text-[#CFC7BE] hover:text-background text-sm transition-colors"
      >
        +91 73881 98240
      </a>
    </li>

    <li className="flex items-center gap-3">
      <Mail className="h-5 w-5 text-background/70" />
      <a
        href="mailto:sadasimpalbysakshi@gmail.com"
        className="text-background/70 hover:text-background text-sm transition-colors"
      >
        sadasimpalbysakshi@gmail.com
      </a>
    </li>
  </ul>
</div>
</div>

        {/* Bottom Bar */}
       <div className="border-t border-[#3A3531] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} Sadasimpalbysakshi. All rights reserved.
          </p>
          <div className="flex gap-6">
  <Link
    to="/page/privacy-policy"
    className="text-background/60 hover:text-background text-sm transition-colors"
  >
    Privacy Policy
  </Link>
  <Link
    to="/page/terms-of-service"
    className="text-background/60 hover:text-background text-sm transition-colors"
  >
    Terms of Service
  </Link>
</div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
