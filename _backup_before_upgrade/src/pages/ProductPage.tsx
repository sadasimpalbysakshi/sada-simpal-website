import { useParams } from "react-router-dom";
import { products } from "@/data/products";

const ProductPage = () => {
  const { id } = useParams();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }

  return (
    <div className="py-20 px-6 lg:px-12 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10">

        {/* Images */}
        <img
          src={product.images[0]}
          className="w-full aspect-square object-cover rounded-sm"
        />

        {/* Details */}
        <div>
          <h1 className="font-display text-3xl mb-2">
            {product.name}
          </h1>

          <p className="text-xl mb-4">₹{product.price}</p>

          <p className="text-muted-foreground mb-4">
            {product.description}
          </p>

          <p className="italic text-sm mb-6">
            🌸 Custom bouquet available
          </p>

          <a
            href={`https://wa.me/917388198240?text=Hi! I want to order ${product.name}`}
            target="_blank"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-sm"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
