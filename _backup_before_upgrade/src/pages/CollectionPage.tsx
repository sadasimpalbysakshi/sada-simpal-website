import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import { Link } from "react-router-dom";


const CollectionPage = () => {
  const { slug } = useParams();

  const collectionProducts = products.filter(
    (p) => p.category === slug
  );

  if (collectionProducts.length === 0) {
    return <p className="py-20 text-center">No products found</p>;
  }

  return (
    <div className="py-20 px-6 lg:px-12">
      <h1 className="font-display text-4xl mb-6 capitalize">
  {slug?.replace("-", " ")}
</h1>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {collectionProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <div className="aspect-[3/4] overflow-hidden mb-3">
              <img
                src={product.images[0]}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
            </div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              ₹{product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
