// import { Button } from "@/components/ui/button";

// const CustomizeOrder = () => {
//   return (
//     <div className="py-24 px-6 lg:px-12">
//       <div className="max-w-3xl mx-auto text-center">
//         <h1 className="font-display text-4xl mb-6">
//           Customize Your Order
//         </h1>

//         <p className="text-muted-foreground mb-10">
//           Looking for something special?  
//           Tell us what you have in mind and we’ll craft it just for you.
//         </p>

//         <form className="space-y-6 text-left">
//           <div>
//             <label className="block text-sm mb-1">Your Name</label>
//             <input
//               type="text"
//               className="w-full border px-4 py-2 rounded"
//               placeholder="Enter your name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Email / Phone</label>
//             <input
//               type="text"
//               className="w-full border px-4 py-2 rounded"
//               placeholder="Enter contact details"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">
//               Describe your custom order
//             </label>
//             <textarea
//               className="w-full border px-4 py-2 rounded h-32"
//               placeholder="Size, color, design, occasion, etc."
//             />
//           </div>

//           <Button className="w-full bg-[#2E2E2E] text-white hover:bg-black">
//             Submit Request
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CustomizeOrder;


import { useState } from "react";

const CustomizeOrder = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !contact || !details) {
      alert("Please fill all fields");
      return;
    }

    const message = `
🧶 *New Custom Order Request*

👤 Name: ${name}
📞 Contact: ${contact}

📝 Order Details:
${details}
    `;

    const phoneNumber = "9956076917"; // 🔴 PUT YOUR NUMBER HERE

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="py-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl mb-4 text-center">
          Customize Your Order
        </h1>

        <p className="text-muted-foreground text-center mb-10">
          Tell us what you want and we’ll craft something special just for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border px-4 py-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Email or Phone Number"
            className="w-full border px-4 py-3 rounded"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <textarea
            placeholder="Describe your custom order (size, color, occasion...)"
            rows={5}
            className="w-full border px-4 py-3 rounded"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Send on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomizeOrder;
