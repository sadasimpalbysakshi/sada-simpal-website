import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

    const { error } = await supabase.from("reviews").insert({
      name,
      rating,
      text,
      approved: false, // admin approval required
    });

    setLoading(false);

    if (error) {
      toast.error("Sorry, we couldn't submit your review. Please try again.");
      return;
    }

    setName("");
    setText("");
    setRating(5);
    toast.success("Thank you! Your review will appear after approval 💛");
  };

  const [showForm, setShowForm] = useState(false);
  const shown = reviews.slice(0, 8);

  return (
    <section className="bg-[#FAF7F2] px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl md:text-4xl">Loved by our customers</h2>
          <p className="text-sm text-muted-foreground">
            Real stories from people who love their purchase.
          </p>
        </div>

        {/* ================= REVIEW CARDS ================= */}
        {shown.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-5">
            {shown.map((r) => (
              <motion.figure
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex w-full flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
              >
                <div
                  aria-hidden="true"
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-2xl"
                >
                  {r.name.trim().charAt(0).toUpperCase()}
                </div>
                <div className="mb-3 text-yellow-500" aria-label={`${r.rating} out of 5 stars`}>
                  {"★".repeat(r.rating)}
                </div>
                <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{r.text}”
                </blockquote>
                <figcaption className="text-sm font-medium">{r.name}</figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        <div className="mb-10 text-center">
          {shown.length === 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              No reviews yet — be the first to share your experience!
            </p>
          )}
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-sm border border-foreground px-6 py-2 text-sm hover:bg-foreground hover:text-background"
            >
              Write a review
            </button>
          )}
        </div>

        {/* ================= SUBMIT REVIEW ================= */}
        {showForm && (
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
        )}
      </div>
    </section>
  );
};
