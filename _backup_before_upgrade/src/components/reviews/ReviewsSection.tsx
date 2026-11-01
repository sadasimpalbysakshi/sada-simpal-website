import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
};

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH APPROVED REVIEWS ================= */
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  /* ================= REAL-TIME UPDATES ================= */
  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel("reviews-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        fetchReviews
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setLoading(true);

    await supabase.from("reviews").insert({
      name,
      rating,
      text,
      approved: false, // 👈 admin approval required
    });

    setName("");
    setText("");
    setRating(5);
    setLoading(false);

    alert("Thank you! Your review will appear after approval 💛");
  };

  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl mb-3">
            Customer Stories
          </h2>
          <p className="text-muted-foreground text-sm">
            Loved by customers across India
          </p>
        </div>

        {/* ================= MOVING REVIEWS ================= */}
        {reviews.length > 0 ? (
          <div className="relative overflow-hidden mb-20">
            <motion.div
              className="flex gap-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...reviews, ...reviews].slice(0, 12).map((r, index) => (
                <div
                  key={index}
                  className="min-w-[300px] md:min-w-[360px] bg-white p-6 rounded-xl shadow-md"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    “{r.text}”
                  </p>

                  {/* Name */}
                  <p className="text-sm font-medium">
                    — {r.name}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-16">
            No reviews yet. Be the first to share your experience!
          </p>
        )}

        {/* ================= SUBMIT REVIEW ================= */}
        <motion.form
          onSubmit={submitReview}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md"
        >
          <h3 className="font-display text-2xl mb-6 text-center">
            Leave a Review
          </h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border px-4 py-2 mb-4 text-sm"
            required
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your review"
            className="w-full border px-4 py-2 mb-4 text-sm"
            rows={3}
            required
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border px-4 py-2 mb-6 text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Stars
              </option>
            ))}
          </select>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 text-sm hover:opacity-90 transition"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
