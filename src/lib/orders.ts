import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { CartItem } from "@/contexts/CartContext";
import { SITE, whatsappLink } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91|91|0)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .or(z.literal("")),
  address1: z.string().trim().min(5, "Please enter your address"),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Please enter your city"),
  state: z.string().min(1, "Please choose your state"),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().trim().max(500).optional(),
  payment: z.enum(["cod", "upi"]),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;

export type PlacedOrder = {
  orderNumber: string;
  form: CheckoutForm;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  savedToDatabase: boolean;
};

export const LAST_ORDER_KEY = "sadasimpal-last-order";

export const normalisePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  return digits.slice(-10);
};

export const saveOrder = async (order: Omit<PlacedOrder, "savedToDatabase">) => {
  const { form } = order;
  const { error } = await supabase.from("orders").insert({
    order_number: order.orderNumber,
    customer_name: form.name,
    phone: normalisePhone(form.phone),
    email: form.email || null,
    address_line1: form.address1,
    address_line2: form.address2 || null,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    notes: form.notes || null,
    payment_method: form.payment,
    items: order.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
  });
  return { error };
};

export const orderWhatsappMessage = (o: PlacedOrder) => {
  const lines = o.items
    .map(
      (i) =>
        `• ${i.name}${
          [i.color, i.size].filter((v) => v && v !== "One Size").length
            ? ` (${[i.color, i.size].filter((v) => v && v !== "One Size").join(", ")})`
            : ""
        } × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`
    )
    .join("\n");
  return whatsappLink(
    `Hi ${SITE.name}! I've placed an order.\n\n` +
      `Order: ${o.orderNumber}\n${lines}\n\n` +
      `Subtotal: ${formatPrice(o.subtotal)}\n` +
      `Shipping: ${o.shipping === 0 ? "Free" : formatPrice(o.shipping)}\n` +
      `Total: ${formatPrice(o.total)}\n` +
      `Payment: ${o.form.payment === "cod" ? "Cash on Delivery" : "UPI / Bank transfer"}\n\n` +
      `Name: ${o.form.name}\nPhone: ${o.form.phone}\n` +
      `Address: ${o.form.address1}${o.form.address2 ? ", " + o.form.address2 : ""}, ${o.form.city}, ${o.form.state} - ${o.form.pincode}`
  );
};
