import { MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

/** Floating "chat with us" button, bottom-right on every page. */
const WhatsAppButton = () => (
  <a
    href={whatsappLink(`Hi ${SITE.name}! I have a question.`)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
  >
    <MessageCircle className="h-7 w-7" />
  </a>
);

export default WhatsAppButton;
